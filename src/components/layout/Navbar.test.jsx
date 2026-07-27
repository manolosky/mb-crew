import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the brand and section links', () => {
    render(<Navbar />);

    expect(screen.getByRole('link', { name: /manuel bolaños/i })).toBeInTheDocument();
    ['About', 'Stack', 'Experience', 'Projects'].forEach((label) => {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    });
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
