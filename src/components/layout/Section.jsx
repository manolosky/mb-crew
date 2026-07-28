import { cn } from '@/lib/cn';

// Page section: anchor target with sticky-nav offset and 1120px container.
// `band` renders a slightly raised full-width background with top/bottom
// borders; `backdrop` slots a decorative layer behind the content.
export const Section = ({
  id,
  band = false,
  backdrop,
  className,
  containerClassName,
  children,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-[84px]',
        band && 'border-line-soft border-y bg-[#12100e]',
        undefined !== backdrop && 'relative overflow-hidden',
        className,
      )}
    >
      {backdrop}
      <div
        className={cn(
          'relative z-[1] mx-auto w-full max-w-[1120px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};
