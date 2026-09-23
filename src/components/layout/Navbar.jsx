'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';

import { LogoMark } from '@/components/layout/LogoMark';
import { AnimationToggle } from '@/components/ui/AnimationToggle';
import { cn } from '@/lib/cn';
import { Icon } from '@/lib/icons';
import { portfolioHref } from '@/lib/routes';

const NAV_LINKS = [
  { label: 'About', href: portfolioHref('about') },
  { label: 'Stack', href: portfolioHref('stack') },
  { label: 'Experience', href: portfolioHref('experience') },
  { label: 'Projects', href: portfolioHref('projects') },
];

const CONTACT_HREF = portfolioHref('contact');

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'text-slate hover:text-ink hover:bg-line-strong rounded-[9px] px-3 py-2 text-[14.5px] font-medium transition',
                pathname === link.href && 'text-brand-start bg-line-strong',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={CONTACT_HREF}
            className="bg-brand-gradient-soft shadow-nav-cta text-ink-on-brand ml-1.5 inline-flex items-center gap-2 rounded-[10px] px-[18px] py-[9px] text-[14.5px] font-semibold transition hover:brightness-[1.06]"
          >
            <Icon name="fa-solid fa-paper-plane" className="text-xs" /> Contact
          </Link>
          <AnimationToggle />
        </div>

        {/* Mobile: animation toggle + hamburger */}
        <div className="nav:hidden flex items-center gap-2">
          <AnimationToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="border-line bg-surface flex cursor-pointer flex-col gap-[5px] rounded-[10px] border p-2.5"
          >
            <span className="bg-ink block h-0.5 w-5 rounded-sm" />
            <span className="bg-ink block h-0.5 w-5 rounded-sm" />
            <span className="bg-ink block h-0.5 w-5 rounded-sm" />
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
                'text-ink-soft border-line-soft border-b px-2 py-3 text-base font-semibold',
                pathname === link.href && 'text-brand-start border-l-brand-start border-l-2 pl-3',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={CONTACT_HREF}
            onClick={closeMenu}
            className="bg-brand-gradient-soft text-ink-on-brand mt-2 rounded-[11px] p-3 text-center text-base font-bold"
          >
            Contact
          </Link>
        </nav>
      ) : null}
    </>
  );
};
