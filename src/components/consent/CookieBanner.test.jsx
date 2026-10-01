import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// The consent store keeps per-visit state, so every test loads fresh modules.
const loadBanner = async () => {
  vi.resetModules();
  const [{ CookieBanner }, { CookieSettingsButton }, consent] = await Promise.all([
    import('./CookieBanner'),
    import('./CookieSettingsButton'),
    import('@/lib/consent'),
  ]);

  return { CookieBanner, CookieSettingsButton, consent };
};

describe('CookieBanner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('asks first-time visitors, with reject and accept side by side', async () => {
    const { CookieBanner } = await loadBanner();
    render(<CookieBanner />);

    expect(screen.getByRole('region', { name: /cookies & analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy & cookies/i })).toHaveAttribute(
      'href',
      '/privacy#cookies',
    );
  });

  it('stores an acceptance and disappears', async () => {
    const { CookieBanner, consent } = await loadBanner();
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(screen.getByRole('button', { name: 'Accept' }));

    expect(consent.readConsent()).toBe('granted');
    expect(screen.queryByRole('region', { name: /cookies & analytics/i })).not.toBeInTheDocument();
  });

  it('stores a rejection and can be reopened from the cookie settings', async () => {
    const { CookieBanner, CookieSettingsButton, consent } = await loadBanner();
    const user = userEvent.setup();
    render(
      <>
        <CookieBanner />
        <CookieSettingsButton />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(consent.readConsent()).toBe('denied');
    expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cookie settings' }));
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
  });

  it('stays hidden once the visitor has decided', async () => {
    window.localStorage.setItem(
      'mb-analytics-consent',
      JSON.stringify({ choice: 'granted', version: 1, savedAt: Date.now() }),
    );
    const { CookieBanner, consent } = await loadBanner();
    render(<CookieBanner />);

    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();

    act(() => consent.requestConsentPrompt());
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
  });
});
