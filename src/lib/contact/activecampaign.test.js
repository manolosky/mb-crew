// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

import { PRIVACY_NOTICE_VERSION } from '@/lib/contact/constants';

import { buildContactSyncPayload, syncContact } from './activecampaign';

const IDS = {
  fields: { message: 1, company: 2, reason: 3, source: 4, privacyConsent: 5 },
  newsletterListId: 7,
};

const LEAD = {
  name: 'Ada King Lovelace',
  email: 'ada@example.com',
  company: '',
  reason: 'job',
  message: 'Hello there, I have a role for you.',
  newsletter: false,
  source: 'portfolio',
};

describe('buildContactSyncPayload', () => {
  const now = new Date('2026-09-23T10:00:00.000Z');

  it('maps the lead to contact fields, custom fields and tags', () => {
    const { contact } = buildContactSyncPayload(LEAD, IDS, now);

    expect(contact).toMatchObject({
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'King Lovelace',
      tags: ['src:portfolio', 'reason:job'],
    });
    expect(contact.fieldValues).toEqual([
      { field: '1', value: 'Hello there, I have a role for you.' },
      { field: '3', value: 'job' },
      { field: '4', value: 'portfolio' },
      { field: '5', value: `${PRIVACY_NOTICE_VERSION} (2026-09-23T10:00:00.000Z)` },
    ]);
    expect(contact.lists).toBeUndefined();
  });

  it('adds the newsletter list only with the explicit opt-in', () => {
    const { contact } = buildContactSyncPayload({ ...LEAD, newsletter: true }, IDS, now);

    expect(contact.lists).toEqual([{ list: 7 }]);
  });

  it('refuses to build a payload without the required field ids', () => {
    expect(() =>
      buildContactSyncPayload(LEAD, { ...IDS, fields: { ...IDS.fields, message: null } }),
    ).toThrow(/message/);
  });
});

describe('syncContact', () => {
  it('posts the payload with the API token', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ contact: { id: '42' } }));

    const id = await syncContact(
      { contact: { email: 'ada@example.com' } },
      { baseUrl: 'https://acme.api-us1.com/', apiToken: 'secret', fetchImpl },
    );

    expect(id).toBe('42');
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://acme.api-us1.com/api/3/contact/sync');
    expect(init.method).toBe('POST');
    expect(init.headers['Api-Token']).toBe('secret');
    expect(JSON.parse(init.body)).toEqual({ contact: { email: 'ada@example.com' } });
  });

  it('throws on an error response', async () => {
    const fetchImpl = vi.fn(async () => new Response('nope', { status: 422 }));

    await expect(
      syncContact({}, { baseUrl: 'https://acme.api-us1.com', apiToken: 'secret', fetchImpl }),
    ).rejects.toThrow(/422/);
  });
});
