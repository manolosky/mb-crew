// Work-in-progress routes stay hidden in production unless explicitly enabled
// with FEATURE_LAB=1 (e.g. on Vercel previews). A plain value, read at build time.
export const isLabEnabled = () =>
  'development' === process.env.NODE_ENV || '1' === process.env.FEATURE_LAB;
