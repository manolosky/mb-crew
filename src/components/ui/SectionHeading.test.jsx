import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders kicker, title and description', () => {
    render(
      <SectionHeading kicker="01 — About" title="A hybrid engineer." description="Some intro." />,
    );

    expect(screen.getByText('01 — About')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'A hybrid engineer.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Some intro.')).toBeInTheDocument();
  });

  it('omits the description paragraph when not provided', () => {
    const { container } = render(<SectionHeading kicker="02 — Stack" title="Tools." />);

    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
