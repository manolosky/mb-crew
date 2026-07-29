const isDev = 'development' === process.env.NODE_ENV;

// Content Security Policy: first-party everything, with the Google tag stack
// (Tag Manager + Analytics 4) as the only allowed third party. When new GTM
// tags load other vendors, add their origins explicitly here.
const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://*.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  'frame-src https://www.googletagmanager.com',
  "worker-src 'self'",
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
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
        },
      ],
    },
  ],
};

export default nextConfig;
