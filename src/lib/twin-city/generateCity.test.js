// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { generateCity } from './generateCity';

describe('generateCity', () => {
  it('is deterministic for a given seed', () => {
    expect(generateCity({ seed: 7 })).toEqual(generateCity({ seed: 7 }));
    expect(generateCity({ seed: 7 })).not.toEqual(generateCity({ seed: 8 }));
  });

  it('keeps every building inside the city bounds with a positive size', () => {
    const { buildings, bounds } = generateCity();

    expect(buildings.length).toBeGreaterThan(100);
    buildings.forEach(({ x, z, width, depth, height }) => {
      expect(Math.abs(x)).toBeLessThanOrEqual(bounds.half);
      expect(Math.abs(z)).toBeLessThanOrEqual(bounds.half);
      expect(width).toBeGreaterThan(0);
      expect(depth).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    });
  });

  it('mixes pitched and flat roofs, keeping pitched ones off the towers', () => {
    const { buildings } = generateCity();
    const types = new Set(buildings.map(({ roof }) => roof.type));

    expect(types).toEqual(new Set(['gable', 'hip', 'flat']));
    buildings.forEach(({ height, roof }) => {
      Object.values(roof.tone).forEach((offset) => expect(Math.abs(offset)).toBeLessThanOrEqual(1));

      if ('flat' !== roof.type) {
        expect(height).toBeLessThan(9);
        expect(roof.height).toBeGreaterThan(0);
      }
    });
  });

  it('puts the forest belt beyond the blocks and lays out the streets', () => {
    const { trees, streets, bounds } = generateCity({ blocks: 5 });

    trees.forEach(({ z }) => expect(z).toBeGreaterThan(bounds.half));
    expect(streets).toHaveLength(8);
  });
});
