// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildContactSyncPayload, syncContact } from '@/lib/contact/activecampaign';

import { submitLead } from './leads';

vi.mock('@/lib/contact/activecampaign', () => ({
  buildContactSyncPayload: vi.fn(() => ({ contact: {} })),
  syncContact: vi.fn(async () => '42'),
}));

const LEAD = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: '',
  reason: 'job',
  message: 'Hello there, I have a role for you.',
  newsletter: false,
  source: 'portfolio',
};

describe('submitLead', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('only logs non-personal metadata in dry-run mode', async () => {
    await expect(submitLead(LEAD, 'dry-run')).resolves.toEqual({ ok: true });

    expect(syncContact).not.toHaveBeenCalled();
    expect(JSON.stringify(vi.mocked(console.info).mock.calls)).not.toContain('ada@example.com');
  });

  it('fails when live mode has no credentials', async () => {
    vi.stubEnv('ACTIVECAMPAIGN_API_URL', undefined);
    vi.stubEnv('ACTIVECAMPAIGN_API_KEY', '[SENSITIVE]');

    await expect(submitLead(LEAD, 'live')).resolves.toEqual({ ok: false });
    expect(syncContact).not.toHaveBeenCalled();
  });

  it('sends the lead to ActiveCampaign in live mode', async () => {
    vi.stubEnv('ACTIVECAMPAIGN_API_URL', 'https://acme.api-us1.com');
    vi.stubEnv('ACTIVECAMPAIGN_API_KEY', 'secret');

    await expect(submitLead(LEAD, 'live')).resolves.toEqual({ ok: true });
    expect(buildContactSyncPayload).toHaveBeenCalledWith(LEAD);
    expect(syncContact).toHaveBeenCalledWith(
      { contact: {} },
      { baseUrl: 'https://acme.api-us1.com', apiToken: 'secret' },
    );
  });

  it('reports delivery failures instead of throwing', async () => {
    vi.stubEnv('ACTIVECAMPAIGN_API_URL', 'https://acme.api-us1.com');
    vi.stubEnv('ACTIVECAMPAIGN_API_KEY', 'secret');
    vi.mocked(syncContact).mockRejectedValueOnce(new Error('status 500'));

    await expect(submitLead(LEAD, 'live')).resolves.toEqual({ ok: false });
  });
});
