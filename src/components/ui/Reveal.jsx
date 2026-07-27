'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/cn';

// Fades content in when it enters the viewport, as in the reference design.
// Reduced-motion users see content immediately via the motion-reduce classes;
// environments without IntersectionObserver (jsdom) reveal on the next frame.
export const Reveal = ({ className, children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('undefined' === typeof IntersectionObserver) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-800 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-[22px] opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
};
