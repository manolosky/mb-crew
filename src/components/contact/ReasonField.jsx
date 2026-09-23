import { ERROR_STYLES, LABEL_STYLES } from '@/components/contact/fieldStyles';
import { CONTACT_REASONS } from '@/lib/contact/constants';

export const reasonInputId = (idPrefix, value) => `${idPrefix}-${value}`;

// "What's this about?" radio group rendered as selectable chips. The error is
// tied to the whole group through the fieldset (radios don't take aria-invalid).
export const ReasonField = ({ idPrefix, defaultValue, error, errorId }) => {
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className={LABEL_STYLES}>What&apos;s this about?</legend>
      <div className="flex flex-wrap gap-2">
        {CONTACT_REASONS.map(({ value, label }) => (
          <label
            key={value}
            htmlFor={reasonInputId(idPrefix, value)}
            className="has-checked:border-brand-start has-checked:bg-brand-start/25 has-focus-visible:outline-brand-start cursor-pointer rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[14px] text-white transition hover:bg-white/15 has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
          >
            <input
              id={reasonInputId(idPrefix, value)}
              type="radio"
              name="reason"
              value={value}
              defaultChecked={value === defaultValue}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className={ERROR_STYLES}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
};
