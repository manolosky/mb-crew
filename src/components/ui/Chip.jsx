import { cn } from '@/lib/cn';

const SIZE_STYLES = {
  md: 'rounded-lg px-[11px] py-1.5 text-[12.5px]',
  sm: 'rounded-[7px] px-[9px] py-[5px] text-[11.5px]',
};

// Small mono label for skills and tech stacks.
export const Chip = ({ size = 'md', interactive = false, className, children }) => {
  return (
    <span
      className={cn(
        'border-line bg-tint text-slate inline-block border font-mono',
        SIZE_STYLES[size],
        interactive && 'hover:border-brand hover:bg-brand transition duration-200 hover:text-white',
        className,
      )}
    >
      {children}
    </span>
  );
};
