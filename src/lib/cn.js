// Minimal class-name joiner; skips falsy values.
export const cn = (...classes) => classes.filter(Boolean).join(' ');
