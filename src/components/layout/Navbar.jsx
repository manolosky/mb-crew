'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Icon } from '@/lib/icons';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
];

const LogoMark = ({ className }) => (
  <span
    className={`bg-brand-gradient font-heading inline-flex items-center justify-center rounded-[9px] font-bold text-white ${className}`}
  >
    MB
  </span>
);

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="border-line-strong sticky top-0 z-50 flex h-[68px] items-center justify-between gap-5 border-b bg-[rgba(236,238,245,.78)] px-[clamp(20px,5vw,48px)] backdrop-blur-xl">
        <Link
          href="#top"
          onClick={closeMenu}
          className="font-heading text-ink flex min-w-0 items-center gap-2.5 text-[clamp(15px,4vw,18px)] font-bold tracking-[-0.01em] whitespace-nowrap"
        >
          <LogoMark className="h-[30px] w-[30px] text-sm" />
          Manuel Bolaños
        </Link>

        {/* Desktop links */}
        <div className="nav:flex hidden items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate hover:text-ink rounded-[9px] px-3 py-2 text-[14.5px] font-medium transition hover:bg-[#e3e6f2]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="bg-brand-gradient-soft shadow-nav-cta ml-1.5 inline-flex items-center gap-2 rounded-[10px] px-[18px] py-[9px] text-[14.5px] font-semibold text-white transition hover:brightness-[1.06]"
          >
            <Icon name="fa-solid fa-paper-plane" className="text-xs" /> Contact
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="nav:hidden border-line flex cursor-pointer flex-col gap-[5px] rounded-[10px] border bg-white p-2.5"
        >
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen ? (
        <div className="border-line-strong nav:hidden sticky top-[68px] z-40 flex flex-col gap-0.5 border-b bg-[rgba(236,238,245,.96)] px-[clamp(20px,5vw,48px)] pt-3 pb-[18px] backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-ink-soft border-line-soft border-b px-2 py-3 text-base font-semibold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={closeMenu}
            className="bg-brand-gradient-soft mt-2 rounded-[11px] p-3 text-center text-base font-bold text-white"
          >
            Contact
          </Link>
        </div>
      ) : null}
    </>
  );
};

export { LogoMark };
