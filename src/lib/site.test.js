import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSiteUrl } from './site';

describe('getSiteUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the configured origin', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.manuelbolanos.dev/');

    expect(getSiteUrl()).toBe('https://www.manuelbolanos.dev');
  });

  it('falls back to the production domain when the variable is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);

    expect(getSiteUrl()).toBe('https://manuelbolanos.dev');
  });

  it('ignores the placeholder Vercel sends for sensitive variables', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '[SENSITIVE]');

    expect(getSiteUrl()).toBe('https://manuelbolanos.dev');
  });

  it('ignores non-http URLs', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'javascript:alert(1)');

    expect(getSiteUrl()).toBe('https://manuelbolanos.dev');
  });
});
