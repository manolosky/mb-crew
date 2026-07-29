'use client';

import { animate, stagger } from 'animejs';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/lib/motion';

const MOTIONS = {
  up: { y: [28, 0] },
  down: { y: [-28, 0] },
  left: { x: [-40, 0] },
  right: { x: [40, 0] },
  fade: { scale: [0.97, 1] },
};

// Animates content into view with anime.js when it enters the viewport.
// `direction` picks the entry motion; `staggerChildren` cascades the direct
// children instead of moving the wrapper as one block. Falls back to showing
// everything immediately without IntersectionObserver or with reduced motion.
export const Reveal = ({ direction = 'up', staggerChildren = false, className, children }) => {
  const ref = useRef(null);
  const revealedRef = useRef(false);

  // Keyboard users can tab into content that has not animated in yet; show it
  // instantly so focus never lands on an invisible element.
  const revealNow = () => {
    if (revealedRef.current || null === ref.current) {
      return;
    }
    revealedRef.current = true;
    ref.current.style.opacity = '1';
    Array.from(ref.current.children).forEach((child) => {
      child.style.opacity = '1';
    });
  };

  useEffect(() => {
    const el = ref.current;

    if ('undefined' === typeof IntersectionObserver || prefersReducedMotion()) {
      revealedRef.current = true;
      el.style.opacity = '1';
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealedRef.current) {
            return;
          }
          revealedRef.current = true;
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
    <div
      ref={ref}
      onFocusCapture={revealNow}
      className={cn('opacity-0 motion-reduce:opacity-100', className)}
    >
      {children}
    </div>
  );
};
