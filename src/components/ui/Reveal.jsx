'use client';

import { animate, stagger } from 'animejs';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';

const MOTIONS = {
  up: { y: [28, 0] },
  down: { y: [-28, 0] },
  left: { x: [-40, 0] },
  right: { x: [40, 0] },
  fade: { scale: [0.97, 1] },
};

const prefersReducedMotion = () =>
  'function' === typeof window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animates content into view with anime.js when it enters the viewport.
// `direction` picks the entry motion; `staggerChildren` cascades the direct
// children instead of moving the wrapper as one block. Falls back to showing
// everything immediately without IntersectionObserver or with reduced motion.
export const Reveal = ({ direction = 'up', staggerChildren = false, className, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    const showImmediately = () => {
      el.style.opacity = '1';
    };

    if ('undefined' === typeof IntersectionObserver || prefersReducedMotion()) {
      showImmediately();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          observer.unobserve(entry.target);
          el.style.opacity = '1';
          animate(staggerChildren ? el.children : el, {
            ...MOTIONS[direction],
            opacity: [0, 1],
            duration: 750,
            ease: 'outCubic',
            delay: staggerChildren ? stagger(90) : 0,
          });
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [direction, staggerChildren]);

  return (
    <div ref={ref} className={cn('opacity-0 motion-reduce:opacity-100', className)}>
      {children}
    </div>
  );
};
