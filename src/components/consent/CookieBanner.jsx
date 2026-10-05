'use client';

import Link from 'next/link';
import { useId, useLayoutEffect, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/Button';
import {
  isConsentPromptOpen,
  onConsentChange,
  saveConsent,
  syncConsentPromptAttribute,
} from '@/lib/consent';

// The server always renders the banner: the stored decision only exists in the
// browser, where the inline script in the root layout decides (before the
// first paint) whether CSS shows it.
const getServerSnapshot = () => true;

// Analytics cookie banner: a full-width bar along the bottom edge, so it never
// sits on top of the page's own cards. "Reject" and "Accept" carry the same
// weight, and nothing is loaded until the visitor accepts (AEPD cookie guidance).
export const CookieBanner = () => {
  const open = useSyncExternalStore(onConsentChange, isConsentPromptOpen, getServerSnapshot);
  const titleId = useId();

  // Keep <html data-consent-prompt> in step with the store, before paint. It
  // reads the store itself, so hydration (which still sees the server value)
  // never shows the banner to someone who has already decided.
  useLayoutEffect(() => {
    syncConsentPromptAttribute();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <section
      data-cookie-banner=""
      aria-labelledby={titleId}
      className="border-line bg-surface/95 shadow-lift-lg fixed inset-x-0 bottom-0 z-[60] border-t backdrop-blur-xl"
    >
      <div className="nav:flex-row nav:items-center nav:gap-10 mx-auto flex max-w-[1240px] flex-col gap-4 px-[clamp(16px,4vw,56px)] py-4">
        <div className="nav:flex-1">
          <p id={titleId} className="font-heading text-ink text-base font-bold">
            Cookies &amp; analytics
          </p>
          <p className="text-body-soft mt-1 text-[14px] leading-[1.55]">
            I&apos;d like to use Google Analytics cookies to see how visitors use this site. They
            are only set if you accept.{' '}
            <Link
              href="/privacy#cookies"
              className="text-brand-start font-semibold underline underline-offset-2"
            >
              Privacy &amp; cookies
            </Link>
          </p>
        </div>
        <div className="nav:w-[280px] grid shrink-0 grid-cols-2 gap-2.5">
          <Button variant="glass" size="sm" onClick={() => saveConsent('denied')}>
            Reject
          </Button>
          <Button variant="glass" size="sm" onClick={() => saveConsent('granted')}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
};
