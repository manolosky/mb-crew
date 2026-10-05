const STORAGE_KEY = 'mb-analytics-consent';
const EVENT_NAME = 'mb-consent-change';

// Bump to ask everyone again, e.g. when new tracking is added.
const CONSENT_VERSION = 1;

// Decisions are renewed after a year (the AEPD accepts up to 24 months).
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

// Mirrors the prompt state on <html> ('open' | 'closed'); the banner's CSS
// reads it, so the server-rendered banner shows only to undecided visitors.
const PROMPT_ATTRIBUTE = 'data-consent-prompt';

// Fallback for browsers that block localStorage: the choice still applies for
// the rest of the visit.
let memoryChoice = null;
let storageBlocked = false;
let promptRequested = false;

// Analytics cookie decision: 'granted' | 'denied' | null (not decided yet).
export const readConsent = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');

    if (
      null === stored ||
      CONSENT_VERSION !== stored.version ||
      Date.now() - stored.savedAt > MAX_AGE_MS
    ) {
      return storageBlocked ? memoryChoice : null;
    }

    return 'granted' === stored.choice ? 'granted' : 'denied';
  } catch {
    return storageBlocked ? memoryChoice : null;
  }
};

export const saveConsent = (choice) => {
  memoryChoice = choice;
  promptRequested = false;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ choice, version: CONSENT_VERSION, savedAt: Date.now() }),
    );
  } catch {
    storageBlocked = true;
  }

  window.dispatchEvent(new Event(EVENT_NAME));
};

// Reopens the banner from the "Cookie settings" control.
export const requestConsentPrompt = () => {
  promptRequested = true;
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const isConsentPromptOpen = () => promptRequested || null === readConsent();

export const syncConsentPromptAttribute = () => {
  document.documentElement.setAttribute(
    PROMPT_ATTRIBUTE,
    isConsentPromptOpen() ? 'open' : 'closed',
  );
};

// Inline script for the root layout's <head>: sets the prompt attribute while
// the HTML is still being parsed, so the banner is painted with the page (or
// not at all) instead of popping in once React has loaded. Same rules as
// readConsent(); if storage is unavailable the prompt stays open.
export const consentPromptScript = `(function(){var open=true;try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"null");open=!(s&&${CONSENT_VERSION}===s.version&&Date.now()-s.savedAt<=${MAX_AGE_MS})}catch(e){}document.documentElement.setAttribute("${PROMPT_ATTRIBUTE}",open?"open":"closed")})()`;

// Notifies on changes from this tab and from other open tabs.
export const onConsentChange = (callback) => {
  const onStorage = (event) => {
    if (STORAGE_KEY === event.key) {
      callback();
    }
  };

  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', onStorage);
  };
};
