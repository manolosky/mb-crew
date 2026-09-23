import { getSiteUrl } from '@/lib/site';

const robots = () => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: `${getSiteUrl()}/sitemap.xml`,
});

export default robots;
