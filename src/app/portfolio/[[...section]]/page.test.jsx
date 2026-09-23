import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import portfolio from '@/data/portfolio.json';
import { SECTIONS } from '@/lib/routes';

import Page, { generateMetadata, generateStaticParams } from './page';

const renderPage = async (section) => {
  render(await Page({ params: Promise.resolve({ section }) }));
};

describe('portfolio route', () => {
  beforeEach(() => {
    // jsdom does not implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders the one-page at the bare /portfolio path', async () => {
    await renderPage(undefined);

    expect(
      screen.getByRole('heading', { level: 1, name: portfolio.profile.name }),
    ).toBeInTheDocument();
  });

  it('renders every section anchor', async () => {
    await renderPage(undefined);

    ['top', ...Object.keys(SECTIONS)].forEach((id) => {
      expect(document.querySelector(`#${id}`), `missing #${id}`).toBeInTheDocument();
    });
  });

  it('prerenders the bare path plus one path per section', () => {
    const params = generateStaticParams();

    expect(params).toContainEqual({ section: [] });
    Object.keys(SECTIONS).forEach((section) => {
      expect(params).toContainEqual({ section: [section] });
    });
    expect(params).toHaveLength(Object.keys(SECTIONS).length + 1);
  });

  it('builds a per-section title and canonical URL', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ section: ['about'] }) });

    expect(metadata.title).toBe('About — Manuel Bolaños');
    expect(metadata.alternates.canonical).toBe('/portfolio/about');
  });

  it('keeps the bare path out of the index while `/` mirrors it', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ section: undefined }) });

    expect(metadata.alternates.canonical).toBe('/');
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('scrolls to the requested section', async () => {
    await renderPage(['experience']);

    expect(document.querySelector('#experience').scrollIntoView).toHaveBeenCalled();
  });

  it('points the contact calls to action at the portfolio contact section', async () => {
    await renderPage(undefined);

    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      '/portfolio/contact',
    );
    expect(screen.getByRole('link', { name: /ask me about them/i })).toHaveAttribute(
      'href',
      '/portfolio/contact',
    );
  });

  it('summarizes confidential client work instead of listing client sites', async () => {
    await renderPage(undefined);

    expect(screen.getByText(/Under NDA/i)).toBeInTheDocument();
    expect(
      screen.getByText(/10\+ production websites built for Content Pilot/i),
    ).toBeInTheDocument();
  });
});
