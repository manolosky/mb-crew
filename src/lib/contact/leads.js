import 'server-only';

import { buildContactSyncPayload, syncContact } from '@/lib/contact/activecampaign';
import { readEnv } from '@/lib/server/env';

// Delivers a validated lead according to the contact form mode. Dry runs only
// log non-personal metadata; delivery problems are logged and reported back so
// the form can offer the email address instead.
export const submitLead = async (lead, mode) => {
  if ('dry-run' === mode) {
    console.info('[contact] dry-run lead', {
      reason: lead.reason,
      source: lead.source,
      newsletter: lead.newsletter,
      messageLength: lead.message.length,
    });

    return { ok: true };
  }

  const baseUrl = readEnv('ACTIVECAMPAIGN_API_URL');
  const apiToken = readEnv('ACTIVECAMPAIGN_API_KEY');

  if (undefined === baseUrl || undefined === apiToken) {
    console.error('[contact] live mode is missing the ActiveCampaign credentials');

    return { ok: false };
  }

  try {
    await syncContact(buildContactSyncPayload(lead), { baseUrl, apiToken });

    return { ok: true };
  } catch (error) {
    console.error('[contact] ActiveCampaign delivery failed', error);

    return { ok: false };
  }
};
