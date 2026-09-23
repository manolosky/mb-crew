import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/lib/routes';

import nextConfig from '../../next.config.mjs';

describe('next.config', () => {
  it('permanently redirects every old section URL to its /portfolio twin', async () => {
    const redirects = await nextConfig.redirects();
    const sectionRedirect = redirects.find(
      (redirect) => '/portfolio/:section' === redirect.destination,
    );
    const redirectedIds = sectionRedirect.source.match(/\(([^)]+)\)/)[1].split('|');

    expect(sectionRedirect.permanent).toBe(true);
    expect(redirectedIds.toSorted()).toEqual(SECTION_IDS.toSorted());
  });

  // Security headers only change on purpose: update the snapshot deliberately.
  it('keeps the security headers stable', async () => {
    const [rule] = await nextConfig.headers();

    expect(rule.source).toBe('/(.*)');
    expect(rule.headers).toMatchSnapshot();
  });
});
