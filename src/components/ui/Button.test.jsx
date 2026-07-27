import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a native button when no href is given', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders a link when href is given', () => {
    render(<Button href="/contact">Get in touch</Button>);

    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
  });

  it('applies the requested variant styles', () => {
    render(<Button variant="glass">Download CV</Button>);

    expect(screen.getByRole('button', { name: 'Download CV' })).toHaveClass('backdrop-blur-sm');
  });
});
