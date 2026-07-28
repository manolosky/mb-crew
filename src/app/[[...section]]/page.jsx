import { OnePage } from '@/components/OnePage';
import { ScrollToSection } from '@/components/ScrollToSection';

export const SECTIONS = {
  about: 'About',
  stack: 'Tech Stack',
  experience: 'Experience',
  projects: 'Projects',
  contact: 'Contact',
};

// Only the paths returned here are served; anything else is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => [
  { section: [] },
  ...Object.keys(SECTIONS).map((section) => ({ section: [section] })),
];

export const generateMetadata = async ({ params }) => {
  const { section } = await params;
  const label = SECTIONS[section?.[0]];

  if (undefined === label) {
    return {};
  }

  return { title: `${label} — Manuel Bolaños` };
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
