import { OnePage } from '@/components/OnePage';
import { ScrollToSection } from '@/components/ScrollToSection';
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

  if (undefined === id) {
    return {
      title: 'Portfolio — Manuel Bolaños',
      alternates: { canonical: portfolioHref() },
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

  return (
    <>
      <ScrollToSection section={section?.[0]} />
      <OnePage />
    </>
  );
};

export default Page;
