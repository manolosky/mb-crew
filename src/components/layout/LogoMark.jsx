import Image from 'next/image';

import { cn } from '@/lib/cn';

// Decorative brand mark: it always sits next to visible text (brand link,
// copyright line), so it carries an empty alt.
export const LogoMark = ({ className }) => (
  <Image
    src="/images/logo-mb-light.png"
    alt=""
    width={109}
    height={160}
    className={cn('w-auto', className)}
  />
);
