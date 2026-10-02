import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';
import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  Fog,
  HalfFloatType,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { areAnimationsPaused, onAnimationsChange, prefersReducedMotion } from '@/lib/motion';
import { createRandom } from '@/lib/random';
import { createGrass } from '@/lib/twin-city/createGrass';
import { createRoofs } from '@/lib/twin-city/createRoofs';
import { generateCity } from '@/lib/twin-city/generateCity';
import { SplitLensEffect } from '@/lib/twin-city/SplitLensEffect';
import { createWindowsTexture } from '@/lib/twin-city/windowsTexture';

const BACKGROUND = '#0b0a09';
const SPLIT_RANGE = 0.15; // the seam moves up to 15% towards the hovered side
const DAMPING = 4; // easing speed (per second)
const CURSOR_RADIUS = 9;
const CURSOR_GROWTH = 0.65;
const FLOW_COUNT = 240;
const FIREFLY_COUNT = 90;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const damp = (current, target, delta) =>
  current + (target - current) * (1 - Math.exp(-DAMPING * delta));

const createFlows = (streets, random) => {
  const flows = Array.from({ length: FLOW_COUNT }, () => ({
    street: streets[Math.floor(random.next() * streets.length)],
    progress: random.next(),
    speed: random.range(0.04, 0.11) * (random.chance(0.5) ? 1 : -1),
  }));
  const colors = new Float32Array(FLOW_COUNT * 3);
  const ember = new Color('#ff9a3d');
  const cyan = new Color('#58d4ff');

  flows.forEach((_, index) => {
    (random.chance(0.6) ? ember : cyan).toArray(colors, index * 3);
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(FLOW_COUNT * 3), 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  const points = new Points(
    geometry,
    new PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );

  const update = (delta) => {
    const positions = geometry.attributes.position.array;

    flows.forEach((flow, index) => {
      flow.progress = (flow.progress + flow.speed * delta + 1) % 1;
      const { axis, offset, from, to } = flow.street;
      const along = from + flow.progress * (to - from);

      positions[index * 3] = 'x' === axis ? along : offset;
      positions[index * 3 + 1] = 0.3;
      positions[index * 3 + 2] = 'x' === axis ? offset : along;
    });
    geometry.attributes.position.needsUpdate = true;
  };

  return { points, update };
};

const createFireflies = (bounds, random) => {
  const seeds = Array.from({ length: FIREFLY_COUNT }, () => ({
    x: random.range(-bounds.half, bounds.half),
    z: random.range(bounds.half + 2, bounds.forestEnd),
    y: random.range(1, 5),
    phase: random.range(0, Math.PI * 2),
  }));
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(FIREFLY_COUNT * 3), 3));

  const points = new Points(
    geometry,
    new PointsMaterial({
      size: 0.45,
      color: '#ffb36b',
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );

  const update = (time) => {
    const positions = geometry.attributes.position.array;

    seeds.forEach((seed, index) => {
      positions[index * 3] = seed.x + Math.sin(time * 0.6 + seed.phase) * 0.8;
      positions[index * 3 + 1] = seed.y + Math.sin(time * 0.9 + seed.phase * 2) * 0.5;
      positions[index * 3 + 2] = seed.z + Math.cos(time * 0.5 + seed.phase) * 0.8;
    });
    geometry.attributes.position.needsUpdate = true;
  };

  return { points, update };
};

// Mounts the "Twin City" in `host`: a procedural city whose left (or top) half
// is its colourful digital twin and whose other half is an ink drawing. The
// seam follows the pointer and writes `--split` on `cssTarget` so the page's
// columns move with it. `onReady` fires after the first frame (to fade the
// canvas in over the poster). Throws when WebGL is unavailable.
export const createTwinCity = (host, { cssTarget = host, onReady, onContextLost } = {}) => {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer ? 1.25 : 1.5));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.domElement.style.display = 'block';
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(BACKGROUND);
  scene.fog = new Fog(BACKGROUND, 80, 200);

  const camera = new PerspectiveCamera(36, host.clientWidth / host.clientHeight, 1, 400);
  const random = createRandom(4242);
  const city = generateCity();

  // Buildings: sides carry the lit windows, roofs stay dark.
  const windows = createWindowsTexture();
  const facade = new MeshStandardMaterial({
    color: '#1b1815',
    roughness: 0.82,
    metalness: 0.15,
    emissive: '#ffffff',
    emissiveMap: windows,
    emissiveIntensity: 1.25,
  });
  const roof = new MeshStandardMaterial({ color: '#221e1a', roughness: 0.9 });
  const buildingGeometry = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const buildings = new InstancedMesh(
    buildingGeometry,
    [facade, facade, roof, roof, facade, facade],
    city.buildings.length,
  );
  const growth = new Float32Array(city.buildings.length).fill(1);
  const roofs = createRoofs(city.buildings);
  const placeholder = new Object3D();

  const treeGeometry = new ConeGeometry(1, 1, 6).translate(0, 0.5, 0);
  const treeMaterial = new MeshStandardMaterial({
    color: '#0e231d',
    emissive: '#1f7a5c',
    emissiveIntensity: 0.25,
    roughness: 0.9,
    flatShading: true,
  });
  const trees = new InstancedMesh(treeGeometry, treeMaterial, city.trees.length);

  city.trees.forEach((tree, index) => {
    placeholder.position.set(tree.x, 0, tree.z);
    placeholder.scale.set(tree.radius, tree.height, tree.radius);
    placeholder.updateMatrix();
    trees.setMatrixAt(index, placeholder.matrix);
  });

  const groundGeometry = new PlaneGeometry(400, 400).rotateX(-Math.PI / 2);
  const groundMaterial = new MeshStandardMaterial({ color: '#0d0b09', roughness: 1 });
  const ground = new Mesh(groundGeometry, groundMaterial);
  const grass = createGrass(city.ground, {
    anisotropy: renderer.capabilities.getMaxAnisotropy(),
  });

  const flows = createFlows(city.streets, random);
  const fireflies = createFireflies(city.bounds, random);

  scene.add(
    ground,
    grass.mesh,
    buildings,
    ...roofs.meshes,
    trees,
    flows.points,
    fireflies.points,
    new HemisphereLight('#4b5d8a', BACKGROUND, 0.55),
    new AmbientLight('#ffffff', 0.08),
  );
  const moon = new DirectionalLight('#a9bcff', 0.9);
  moon.position.set(-40, 70, -30);
  scene.add(moon);

  const composer = new EffectComposer(renderer, {
    frameBufferType: HalfFloatType,
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
  });
  const lens = new SplitLensEffect();
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(
    new EffectPass(
      camera,
      new BloomEffect({
        luminanceThreshold: 0.32,
        luminanceSmoothing: 0.25,
        intensity: 1.15,
        mipmapBlur: true,
      }),
    ),
  );
  composer.addPass(new EffectPass(camera, lens));

  // Interaction state.
  const pointer = { x: 0.5, y: 0.5, active: false };
  const state = { split: 0.5, focus: 0, hoverSide: null };
  const raycaster = new Raycaster();
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
  const cursor = new Vector3();
  const ndc = new Vector2();

  let ready = false;

  const isPortrait = () => host.clientWidth <= host.clientHeight;

  const placeCamera = (time) => {
    const radius = isPortrait() ? 150 : 108;
    const azimuth = Math.PI + 0.55 + Math.sin(time * 0.05) * 0.06 + state.focus * 0.1;
    const elevation = 0.6;

    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * radius,
      Math.sin(elevation) * radius,
      Math.cos(azimuth) * Math.cos(elevation) * radius,
    );
    camera.lookAt(0, 0, 4);
  };

  const updateBuildings = (delta, cursorActive) => {
    city.buildings.forEach((building, index) => {
      const target = cursorActive
        ? 1 +
          CURSOR_GROWTH *
            Math.exp(
              -((building.x - cursor.x) ** 2 + (building.z - cursor.z) ** 2) /
                (2 * CURSOR_RADIUS ** 2),
            )
        : 1;

      growth[index] = damp(growth[index], target, delta);
      placeholder.position.set(building.x, 0, building.z);
      placeholder.scale.set(building.width, building.height * growth[index], building.depth);
      placeholder.updateMatrix();
      buildings.setMatrixAt(index, placeholder.matrix);
    });
    buildings.instanceMatrix.needsUpdate = true;
    roofs.update(growth);
  };

  const update = (delta, time) => {
    const portrait = isPortrait();
    const along = portrait ? pointer.y : pointer.x;
    let targetSplit = 0.5;

    if (pointer.active) {
      targetSplit = 0.5 + (0.5 - along) * 2 * SPLIT_RANGE;
    } else if (null !== state.hoverSide) {
      targetSplit = 0.5 + ('twin' === state.hoverSide ? SPLIT_RANGE : -SPLIT_RANGE);
    }

    state.split = damp(state.split, targetSplit, delta);
    state.focus = (state.split - 0.5) / SPLIT_RANGE;

    // The cursor only "pays attention" on the digital twin side.
    let cursorActive = false;

    if (pointer.active && along < state.split) {
      ndc.set(pointer.x * 2 - 1, -(pointer.y * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      cursorActive = null !== raycaster.ray.intersectPlane(groundPlane, cursor);
    }

    placeCamera(time);
    updateBuildings(delta, cursorActive);
    flows.update(delta);
    fireflies.update(time);
    lens.setLens({
      split: state.split,
      axis: portrait ? 1 : 0,
      focus: state.focus,
    });
    cssTarget.style.setProperty('--split', state.split.toFixed(4));
    composer.render(delta);

    if (!ready) {
      ready = true;
      onReady?.();
    }
  };

  // Render loop: runs only while visible and while animations are allowed.
  let frame = null;
  let last = 0;
  let elapsed = 0;

  const motionAllowed = () => !prefersReducedMotion() && !areAnimationsPaused();

  const tick = (now) => {
    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += delta;
    update(delta, elapsed);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (null !== frame || document.hidden || !motionAllowed()) {
      return;
    }

    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (null !== frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  // Reduced motion or paused animations: a single still frame.
  const renderStill = () => {
    update(0, elapsed);
  };

  const syncMotion = () => {
    if (motionAllowed()) {
      start();
    } else {
      stop();
      renderStill();
    }
  };

  const onPointerMove = (event) => {
    const rect = host.getBoundingClientRect();
    pointer.x = clamp01((event.clientX - rect.left) / rect.width);
    pointer.y = clamp01((event.clientY - rect.top) / rect.height);
    pointer.active = true;
  };
  const onPointerLeave = () => {
    pointer.active = false;
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      syncMotion();
    }
  };
  const onContextLostEvent = (event) => {
    event.preventDefault();
    stop();
    onContextLost?.();
  };

  const resizeObserver = new ResizeObserver(() => {
    const width = host.clientWidth;
    const height = host.clientHeight;

    renderer.setSize(width, height);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (null === frame) {
      renderStill();
    }
  });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibilityChange);
  renderer.domElement.addEventListener('webglcontextlost', onContextLostEvent);
  resizeObserver.observe(host);
  const unsubscribeMotion = onAnimationsChange(syncMotion);

  syncMotion();

  return {
    // Keyboard focus on a column behaves like hovering it.
    setHoverSide: (side) => {
      state.hoverSide = side;
      if (null === frame) {
        renderStill();
      }
    },
    dispose: () => {
      stop();
      unsubscribeMotion();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLostEvent);
      composer.dispose();
      [
        buildingGeometry,
        treeGeometry,
        groundGeometry,
        flows.points.geometry,
        fireflies.points.geometry,
      ].forEach((geometry) => geometry.dispose());
      [
        facade,
        roof,
        treeMaterial,
        groundMaterial,
        flows.points.material,
        fireflies.points.material,
      ].forEach((material) => material.dispose());
      roofs.dispose();
      grass.dispose();
      windows.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};
