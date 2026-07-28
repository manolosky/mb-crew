import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Reveal } from './Reveal';

describe('Reveal', () => {
  it('shows content immediately when IntersectionObserver is unavailable', async () => {
    render(
      <Reveal>
        <p>Revealed content</p>
      </Reveal>,
    );

    const wrapper = screen.getByText('Revealed content').parentElement;
    await waitFor(() => expect(wrapper.style.opacity).toBe('1'));
  });

  it('renders children for every direction', () => {
    ['up', 'down', 'left', 'right', 'fade'].forEach((direction) => {
      const { unmount } = render(
        <Reveal direction={direction}>
          <p>{`content-${direction}`}</p>
        </Reveal>,
      );
      expect(screen.getByText(`content-${direction}`)).toBeInTheDocument();
      unmount();
    });
  });
});
