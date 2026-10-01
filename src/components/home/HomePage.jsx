import Link from 'next/link';

import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { HomePoster } from '@/components/home/HomePoster';
import { HomeStage } from '@/components/home/HomeStage';
import { AnimationToggle } from '@/components/ui/AnimationToggle';
import { cn } from '@/lib/cn';
import { portfolioHref } from '@/lib/routes';

const LEGAL_LINK_STYLES = 'hover:text-white underline-offset-2 transition hover:underline';

// One lens of the homepage: a square panel with a coloured bottom rule,
// holding the lens type, the headline and a text call to action.
const LensCard = ({ lens, eyebrow, title, accentClassName, children }) => {
  const titleId = `home-${lens}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex items-end p-[clamp(16px,4vw,56px)] pb-[clamp(56px,7vw,80px)]',
        'twin' === lens ? 'justify-start pt-28' : 'justify-end',
      )}
    >
      <div
        data-lens={lens}
        className={cn(
          'pointer-events-auto w-full max-w-[460px] border-b-[3px] bg-[rgba(11,10,9,.72)] px-[clamp(20px,2.6vw,32px)] py-[clamp(20px,2.4vw,28px)] backdrop-blur-md',
          accentClassName,
        )}
      >
        <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.12em] text-white/75 uppercase">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="font-heading mt-3 text-[clamp(28px,3.4vw,44px)] leading-[1.05] font-bold tracking-[-0.02em]"
        >
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
};

// "Two lenses" homepage: the AI digital twin on one side, the classic
// portfolio on the other, over the Twin City scene.
export const HomePage = () => {
  return (
    <HomeStage poster={<HomePoster />}>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 px-16 pt-6 text-center">
        <h1 className="font-heading leading-tight font-bold tracking-[-0.015em]">
          <span className="text-[clamp(21px,2.3vw,30px)]">Manuel Bolaños</span>
          <span className="sr-only"> — </span>
          <span className="nav:inline nav:ml-3 block text-[clamp(14px,1.4vw,18px)] font-medium text-white/80">
            Full-Stack · AI · IoT/Embedded
          </span>
        </h1>
        <p className="mt-1.5 font-mono text-[13px] text-white/70">
          Two ways to meet me. Pick yours.
        </p>
      </header>

      <div className="absolute top-4 right-4 z-20">
        <AnimationToggle />
      </div>

      <div className="pointer-events-none relative z-10 grid h-full portrait:grid-rows-[calc(var(--split)*100%)_minmax(0,1fr)] landscape:grid-cols-[calc(var(--split)*100%)_minmax(0,1fr)]">
        <LensCard
          lens="twin"
          eyebrow={
            <>
              <span className="bg-brand-start h-2 w-2 animate-pulse rounded-full motion-reduce:animate-none" />
              MB-01 · Agent mode
            </>
          }
          title="Don’t read my résumé. Talk to it."
          accentClassName="border-brand"
        >
          <p className="font-heading flex items-center gap-2 text-[16px] font-semibold text-white/55">
            Talk to MB-01 <span aria-hidden="true">→</span>
            <span className="text-brand-start font-mono text-[12px] font-medium tracking-[0.1em] uppercase">
              (soon)
            </span>
          </p>
        </LensCard>

        <LensCard
          lens="classic"
          eyebrow="Classic · Portfolio"
          title="Prefer the classic way?"
          accentClassName="border-ink"
        >
          <Link
            href={portfolioHref()}
            className="group font-heading inline-flex items-center gap-2 text-[16px] font-semibold text-white underline-offset-4 hover:underline"
          >
            Explore the portfolio
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            >
              →
            </span>
          </Link>
        </LensCard>
      </div>

      <nav
        aria-label="Legal"
        className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-4 bg-black/55 px-3 py-1 font-mono text-[11.5px] whitespace-nowrap text-white/70 backdrop-blur-sm"
      >
        <Link href="/privacy" className={LEGAL_LINK_STYLES}>
          Privacy &amp; cookies
        </Link>
        <CookieSettingsButton className={cn(LEGAL_LINK_STYLES, 'cursor-pointer')} />
      </nav>
    </HomeStage>
  );
};
