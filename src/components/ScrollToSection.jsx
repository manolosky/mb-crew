'use client';

import { useEffect } from 'react';

// Tracks whether the visitor already navigated within the page. Module scope
// survives page remounts, so only the very first landing jumps instantly.
let hasNavigated = false;

// Scrolls the viewport to the section matching the current route.
export const ScrollToSection = ({ section }) => {
  useEffect(() => {
    if (undefined === section) {
      if (hasNavigated) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      hasNavigated = true;
      return;
    }

    const target = document.getElementById(section);

    if (null !== target) {
      target.scrollIntoView({ behavior: hasNavigated ? 'smooth' : 'instant', block: 'start' });
    }
    hasNavigated = true;
  }, [section]);

  return null;
};
