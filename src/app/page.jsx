import { HomePage } from '@/components/home/HomePage';
import { getProfile } from '@/lib/portfolio';
import { getSiteUrl } from '@/lib/site';

export const metadata = {
  description:
    'Full-Stack, AI and IoT/Embedded developer. Explore the classic portfolio — and soon, talk to MB-01, my AI twin.',
  alternates: { canonical: '/' },
};

// Structured data so search engines connect the site with its author.
const buildPersonJsonLd = (profile) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: getSiteUrl(),
  jobTitle: profile.roles[0].label,
  knowsAbout: profile.roles.map((role) => role.label),
  address: { '@type': 'PostalAddress', addressCountry: 'ES' },
  sameAs: profile.socials.map((social) => social.href).filter((href) => href.startsWith('http')),
});

const Home = () => {
  const jsonLd = JSON.stringify(buildPersonJsonLd(getProfile())).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <HomePage />
    </>
  );
};

export default Home;
