import { cn } from '@/lib/cn';

// Base surface for hobby, skill, experience and project cards.
export const Card = ({ hover = false, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'border-line shadow-card rounded-2xl border bg-white',
        hover &&
          'hover:shadow-lift transition duration-200 hover:-translate-y-[3px] hover:border-[#c9c2ff]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
