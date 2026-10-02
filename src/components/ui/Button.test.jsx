import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

// Tag Next.js links so they can be told apart from plain anchors.
vi.mock('next/link', () => ({
  default: ({ children, ...props }) => (
    <a data-next-link="" {...props}>
      {children}
    </a>
  ),
}));

describe('Button', () => {
  it('renders a native button when no href is given', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders a Next.js link for pages of the site', () => {
    render(<Button href="/contact">Get in touch</Button>);

    const link = screen.getByRole('link', { name: 'Get in touch' });
    expect(link).toHaveAttribute('href', '/contact');
    expect(link).toHaveAttribute('data-next-link');
  });

  it('renders a plain anchor for files, new tabs and external links', () => {
    render(
      <>
        <Button href="/cv/manuel-bolanos-cv.pdf">CV</Button>
        <Button href="/portfolio" target="_blank">
          New tab
        </Button>
        <Button href="https://github.com/manolosky">GitHub</Button>
        <Button href="mailto:hello@example.com">Email</Button>
      </>,
    );

    ['CV', 'New tab', 'GitHub', 'Email'].forEach((name) => {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('data-next-link');
    });
  });

  it('applies the requested variant styles', () => {
    render(<Button variant="glass">Download CV</Button>);

    expect(screen.getByRole('button', { name: 'Download CV' })).toHaveClass('backdrop-blur-sm');
  });
});
