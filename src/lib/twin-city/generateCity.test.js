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

  it('lays an organic patch of ground under every building and tree', () => {
    const { buildings, trees, ground } = generateCity();
    // Ray casting: a point is inside when a ray from it crosses the outline an odd number of times.
    const inside = (x, z) =>
      ground.outline.reduce((crossings, a, index) => {
        const b = ground.outline[(index + 1) % ground.outline.length];
        const crosses = a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x;

        return crosses ? !crossings : crossings;
      }, false);

    buildings.forEach(({ x, z, width, depth }) => {
      [-0.5, 0.5].forEach((sideX) => {
        [-0.5, 0.5].forEach((sideZ) => {
          expect(inside(x + sideX * width, z + sideZ * depth)).toBe(true);
        });
      });
    });
    trees.forEach(({ x, z, radius }) => {
      expect(inside(x - radius, z + radius)).toBe(true);
      expect(inside(x + radius, z + radius)).toBe(true);
    });

    const distances = ground.outline.map(({ x, z }) =>
      Math.hypot(x - ground.center.x, z - ground.center.z),
    );
    expect(Math.max(...distances) - Math.min(...distances)).toBeGreaterThan(8);
  });

  it('puts the forest belt beyond the blocks and lays out the streets', () => {
    const { trees, streets, bounds } = generateCity({ blocks: 5 });

    trees.forEach(({ z }) => expect(z).toBeGreaterThan(bounds.half));
    expect(streets).toHaveLength(8);
  });
});
