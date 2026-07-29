'use client';

import { useEffect } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

// Tracks whether the visitor already navigated within the page. Module scope
// survives page remounts, so only the very first landing jumps instantly.
let hasNavigated = false;

// Scrolls the viewport to the section matching the current route and moves
// keyboard focus there, so tabbing continues from the section (WCAG 2.4.3).
// Smooth scrolling is skipped for reduced-motion users (WCAG 2.3.3).
export const ScrollToSection = ({ section }) => {
  useEffect(() => {
    const behavior = hasNavigated && !prefersReducedMotion() ? 'smooth' : 'instant';

    if (undefined === section) {
      if (hasNavigated) {
        window.scrollTo({ top: 0, behavior });
      }
      hasNavigated = true;
      return;
    }

    const target = document.getElementById(section);

    if (null !== target) {
      target.scrollIntoView({ behavior, block: 'start' });

      if (hasNavigated) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
    hasNavigated = true;
  }, [section]);

  return null;
};
