import 'server-only';

import { checkBotId } from 'botid/server';

// BotID verdict for the current request. BotID only classifies traffic on
// Vercel deployments (elsewhere it throws), so other environments count as
// human, and a verification outage fails open so it never blocks real visitors.
export const isBotRequest = async () => {
  if (undefined === process.env.VERCEL) {
    return false;
  }

  try {
    const { isBot } = await checkBotId();

    return isBot;
  } catch (error) {
    console.error('[botid] verification failed open', error);

    return false;
  }
};
