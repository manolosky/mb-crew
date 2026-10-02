// Small seeded PRNG (mulberry32): the same seed always yields the same
// sequence, so procedural layouts render identically on every visit.
export const createRandom = (seed) => {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const range = (min, max) => min + next() * (max - min);

  return { next, range, chance: (probability) => next() < probability };
};
