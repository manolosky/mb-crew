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
  GridHelper,
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
import { generateCity } from '@/lib/twin-city/generateCity';
import { SplitLensEffect } from '@/lib/twin-city/SplitLensEffect';
import { createWindowsTexture } from '@/lib/twin-city/windowsTexture';

const BACKGROUND = '#0b0a09';
const SPLIT_RANGE = 0.15; // the seam moves up to 15% towards the hovered side
const DAMPING = 4; // easing speed (per second)
const INTRO_SECONDS = 1.8;
const CURSOR_RADIUS = 9;
const CURSOR_GROWTH = 0.65;
const FLOW_COUNT = 240;
const FIREFLY_COUNT = 90;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
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
// columns move with it. Throws when WebGL is unavailable.
export const createTwinCity = (host, { cssTarget = host, onStats, onContextLost } = {}) => {
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
  const grid = new GridHelper(city.bounds.half * 2 + 24, 44, '#ff7a1a', '#2a1a0e');
  grid.material.transparent = true;
  grid.material.opacity = 0.32;
  grid.position.y = 0.02;

  const flows = createFlows(city.streets, random);
  const fireflies = createFireflies(city.bounds, random);

  scene.add(
    ground,
    grid,
    buildings,
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
  const state = { split: 0.5, focus: 0, intro: 0, inkLight: 0, hoverSide: null };
  const raycaster = new Raycaster();
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
  const cursor = new Vector3();
  const ndc = new Vector2();

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
    const rise = state.intro;

    city.buildings.forEach((building, index) => {
      const distanceFromCentre = Math.hypot(building.x, building.z) / city.bounds.half;
      const delay = Math.min(1, distanceFromCentre) * 0.45;
      const grown = easeOutCubic(clamp01((rise - delay) / 0.55));
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
      placeholder.scale.set(
        building.width,
        Math.max(0.001, building.height * growth[index] * grown),
        building.depth,
      );
      placeholder.updateMatrix();
      buildings.setMatrixAt(index, placeholder.matrix);
    });
    buildings.instanceMatrix.needsUpdate = true;
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
    state.intro = Math.min(1, state.intro + delta / INTRO_SECONDS);

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
      inkLight: state.inkLight,
      focus: state.focus,
      reveal: easeOutCubic(Math.min(1, state.intro * 1.6)),
    });
    cssTarget.style.setProperty('--split', state.split.toFixed(4));
    composer.render(delta);
  };

  // Render loop: runs only while visible and while animations are allowed.
  let frame = null;
  let last = 0;
  let elapsed = 0;
  let frames = 0;
  let statsSince = 0;

  const motionAllowed = () => !prefersReducedMotion() && !areAnimationsPaused();

  const tick = (now) => {
    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += delta;
    update(delta, elapsed);

    frames += 1;
    if (now - statsSince >= 500) {
      onStats?.({ fps: Math.round((frames * 1000) / (now - statsSince)) });
      frames = 0;
      statsSince = now;
    }

    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (null !== frame || document.hidden || !motionAllowed()) {
      return;
    }

    last = performance.now();
    statsSince = last;
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (null !== frame) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };

  // Reduced motion or paused animations: one finished, still frame.
  const renderStill = () => {
    state.intro = 1;
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
    setInkLight: (light) => {
      state.inkLight = light ? 1 : 0;
      if (null === frame) {
        renderStill();
      }
    },
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
        grid.material,
        flows.points.material,
        fireflies.points.material,
      ].forEach((material) => material.dispose());
      windows.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};
