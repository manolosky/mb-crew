import { cn } from '@/lib/cn';

const SIZE_STYLES = {
  md: 'h-10 w-10 rounded-[11px] text-base',
  sm: 'h-[34px] w-[34px] rounded-[10px] text-sm',
};

// Gradient square holding a single icon.
export const IconTile = ({ size = 'md', className, children }) => {
  return (
    <span
      className={cn(
        'bg-brand-gradient inline-flex flex-none items-center justify-center text-white',
        SIZE_STYLES[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
