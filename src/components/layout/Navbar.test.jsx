import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  afterEach(() => {
    vi.mocked(usePathname).mockReturnValue('/');
  });

  it('renders the brand and section links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /manuel bolaños/i })).toBeInTheDocument();
    ['About', 'Stack', 'Experience', 'Projects'].forEach((label) => {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    });
  });

  it('points section links at the portfolio routes', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/portfolio/about');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/portfolio/contact',
    );
  });

  it('marks the link of the current section', () => {
    vi.mocked(usePathname).mockReturnValue('/portfolio/experience');
    render(<Navbar />);

    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current');
  });

  it('toggles the mobile menu and closes it on link click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Menu adds a second set of section links.
    expect(screen.getAllByRole('link', { name: 'About' })).toHaveLength(2);

    await user.click(screen.getAllByRole('link', { name: 'About' })[1]);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
