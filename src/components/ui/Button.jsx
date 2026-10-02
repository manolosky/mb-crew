import Link from 'next/link';

import { cn } from '@/lib/cn';

// Square buttons with a subtle rule along the bottom edge, matching the cards.
const BASE_STYLES =
  'inline-flex items-center justify-center border-b-2 font-semibold transition duration-200 disabled:cursor-not-allowed';

const VARIANT_STYLES = {
  gradient:
    'bg-brand-gradient-soft text-ink-on-brand border-brand-end shadow-cta hover:-translate-y-px hover:brightness-[1.08]',
  glass:
    'border-white/35 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20 disabled:border-white/20 disabled:bg-white/5 disabled:text-white/55',
  white: 'text-brand-strong border-black/20 bg-white hover:brightness-[0.96]',
};

const SIZE_STYLES = {
  md: 'gap-2.5 px-7 py-[15px] text-base',
  sm: 'gap-2 px-[18px] py-[9px] text-[14.5px]',
};

// A file such as /cv/resume.pdf (optionally followed by a query or a hash).
const FILE_PATH = /\.[a-z0-9]+(?:[?#].*)?$/i;

// Client-side navigation (and its prefetch) only makes sense for pages of this
// site opened in the same tab. Files, new tabs and external or mailto: links
// get a plain anchor; prefetching a PDF as a route answers 404.
const isSitePage = (href, target) =>
  undefined === target && href.startsWith('/') && !FILE_PATH.test(href);

// Renders a link when `href` is given (a Next.js link for site pages), a
// native button otherwise.
export const Button = ({
  variant = 'gradient',
  size = 'md',
  href,
  className,
  children,
  ...props
}) => {
  const classes = cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className);

  if (undefined !== href) {
    const Anchor = isSitePage(href, props.target) ? Link : 'a';

    return (
      <Anchor href={href} className={classes} {...props}>
        {children}
      </Anchor>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};
