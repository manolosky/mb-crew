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

// Renders a Next.js link when `href` is given, a native button otherwise.
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
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
};
