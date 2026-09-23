// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { parseContactForm } from './schema';

const buildForm = (overrides = {}) => {
  const fields = {
    name: '  Ada Lovelace ',
    email: ' ada@example.com ',
    company: 'Analytical Engines',
    reason: 'freelance',
    message: 'I would love to talk about a new project with you.',
    consent: 'on',
    source: 'portfolio',
    page: '/portfolio/contact',
    utm_source: 'linkedin',
    ...overrides,
  };
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (null !== value) {
      formData.set(key, value);
    }
  });

  return formData;
};

describe('parseContactForm', () => {
  it('returns a trimmed lead for a valid submission', () => {
    const result = parseContactForm(buildForm({ newsletter: 'on' }));

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      reason: 'freelance',
      consent: 'on',
      newsletter: true,
      source: 'portfolio',
      page: '/portfolio/contact',
      utm: { source: 'linkedin', medium: '', campaign: '' },
    });
  });

  it('reports one message per invalid field and keeps the values to refill the form', () => {
    const result = parseContactForm(
      buildForm({
        name: 'A',
        email: 'not-an-email',
        reason: 'spam',
        message: 'Too short',
        consent: null,
      }),
    );

    expect(result.success).toBe(false);
    expect(Object.keys(result.fieldErrors).sort()).toEqual(
      ['consent', 'email', 'message', 'name', 'reason'].sort(),
    );
    expect(result.values).toMatchObject({ name: 'A', email: 'not-an-email', consent: false });
  });

  it('treats the company as optional', () => {
    expect(parseContactForm(buildForm({ company: null })).success).toBe(true);
  });

  it('never fails on tampered metadata', () => {
    const result = parseContactForm(buildForm({ source: 'evil', page: 'x'.repeat(500) }));

    expect(result.success).toBe(true);
    expect(result.data.source).toBe('portfolio');
    expect(result.data.page).toBe('');
  });
});
