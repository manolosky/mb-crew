import 'server-only';

import { Redis } from '@upstash/redis';

import { readEnv } from '@/lib/server/env';

let client;

// Upstash client built lazily from the Vercel Marketplace (KV_*) or plain
// Upstash (UPSTASH_REDIS_REST_*) variables; null when Redis isn't configured,
// e.g. in local development.
export const getRedis = () => {
  if (undefined === client) {
    const url = readEnv('KV_REST_API_URL') ?? readEnv('UPSTASH_REDIS_REST_URL');
    const token = readEnv('KV_REST_API_TOKEN') ?? readEnv('UPSTASH_REDIS_REST_TOKEN');

    client = undefined === url || undefined === token ? null : new Redis({ url, token });
  }

  return client;
};
