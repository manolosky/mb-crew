import { cn } from '@/lib/cn';

// Base surface for hobby, skill, experience and project cards: square, with
// an ember rule along the bottom edge.
export const Card = ({ hover = false, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'border-line shadow-card bg-surface border-b-brand-line border border-b-2',
        hover &&
          'hover:shadow-lift hover:border-brand-line hover:border-b-brand transition duration-200 hover:-translate-y-[3px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
