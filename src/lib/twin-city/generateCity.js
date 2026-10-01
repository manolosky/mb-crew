import { createRandom } from '@/lib/random';

// Layout of the "Twin City": a grid of blocks crossed by streets, with a
// forest belt along the river side. Pure and seeded, so the scene is stable
// between visits and easy to test.
const DEFAULTS = {
  seed: 20260923,
  blocks: 9, // blocks per side
  blockSize: 6,
  streetWidth: 2.4,
  forestDepth: 12,
};

export const generateCity = (options = {}) => {
  const { seed, blocks, blockSize, streetWidth, forestDepth } = { ...DEFAULTS, ...options };
  const random = createRandom(seed);
  const pitch = blockSize + streetWidth;
  const half = (blocks * pitch - streetWidth) / 2;
  const buildings = [];
  const trees = [];
  const streets = [];

  for (let row = 0; row < blocks; row += 1) {
    for (let col = 0; col < blocks; col += 1) {
      const originX = -half + col * pitch;
      const originZ = -half + row * pitch;
      const distance = Math.hypot(originX + blockSize / 2, originZ + blockSize / 2) / half;
      // Taller towers downtown, low-rise towards the edges.
      const maxHeight = 3 + (1 - Math.min(distance, 1)) * 16;
      const lots = random.chance(0.35) ? 1 : 2;
      const lotSize = blockSize / lots;

      for (let lotX = 0; lotX < lots; lotX += 1) {
        for (let lotZ = 0; lotZ < lots; lotZ += 1) {
          const width = lotSize * random.range(0.6, 0.85);
          const depth = lotSize * random.range(0.6, 0.85);

          buildings.push({
            x: originX + lotX * lotSize + lotSize / 2,
            z: originZ + lotZ * lotSize + lotSize / 2,
            width,
            depth,
            height: random.range(1.5, maxHeight),
          });
        }
      }
    }
  }

  // Streets: one lane per gap between block rows/columns, used by data flows.
  for (let index = 1; index < blocks; index += 1) {
    const offset = -half + index * pitch - streetWidth / 2;
    streets.push({ axis: 'x', offset, from: -half, to: half });
    streets.push({ axis: 'z', offset, from: -half, to: half });
  }

  // Forest belt beyond the last row of blocks.
  const forestStart = half + streetWidth * 1.5;
  const treeCount = Math.round(blocks * 22);

  for (let index = 0; index < treeCount; index += 1) {
    const height = random.range(1.6, 4.2);

    trees.push({
      x: random.range(-half, half),
      z: forestStart + random.range(0, forestDepth),
      height,
      radius: height * random.range(0.28, 0.4),
    });
  }

  return { buildings, trees, streets, bounds: { half, forestEnd: forestStart + forestDepth } };
};
