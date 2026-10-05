import { Pass } from 'postprocessing';
import { Mesh } from 'three';

// Compiles the programs of `object` as if it were drawn into `target`. The
// target matters: drawing to the screen and into a buffer need different
// programs (colour space and tone mapping), so the wrong one is wasted work.
const compileInto = (renderer, target, object, camera) => {
  const previous = renderer.getRenderTarget();
  renderer.setRenderTarget(target);
  const ready = renderer.compileAsync(object, camera);
  renderer.setRenderTarget(previous);

  return ready;
};

// Starts compiling every shader a frame of the Twin City uses (the scene, each
// effect pass and the bloom's own luminance and blur passes) and resolves once
// all of them are linked. With KHR_parallel_shader_compile the driver does this
// without blocking the main thread, so the first frame only has to draw.
export const precompileShaders = (renderer, composer, { scene, camera, bloom }) => {
  const offscreen = composer.outputBuffer;
  const passes = composer.passes.filter((pass) => null !== pass.fullscreenMaterial);
  const screenCamera = passes[0]?.camera ?? camera;
  const jobs = [compileInto(renderer, composer.inputBuffer, scene, camera)];

  passes.forEach((pass) => {
    jobs.push(
      compileInto(renderer, pass.renderToScreen ? null : offscreen, pass.scene, pass.camera),
    );
  });

  [
    bloom.luminancePass?.fullscreenMaterial,
    bloom.mipmapBlurPass?.downsamplingMaterial,
    bloom.mipmapBlurPass?.upsamplingMaterial,
  ]
    .filter(Boolean)
    .forEach((material) => {
      jobs.push(
        compileInto(renderer, offscreen, new Mesh(Pass.fullscreenGeometry, material), screenCamera),
      );
    });

  return Promise.all(jobs);
};
