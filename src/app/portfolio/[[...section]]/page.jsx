import { OnePageRoute } from '@/components/OnePageRoute';
import { portfolioHref, SECTION_IDS, SECTIONS } from '@/lib/routes';

// Only the paths returned here are served; anything else is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => [
  { section: [] },
  ...SECTION_IDS.map((section) => ({ section: [section] })),
];

export const generateMetadata = async ({ params }) => {
  const { section } = await params;
  const id = section?.[0];

  // Until the new homepage launches, `/` serves this same page and remains the
  // canonical URL, so the bare /portfolio path stays out of the index.
  if (undefined === id) {
    return {
      alternates: { canonical: '/' },
      robots: { index: false, follow: true },
    };
  }

  const label = SECTIONS[id];

  if (undefined === label) {
    return {};
  }

  return {
    title: `${label} — Manuel Bolaños`,
    alternates: { canonical: portfolioHref(id) },
  };
};

const Page = async ({ params }) => {
  const { section } = await params;

  return <OnePageRoute section={section?.[0]} />;
};

export default Page;
