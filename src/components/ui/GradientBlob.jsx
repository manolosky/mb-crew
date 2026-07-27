import { cn } from '@/lib/cn';

const VARIANT_STYLES = {
  violet: {
    className: 'animate-floaty blur-[30px]',
    background:
      'radial-gradient(circle at 35% 35%, rgba(124,92,255,.32), rgba(193,75,255,.1) 58%, transparent 72%)',
  },
  blue: {
    className: 'animate-floaty-slow blur-[32px]',
    background: 'radial-gradient(circle at 50% 50%, rgba(91,108,255,.26), transparent 70%)',
  },
};

// Decorative floating orb; position and size it via className.
export const GradientBlob = ({ variant = 'violet', className }) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-0 rounded-full motion-reduce:animate-none',
        styles.className,
        className,
      )}
      style={{ background: styles.background }}
    />
  );
};
