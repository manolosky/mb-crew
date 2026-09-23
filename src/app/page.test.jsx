import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import portfolio from '@/data/portfolio.json';

import Home, { metadata } from './page';

describe('home route (interim)', () => {
  it('keeps serving the classic one-page', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: portfolio.profile.name }),
    ).toBeInTheDocument();
  });

  it('stays the canonical URL of the one-page', () => {
    expect(metadata.alternates.canonical).toBe('/');
  });
});
