'use client';

import { useEffect, useRef, useState } from 'react';

import { areAnimationsPaused, onAnimationsChange } from '@/lib/motion';

// Decorative ambient video that mounts well after the page has loaded, so it
// never competes with the initial render or affects LCP. The poster itself is
// rendered by the parent server component and stays untouched by hydration.
// Respects the site-wide animation pause switch (WCAG 2.2.2).
export const BackgroundVideo = ({ src, poster }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const EVENTS = ['scroll', 'pointerdown', 'pointermove', 'keydown', 'touchstart'];
    const start = () => setShowVideo(true);

    // First interaction starts the video; a long fallback covers passive
    // visitors without ever overlapping the initial page load.
    EVENTS.forEach((name) => window.addEventListener(name, start, { once: true, passive: true }));
    const timeoutId = window.setTimeout(start, 8000);

    return () => {
      EVENTS.forEach((name) => window.removeEventListener(name, start));
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!showVideo) {
      return undefined;
    }

    const applyPlayState = () => {
      const video = videoRef.current;

      if (null === video) {
        return;
      }

      if (areAnimationsPaused()) {
        video.pause();
      } else {
        // play() may return undefined in older engines; rejection means the
        // browser refused autoplay and the poster keeps showing.
        video.play()?.catch(() => {});
      }
    };

    applyPlayState();
    return onAnimationsChange(applyPlayState);
  }, [showVideo]);

  if (!showVideo) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      autoPlay={!areAnimationsPaused()}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      poster={poster}
      className="absolute inset-0 z-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 motion-reduce:hidden"
      onPlaying={(event) => {
        event.currentTarget.style.opacity = '1';
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};
