import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import LabPage, { metadata } from './page';

// The 3D engine needs WebGL, which jsdom doesn't have.
vi.mock('@/lib/twin-city/createTwinCity', () => ({
  createTwinCity: () => {
    throw new Error('WebGL unavailable');
  },
}));

describe('lab page', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is hidden unless the lab flag is on', () => {
    vi.stubEnv('FEATURE_LAB', undefined);

    expect(() => LabPage()).toThrow('NEXT_NOT_FOUND');
  });

  it('renders both lenses and stays out of search engines', async () => {
    vi.stubEnv('FEATURE_LAB', '1');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<LabPage />);

    expect(screen.getByRole('heading', { name: /talk to it/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore the portfolio/i })).toHaveAttribute(
      'href',
      '/portfolio',
    );
    expect(await screen.findByText('WebGL unavailable')).toBeInTheDocument();
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
