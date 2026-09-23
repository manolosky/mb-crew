// Shared by the contact form (client) and its Server Action.
export const CONTACT_REASONS = [
  { value: 'job', label: 'Job opportunity' },
  { value: 'freelance', label: 'Freelance project' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'hello', label: 'Just saying hi' },
];

export const CONTACT_SOURCES = ['portfolio', 'agent'];

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 2000 },
};

// Submissions faster than this are almost certainly automated.
export const MIN_FILL_TIME_MS = 3000;

// Bump when the privacy notice changes, so every lead records the version it
// was sent under.
export const PRIVACY_NOTICE_VERSION = '2026-09-23';
