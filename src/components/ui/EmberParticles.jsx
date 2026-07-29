'use client';

import { animate, onScroll } from 'animejs';
import { useEffect, useRef } from 'react';

import { areAnimationsPaused, onAnimationsChange, prefersReducedMotion } from '@/lib/motion';

const COLORS = ['#f25c05', '#ff9a3d', '#ffd2a8', '#c93400'];
const DESKTOP_COUNT = 44;
const MOBILE_COUNT = 22;

// Deterministic pseudo-random (mulberry32) so server and client render the
// same particle layout — Math.random() would break hydration.
const rand = (seed) => {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildParticles = (count) =>
  Array.from({ length: count }, (_, index) => {
    const size = 2 + rand(index * 7 + 1) * 3.5;
    const color = COLORS[Math.floor(rand(index * 7 + 2) * COLORS.length)];

    return {
      id: index,
      left: `${rand(index * 7 + 3) * 100}%`,
      top: `${8 + rand(index * 7 + 4) * 84}%`,
      size: `${size.toFixed(1)}px`,
      color,
      opacity: 0.2 + rand(index * 7 + 5) * 0.5,
      glow: `0 0 ${(4 + size * 1.5).toFixed(0)}px ${color}`,
    };
  });

const PARTICLES = buildParticles(DESKTOP_COUNT);

// Floating ember particles behind a section, with a scroll-scrubbed parallax
// drift. Static (dim, motionless) with reduced motion or without observers.
export const EmberParticles = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;

    if ('undefined' === typeof IntersectionObserver || prefersReducedMotion()) {
      return undefined;
    }

    const isMobile = window.innerWidth < 821;
    const dots = Array.from(layer.children).slice(0, isMobile ? MOBILE_COUNT : DESKTOP_COUNT);

    // Continuous firefly drift, one randomized loop per particle.
    const floats = dots.map((dot, index) =>
      animate(dot, {
        y: [0, -(18 + rand(index * 11 + 6) * 46)],
        x: [0, (rand(index * 11 + 7) - 0.5) * 34],
        opacity: [dot.style.opacity * 0.4, dot.style.opacity],
        duration: 3200 + rand(index * 11 + 8) * 3600,
        delay: rand(index * 11 + 9) * 1800,
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      }),
    );

    // Parallax scrub: the whole layer slides as the section crosses the viewport.
    const scrub = animate(layer, {
      y: ['4rem', '-4rem'],
      ease: 'linear',
      autoplay: onScroll({ target: layer.parentElement, sync: 0.35 }),
    });

    const all = [...floats, scrub];
    let onScreen = true;

    const applyPlayState = () => {
      const shouldRun = onScreen && !areAnimationsPaused();
      all.forEach((animation) => (shouldRun ? animation.play() : animation.pause()));
    };

    // Save cycles while the section is off screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          onScreen = entry.isIntersecting;
          applyPlayState();
        });
      },
      { rootMargin: '10% 0px 10% 0px' },
    );

    observer.observe(layer.parentElement);
    applyPlayState();
    const unsubscribe = onAnimationsChange(applyPlayState);

    return () => {
      unsubscribe();
      observer.disconnect();
      all.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className={
            particle.id >= MOBILE_COUNT
              ? 'nav:block absolute hidden rounded-full'
              : 'absolute rounded-full'
          }
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: particle.glow,
          }}
        />
      ))}
    </div>
  );
};
