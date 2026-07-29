import { cn } from '@/lib/cn';

// Base surface for hobby, skill, experience and project cards.
export const Card = ({ hover = false, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'border-line shadow-card bg-surface rounded-2xl border',
        hover &&
          'hover:shadow-lift hover:border-brand-line transition duration-200 hover:-translate-y-[3px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
