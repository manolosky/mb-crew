import 'server-only';

import { ACTIVECAMPAIGN_IDS } from '@/lib/contact/activecampaign.config';
import { PRIVACY_NOTICE_VERSION } from '@/lib/contact/constants';

const REQUIRED_FIELDS = ['message', 'privacyConsent'];
const REQUEST_TIMEOUT_MS = 8000;

const splitName = (fullName) => {
  const [firstName, ...rest] = fullName.split(/\s+/);

  return { firstName, lastName: rest.join(' ') };
};

// Builds the body for POST /api/3/contact/sync (upsert by email). A tag and a
// custom field record where the lead came from.
export const buildContactSyncPayload = (lead, ids = ACTIVECAMPAIGN_IDS, now = new Date()) => {
  const missing = REQUIRED_FIELDS.filter((key) => null === ids.fields[key]);

  if (missing.length > 0) {
    throw new Error(`ActiveCampaign field ids missing: ${missing.join(', ')}`);
  }

  const values = {
    message: lead.message,
    company: lead.company,
    source: lead.source,
    privacyConsent: `${PRIVACY_NOTICE_VERSION} (${now.toISOString()})`,
  };

  const contact = {
    email: lead.email,
    ...splitName(lead.name),
    fieldValues: Object.entries(values)
      .filter(([key, value]) => null !== ids.fields[key] && '' !== value)
      .map(([key, value]) => ({ field: String(ids.fields[key]), value })),
    tags: [`src:${lead.source}`],
  };

  // Only visitors who ticked the optional box join the newsletter list.
  if (lead.newsletter && null !== ids.newsletterListId) {
    contact.lists = [{ list: ids.newsletterListId }];
  }

  return { contact };
};

// Sends the payload; throws on any non-2xx answer so the caller can fall back.
export const syncContact = async (payload, { baseUrl, apiToken, fetchImpl = fetch }) => {
  const response = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}/api/3/contact/sync`, {
    method: 'POST',
    headers: {
      'Api-Token': apiToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`ActiveCampaign contact sync failed with status ${response.status}`);
  }

  const body = await response.json();

  return body.contact?.id;
};
