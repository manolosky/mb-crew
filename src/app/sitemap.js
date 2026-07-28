import { SECTIONS } from '@/app/[[...section]]/page';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mb-crew.vercel.app';

const sitemap = () => [
  { url: BASE_URL, priority: 1 },
  ...Object.keys(SECTIONS).map((section) => ({
    url: `${BASE_URL}/${section}`,
    priority: 0.8,
  })),
];

export default sitemap;
