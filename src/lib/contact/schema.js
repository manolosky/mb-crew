import { z } from 'zod';

import { CONTACT_LIMITS, CONTACT_REASONS, CONTACT_SOURCES } from '@/lib/contact/constants';

const { name, email, company, message } = CONTACT_LIMITS;

// Metadata fields never produce errors: bad values fall back silently.
const metadata = (max) => z.string().trim().max(max).catch('');

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(name.min, 'Please enter your name.')
    .max(name.max, `Please keep your name under ${name.max} characters.`),
  email: z
    .string()
    .trim()
    .max(email.max, 'That email address is too long.')
    .pipe(z.email('Please enter a valid email address.')),
  company: z.string().trim().max(company.max, `Please keep this under ${company.max} characters.`),
  reason: z.enum(
    CONTACT_REASONS.map((reason) => reason.value),
    { error: 'Please choose what your message is about.' },
  ),
  message: z
    .string()
    .trim()
    .min(message.min, `Please write at least ${message.min} characters.`)
    .max(message.max, `Please keep your message under ${message.max} characters.`),
  consent: z.literal('on', { error: 'Please accept the privacy notice so I can reply.' }),
  newsletter: z.boolean(),
  source: z.enum(CONTACT_SOURCES).catch('portfolio'),
  page: metadata(200),
  utm: z.object({
    source: metadata(100),
    medium: metadata(100),
    campaign: metadata(100),
  }),
});

const readText = (formData, key) => {
  const value = formData.get(key);

  return 'string' === typeof value ? value : '';
};

// Maps the submitted FormData onto the schema. Always returns the visible
// values so the form can be refilled (React resets it after every action).
export const parseContactForm = (formData) => {
  const values = {
    name: readText(formData, 'name'),
    email: readText(formData, 'email'),
    company: readText(formData, 'company'),
    reason: readText(formData, 'reason'),
    message: readText(formData, 'message'),
    consent: 'on' === readText(formData, 'consent'),
    newsletter: 'on' === readText(formData, 'newsletter'),
  };

  const result = contactSchema.safeParse({
    ...values,
    consent: readText(formData, 'consent'),
    source: readText(formData, 'source'),
    page: readText(formData, 'page'),
    utm: {
      source: readText(formData, 'utm_source'),
      medium: readText(formData, 'utm_medium'),
      campaign: readText(formData, 'utm_campaign'),
    },
  });

  if (result.success) {
    return { success: true, data: result.data, values };
  }

  return { success: false, fieldErrors: z.flattenError(result.error).fieldErrors, values };
};
