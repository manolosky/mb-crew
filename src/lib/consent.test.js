import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'mb-analytics-consent';

// The module keeps per-visit state, so every test gets a fresh copy.
const loadConsent = async () => {
  vi.resetModules();

  return import('./consent');
};

describe('consent store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has no decision on a first visit and asks for one', async () => {
    const { isConsentPromptOpen, readConsent } = await loadConsent();

    expect(readConsent()).toBeNull();
    expect(isConsentPromptOpen()).toBe(true);
  });

  it('stores the decision, closes the prompt and notifies listeners', async () => {
    const { isConsentPromptOpen, onConsentChange, readConsent, saveConsent } = await loadConsent();
    const listener = vi.fn();
    const unsubscribe = onConsentChange(listener);

    saveConsent('granted');

    expect(readConsent()).toBe('granted');
    expect(isConsentPromptOpen()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('reopens the prompt on request', async () => {
    const { isConsentPromptOpen, requestConsentPrompt, saveConsent } = await loadConsent();

    saveConsent('denied');
    requestConsentPrompt();

    expect(isConsentPromptOpen()).toBe(true);
  });

  it('asks again after a year', async () => {
    const { readConsent, saveConsent } = await loadConsent();

    saveConsent('granted');
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 366 * 24 * 60 * 60 * 1000);

    expect(readConsent()).toBeNull();
  });

  it('ignores tampered storage', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    const { readConsent } = await loadConsent();

    expect(readConsent()).toBeNull();
  });
});
