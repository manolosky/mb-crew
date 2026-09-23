import 'server-only';

import { createHmac, randomUUID } from 'node:crypto';

import { Ratelimit } from '@upstash/ratelimit';

import { readEnv } from '@/lib/server/env';
import { getRedis } from '@/lib/server/redis';

// Redis calls slower than this let the request through instead of blocking it.
const REDIS_TIMEOUT_MS = 2000;

// Without a configured salt, hash with a per-instance random value: limits
// still work within an instance and raw IPs are never stored.
const FALLBACK_SALT = randomUUID();

const limiters = new Map();

const getLimiter = (name, create) => {
  if (!limiters.has(name)) {
    limiters.set(name, create());
  }

  return limiters.get(name);
};

// Vercel sets both headers itself, so they can't be spoofed by the client.
export const getClientIp = (headerList) =>
  headerList.get('x-real-ip') ??
  headerList.get('x-forwarded-for')?.split(',')[0].trim() ??
  'unknown';

// Keyed hash so rate-limit keys never contain a raw IP address.
export const hashIp = (ip) =>
  createHmac('sha256', readEnv('RATE_LIMIT_SALT') ?? FALLBACK_SALT)
    .update(ip)
    .digest('hex')
    .slice(0, 32);

// Contact form: 3 messages per 10 minutes per visitor and 50 per day overall.
// Redis problems fail open so a genuine lead is never lost; the honeypot, the
// time trap and BotID still apply. `pending` must be awaited after responding.
export const limitContactSubmission = async (ip) => {
  const redis = getRedis();

  if (null === redis) {
    return { allowed: true, pending: Promise.resolve() };
  }

  try {
    const perVisitor = getLimiter(
      'contact:visitor',
      () =>
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '10 m'),
          prefix: 'rl:contact:visitor',
          timeout: REDIS_TIMEOUT_MS,
        }),
    );
    const overall = getLimiter(
      'contact:global',
      () =>
        new Ratelimit({
          redis,
          limiter: Ratelimit.fixedWindow(50, '1 d'),
          prefix: 'rl:contact:global',
          timeout: REDIS_TIMEOUT_MS,
        }),
    );

    const [visitor, global] = await Promise.all([
      perVisitor.limit(hashIp(ip)),
      overall.limit('all'),
    ]);

    return {
      allowed: visitor.success && global.success,
      pending: Promise.all([visitor.pending, global.pending]),
    };
  } catch (error) {
    console.error('[rate-limit] contact limiter failed open', error);

    return { allowed: true, pending: Promise.resolve() };
  }
};
