'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AnimationToggle } from '@/components/ui/AnimationToggle';
import { portfolioHref } from '@/lib/routes';

const CARD_STYLES =
  'pointer-events-auto max-w-[460px] rounded-[20px] border border-white/10 bg-[rgba(11,10,9,.62)] p-[clamp(20px,3vw,32px)] backdrop-blur-md';

const CTA_STYLES =
  'mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition';

// Twin City spike: the 3D scene behind two columns whose widths follow the
// seam (`--split`, written by the scene on every frame).
export const TwinCityLab = () => {
  const rootRef = useRef(null);
  const hostRef = useRef(null);
  const cityRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [fps, setFps] = useState(null);
  const [inkLight, setInkLight] = useState(false);

  useEffect(() => {
    let disposed = false;

    // The 3D engine (three.js + postprocessing) is its own chunk, loaded after
    // the page is interactive.
    const mount = async () => {
      const { createTwinCity } = await import('@/lib/twin-city/createTwinCity');

      if (disposed) {
        return;
      }

      try {
        cityRef.current = createTwinCity(hostRef.current, {
          cssTarget: rootRef.current,
          onStats: ({ fps: value }) => setFps(value),
          onContextLost: () => setStatus('unsupported'),
        });
        setStatus('ready');
      } catch (error) {
        console.error('[twin-city] WebGL is unavailable', error);
        setStatus('unsupported');
      }
    };

    mount();

    return () => {
      disposed = true;
      cityRef.current?.dispose();
      cityRef.current = null;
    };
  }, []);

  const toggleInk = () => {
    setInkLight(!inkLight);
    cityRef.current?.setInkLight(!inkLight);
  };

  // Keyboard focus on a call to action behaves like hovering its side.
  const setHoverSide = (side) => {
    cityRef.current?.setHoverSide(side);
  };

  return (
    <main
      ref={rootRef}
      className="bg-canvas relative h-svh overflow-hidden text-white"
      style={{ '--split': 0.5 }}
    >
      <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-1 px-4 pt-5 text-center">
        <p className="font-heading text-[15px] font-bold tracking-[-0.01em]">
          Manuel Bolaños — Full-Stack · AI · IoT/Embedded
        </p>
        <p className="font-mono text-[12px] text-white/70">Two ways to meet me. Pick yours.</p>
      </div>

      <div className="pointer-events-none relative z-10 grid h-full portrait:grid-rows-[calc(var(--split)*100%)_minmax(0,1fr)] landscape:grid-cols-[calc(var(--split)*100%)_minmax(0,1fr)]">
        <section
          aria-labelledby="lab-twin-title"
          className="flex items-end justify-start p-[clamp(16px,4vw,56px)] pt-24"
        >
          <div className={CARD_STYLES}>
            <p className="flex items-center gap-2 font-mono text-[12px] tracking-[0.1em] text-white/80 uppercase">
              <span className="bg-mint h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(62,207,142,.28)]" />
              MB-01 online · Agent mode
            </p>
            <h2
              id="lab-twin-title"
              className="font-heading mt-3 text-[clamp(26px,3.6vw,44px)] leading-[1.05] font-bold tracking-[-0.02em]"
            >
              Don&apos;t read my résumé. Talk to it.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-white/80">
              MB-01 is my AI twin: it knows my career, projects and passions, and answers instantly
              — in English or Spanish.
            </p>
            <button
              type="button"
              title="Coming soon"
              onFocus={() => setHoverSide('twin')}
              onBlur={() => setHoverSide(null)}
              className={`${CTA_STYLES} bg-brand-gradient-soft text-ink-on-brand cursor-not-allowed`}
            >
              Talk to MB-01 → <span className="text-[12px] font-medium">(soon)</span>
            </button>
          </div>
        </section>

        <section
          aria-labelledby="lab-classic-title"
          className="flex items-end justify-end p-[clamp(16px,4vw,56px)]"
        >
          <div className={CARD_STYLES}>
            <p className="font-mono text-[12px] tracking-[0.1em] text-white/80 uppercase">
              Classic · Portfolio
            </p>
            <h2
              id="lab-classic-title"
              className="mt-3 font-serif text-[clamp(28px,3.8vw,46px)] leading-[1.05] tracking-[-0.01em]"
            >
              Prefer the classic way?
            </h2>
            <p className="mt-3 text-[15px] leading-[1.55] text-white/80">
              Experience, projects and stack across Full-Stack, AI and IoT/Embedded — laid out the
              traditional way.
            </p>
            <Link
              href={portfolioHref()}
              onFocus={() => setHoverSide('classic')}
              onBlur={() => setHoverSide(null)}
              className={`${CTA_STYLES} border border-white/30 bg-white/10 hover:bg-white/20`}
            >
              Explore the portfolio →
            </Link>
          </div>
        </section>
      </div>

      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-[11px] text-white/80 backdrop-blur">
        <span>LAB</span>
        <span aria-live="polite">
          {'ready' === status && null !== fps ? `${fps} fps` : null}
          {'loading' === status ? 'loading…' : null}
          {'unsupported' === status ? 'WebGL unavailable' : null}
        </span>
        <button
          type="button"
          onClick={toggleInk}
          aria-pressed={inkLight}
          className="rounded-md border border-white/20 px-2 py-1 hover:bg-white/10"
        >
          Ink: {inkLight ? 'paper' : 'dark'}
        </button>
        <AnimationToggle />
      </div>
    </main>
  );
};
