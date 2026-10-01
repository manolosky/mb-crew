const GTM_ID = 'GTM-KBCX8VQ2';

let loaded = false;

// GTM's consent API only understands the Arguments object, not an array.
function gtag() {
  window.dataLayer.push(arguments);
}

// Loads Google Tag Manager (and the GA4 tag it contains) only after the
// visitor accepts analytics cookies. Consent Mode defaults are pushed first,
// so GA4 never runs with advertising storage enabled.
export const loadGoogleTagManager = () => {
  if (loaded) {
    return;
  }

  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
};

const clearAnalyticsCookies = () => {
  const baseDomain = window.location.hostname.replace(/^www\./, '');
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter((name) => name.startsWith('_ga'));

  names.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${baseDomain}`;
  });
};

// Withdrawn consent: GA4 stops writing cookies and the existing ones go away.
export const revokeAnalytics = () => {
  if (loaded) {
    gtag('consent', 'update', { analytics_storage: 'denied' });
  }

  clearAnalyticsCookies();
};
