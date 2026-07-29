const STORAGE_KEY = 'mb-animations-paused';
const EVENT_NAME = 'mb-animations-change';

export const prefersReducedMotion = () =>
  'function' === typeof window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Site-wide "pause decorative animations" preference (WCAG 2.2.2). Stored in
// localStorage, mirrored on <html data-animations> for CSS animations, and
// broadcast so JS-driven animations (anime.js, videos) can react live.
export const areAnimationsPaused = () => {
  try {
    return '1' === window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
};

export const setAnimationsPaused = (paused) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, paused ? '1' : '0');
  } catch {
    // Storage unavailable (private mode); the in-page state still applies.
  }
  document.documentElement.dataset.animations = paused ? 'paused' : 'running';
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const syncAnimationsAttribute = () => {
  document.documentElement.dataset.animations = areAnimationsPaused() ? 'paused' : 'running';
};

export const onAnimationsChange = (callback) => {
  window.addEventListener(EVENT_NAME, callback);
  return () => window.removeEventListener(EVENT_NAME, callback);
};
