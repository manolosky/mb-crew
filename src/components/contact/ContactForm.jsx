'use client';

import Link from 'next/link';
import { useActionState, useEffect, useId, useRef } from 'react';

import {
  ERROR_STYLES,
  HINT_STYLES,
  INPUT_STYLES,
  LABEL_STYLES,
} from '@/components/contact/fieldStyles';
import { ReasonField, reasonInputId } from '@/components/contact/ReasonField';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { submitContact } from '@/lib/contact/actions';
import { CONTACT_LIMITS, CONTACT_REASONS } from '@/lib/contact/constants';
import { Icon } from '@/lib/icons';
import { getCampaignParams, UTM_KEYS } from '@/lib/utm';

const INITIAL_STATE = { status: 'idle' };

const ERROR_MESSAGES = {
  unavailable: 'The form is not available right now.',
  verification_failed: "I couldn't verify that this message was sent by a person.",
  rate_limited: 'Too many messages in a short time — please try again in a few minutes.',
  delivery_failed: 'Something went wrong while sending your message.',
};

const FIELD_ORDER = ['name', 'email', 'company', 'reason', 'message', 'consent'];

// Mobile: sits straight on the contact card (a nested card would squeeze the
// fields); desktop: its own frosted card next to the contact details.
const CARD_STYLES =
  'nav:rounded-[20px] nav:border nav:bg-[rgba(11,10,9,.55)] nav:p-[clamp(20px,3vw,32px)] nav:backdrop-blur-md border-t border-white/15 pt-8 text-white';

const FieldError = ({ id, messages }) => {
  if (undefined === messages || 0 === messages.length) {
    return null;
  }

  return (
    <p id={id} className={ERROR_STYLES}>
      {messages[0]}
    </p>
  );
};

// Contact form backed by the submitContact Server Action. Validation runs on
// the server; errors come back per field and focus moves to the summary.
export const ContactForm = ({ source, email, defaultValues = {} }) => {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);
  const formRef = useRef(null);
  const feedbackRef = useRef(null);
  const id = useId();

  const values = state.values ?? defaultValues;
  const errors = state.fieldErrors ?? {};
  const fieldId = (name) => `${id}-${name}`;
  const errorId = (name) => `${id}-${name}-error`;
  const hasError = (name) => undefined !== errors[name];
  const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined;
  const focusTarget = (name) =>
    'reason' === name ? reasonInputId(fieldId('reason'), CONTACT_REASONS[0].value) : fieldId(name);

  // Metadata the server can't know. Written as default values so React's
  // automatic form reset after each submission keeps them.
  useEffect(() => {
    const { elements } = formRef.current;
    const campaign = getCampaignParams();

    elements.namedItem('startedAt').defaultValue = String(Date.now());
    elements.namedItem('page').defaultValue = window.location.pathname;
    UTM_KEYS.forEach((key) => {
      elements.namedItem(key).defaultValue = campaign[key] ?? '';
    });
  }, []);

  // Move focus to the outcome so keyboard and screen reader users get it.
  useEffect(() => {
    if ('idle' === state.status) {
      return;
    }

    feedbackRef.current?.focus();

    if ('success' === state.status && undefined !== state.reason) {
      trackEvent('contact_submit', { source, reason: state.reason });
    }
  }, [state, source]);

  if ('success' === state.status) {
    return (
      <div ref={feedbackRef} tabIndex={-1} role="status" className={CARD_STYLES}>
        <Icon name="fa-solid fa-circle-check" className="text-mint mb-3 text-2xl" />
        <p className="font-heading text-xl font-bold">Message received!</p>
        <p className="mt-2 text-[15px] leading-[1.55] text-white/80">
          Thanks for reaching out — I&apos;ll get back to you by email soon.
        </p>
      </div>
    );
  }

  const invalidFields = FIELD_ORDER.filter(hasError);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      aria-busy={pending}
      aria-labelledby={fieldId('title')}
      className={CARD_STYLES}
    >
      <h3 id={fieldId('title')} className="font-heading text-xl font-bold">
        Send me a message
      </h3>
      <p className="mt-1.5 mb-6 text-[14px] leading-[1.5] text-white/75">
        I read every message myself and reply by email.
      </p>

      {'invalid' === state.status ? (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className="mb-6 rounded-[12px] border border-[#ffb49c]/60 bg-[#ffb49c]/10 p-4 text-[14px]"
        >
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="fa-solid fa-triangle-exclamation" /> Please check these fields:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {invalidFields.map((name) => (
              <li key={name}>
                <a
                  href={`#${focusTarget(name)}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(focusTarget(name))?.focus();
                  }}
                  className="underline underline-offset-2"
                >
                  {errors[name][0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {'error' === state.status ? (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className="mb-6 rounded-[12px] border border-[#ffb49c]/60 bg-[#ffb49c]/10 p-4 text-[14px] leading-[1.5]"
        >
          <p className="flex items-center gap-2 font-semibold">
            <Icon name="fa-solid fa-triangle-exclamation" />
            {ERROR_MESSAGES[state.code] ?? ERROR_MESSAGES.delivery_failed}
          </p>
          <p className="mt-1">
            You can also email me at{' '}
            <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">
              {email}
            </a>
            .
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        <div className="nav:grid-cols-2 grid gap-5">
          <div>
            <label htmlFor={fieldId('name')} className={LABEL_STYLES}>
              Name
            </label>
            <input
              id={fieldId('name')}
              name="name"
              type="text"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name.max}
              defaultValue={values.name}
              aria-invalid={hasError('name') ? true : undefined}
              aria-describedby={describedBy(hasError('name') && errorId('name'))}
              className={INPUT_STYLES}
            />
            <FieldError id={errorId('name')} messages={errors.name} />
          </div>
          <div>
            <label htmlFor={fieldId('email')} className={LABEL_STYLES}>
              Email
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={CONTACT_LIMITS.email.max}
              defaultValue={values.email}
              aria-invalid={hasError('email') ? true : undefined}
              aria-describedby={describedBy(hasError('email') && errorId('email'))}
              className={INPUT_STYLES}
            />
            <FieldError id={errorId('email')} messages={errors.email} />
          </div>
        </div>

        <div>
          <label htmlFor={fieldId('company')} className={LABEL_STYLES}>
            Company or organization <span className="normal-case">(optional)</span>
          </label>
          <input
            id={fieldId('company')}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company.max}
            defaultValue={values.company}
            aria-invalid={hasError('company') ? true : undefined}
            aria-describedby={describedBy(hasError('company') && errorId('company'))}
            className={INPUT_STYLES}
          />
          <FieldError id={errorId('company')} messages={errors.company} />
        </div>

        <ReasonField
          idPrefix={fieldId('reason')}
          defaultValue={values.reason}
          error={errors.reason?.[0]}
          errorId={errorId('reason')}
        />

        <div>
          <label htmlFor={fieldId('message')} className={LABEL_STYLES}>
            Message
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={5}
            maxLength={CONTACT_LIMITS.message.max}
            defaultValue={values.message}
            aria-invalid={hasError('message') ? true : undefined}
            aria-describedby={describedBy(
              fieldId('message-hint'),
              hasError('message') && errorId('message'),
            )}
            className={`${INPUT_STYLES} resize-y`}
          />
          <p id={fieldId('message-hint')} className={HINT_STYLES}>
            Between {CONTACT_LIMITS.message.min} and{' '}
            {CONTACT_LIMITS.message.max.toLocaleString('en-US')} characters.
          </p>
          <FieldError id={errorId('message')} messages={errors.message} />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={fieldId('consent')}
              name="consent"
              type="checkbox"
              defaultChecked={values.consent}
              aria-invalid={hasError('consent') ? true : undefined}
              aria-describedby={describedBy(hasError('consent') && errorId('consent'))}
              className="accent-brand-start mt-1 h-4 w-4 shrink-0"
            />
            <label htmlFor={fieldId('consent')} className="text-[14px] leading-[1.5] text-white/85">
              I agree to the processing of these details to reply to my message, as described in the{' '}
              <Link href="/privacy" className="font-semibold underline underline-offset-2">
                privacy notice
              </Link>
              .
            </label>
          </div>
          <FieldError id={errorId('consent')} messages={errors.consent} />
        </div>

        <div className="flex items-start gap-3">
          <input
            id={fieldId('newsletter')}
            name="newsletter"
            type="checkbox"
            defaultChecked={values.newsletter}
            className="accent-brand-start mt-1 h-4 w-4 shrink-0"
          />
          <label
            htmlFor={fieldId('newsletter')}
            className="text-[14px] leading-[1.5] text-white/85"
          >
            Also send me occasional updates about new projects (optional — unsubscribe anytime).
          </label>
        </div>

        {/* Honeypot: invisible to people, tempting for bots. */}
        <div
          aria-hidden="true"
          className="absolute top-auto left-[-10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor={fieldId('website')}>Leave this field empty</label>
          <input
            id={fieldId('website')}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <input type="hidden" name="startedAt" />
        <input type="hidden" name="page" />
        <input type="hidden" name="source" value={source} />
        {UTM_KEYS.map((key) => (
          <input key={key} type="hidden" name={key} />
        ))}

        <div>
          <Button
            type="submit"
            disabled={pending}
            className="disabled:cursor-wait disabled:opacity-70"
          >
            <Icon name="fa-solid fa-paper-plane" /> {pending ? 'Sending…' : 'Send message'}
          </Button>
        </div>
      </div>
    </form>
  );
};
