import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// App Router hooks need a router context that jsdom tests don't provide.
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

// next/font requires the Next.js compiler; return plain class names in tests.
vi.mock('next/font/google', () => {
  return new Proxy(
    {},
    {
      get:
        () =>
        ({ variable } = {}) => ({
          className: 'mocked-font',
          variable: variable ?? 'mocked-font-variable',
          style: { fontFamily: 'mocked-font' },
        }),
    },
  );
});
