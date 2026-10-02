'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { LuHouse } from 'react-icons/lu';

import { LogoMark } from '@/components/layout/LogoMark';
import { AnimationToggle } from '@/components/ui/AnimationToggle';
import { cn } from '@/lib/cn';
import { portfolioHref } from '@/lib/routes';

const NAV_LINKS = [
  { label: 'About', href: portfolioHref('about') },
  { label: 'Stack', href: portfolioHref('stack') },
  { label: 'Experience', href: portfolioHref('experience') },
  { label: 'Projects', href: portfolioHref('projects') },
  { label: 'Contact', href: portfolioHref('contact') },
];

const ICON_LINK_STYLES =
  'text-slate hover:text-ink flex h-10 w-10 items-center justify-center transition';

// Line-art house that takes visitors back to the two-lens homepage.
const HomeLink = ({ onClick }) => (
  <Link href="/" onClick={onClick} aria-label="Home" className={ICON_LINK_STYLES}>
    <LuHouse aria-hidden="true" className="text-[18px]" strokeWidth={1.5} />
  </Link>
);

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const closeMenuWithFocus = (event) => {
    if ('Escape' === event.key) {
      closeMenu();
      menuButtonRef.current?.focus();
    }
  };

  return (
    <>
      <nav
        aria-label="Main"
        className="border-line-strong sticky top-0 z-50 flex h-[68px] items-center justify-between gap-5 border-b bg-[rgba(11,10,9,.82)] px-[clamp(20px,5vw,48px)] backdrop-blur-xl"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="font-heading text-ink flex min-w-0 items-center gap-3 text-[clamp(17px,4.5vw,22px)] font-bold tracking-[-0.01em] whitespace-nowrap"
        >
          <LogoMark className="h-[55px]" />
          Manuel Bolaños
        </Link>

        {/* Desktop links */}
        <div className="nav:flex hidden items-center gap-1.5">
          <HomeLink />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'text-slate hover:text-ink hover:bg-line-strong px-3 py-2 text-[15px] font-light transition',
                pathname === link.href && 'text-brand-start bg-line-strong',
              )}
            >
              {link.label}
            </Link>
          ))}
          <AnimationToggle variant="bare" />
        </div>

        {/* Mobile: home, animation toggle and hamburger */}
        <div className="nav:hidden flex items-center gap-1">
          <HomeLink onClick={closeMenu} />
          <AnimationToggle variant="bare" />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(ICON_LINK_STYLES, 'cursor-pointer flex-col gap-[5px]')}
          >
            <span className="block h-[1.5px] w-5 bg-current" />
            <span className="block h-[1.5px] w-5 bg-current" />
            <span className="block h-[1.5px] w-5 bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          onKeyDown={closeMenuWithFocus}
          className="border-line-strong nav:hidden sticky top-[68px] z-40 flex flex-col gap-0.5 border-b bg-[rgba(11,10,9,.96)] px-[clamp(20px,5vw,48px)] pt-3 pb-[18px] backdrop-blur-xl"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'text-ink-soft border-line-soft border-b px-2 py-3 text-base font-light',
                pathname === link.href && 'text-brand-start border-l-brand-start border-l-2 pl-3',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </>
  );
};
