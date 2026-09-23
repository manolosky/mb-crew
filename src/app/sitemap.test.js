import { describe, expect, it } from 'vitest';

import { SECTION_IDS } from '@/lib/routes';
import { getSiteUrl } from '@/lib/site';

import sitemap from './sitemap';

describe('sitemap', () => {
  const baseUrl = getSiteUrl();
  const urls = sitemap().map((entry) => entry.url);

  it('lists the home page first', () => {
    expect(urls[0]).toBe(baseUrl);
  });

  it('lists every portfolio section under /portfolio', () => {
    SECTION_IDS.forEach((section) => {
      expect(urls).toContain(`${baseUrl}/portfolio/${section}`);
    });
  });

  it('leaves out the bare /portfolio path and the old section URLs', () => {
    expect(urls).not.toContain(`${baseUrl}/portfolio`);
    SECTION_IDS.forEach((section) => {
      expect(urls).not.toContain(`${baseUrl}/${section}`);
    });
  });
});
