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

describe('consent prompt attribute', () => {
  const promptAttribute = () => document.documentElement.getAttribute('data-consent-prompt');
  // Runs the inline <head> script the way the browser would.
  const runInlineScript = (script) => new Function(script)();

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-consent-prompt');
  });

  it('opens the prompt before the first paint when nothing has been decided', async () => {
    const { consentPromptScript } = await loadConsent();

    runInlineScript(consentPromptScript);

    expect(promptAttribute()).toBe('open');
  });

  it('keeps the prompt closed before the first paint for a valid decision', async () => {
    const { consentPromptScript, saveConsent } = await loadConsent();
    saveConsent('denied');

    runInlineScript(consentPromptScript);

    expect(promptAttribute()).toBe('closed');
  });

  it('agrees with the store for expired and tampered decisions', async () => {
    const { consentPromptScript, isConsentPromptOpen } = await loadConsent();
    const yearAndADay = 366 * 24 * 60 * 60 * 1000;

    [
      JSON.stringify({ choice: 'granted', version: 1, savedAt: Date.now() - yearAndADay }),
      JSON.stringify({ choice: 'granted', version: 0, savedAt: Date.now() }),
      '{not json',
    ].forEach((stored) => {
      window.localStorage.setItem(STORAGE_KEY, stored);
      runInlineScript(consentPromptScript);

      expect(isConsentPromptOpen()).toBe(true);
      expect(promptAttribute()).toBe('open');
    });
  });

  it('mirrors the store on <html>, including a reopened prompt', async () => {
    const { requestConsentPrompt, saveConsent, syncConsentPromptAttribute } = await loadConsent();

    saveConsent('granted');
    syncConsentPromptAttribute();
    expect(promptAttribute()).toBe('closed');

    requestConsentPrompt();
    syncConsentPromptAttribute();
    expect(promptAttribute()).toBe('open');
  });
});
