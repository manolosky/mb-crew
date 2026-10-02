import { CanvasTexture, SRGBColorSpace } from 'three';

import { createRandom } from '@/lib/random';

const COLUMNS = 4;
const ROWS = 10;
const CELL = 16;

// Emissive façade: a grid of windows, most dark, some lit in the site's ember
// tones and a few in cool "data" cyan. Drawn once on a canvas and shared by
// every building.
export const createWindowsTexture = (seed = 11) => {
  const random = createRandom(seed);
  const canvas = document.createElement('canvas');
  canvas.width = COLUMNS * CELL;
  canvas.height = ROWS * CELL;

  const context = canvas.getContext('2d');
  context.fillStyle = '#050403';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const roll = random.next();
      let color = '#14110e';

      if (roll < 0.3) {
        color = '#ffad5c';
      } else if (roll < 0.38) {
        color = '#ff7a1a';
      } else if (roll < 0.45) {
        color = '#58d4ff';
      }

      context.fillStyle = color;
      context.fillRect(column * CELL + 4, row * CELL + 4, CELL - 8, CELL - 7);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;

  return texture;
};
