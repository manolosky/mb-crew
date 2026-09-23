'use server';

import { headers } from 'next/headers';
import { after } from 'next/server';

import { MIN_FILL_TIME_MS } from '@/lib/contact/constants';
import { submitLead } from '@/lib/contact/leads';
import { getContactFormMode } from '@/lib/contact/mode';
import { parseContactForm } from '@/lib/contact/schema';
import { isBotRequest } from '@/lib/server/bot-check';
import { getClientIp, limitContactSubmission } from '@/lib/server/rate-limit';

// Honeypot filled in, or form sent faster than a person could fill it.
const looksAutomated = (formData, now) => {
  if ('' !== (formData.get('website') ?? '')) {
    return true;
  }

  const startedAt = Number(formData.get('startedAt'));

  return Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < MIN_FILL_TIME_MS;
};

// Contact form Server Action (used with useActionState).
export const submitContact = async (previousState, formData) => {
  const mode = getContactFormMode();

  if ('off' === mode) {
    return { status: 'error', code: 'unavailable' };
  }

  // Bots get a fake success so they learn nothing about the filters.
  if (looksAutomated(formData, Date.now())) {
    return { status: 'success' };
  }

  if (await isBotRequest()) {
    return { status: 'error', code: 'verification_failed' };
  }

  const parsed = parseContactForm(formData);

  if (!parsed.success) {
    return { status: 'invalid', fieldErrors: parsed.fieldErrors, values: parsed.values };
  }

  const rate = await limitContactSubmission(getClientIp(await headers()));
  after(() => rate.pending);

  if (!rate.allowed) {
    return { status: 'error', code: 'rate_limited', values: parsed.values };
  }

  const delivery = await submitLead(parsed.data, mode);

  if (!delivery.ok) {
    return { status: 'error', code: 'delivery_failed', values: parsed.values };
  }

  return { status: 'success', reason: parsed.data.reason };
};
