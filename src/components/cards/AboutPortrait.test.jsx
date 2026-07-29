import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AboutPortrait } from './AboutPortrait';

describe('AboutPortrait', () => {
  it('renders the professional photo by default', () => {
    render(<AboutPortrait />);

    expect(screen.getByAltText('Portrait of Manuel Bolaños')).toBeInTheDocument();
  });

  it('falls back to the brand logo when the photo fails to load', () => {
    render(<AboutPortrait />);

    fireEvent.error(screen.getByAltText('Portrait of Manuel Bolaños'));

    expect(screen.queryByAltText('Portrait of Manuel Bolaños')).not.toBeInTheDocument();
    expect(screen.getByAltText('Manuel Bolaños hand-drawn MB logo')).toBeInTheDocument();
  });
});
