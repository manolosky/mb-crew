import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

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
