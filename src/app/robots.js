const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mb-crew.vercel.app';

const robots = () => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: `${BASE_URL}/sitemap.xml`,
});

export default robots;
