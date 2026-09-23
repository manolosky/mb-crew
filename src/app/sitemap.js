import { portfolioHref, SECTION_IDS } from '@/lib/routes';
import { getSiteUrl } from '@/lib/site';

// The bare /portfolio path is left out on purpose: until the new homepage
// launches it mirrors `/`, which stays the canonical URL.
const sitemap = () => {
  const baseUrl = getSiteUrl();

  return [
    { url: baseUrl, priority: 1 },
    ...SECTION_IDS.map((section) => ({
      url: `${baseUrl}${portfolioHref(section)}`,
      priority: 0.8,
    })),
  ];
};

export default sitemap;
