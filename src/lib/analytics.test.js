import { beforeEach, describe, expect, it, vi } from 'vitest';

const GTM_SELECTOR = 'script[src*="googletagmanager.com/gtm.js"]';

// The module remembers whether GTM was loaded, so each test starts fresh.
const loadAnalytics = async () => {
  vi.resetModules();

  return import('./analytics');
};

describe('analytics', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    delete window.dataLayer;
  });

  it('loads Google Tag Manager once, with Consent Mode defaults first', async () => {
    const { loadGoogleTagManager } = await loadAnalytics();

    loadGoogleTagManager();
    loadGoogleTagManager();

    expect(document.querySelectorAll(GTM_SELECTOR)).toHaveLength(1);
    const [consentCall, gtmStart] = window.dataLayer;
    expect(Array.from(consentCall)).toEqual([
      'consent',
      'default',
      expect.objectContaining({ ad_storage: 'denied', analytics_storage: 'granted' }),
    ]);
    expect(gtmStart).toMatchObject({ event: 'gtm.js' });
  });

  it('withdraws consent and removes Google Analytics cookies', async () => {
    const { loadGoogleTagManager, revokeAnalytics } = await loadAnalytics();
    document.cookie = '_ga=GA1.1.123; path=/';

    loadGoogleTagManager();
    revokeAnalytics();

    expect(Array.from(window.dataLayer.at(-1))).toEqual([
      'consent',
      'update',
      { analytics_storage: 'denied' },
    ]);
    expect(document.cookie).not.toContain('_ga=');
  });
});
