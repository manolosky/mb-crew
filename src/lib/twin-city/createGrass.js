import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';

import { createRandom } from '@/lib/random';

const TEXTURE_SIZE = 256;
const BLADES = 2600;
const TILE = 5; // world units covered by one repeat of the texture
const RINGS = 10; // concentric rings inside the outline, for the colour patches
const FEATHER = 7; // width of the soft outer edge, in world units
const EDGE_SHADE = 0.08; // grass brightness at the very edge (blends into the ground)
const HEIGHT = 0.02; // just above the ground plane

// Seamless canvas of short grass blades in a few close greens. Blades that
// cross an edge are drawn again on the opposite side so the tiles join.
const createGrassTexture = (seed) => {
  const random = createRandom(seed);
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;

  const context = canvas.getContext('2d');
  context.fillStyle = '#4c8239';
  context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  context.lineCap = 'round';

  for (let blade = 0; blade < BLADES; blade += 1) {
    const x = random.next() * TEXTURE_SIZE;
    const y = random.next() * TEXTURE_SIZE;
    const tipX = random.range(-2, 2);
    const tipY = -random.range(3, 7);

    context.strokeStyle = `hsl(${random.range(88, 122)} ${random.range(34, 56)}% ${random.range(27, 46)}%)`;
    context.lineWidth = random.range(0.8, 1.6);

    [-TEXTURE_SIZE, 0, TEXTURE_SIZE].forEach((offsetX) => {
      [-TEXTURE_SIZE, 0, TEXTURE_SIZE].forEach((offsetY) => {
        context.beginPath();
        context.moveTo(x + offsetX, y + offsetY);
        context.lineTo(x + offsetX + tipX, y + offsetY + tipY);
        context.stroke();
      });
    });
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
};

// Large, soft light and dark patches so the lawn doesn't look tiled.
const createPatches = (random) => {
  const waves = Array.from({ length: 3 }, () => ({
    angle: random.range(0, Math.PI),
    frequency: random.range(0.05, 0.11),
    phase: random.range(0, Math.PI * 2),
  }));

  return (x, z) =>
    1 +
    0.12 *
      waves.reduce(
        (sum, { angle, frequency, phase }) =>
          sum + Math.sin((x * Math.cos(angle) + z * Math.sin(angle)) * frequency + phase),
        0,
      );
};

// Lawn under the Twin City, following the organic outline from generateCity:
// rings of vertices from the centre to the outline, plus a feathered band
// that fades into the dark ground.
export const createGrass = ({ center, outline }, { anisotropy = 1, seed = 23 } = {}) => {
  const random = createRandom(seed);
  const patches = createPatches(random);
  const samples = outline.length;
  const positions = [center.x, HEIGHT, center.z];
  const colors = [];

  const pushColor = (x, z, fade) => {
    const shade = patches(x, z) * fade;
    colors.push(shade, shade, shade);
  };

  pushColor(center.x, center.z, 1);

  for (let ring = 1; ring <= RINGS + 1; ring += 1) {
    const feather = ring > RINGS;

    outline.forEach((point) => {
      const dx = point.x - center.x;
      const dz = point.z - center.z;
      const length = Math.hypot(dx, dz);
      const scale = feather ? (length + FEATHER) / length : ring / RINGS;
      const x = center.x + dx * scale;
      const z = center.z + dz * scale;

      positions.push(x, HEIGHT, z);
      pushColor(x, z, feather ? EDGE_SHADE : 1);
    });
  }

  // Triangles wind counter-clockwise seen from above, so the lawn faces up.
  const vertex = (ring, sample) => 1 + (ring - 1) * samples + (sample % samples);
  const indices = [];

  for (let sample = 0; sample < samples; sample += 1) {
    indices.push(0, vertex(1, sample + 1), vertex(1, sample));

    for (let ring = 1; ring <= RINGS; ring += 1) {
      const inner = vertex(ring, sample);
      const innerNext = vertex(ring, sample + 1);
      const outer = vertex(ring + 1, sample);
      const outerNext = vertex(ring + 1, sample + 1);

      indices.push(inner, outerNext, outer, inner, innerNext, outerNext);
    }
  }

  const vertexCount = positions.length / 3;
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  for (let index = 0; index < vertexCount; index += 1) {
    normals[index * 3 + 1] = 1;
    uvs[index * 2] = positions[index * 3] / TILE;
    uvs[index * 2 + 1] = positions[index * 3 + 2] / TILE;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('normal', new BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);

  const texture = createGrassTexture(seed);
  texture.anisotropy = anisotropy;

  const material = new MeshStandardMaterial({
    map: texture,
    vertexColors: true,
    roughness: 1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };

  return { mesh: new Mesh(geometry, material), dispose };
};
