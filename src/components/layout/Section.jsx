import { cn } from '@/lib/cn';

// Page section: anchor target with sticky-nav offset and 1120px container.
// `band` renders a slightly raised full-width background with top/bottom borders.
export const Section = ({ id, band = false, className, containerClassName, children }) => {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-[84px]',
        band && 'border-line-soft border-y bg-[#12100e]',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[1120px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};
