import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import portfolio from '@/data/portfolio.json';

import Home, { metadata } from './page';

// The 3D engine needs WebGL, which jsdom doesn't have.
vi.mock('@/lib/twin-city/createTwinCity', () => ({
  createTwinCity: () => {
    throw new Error('WebGL unavailable');
  },
}));

describe('home route', () => {
  it('introduces the site owner in the main heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(portfolio.profile.name);
  });

  it('offers both lenses, with the agent marked as coming soon', () => {
    render(<Home />);

    const twin = screen.getByRole('region', { name: /talk to it/i });
    expect(within(twin).getByText(/talk to mb-01/i)).toBeInTheDocument();
    expect(within(twin).getByText('(soon)')).toBeInTheDocument();
    expect(within(twin).queryByRole('link')).not.toBeInTheDocument();

    const classic = screen.getByRole('region', { name: /prefer the classic way/i });
    expect(within(classic).getByRole('link', { name: /explore the portfolio/i })).toHaveAttribute(
      'href',
      '/portfolio',
    );
  });

  it('keeps the pause control and the legal links on the page', () => {
    render(<Home />);

    expect(screen.getByRole('button', { name: /decorative animations/i })).toBeInTheDocument();
    const legal = screen.getByRole('navigation', { name: 'Legal' });
    expect(within(legal).getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(within(legal).getByRole('button', { name: 'Cookie settings' })).toBeInTheDocument();
  });

  it('describes the author with structured data and is its own canonical URL', () => {
    const { container } = render(<Home />);
    const jsonLd = JSON.parse(
      container.querySelector('script[type="application/ld+json"]').textContent,
    );

    expect(jsonLd).toMatchObject({ '@type': 'Person', name: portfolio.profile.name });
    expect(jsonLd.sameAs.every((url) => url.startsWith('https://'))).toBe(true);
    expect(metadata.alternates.canonical).toBe('/');
  });
});
