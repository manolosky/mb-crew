export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];

const MAX_LENGTH = 100;

// Campaign parameters of the landing URL, kept in memory only (nothing is
// written to the device) so the contact form can attribute the lead after
// the visitor navigates away from the landing page.
let campaign = {};

export const captureCampaignParams = () => {
  const params = new URLSearchParams(window.location.search);
  const found = UTM_KEYS.filter((key) => params.has(key)).map((key) => [
    key,
    params.get(key).slice(0, MAX_LENGTH),
  ]);

  if (found.length > 0) {
    campaign = Object.fromEntries(found);
  }
};

export const getCampaignParams = () => campaign;
