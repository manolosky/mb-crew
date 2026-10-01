import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import portfolio from '@/data/portfolio.json';

import PrivacyPage, { metadata } from './page';

describe('privacy page', () => {
  it('explains who is responsible and how to reach them', () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /privacy & cookies/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: portfolio.profile.email })[0]).toHaveAttribute(
      'href',
      `mailto:${portfolio.profile.email}`,
    );
  });

  it('lists every cookie and local storage entry the site uses', () => {
    render(<PrivacyPage />);

    const table = screen.getByRole('table', { name: /cookies and local storage/i });
    ['_ga, _ga_*', /mb-analytics-consent/, /mb-animations-paused/].forEach((name) => {
      expect(within(table).getByRole('rowheader', { name })).toBeInTheDocument();
    });
  });

  it('names every provider that processes data', () => {
    render(<PrivacyPage />);

    ['Vercel Inc.', 'Upstash, Inc.', 'ActiveCampaign, LLC', /Google Ireland/].forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('lets visitors reopen the cookie settings', () => {
    render(<PrivacyPage />);

    expect(screen.getAllByRole('button', { name: 'Cookie settings' }).length).toBeGreaterThan(0);
  });

  it('is its own canonical URL', () => {
    expect(metadata.alternates.canonical).toBe('/privacy');
  });
});
