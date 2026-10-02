'use client';

import { useEffect, useSyncExternalStore } from 'react';

import {
  areAnimationsPaused,
  onAnimationsChange,
  setAnimationsPaused,
  syncAnimationsAttribute,
} from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Icon } from '@/lib/icons';

// SSR renders the default (running) state; the store takes over on hydration.
const getServerSnapshot = () => false;

// `boxed` holds its own over busy backgrounds (the 3D homepage); `bare` sits
// in the navigation bar as just the icon.
const VARIANT_STYLES = {
  boxed: 'border-line bg-surface border',
  bare: '',
};

// Pauses/resumes every decorative animation on the site: background videos,
// ember particles and floating blobs (WCAG 2.2.2 pause mechanism).
export const AnimationToggle = ({ variant = 'boxed' }) => {
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
      className={cn(
        'text-slate hover:text-ink flex h-10 w-10 cursor-pointer items-center justify-center transition',
        VARIANT_STYLES[variant],
      )}
    >
      <Icon name={paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'} className="text-xs" />
    </button>
  );
};
