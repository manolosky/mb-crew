// Route map shared by the pages, the navigation and the sitemap.
export const PORTFOLIO_PATH = '/portfolio';

// Section id → human label; the ids double as element ids on the one-page.
export const SECTIONS = {
  about: 'About',
  stack: 'Tech Stack',
  experience: 'Experience',
  projects: 'Projects',
  contact: 'Contact',
};

export const SECTION_IDS = Object.keys(SECTIONS);

// Link to the classic portfolio, optionally landing on one of its sections.
export const portfolioHref = (section) =>
  undefined === section ? PORTFOLIO_PATH : `${PORTFOLIO_PATH}/${section}`;
