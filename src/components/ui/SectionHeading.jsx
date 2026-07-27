import { cn } from '@/lib/cn';

const TONE_STYLES = {
  light: { kicker: 'text-brand', title: 'text-ink', description: 'text-body-soft' },
  dark: { kicker: 'text-white/75', title: 'text-white', description: 'text-white/85' },
};

// Section opener: "01 — About" kicker, big heading, optional description.
export const SectionHeading = ({ kicker, title, description, tone = 'light', className }) => {
  const styles = TONE_STYLES[tone];

  return (
    <div className={className}>
      <div className={cn('mb-3 font-mono text-[13px] tracking-[0.12em] uppercase', styles.kicker)}>
        {kicker}
      </div>
      <h2
        className={cn(
          'font-heading text-[clamp(28px,4.5vw,48px)] font-bold tracking-[-0.02em]',
          styles.title,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-2.5 max-w-[52ch] text-[clamp(16px,1.8vw,18px)] leading-[1.55]',
            styles.description,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};
