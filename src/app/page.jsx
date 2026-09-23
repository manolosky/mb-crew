import { OnePageRoute } from '@/components/OnePageRoute';

// Interim homepage: keeps serving the classic one-page (the same content as
// /portfolio) until the new two-lens homepage launches.
export const metadata = {
  alternates: { canonical: '/' },
};

const Home = () => {
  return <OnePageRoute />;
};

export default Home;
