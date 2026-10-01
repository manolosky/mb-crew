import { initBotId } from 'botid/client/core';

import { captureCampaignParams } from '@/lib/utm';

// BotID attaches its challenge headers to these requests. Server Actions post
// to the page that renders the form, so every page hosting the contact form is
// listed; the server side of the check lives in src/lib/server/bot-check.js.
initBotId({
  protect: [
    { path: '/', method: 'POST' },
    { path: '/portfolio', method: 'POST' },
    { path: '/portfolio/*', method: 'POST' },
  ],
});

// Remember the landing page campaign before the visitor navigates away.
captureCampaignParams();
