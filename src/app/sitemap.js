import { portfolioHref, SECTION_IDS } from '@/lib/routes';
import { getSiteUrl } from '@/lib/site';

const sitemap = () => {
  const baseUrl = getSiteUrl();

  return [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}${portfolioHref()}`, priority: 0.9 },
    ...SECTION_IDS.map((section) => ({
      url: `${baseUrl}${portfolioHref(section)}`,
      priority: 0.8,
    })),
    { url: `${baseUrl}/privacy`, priority: 0.3 },
  ];
};

export default sitemap;
