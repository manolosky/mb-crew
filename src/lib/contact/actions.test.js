// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitLead } from '@/lib/contact/leads';
import { getContactFormMode } from '@/lib/contact/mode';
import { isBotRequest } from '@/lib/server/bot-check';
import { limitContactSubmission } from '@/lib/server/rate-limit';

import { submitContact } from './actions';

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }),
}));
vi.mock('next/server', () => ({ after: vi.fn() }));
vi.mock('@/lib/contact/mode', () => ({ getContactFormMode: vi.fn(() => 'dry-run') }));
vi.mock('@/lib/contact/leads', () => ({ submitLead: vi.fn(async () => ({ ok: true })) }));
vi.mock('@/lib/server/bot-check', () => ({ isBotRequest: vi.fn(async () => false) }));
vi.mock('@/lib/server/rate-limit', () => ({
  getClientIp: vi.fn(() => '203.0.113.7'),
  limitContactSubmission: vi.fn(async () => ({ allowed: true, pending: Promise.resolve() })),
}));

const buildForm = (overrides = {}) => {
  const fields = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    reason: 'job',
    message: 'I have an interesting role I would like to discuss.',
    consent: 'on',
    source: 'portfolio',
    website: '',
    startedAt: String(Date.now() - 60_000),
    ...overrides,
  };
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));

  return formData;
};

describe('submitContact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delivers a valid lead', async () => {
    await expect(submitContact(undefined, buildForm())).resolves.toEqual({
      status: 'success',
      reason: 'job',
    });
    expect(submitLead).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'ada@example.com', reason: 'job' }),
      'dry-run',
    );
  });

  it('refuses submissions while the form is off', async () => {
    vi.mocked(getContactFormMode).mockReturnValueOnce('off');

    await expect(submitContact(undefined, buildForm())).resolves.toEqual({
      status: 'error',
      code: 'unavailable',
    });
    expect(submitLead).not.toHaveBeenCalled();
  });

  it('fakes success for a filled honeypot without delivering anything', async () => {
    await expect(
      submitContact(undefined, buildForm({ website: 'https://spam.example' })),
    ).resolves.toEqual({ status: 'success' });
    expect(submitLead).not.toHaveBeenCalled();
  });

  it('fakes success for forms sent faster than a person could type', async () => {
    await expect(
      submitContact(undefined, buildForm({ startedAt: String(Date.now() - 500) })),
    ).resolves.toEqual({ status: 'success' });
    expect(submitLead).not.toHaveBeenCalled();
  });

  it('rejects requests BotID flags as automated', async () => {
    vi.mocked(isBotRequest).mockResolvedValueOnce(true);

    await expect(submitContact(undefined, buildForm())).resolves.toEqual({
      status: 'error',
      code: 'verification_failed',
    });
  });

  it('returns field errors and the submitted values when validation fails', async () => {
    const result = await submitContact(undefined, buildForm({ email: 'nope' }));

    expect(result.status).toBe('invalid');
    expect(result.fieldErrors.email).toHaveLength(1);
    expect(result.values.email).toBe('nope');
    expect(limitContactSubmission).not.toHaveBeenCalled();
  });

  it('stops at the rate limit and keeps the values', async () => {
    vi.mocked(limitContactSubmission).mockResolvedValueOnce({
      allowed: false,
      pending: Promise.resolve(),
    });

    const result = await submitContact(undefined, buildForm());

    expect(result).toMatchObject({ status: 'error', code: 'rate_limited' });
    expect(result.values.name).toBe('Ada Lovelace');
    expect(submitLead).not.toHaveBeenCalled();
  });

  it('reports delivery failures so the visitor can use email instead', async () => {
    vi.mocked(submitLead).mockResolvedValueOnce({ ok: false });

    await expect(submitContact(undefined, buildForm())).resolves.toMatchObject({
      status: 'error',
      code: 'delivery_failed',
    });
  });
});
