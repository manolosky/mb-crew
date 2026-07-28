import { cn } from '@/lib/cn';

const VARIANT_STYLES = {
  ember: {
    className: 'animate-floaty blur-[30px]',
    background:
      'radial-gradient(circle at 35% 35%, rgba(242,92,5,.26), rgba(201,52,0,.09) 58%, transparent 72%)',
  },
  amber: {
    className: 'animate-floaty-slow blur-[32px]',
    background: 'radial-gradient(circle at 50% 50%, rgba(255,154,61,.22), transparent 70%)',
  },
};

// Decorative floating orb; position and size it via className.
export const GradientBlob = ({ variant = 'ember', className }) => {
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
