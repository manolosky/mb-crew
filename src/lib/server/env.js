import 'server-only';

// Vercel "Sensitive" env vars reach external CI builds as this literal value.
const SENSITIVE_PLACEHOLDER = '[SENSITIVE]';

// Reads a server-side env var, treating empty values and the Sensitive
// placeholder as unset so callers can fall back safely.
export const readEnv = (name) => {
  const value = process.env[name]?.trim();

  if (undefined === value || '' === value || SENSITIVE_PLACEHOLDER === value) {
    return undefined;
  }

  return value;
};
