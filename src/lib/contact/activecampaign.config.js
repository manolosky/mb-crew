// ActiveCampaign ids for the portfolio account (Settings → Fields / Lists).
// They are not secrets. `live` mode refuses to send leads until the required
// field ids (message, privacyConsent) are filled in.
export const ACTIVECAMPAIGN_IDS = {
  fields: {
    message: null,
    company: null,
    reason: null,
    source: null,
    privacyConsent: null,
  },
  newsletterListId: null,
};
