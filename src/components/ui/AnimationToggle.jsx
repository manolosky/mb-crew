'use client';

import { useEffect, useSyncExternalStore } from 'react';

import {
  areAnimationsPaused,
  onAnimationsChange,
  setAnimationsPaused,
  syncAnimationsAttribute,
} from '@/lib/motion';
import { Icon } from '@/lib/icons';

// SSR renders the default (running) state; the store takes over on hydration.
const getServerSnapshot = () => false;

// Pauses/resumes every decorative animation on the site: background videos,
// ember particles and floating blobs (WCAG 2.2.2 pause mechanism).
export const AnimationToggle = () => {
  const paused = useSyncExternalStore(onAnimationsChange, areAnimationsPaused, getServerSnapshot);

  // Mirror the stored preference onto <html> so CSS animations pause too.
  useEffect(() => {
    syncAnimationsAttribute();
  }, []);

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={paused ? 'Resume decorative animations' : 'Pause decorative animations'}
      onClick={() => setAnimationsPaused(!paused)}
      className="border-line bg-surface text-slate hover:text-ink flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border transition"
    >
      <Icon name={paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'} className="text-xs" />
    </button>
  );
};
