import 'server-only';

import { readEnv } from '@/lib/server/env';

const MODES = ['off', 'dry-run', 'live'];

// Whether the contact form is shown and where submissions go:
// - `off`: only the classic contact card (production default until the CRM is ready)
// - `dry-run`: messages are accepted but not delivered (local development, previews)
// - `live`: leads are sent to ActiveCampaign
// Read at build time for the static pages and at runtime by the Server Action.
export const getContactFormMode = () => {
  const mode = readEnv('CONTACT_FORM_MODE');

  if (MODES.includes(mode)) {
    return mode;
  }

  return 'development' === process.env.NODE_ENV ? 'dry-run' : 'off';
};
