import { cn } from '@/lib/cn';

// Hero metric: gradient number over a muted label.
export const Stat = ({ value, label, className }) => {
  return (
    <div className={className}>
      <div
        className={cn(
          'text-gradient-brand font-heading text-[clamp(30px,4vw,46px)] leading-none font-bold',
        )}
      >
        {value}
      </div>
      <div className="mt-2 max-w-[16ch] text-sm text-white/60">{label}</div>
    </div>
  );
};
