import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmberParticles } from './EmberParticles';

describe('EmberParticles', () => {
  it('renders a hidden decorative layer with all particles', () => {
    const { container } = render(<EmberParticles />);

    const layer = container.firstChild;
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer.querySelectorAll('span')).toHaveLength(44);
  });

  it('keeps the layer out of the interaction path', () => {
    const { container } = render(<EmberParticles />);

    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
