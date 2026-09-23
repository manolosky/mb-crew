// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

import { readEnv } from './env';

describe('readEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the trimmed value', () => {
    vi.stubEnv('SOME_VALUE', '  dry-run ');

    expect(readEnv('SOME_VALUE')).toBe('dry-run');
  });

  it('treats missing, empty and Vercel "Sensitive" placeholder values as unset', () => {
    vi.stubEnv('SOME_VALUE', undefined);
    expect(readEnv('SOME_VALUE')).toBeUndefined();

    vi.stubEnv('SOME_VALUE', '   ');
    expect(readEnv('SOME_VALUE')).toBeUndefined();

    vi.stubEnv('SOME_VALUE', '[SENSITIVE]');
    expect(readEnv('SOME_VALUE')).toBeUndefined();
  });
});
