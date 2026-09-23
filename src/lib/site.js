const DEFAULT_SITE_URL = 'https://manuelbolanos.dev';

// Public origin of the site, used for metadataBase, the sitemap and robots.
// Vercel "Sensitive" env vars reach external CI builds as the literal string
// "[SENSITIVE]", so anything that is not an absolute http(s) URL falls back to
// the production domain instead of breaking the build.
export const getSiteUrl = () => {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);

    if ('https:' === url.protocol || 'http:' === url.protocol) {
      return url.origin;
    }
  } catch {
    // Missing or malformed value: use the default below.
  }

  return DEFAULT_SITE_URL;
};
