'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';
import { areAnimationsPaused, onAnimationsChange, prefersReducedMotion } from '@/lib/motion';

// Let the poster and the copy paint before the 3D engine is fetched.
const LOAD_TIMEOUT_MS = 1200;

const scheduleIdle = (callback) =>
  'requestIdleCallback' in window
    ? window.requestIdleCallback(callback, { timeout: LOAD_TIMEOUT_MS })
    : window.setTimeout(callback, LOAD_TIMEOUT_MS);

const cancelIdle = (handle) =>
  'cancelIdleCallback' in window ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);

// Ends the current task so input can be handled before the next chunk of work.
const yieldToMain = () => new Promise((resolve) => window.setTimeout(resolve, 0));

// Without motion, or when the visitor asked to save data, the poster is enough.
const sceneWanted = () =>
  !prefersReducedMotion() && !areAnimationsPaused() && true !== navigator.connection?.saveData;

// Full-screen stage of the homepage: server-rendered poster and copy, with
// the Twin City canvas mounted lazily in between. The scene writes `--split`
// on the stage so the two columns follow the seam.
export const HomeStage = ({ poster, children }) => {
  const stageRef = useRef(null);
  const hostRef = useRef(null);
  const cityRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let requested = false;
    let idleHandle = null;

    const mount = async () => {
      const { createTwinCity } = await import('@/lib/twin-city/createTwinCity');
      // Evaluating the engine and building the scene are both heavy; keep them
      // in separate tasks instead of one long one.
      await yieldToMain();

      if (disposed) {
        return;
      }

      try {
        cityRef.current = createTwinCity(hostRef.current, {
          cssTarget: stageRef.current,
          onReady: () => setReady(true),
          onContextLost: () => setReady(false),
        });
      } catch (error) {
        // No WebGL: the poster stays as the background.
        console.warn('[home] 3D scene unavailable, keeping the poster', error);
      }
    };

    const requestScene = () => {
      if (requested || !sceneWanted()) {
        return;
      }

      requested = true;
      idleHandle = scheduleIdle(mount);
    };

    requestScene();
    // Visitors who resume the animations later still get the live scene.
    const unsubscribe = onAnimationsChange(requestScene);

    return () => {
      disposed = true;
      unsubscribe();

      if (null !== idleHandle) {
        cancelIdle(idleHandle);
      }

      cityRef.current?.dispose();
      cityRef.current = null;
    };
  }, []);

  // Keyboard focus inside a lens card behaves like hovering that side.
  const handleFocus = (event) => {
    const lens = event.target.closest('[data-lens]')?.dataset.lens;

    if (undefined !== lens) {
      cityRef.current?.setHoverSide(lens);
    }
  };

  const handleBlur = () => {
    cityRef.current?.setHoverSide(null);
  };

  return (
    <main
      ref={stageRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="bg-canvas relative h-svh overflow-hidden text-white"
      style={{ '--split': 0.5 }}
    >
      {poster}
      <div
        ref={hostRef}
        aria-hidden="true"
        className={cn(
          'absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none',
          ready ? 'opacity-100' : 'opacity-0',
        )}
      />
      {children}
    </main>
  );
};
