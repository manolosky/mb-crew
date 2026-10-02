import { BlendFunction, Effect, EffectAttribute } from 'postprocessing';
import { Uniform } from 'three';

// One full-screen pass decides the "lens" per pixel: the digital twin keeps
// the rendered colours on one side of the seam; the classic side becomes an ink
// drawing on dark paper (Sobel edges on depth + luminance, hatching, grain).
// `uAxis` 0 = vertical seam (landscape), 1 = horizontal seam (portrait, AI on top).
const fragmentShader = /* glsl */ `
uniform float uSplit;
uniform float uAxis;
uniform float uFocus;

float luma(const in vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float hash(const in vec2 point) {
  return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
}

float linearDepthAt(const in vec2 uv) {
  return clamp(-getViewZ(readDepth(uv)) / cameraFar, 0.0, 1.0);
}

float depthEdge(const in vec2 uv) {
  vec2 t = texelSize;
  float tl = linearDepthAt(uv + t * vec2(-1.0, 1.0));
  float tc = linearDepthAt(uv + t * vec2(0.0, 1.0));
  float tr = linearDepthAt(uv + t * vec2(1.0, 1.0));
  float ml = linearDepthAt(uv + t * vec2(-1.0, 0.0));
  float mr = linearDepthAt(uv + t * vec2(1.0, 0.0));
  float bl = linearDepthAt(uv + t * vec2(-1.0, -1.0));
  float bc = linearDepthAt(uv + t * vec2(0.0, -1.0));
  float br = linearDepthAt(uv + t * vec2(1.0, -1.0));
  float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
  float gy = (tl + 2.0 * tc + tr) - (bl + 2.0 * bc + br);

  return length(vec2(gx, gy));
}

float lumaEdge(const in vec2 uv) {
  vec2 t = texelSize;
  float tl = luma(texture2D(inputBuffer, uv + t * vec2(-1.0, 1.0)).rgb);
  float tr = luma(texture2D(inputBuffer, uv + t * vec2(1.0, 1.0)).rgb);
  float bl = luma(texture2D(inputBuffer, uv + t * vec2(-1.0, -1.0)).rgb);
  float br = luma(texture2D(inputBuffer, uv + t * vec2(1.0, -1.0)).rgb);

  return length(vec2(tr + br - tl - bl, tl + tr - bl - br));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  vec2 pixel = uv * resolution;
  float coord = mix(uv.x, 1.0 - uv.y, uAxis);
  float axisPixels = mix(resolution.x, resolution.y, uAxis);
  float seamDistance = (coord - uSplit) * axisPixels;

  // Silhouettes: depth jumps relative to the distance, so receding ground
  // doesn't read as an edge but every building outline does.
  float relativeDepthEdge = depthEdge(uv) / max(linearDepthAt(uv), 0.0001);
  float silhouette = smoothstep(0.06, 0.18, relativeDepthEdge);
  float detail = smoothstep(0.12, 0.45, lumaEdge(uv));

  // Classic lens: architectural ink drawing.
  float lines = clamp(silhouette + detail * 0.8, 0.0, 1.0);
  float tone = clamp(luma(inputColor.rgb) * 1.6, 0.0, 1.0);
  float hatchMask = step(0.62, fract((pixel.x + pixel.y) / 6.0));
  float grain = hash(floor(pixel) + floor(time * 12.0)) * 0.045;
  vec3 classic = vec3(0.03) + vec3(tone * 0.22) + hatchMask * tone * 0.08 + grain;
  classic = mix(classic, vec3(0.88, 0.86, 0.82), lines);

  // AI lens: the rendered scene with holographic cyan outlines (the same
  // silhouettes), a touch brighter when hovered, plus faint scanlines.
  float scan = 0.5 + 0.5 * sin(pixel.y * 1.4 + time * 3.0);
  vec3 twin = inputColor.rgb * (1.0 + 0.18 * max(uFocus, 0.0)) * (0.96 + 0.04 * scan);
  twin += vec3(0.22, 0.72, 1.0) * silhouette * (0.45 + 0.25 * max(uFocus, 0.0));

  float side = smoothstep(-1.0, 1.0, seamDistance);
  vec3 color = mix(twin, classic, side);

  // The seam: an ember "scanner" line that digitises the classic city.
  float glow = exp(-abs(seamDistance) / 5.0) + 0.35 * exp(-abs(seamDistance) / 40.0);
  color += vec3(1.0, 0.42, 0.1) * glow * 0.8;

  outputColor = vec4(color, inputColor.a);
}
`;

export class SplitLensEffect extends Effect {
  constructor() {
    super('SplitLensEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      uniforms: new Map([
        ['uSplit', new Uniform(0.5)],
        ['uAxis', new Uniform(0)],
        ['uFocus', new Uniform(0)],
      ]),
    });
  }

  setLens({ split, axis, focus }) {
    this.uniforms.get('uSplit').value = split;
    this.uniforms.get('uAxis').value = axis;
    this.uniforms.get('uFocus').value = focus;
  }
}
