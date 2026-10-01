import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
} from 'three';

const TILE_COLOR = new Color('#a65b3f'); // muted terracotta
const SLAB_COLOR = new Color('#5c524b'); // weathered concrete
const OVERHANG = 1.08; // pitched roofs stick out a little past the walls
const CAP_OVERHANG = 1.03; // flat roofs end in a thin cornice
const CAP_HEIGHT = 0.18;
const GABLE_RIDGE = 0.5;
const HIP_RIDGE = 0.18;

// Pitched roof over a unit footprint, one unit high, with its ridge along Z.
// `ridge` is half the ridge length: 0.5 gives a gable roof, less a hip roof.
const createPitchedGeometry = (ridge) => {
  const a = [-0.5, 0, -0.5];
  const b = [0.5, 0, -0.5];
  const c = [0.5, 0, 0.5];
  const d = [-0.5, 0, 0.5];
  const e = [0, 1, -ridge];
  const f = [0, 1, ridge];
  const triangles = [a, d, f, a, f, e, b, e, f, b, f, c, d, c, f, b, a, e];
  const geometry = new BufferGeometry();

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(triangles.flat()), 3));
  geometry.computeVertexNormals();

  return geometry;
};

// One colour family for every roof, nudged per building (in sRGB, so the
// variation reads the same across light and dark tones).
const hsl = { h: 0, s: 0, l: 0 };
const tint = (base, { hue, saturation, lightness }) => {
  base.getHSL(hsl, SRGBColorSpace);

  return new Color().setHSL(
    hsl.h + hue * 0.03,
    hsl.s + saturation * 0.1,
    hsl.l + lightness * 0.08,
    SRGBColorSpace,
  );
};

// Roofs of the Twin City: gable and hip roofs on low-rise buildings, a
// concrete cap (and sometimes a rooftop unit) on towers. They sit on top of
// each building, so `update` follows the buildings' current growth.
export const createRoofs = (buildings) => {
  const material = new MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 });
  const layers = {
    gable: { geometry: createPitchedGeometry(GABLE_RIDGE), parts: [] },
    hip: { geometry: createPitchedGeometry(HIP_RIDGE), parts: [] },
    block: { geometry: new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), parts: [] },
  };

  buildings.forEach((building, index) => {
    const { roof } = building;

    if ('flat' !== roof.type) {
      layers[roof.type].parts.push({ index, color: tint(TILE_COLOR, roof.tone) });
      return;
    }

    const color = tint(SLAB_COLOR, roof.tone);
    layers.block.parts.push({ index, color });

    if (null !== roof.unit) {
      layers.block.parts.push({ index, color, unit: roof.unit });
    }
  });

  const meshes = Object.values(layers).map(({ geometry, parts }) => {
    const mesh = new InstancedMesh(geometry, material, parts.length);
    parts.forEach(({ color }, slot) => mesh.setColorAt(slot, color));

    return mesh;
  });

  const placeholder = new Object3D();

  const placePitched = (building, top) => {
    // The ridge runs along the longer side of the building.
    const alongX = building.width > building.depth;

    placeholder.position.set(building.x, top, building.z);
    placeholder.rotation.set(0, alongX ? Math.PI / 2 : 0, 0);
    placeholder.scale.set(
      (alongX ? building.depth : building.width) * OVERHANG,
      building.roof.height,
      (alongX ? building.width : building.depth) * OVERHANG,
    );
  };

  const placeBlock = (building, top, unit) => {
    placeholder.rotation.set(0, 0, 0);

    if (undefined === unit) {
      placeholder.position.set(building.x, top, building.z);
      placeholder.scale.set(
        building.width * CAP_OVERHANG,
        CAP_HEIGHT,
        building.depth * CAP_OVERHANG,
      );
      return;
    }

    placeholder.position.set(
      building.x + unit.offsetX,
      top + CAP_HEIGHT,
      building.z + unit.offsetZ,
    );
    placeholder.scale.set(unit.width, unit.height, unit.depth);
  };

  const update = (growth) => {
    Object.values(layers).forEach(({ parts }, layer) => {
      const mesh = meshes[layer];

      parts.forEach(({ index, unit }, slot) => {
        const building = buildings[index];
        const top = building.height * growth[index];

        if ('flat' === building.roof.type) {
          placeBlock(building, top, unit);
        } else {
          placePitched(building, top);
        }

        placeholder.updateMatrix();
        mesh.setMatrixAt(slot, placeholder.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
  };

  const dispose = () => {
    Object.values(layers).forEach(({ geometry }) => geometry.dispose());
    material.dispose();
  };

  return { meshes, update, dispose };
};
