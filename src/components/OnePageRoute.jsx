import { OnePage } from '@/components/OnePage';
import { ScrollToSection } from '@/components/ScrollToSection';

// The classic one-page scrolled to the requested section. Shared by
// /portfolio/[[...section]] and, until the new homepage launches, by `/`.
export const OnePageRoute = ({ section }) => {
  return (
    <>
      <ScrollToSection section={section} />
      <OnePage />
    </>
  );
};
