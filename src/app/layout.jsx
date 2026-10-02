import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';

import { Analytics } from '@/components/consent/Analytics';
import { CookieBanner } from '@/components/consent/CookieBanner';
import portfolio from '@/data/portfolio.json';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Manuel Bolaños — Full-Stack Developer · Integrations & Applied AI',
  description: portfolio.profile.tagline,
};

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* First in the tab order so keyboard users can decide right away. */}
        <CookieBanner />
        {children}
        {/* Google Tag Manager (with GA4) only loads after analytics consent. */}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
