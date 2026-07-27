import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import portfolio from '@/data/portfolio.json';

import Home from './page';

describe('Home one-page', () => {
  it('renders the hero with the profile name', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { level: 1, name: portfolio.profile.name }),
    ).toBeInTheDocument();
  });

  it('renders every section anchor', () => {
    const { container } = render(<Home />);

    ['top', 'about', 'stack', 'experience', 'projects', 'contact'].forEach((id) => {
      expect(container.querySelector(`#${id}`), `missing #${id}`).toBeInTheDocument();
    });
  });

  it('renders all experience entries and project cards', () => {
    render(<Home />);

    portfolio.experience.forEach((job) => {
      expect(screen.getAllByText(job.role).length).toBeGreaterThan(0);
    });
    portfolio.projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it('links contact methods to email and phone', () => {
    render(<Home />);

    const contact = within(document.querySelector('#contact'));
    const links = contact.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain(`mailto:${portfolio.profile.email}`);
    expect(hrefs).toContain(`tel:${portfolio.profile.phone}`);
  });
});
