import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>ESP32</Chip>);

    expect(screen.getByText('ESP32')).toBeInTheDocument();
  });

  it('adds hover styles only when interactive', () => {
    render(<Chip interactive>PHP</Chip>);
    render(<Chip>Laravel</Chip>);

    expect(screen.getByText('PHP')).toHaveClass('hover:bg-brand');
    expect(screen.getByText('Laravel')).not.toHaveClass('hover:bg-brand');
  });
});
