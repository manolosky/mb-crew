import { afterEach, describe, expect, it, vi } from 'vitest';

const loadUtm = async () => {
  vi.resetModules();

  return import('./utm');
};

describe('campaign params', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('keeps the UTM tags of the landing URL in memory', async () => {
    window.history.replaceState({}, '', '/?utm_source=linkedin&utm_campaign=launch&ref=x');
    const { captureCampaignParams, getCampaignParams } = await loadUtm();

    captureCampaignParams();
    window.history.replaceState({}, '', '/portfolio/contact');

    expect(getCampaignParams()).toEqual({ utm_source: 'linkedin', utm_campaign: 'launch' });
  });

  it('stays empty without campaign parameters', async () => {
    const { captureCampaignParams, getCampaignParams } = await loadUtm();

    captureCampaignParams();

    expect(getCampaignParams()).toEqual({});
  });
});
