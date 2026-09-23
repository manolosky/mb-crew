import Link from 'next/link';

import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { LogoMark } from '@/components/layout/LogoMark';

const LEGAL_LINK_STYLES =
  'hover:text-ink cursor-pointer underline-offset-2 transition hover:underline';

export const Footer = () => {
  return (
    <footer className="text-faint mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,48px)] pb-14 text-[13.5px]">
      <div className="flex items-center gap-2.5">
        <LogoMark className="h-[34px]" />© {new Date().getFullYear()} Manuel Bolaños
      </div>
      <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link href="/privacy" className={LEGAL_LINK_STYLES}>
          Privacy &amp; cookies
        </Link>
        <CookieSettingsButton className={LEGAL_LINK_STYLES} />
      </nav>
    </footer>
  );
};
