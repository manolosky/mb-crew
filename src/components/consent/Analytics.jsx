'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { loadGoogleTagManager, revokeAnalytics } from '@/lib/analytics';
import { onConsentChange, readConsent } from '@/lib/consent';

const getServerSnapshot = () => null;

// Loads Google Tag Manager only once the visitor accepts analytics cookies,
// and withdraws them when the visitor changes their mind.
export const Analytics = () => {
  const consent = useSyncExternalStore(onConsentChange, readConsent, getServerSnapshot);

  useEffect(() => {
    if ('granted' === consent) {
      loadGoogleTagManager();
    }

    if ('denied' === consent) {
      revokeAnalytics();
    }
  }, [consent]);

  return null;
};
