import { notFound } from 'next/navigation';

import { TwinCityLab } from '@/components/lab/TwinCityLab';
import { isLabEnabled } from '@/lib/features';

// Hidden playground for the "Two lenses" homepage (Twin City spike).
export const metadata = {
  title: 'Lab — Twin City',
  robots: { index: false, follow: false },
};

const LabPage = () => {
  if (!isLabEnabled()) {
    notFound();
  }

  return <TwinCityLab />;
};

export default LabPage;
