'use client';

import { requestConsentPrompt } from '@/lib/consent';

// Reopens the cookie banner so visitors can change or withdraw their choice.
export const CookieSettingsButton = ({ className }) => {
  return (
    <button type="button" onClick={requestConsentPrompt} className={className}>
      Cookie settings
    </button>
  );
};
