// @vitest-environment node
import { checkBotId } from 'botid/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isBotRequest } from './bot-check';

describe('isBotRequest', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('treats traffic outside Vercel as human without calling BotID', async () => {
    vi.stubEnv('VERCEL', undefined);

    await expect(isBotRequest()).resolves.toBe(false);
    expect(checkBotId).not.toHaveBeenCalled();
  });

  it('returns the BotID verdict on Vercel', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.mocked(checkBotId).mockResolvedValueOnce({ isBot: true });

    await expect(isBotRequest()).resolves.toBe(true);
  });

  it('fails open when the verification itself breaks', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.mocked(checkBotId).mockRejectedValueOnce(new Error('outage'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(isBotRequest()).resolves.toBe(false);
  });
});
