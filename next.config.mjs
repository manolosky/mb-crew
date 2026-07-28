const isDev = 'development' === process.env.NODE_ENV;

// Content Security Policy: first-party everything, with Google Tag Manager as
// the only allowed third party for now. When GTM tags grow (e.g. GA4), add the
// new origins explicitly (script-src / connect-src / img-src).
const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://www.googletagmanager.com",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://www.googletagmanager.com",
  'frame-src https://www.googletagmanager.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide the floating Next.js dev-tools badge shown during `next dev`.
  devIndicators: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: cspHeader },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

export default nextConfig;
