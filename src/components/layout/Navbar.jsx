'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import { Icon } from '@/lib/icons';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Stack', href: '/stack' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
];

const LogoMark = ({ className }) => (
  <Image
    src="/images/logo-mb-light.png"
    alt="Manuel Bolaños hand-drawn MB logo"
    width={109}
    height={160}
    className={cn('w-auto', className)}
  />
);

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

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
                'text-slate hover:text-ink rounded-[9px] px-3 py-2 text-[14.5px] font-medium transition hover:bg-[#232019]',
                pathname === link.href && 'text-brand-start bg-[#232019]',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
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
          className="nav:hidden border-line bg-surface flex cursor-pointer flex-col gap-[5px] rounded-[10px] border p-2.5"
        >
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
          <span className="bg-ink block h-0.5 w-5 rounded-sm" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen ? (
        <div className="border-line-strong nav:hidden sticky top-[68px] z-40 flex flex-col gap-0.5 border-b bg-[rgba(11,10,9,.96)] px-[clamp(20px,5vw,48px)] pt-3 pb-[18px] backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'text-ink-soft border-line-soft border-b px-2 py-3 text-base font-semibold',
                pathname === link.href && 'text-brand-start',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
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
