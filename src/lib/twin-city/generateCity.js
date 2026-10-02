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

// Buildings below this height get a pitched roof most of the time.
const PITCHED_MAX_HEIGHT = 9;

// Grass patch under the city and the forest.
const GROUND_SAMPLES = 120;
const GROUND_MARGIN = 3; // minimum clearance around the outermost lots and trees
const GROUND_ROUNDNESS = 4; // superellipse exponent: 2 is an ellipse, higher is boxier
const GROUND_WOBBLE = 0.32; // how far the organic edge bulges out, relative to the radius

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

  // Roofs: pitched (gable or hip) on low and mid-rise buildings, flat with a
  // small rooftop unit on towers. Each one gets a slight tone shift (hue,
  // saturation and lightness offsets in [-1, 1]) so they don't look stamped
  // out. A separate seeded sequence keeps the city layout above unchanged.
  const roofRandom = createRandom(seed + 1);

  buildings.forEach((building) => {
    const tone = {
      hue: roofRandom.range(-1, 1),
      saturation: roofRandom.range(-1, 1),
      lightness: roofRandom.range(-1, 1),
    };

    if (building.height < PITCHED_MAX_HEIGHT && roofRandom.chance(0.8)) {
      building.roof = {
        type: roofRandom.chance(0.55) ? 'gable' : 'hip',
        height: Math.min(
          Math.min(building.width, building.depth) * roofRandom.range(0.3, 0.55),
          building.height * 0.6,
        ),
        tone,
      };
      return;
    }

    building.roof = {
      type: 'flat',
      tone,
      unit: roofRandom.chance(0.7)
        ? {
            width: building.width * roofRandom.range(0.2, 0.4),
            depth: building.depth * roofRandom.range(0.2, 0.4),
            height: roofRandom.range(0.4, 1.1),
            offsetX: building.width * roofRandom.range(-0.2, 0.2),
            offsetZ: building.depth * roofRandom.range(-0.2, 0.2),
          }
        : null,
    };
  });

  // Ground: a superellipse through the corners of the area to cover (blocks
  // plus forest), pushed outwards by a few waves so the edge looks organic
  // instead of square. The waves only add, so nothing is left off.
  const groundRandom = createRandom(seed + 2);
  const forestEnd = forestStart + forestDepth;
  const center = { x: 0, z: (forestEnd - half) / 2 };
  const halfX = half + GROUND_MARGIN;
  const halfZ = (forestEnd + half) / 2 + GROUND_MARGIN;
  const corner = 2 ** (1 / GROUND_ROUNDNESS);
  const waves = [3, 4, 6, 9, 13].map((frequency) => ({
    frequency,
    phase: groundRandom.range(0, Math.PI * 2),
    weight: groundRandom.range(0.5, 1) / frequency ** 0.7,
  }));
  const angles = Array.from(
    { length: GROUND_SAMPLES },
    (_, index) => (index / GROUND_SAMPLES) * Math.PI * 2,
  );
  const bulges = angles.map((angle) =>
    waves.reduce(
      (sum, { frequency, phase, weight }) => sum + weight * Math.sin(frequency * angle + phase),
      0,
    ),
  );
  const lowest = Math.min(...bulges);
  const spread = Math.max(...bulges) - lowest;

  const outline = angles.map((angle, index) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const reach =
      (Math.abs(cos) / (halfX * corner)) ** GROUND_ROUNDNESS +
      (Math.abs(sin) / (halfZ * corner)) ** GROUND_ROUNDNESS;
    // From 0 in the deepest bay to 1 at the furthest bulge.
    const wobble = (bulges[index] - lowest) / spread;
    const radius = reach ** (-1 / GROUND_ROUNDNESS) * (1 + GROUND_WOBBLE * wobble);

    return { x: center.x + cos * radius, z: center.z + sin * radius };
  });

  return {
    buildings,
    trees,
    streets,
    ground: { center, outline },
    bounds: { half, forestEnd },
  };
};
