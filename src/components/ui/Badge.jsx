import { cn } from '@/lib/cn';

const VARIANT_STYLES = {
  // Role chips on the dark hero: heading font, frosted glass pill.
  glass:
    'gap-[9px] border-white/25 bg-white/10 px-4 py-[9px] font-heading text-[clamp(14px,1.6vw,16px)] font-semibold text-white',
  // Status pill ("Open to…"): mono font, smaller.
  status: 'gap-2 border-white/20 bg-white/10 px-3.5 py-[7px] font-mono text-[12.5px] text-white/80',
};

export const Badge = ({ variant = 'glass', className, children }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-sm',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
