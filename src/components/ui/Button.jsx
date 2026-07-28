import Link from 'next/link';

import { cn } from '@/lib/cn';

const BASE_STYLES = 'inline-flex items-center justify-center font-semibold transition duration-200';

const VARIANT_STYLES = {
  gradient: 'bg-brand-gradient text-white shadow-cta hover:-translate-y-px hover:brightness-[1.08]',
  glass:
    'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20',
  white: 'bg-white text-[#c2440a] hover:brightness-[0.96]',
};

const SIZE_STYLES = {
  md: 'gap-2.5 rounded-xl px-7 py-[15px] text-base',
  sm: 'gap-2 rounded-[10px] px-[18px] py-[9px] text-[14.5px]',
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
