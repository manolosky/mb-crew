'use client';

import Link from 'next/link';
import { useId, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/Button';
import { isConsentPromptOpen, onConsentChange, saveConsent } from '@/lib/consent';

// SSR renders nothing; the stored decision is only known in the browser.
const getServerSnapshot = () => false;

// Analytics cookie banner. "Reject" and "Accept" carry the same weight, and
// nothing is loaded until the visitor accepts (AEPD cookie guidance).
export const CookieBanner = () => {
  const open = useSyncExternalStore(onConsentChange, isConsentPromptOpen, getServerSnapshot);
  const titleId = useId();

  if (!open) {
    return null;
  }

  return (
    <section
      aria-labelledby={titleId}
      className="border-line bg-surface/95 shadow-lift-lg nav:right-6 nav:bottom-6 nav:left-auto nav:max-w-[440px] fixed inset-x-3 bottom-3 z-[60] rounded-[18px] border p-5 backdrop-blur-xl"
    >
      <p id={titleId} className="font-heading text-ink text-base font-bold">
        Cookies &amp; analytics
      </p>
      <p className="text-body-soft mt-2 text-[14px] leading-[1.55]">
        I&apos;d like to use Google Analytics cookies to see how visitors use this site. They are
        only set if you accept.{' '}
        <Link
          href="/privacy#cookies"
          className="text-brand-start font-semibold underline underline-offset-2"
        >
          Privacy &amp; cookies
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Button variant="glass" size="sm" onClick={() => saveConsent('denied')}>
          Reject
        </Button>
        <Button variant="glass" size="sm" onClick={() => saveConsent('granted')}>
          Accept
        </Button>
      </div>
    </section>
  );
};
