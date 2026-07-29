import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getIcon, Icon } from './icons';

describe('icons registry', () => {
  it('resolves every icon name used in the portfolio data', async () => {
    const portfolio = (await import('@/data/portfolio.json')).default;
    const names = new Set();

    portfolio.profile.roles.forEach((role) => names.add(role.icon));
    portfolio.profile.socials.forEach((social) => names.add(social.icon));
    portfolio.hobbies.forEach((hobby) => names.add(hobby.icon));
    portfolio.skills.forEach((skill) => names.add(skill.icon));

    names.forEach((name) => {
      expect(getIcon(name), `missing icon mapping for "${name}"`).not.toBeNull();
    });
  });

  it('renders nothing for unknown names', () => {
    const { container } = render(<Icon name="fa-solid fa-does-not-exist" />);

    expect(container).toBeEmptyDOMElement();
  });
});
