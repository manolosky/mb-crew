import { getImageProps } from 'next/image';

// Still frame of the Twin City, art-directed per orientation. Painted by the
// server so it is the first visual (and the fallback without WebGL); the live
// canvas fades in on top once its first frame is ready.
export const HomePoster = () => {
  const common = { alt: '', sizes: '100vw', unoptimized: true };
  const { props: portrait } = getImageProps({
    ...common,
    src: '/images/home/twin-city-portrait.webp',
    width: 860,
    height: 1864,
  });
  const { props: landscape } = getImageProps({
    ...common,
    src: '/images/home/twin-city-landscape.webp',
    width: 1920,
    height: 1080,
    loading: 'eager',
    fetchPriority: 'high',
  });

  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portrait.src} />
      <img {...landscape} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
};
