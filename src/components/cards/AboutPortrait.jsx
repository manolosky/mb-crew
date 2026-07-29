'use client';

import Image from 'next/image';
import { useState } from 'react';

// Professional portrait for the About section. If the photo is ever missing
// or fails to load, the brand logo takes its place on the striped backdrop.
export const AboutPortrait = () => {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="border-line relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-[20px] border bg-[repeating-linear-gradient(135deg,#1b1916_0_12px,#211e1a_12px_24px)]">
      {photoFailed ? (
        <Image
          src="/images/logo-mb-about.png"
          alt="Manuel Bolaños hand-drawn MB logo"
          width={326}
          height={480}
          className="h-3/5 w-auto opacity-90"
        />
      ) : (
        <Image
          src="/images/about-portrait.webp"
          alt="Portrait of Manuel Bolaños"
          fill
          sizes="(max-width: 820px) 100vw, 540px"
          className="object-cover"
          onError={() => setPhotoFailed(true)}
        />
      )}
      {/* Vignette: melts the edges into the page's dark background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(11,10,9,.62)_100%)] shadow-[inset_0_0_70px_rgba(11,10,9,.55)]"
      />
    </div>
  );
};
