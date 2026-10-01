// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRedis } from '@/lib/server/redis';

import { getClientIp, hashIp, limitContactSubmission } from './rate-limit';

const { limit } = vi.hoisted(() => ({ limit: vi.fn() }));

vi.mock('@/lib/server/redis', () => ({ getRedis: vi.fn(() => null) }));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow = () => ({});
    static fixedWindow = () => ({});

    constructor({ prefix }) {
      this.prefix = prefix;
    }

    limit(key) {
      return limit(this.prefix, key);
    }
  },
}));

const result = (success) => ({ success, pending: Promise.resolve() });

describe('getClientIp', () => {
  it('prefers x-real-ip, then the first x-forwarded-for entry', () => {
    expect(getClientIp(new Headers({ 'x-real-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' }))).toBe(
      '1.1.1.1',
    );
    expect(getClientIp(new Headers({ 'x-forwarded-for': '3.3.3.3, 10.0.0.1' }))).toBe('3.3.3.3');
    expect(getClientIp(new Headers())).toBe('unknown');
  });
});

describe('hashIp', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('never exposes the raw address and is stable for the same salt', () => {
    vi.stubEnv('RATE_LIMIT_SALT', 'test-salt');

    const hash = hashIp('203.0.113.7');

    expect(hash).toMatch(/^[0-9a-f]{32}$/);
    expect(hash).not.toContain('203');
    expect(hashIp('203.0.113.7')).toBe(hash);
    expect(hashIp('203.0.113.8')).not.toBe(hash);
  });
});

describe('limitContactSubmission', () => {
  beforeEach(() => {
    limit.mockReset();
  });

  it('allows everything when Redis is not configured', async () => {
    vi.mocked(getRedis).mockReturnValue(null);

    await expect(limitContactSubmission('203.0.113.7')).resolves.toMatchObject({ allowed: true });
    expect(limit).not.toHaveBeenCalled();
  });

  it('blocks when the visitor or the daily total is over the limit', async () => {
    vi.mocked(getRedis).mockReturnValue({});
    limit.mockImplementation((prefix) => result('rl:contact:visitor' !== prefix));

    await expect(limitContactSubmission('203.0.113.7')).resolves.toMatchObject({ allowed: false });

    limit.mockImplementation((prefix) => result('rl:contact:global' !== prefix));
    await expect(limitContactSubmission('203.0.113.7')).resolves.toMatchObject({ allowed: false });
  });

  it('keys the visitor limit by the hashed IP', async () => {
    vi.mocked(getRedis).mockReturnValue({});
    limit.mockResolvedValue(result(true));

    await limitContactSubmission('203.0.113.7');

    expect(limit).toHaveBeenCalledWith('rl:contact:visitor', hashIp('203.0.113.7'));
    expect(limit).toHaveBeenCalledWith('rl:contact:global', 'all');
  });

  it('fails open when Redis errors', async () => {
    vi.mocked(getRedis).mockReturnValue({});
    limit.mockRejectedValue(new Error('Redis down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(limitContactSubmission('203.0.113.7')).resolves.toMatchObject({ allowed: true });
  });
});
