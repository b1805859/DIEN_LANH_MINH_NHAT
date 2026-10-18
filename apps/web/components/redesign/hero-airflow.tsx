'use client';

import { useEffect, useRef } from 'react';
import styles from './hero.module.css';

/**
 * HeroAirflow — Precision Unified Volumetric Cooling Engine
 *
 * Skills Applied:
 * 1. `shader-glsl`:
 *    - Single continuous volumetric cooling field (`UNIFIED_VOLUME_FRAG`) with zero
 *      separated lines, beams, or neon ribbons.
 *    - Curvilinear fan-and-floor coordinate mapping `(s, v)` anchored to the exact AC
 *      louver slot `A(0.836, 0.730) -> B(0.916, 0.775)`.
 *    - Controlled, subtle cyan illumination at the AC vent (no white hotspot or harsh glow;
 *      the dark louver slot remains clearly visible).
 *    - Full-room cooling coverage expanding from the AC vent across the curtain, window,
 *      and indoor plant, diffusing around the family sofa and coffee table, and settling
 *      softly near the floor/rug.
 *    - Three blended internal advection layers (broad volumetric base, soft directional
 *      streamline currents, and slow billowing mist) that move continuously within a
 *      stable outer silhouette.
 * 2. `threejs-animation`:
 *    - Frame-rate-independent continuous advection clock (`12s` calm cycle), deterministic
 *      `?t=N` frame-freeze harness, responsive `object-fit: cover` projection,
 *      `IntersectionObserver` offscreen pause, `prefers-reduced-motion` support, and
 *      complete WebGL GPU buffer/program disposal on unmount.
 * 3. `particle-system`:
 *    - Secondary, ultra-subtle atmospheric micro-motes (`1.8–3.6px`, low alpha) advected
 *      through a divergence-free 2D curl-noise velocity field inside the cooling volume.
 */

const IMAGE_ASPECT = 16 / 9;

// ---------------------------------------------------------------------------
// 1. Divergence-Free 2D Curl Noise for Subtle Atmospheric Micro-Motes (`particle-system`)
// ---------------------------------------------------------------------------
function hash2D(ix: number, iy: number): number {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothNoise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);
  const a = hash2D(ix, iy);
  const b = hash2D(ix + 1, iy);
  const c = hash2D(ix, iy + 1);
  const d = hash2D(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function curlNoise2D(x: number, y: number): [number, number] {
  const eps = 0.04;
  const dPsiDy = (smoothNoise2D(x, y + eps) - smoothNoise2D(x, y - eps)) / (2.0 * eps);
  const dPsiDx = (smoothNoise2D(x + eps, y) - smoothNoise2D(x - eps, y)) / (2.0 * eps);
  return [dPsiDy, -dPsiDx];
}

// ---------------------------------------------------------------------------
// 2. GLSL Simplex Noise, Gaseous fBM & Subject Occlusion Mask (`shader-glsl`)
// ---------------------------------------------------------------------------
const GLSL_FLUID_COMMON = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbmGas(vec2 p) {
  float value = 0.0;
  float amp = 0.52;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 3; i++) {
    value += amp * snoise(p);
    p = rot * p * 1.92 + vec2(7.3, 11.8);
    amp *= 0.48;
  }
  return value;
}

// Signed distance to a 2D line segment AB
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Protects the entire family on the sofa (zero airflow over any part of the family),
// preserves coffee table details, and protects UI readability while allowing the cooling
// volume to flow continuously behind the foreground technician (hero-technician-layer.webp).
float subjectMask(vec2 imgUv) {
  float nx = imgUv.x;
  float ny = 1.0 - imgUv.y; // top-down y [0..1]
  vec2 p = vec2(nx, ny);

  // 1. Complete Family Protection (Father, Mother, Boy, Girl — heads, hair, shirts,
  //    mother's extended arm on sofa backrest, laps, trousers, legs, and bare feet).
  //    Note: Technician is NOT masked out here so the airflow volume passes continuously
  //    right behind his head, hair, ear, neck, and right shoulder, and is naturally
  //    occluded by hero-technician-layer.webp (z-index: 8).
  float dFatherHead  = length((p - vec2(0.353, 0.562)) / vec2(0.023, 0.038));
  float dMotherHead  = length((p - vec2(0.414, 0.580)) / vec2(0.024, 0.034));
  float dFamTorsos   = length((p - vec2(0.398, 0.658)) / vec2(0.068, 0.068));
  float dMotherArm   = sdSegment(p, vec2(0.425, 0.608), vec2(0.495, 0.612)) / 0.016;
  float dFatherLegs  = sdSegment(p, vec2(0.415, 0.715), vec2(0.482, 0.798)) / 0.044;
  float dMotherLegs  = sdSegment(p, vec2(0.468, 0.688), vec2(0.548, 0.762)) / 0.036;

  float dFamily = min(
    min(min(dFatherHead, dMotherHead), min(dFamTorsos, dMotherArm)),
    min(dFatherLegs, dMotherLegs)
  );
  // 0.0 inside the family contour -> zero cyan airflow on any part of the family
  float famKeep = smoothstep(0.88, 1.18, dFamily);

  // 2. Coffee table & centerpiece plant subtle detail preservation
  float dTable    = length((p - vec2(0.585, 0.765)) / vec2(0.068, 0.055));
  float tableKeep = mix(0.38, 1.0, smoothstep(0.60, 1.20, dTable));

  // 3. Left-side headline, description & CTA button readability zone (upper-left)
  // Allows lower-left sofa & floor (imgUv.y < 0.32) to receive gentle cooling diffusion
  float inLeftCopyX = 1.0 - smoothstep(0.18, 0.36, nx);
  float inLeftCopyY = smoothstep(0.28, 0.40, imgUv.y);
  float leftCopyKeep = 1.0 - inLeftCopyX * inLeftCopyY * 0.92;

  // 4. Outer left edge & bottom 8-icon service bar fade (service bar top is at ny ~ 0.852)
  float leftEdgeKeep  = smoothstep(0.10, 0.22, nx);
  float bottomBarKeep = smoothstep(0.862, 0.822, ny);
  float topHeaderKeep = smoothstep(0.125, 0.195, ny);

  return famKeep * tableKeep * leftCopyKeep * leftEdgeKeep * bottomBarKeep * topHeaderKeep;
}
`;

// ---------------------------------------------------------------------------
// Pass 1: Unified Volumetric Cooling Field (`shader-glsl` + `threejs-animation`)
// Renders ONE cohesive, continuous fan-shaped volume of cool cyan air that
// emerges from the AC vent, flows directly behind the technician so the
// technician naturally occludes the airflow, expands across the room, and
// diffuses softly around the sofa, coffee table, and floor without covering
// any part of the family.
// ---------------------------------------------------------------------------
const UNIFIED_VOLUME_VERT = /* glsl */ `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const UNIFIED_VOLUME_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uStatic;
uniform vec2 uCoverScale;
uniform vec2 uCoverOffset;

${GLSL_FLUID_COMMON}

vec2 toImageUv(vec2 viewUv) {
  return viewUv * uCoverScale + uCoverOffset;
}

void main() {
  vec2 imgUv = toImageUv(vUv);
  if (imgUv.x < 0.0 || imgUv.x > 1.0 || imgUv.y < 0.0 || imgUv.y > 1.0) {
    discard;
  }

  // AC louver slot segment in bottom-up UV: A(0.836, 0.730) -> B(0.916, 0.775)
  vec2 ventA = vec2(0.836, 0.730);
  vec2 ventB = vec2(0.916, 0.775);

  // Smooth ceiling mask along the AC louver slot so airflow never bleeds onto the upper white AC casing
  float ventLineY = 0.732 + (imgUv.x - 0.836) * (0.045 / 0.080);
  float ventCeilingMask = 1.0 - smoothstep(0.815, 0.842, imgUv.x) * smoothstep(ventLineY - 0.002, ventLineY + 0.015, imgUv.y);
  // Prevent bleeding to the right of the AC vent while allowing downward expansion behind technician
  float rightWallMask = smoothstep(0.942, 0.902, imgUv.x - (0.775 - imgUv.y) * 0.08);
  if (ventCeilingMask * rightWallMask < 0.002) {
    discard;
  }

  // Distance to the physical AC louver slot AB
  vec2 AB = ventB - ventA;
  float projAB = clamp(dot(imgUv - ventA, AB) / dot(AB, AB), 0.0, 1.0);
  vec2 closestVent = ventA + projAB * AB;
  float distToVent = length((imgUv - closestVent) * vec2(1.0, 1.35));

  // Progression distance s from the AC vent across the room [0 at vent -> 1 at far left/floor]
  float dxVent = max(0.0, 0.905 - imgUv.x);
  float dyVent = max(0.0, 0.768 - imgUv.y);
  float radialDist = length(vec2(dxVent * 0.88, dyVent * 0.92));
  float s = clamp(radialDist / 0.78, 0.0001, 1.0);

  // Calm, continuous advection clock (~12-second full room traversal cycle)
  float t = (uStatic > 0.5) ? 0.0 : uTime;
  float flowPhase = t * 0.082;

  // -------------------------------------------------------------------------
  // A. UNIFIED VOLUMETRIC SILHOUETTE (Stable outer shape matching approved mockup)
  // -------------------------------------------------------------------------
  // Upper boundary of the fan:
  // - For x in [0.836..0.916], follows the exact AC louver slot line A(0.836, 0.732) -> B(0.916, 0.775)
  // - For x < 0.836, sweeps smoothly across the upper curtain (0.78, 0.715), window panes (0.62, 0.665),
  //   and indoor tree foliage (0.46, 0.615), then slopes gently down on the left.
  float dxFromA = max(0.0, 0.836 - imgUv.x);
  float louverTopY = 0.732 + clamp(imgUv.x - 0.836, 0.0, 0.085) * 0.54;
  float leftDropX = max(0.0001, 0.44 - imgUv.x);
  float yHigh = louverTopY - 0.30 * dxFromA - 0.34 * pow(leftDropX, 1.45) * step(imgUv.x, 0.44);

  // Lower boundary of the fan: plunges steeply from the right end of the AC louver B(0.916, 0.775)
  // straight down behind the technician's head, hair, ear, neck, and shoulders (x = 0.78..0.91,
  // ny_topdown = 0.35..0.65 -> imgUv.y = 0.35..0.65) so the technician clearly blocks the airflow!
  float dxBot = max(0.0001, 0.926 - imgUv.x);
  float yLow  = 0.135 + 0.635 * exp(-18.5 * pow(dxBot, 1.38));

  float span = max(0.042, yHigh - yLow);
  float v = (imgUv.y - yLow) / span; // 0 at lower boundary -> 1 at upper boundary

  if (imgUv.y > yHigh + 0.045 || v < -0.25) {
    discard;
  }

  // Very subtle, low-frequency edge breathing (amplitude <= 0.012 in screen Y so outer silhouette remains stable)
  float edgeNoise = fbmGas(vec2(s * 1.5 - flowPhase * 0.75, v * 1.4 + 2.1));

  // Physical-distance upper feather so the fan stays full right up to the louver slot and upper curtain/tree
  float distBelowTop = (yHigh - imgUv.y) + edgeNoise * 0.012 * smoothstep(0.03, 0.28, s);
  float upperFeather = smoothstep(-0.016, 0.032 + 0.055 * s, distBelowTop);
  float lowerFeather = smoothstep(-0.08, 0.14, v + edgeNoise * 0.025);
  float fanCrossSection = upperFeather * lowerFeather;

  // Longitudinal density falloff: compact & controlled near the AC vent, broad in the mid-room,
  // and softly diffusing toward the far left
  float ventStart = smoothstep(-0.015, 0.022, 0.922 - imgUv.x);
  float roomDecay = 1.0 - smoothstep(0.42, 0.98, s) * 0.48;
  float primaryFanVolume = fanCrossSection * ventStart * roomDecay;

  // Dedicated behind-technician cooling stream reinforcement:
  // Ensures the cyan airflow behind the technician's head, ear, neck, and right shoulder
  // (x: 0.77..0.90, ny_topdown: 0.36..0.62 -> imgUv.y: 0.38..0.64) is unmistakably visible
  // so the technician clearly occludes the flow in front of it.
  float behindTechX = smoothstep(0.72, 0.81, imgUv.x) * smoothstep(0.915, 0.855, imgUv.x);
  float behindTechY = smoothstep(0.32, 0.44, imgUv.y) * smoothstep(0.74, 0.60, imgUv.y);
  float behindTechBoost = behindTechX * behindTechY * 0.32;

  // Lower-Room & Sofa Cooling Diffusion Pool:
  // Cold air settles gently around the lower sofa base, coffee table, and rug/floor
  float poolX = smoothstep(0.17, 0.30, imgUv.x) * smoothstep(0.78, 0.52, imgUv.x);
  float poolY = smoothstep(0.138, 0.182, imgUv.y) * smoothstep(0.46, 0.22, imgUv.y);
  float floorDiffusionPool = poolX * poolY * 0.68;

  // Controlled, subtle emission right at the AC louver mouth (no harsh white hotspot)
  float louverEmission = exp(-distToVent * distToVent * 260.0) *
                         smoothstep(0.825, 0.840, imgUv.x) *
                         smoothstep(0.924, 0.908, imgUv.x) * 0.26;

  // Seamlessly unify the primary fan volume, behind-technician flow, and lower-room floor diffusion
  float unifiedEnvelope = clamp(
    primaryFanVolume * 0.88 + behindTechBoost + floorDiffusionPool * (1.0 - primaryFanVolume * 0.55) + louverEmission,
    0.0,
    1.0
  );

  // -------------------------------------------------------------------------
  // B. CONTINUOUS INTERNAL VOLUMETRIC ADVECTION (3 Blended Internal Layers)
  // -------------------------------------------------------------------------
  // Low-frequency curvilinear coordinates so internal vapor glides outward as ONE
  // velvety volume without any separated stripes or bands.
  vec2 streamUv = vec2(s * 1.85 - flowPhase, v * 1.75);

  // Domain-warping field q
  vec2 q = vec2(
    fbmGas(streamUv + vec2(0.0, flowPhase * 0.22)),
    fbmGas(streamUv + vec2(4.7, -flowPhase * 0.18))
  );

  // Internal Layer 1: Broad volumetric mist body (always >= 0.78 so volume is 100% continuous)
  float layerMist = 0.5 + 0.5 * fbmGas(streamUv * 1.10 + 0.38 * q);

  // Internal Layer 2: Soft directional air-current flow along the fan streamlines
  // (low cross-frequency 2.4 so it never forms separated lines or beams)
  vec2 currentUv = vec2(s * 1.55 - flowPhase * 1.22, (v + (q.y - 0.1) * 0.12) * 2.45);
  float layerCurrents = smoothstep(-0.42, 0.58, fbmGas(currentUv));

  // Internal Layer 3: Slow deep-room atmospheric undulation near sofa & floor
  vec2 deepUv = vec2(imgUv.x * 2.2 + flowPhase * 0.60, imgUv.y * 2.6 + flowPhase * 0.32);
  float layerDeep = 0.5 + 0.5 * fbmGas(deepUv + 0.28 * q);

  // Blend the 3 internal motion layers into ONE cohesive density field
  float currentWeight = (1.0 - smoothstep(0.15, 0.85, s)) * 0.16;
  float internalDensity = 0.76 + 0.16 * layerMist + currentWeight * layerCurrents + 0.08 * layerDeep;

  // Final volumetric alpha with family & UI occlusion mask
  float rawAlpha = unifiedEnvelope * internalDensity * ventCeilingMask * rightWallMask * subjectMask(imgUv);
  float alpha = clamp(rawAlpha * 0.76, 0.0, 0.66);

  if (alpha < 0.002) {
    discard;
  }

  // -------------------------------------------------------------------------
  // C. APPROVED MOCKUP COLOR GRADING (Soft sky-cyan to ice-blue, zero harsh neon/white)
  // -------------------------------------------------------------------------
  vec3 deepCoolingCyan = vec3(0.12, 0.68, 0.96); // Rich sky-cyan tint over bright windows & outer edges
  vec3 midAirflowCyan  = vec3(0.30, 0.81, 0.99); // Primary cohesive cooling volume cyan
  vec3 softIceMist     = vec3(0.58, 0.91, 1.00); // Gentle internal vapor highlight (never overexposed white)

  // Over the lower sofa & rug (imgUv.y < 0.36), lift cyan luminance so dark fabrics glow softly
  float lowerRoomLift = (1.0 - smoothstep(0.16, 0.38, imgUv.y)) * 0.36;
  float highlightMix = clamp(
    layerCurrents * (1.0 - 0.45 * s) * 0.55 + layerMist * 0.32 + lowerRoomLift,
    0.0,
    1.0
  );
  vec3 color = mix(deepCoolingCyan, midAirflowCyan, smoothstep(0.06, 0.62, unifiedEnvelope + lowerRoomLift));
  color = mix(color, softIceMist, highlightMix * 0.66);

  // Output premultiplied color with slightly reduced destination alpha occlusion (0.82)
  // so the cooling volume both tints bright windows and softly illuminates darker sofa/rug areas
  gl_FragColor = vec4(color * alpha, alpha * 0.82);
}
`;

// ---------------------------------------------------------------------------
// Pass 2: Fine Atmospheric Cooling Micro-Particles (`particle-system`)
// Abundant tiny suspended cool-air micro-motes (1.2-3.4px) drifting gently
// inside the unified cooling volume, behind the technician and around the room,
// while strictly avoiding any part of the family.
// ---------------------------------------------------------------------------
const PARTICLE_VERT = /* glsl */ `
attribute vec2 aPosition;
attribute float aAlpha;
attribute float aSize;
varying float vAlpha;

void main() {
  vAlpha = aAlpha;
  gl_Position = vec4(aPosition, 0.0, 1.0);
  gl_PointSize = aSize;
}
`;

const PARTICLE_FRAG = /* glsl */ `
precision mediump float;
varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float r2 = dot(p, p) * 4.0;
  if (r2 > 1.0) discard;

  // Crisp micro-mote core with soft icy halo
  float core = exp(-r2 * 2.8);
  float halo = (1.0 - r2) * 0.72;
  float a = clamp(core * 0.85 + halo * 0.50, 0.0, 1.0) * vAlpha;
  vec3 col = mix(vec3(0.52, 0.90, 1.00), vec3(0.92, 0.99, 1.00), core);
  gl_FragColor = vec4(col * a, a * 0.78);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// Helper for 2D segment distance in JS (for exact family particle occlusion)
function distToSegment2D(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.max(0.0, Math.min(1.0, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

export function HeroAirflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('airflow');
    if (modeParam === 'off') return;

    const fixedTimeParam = params.get('t');
    const hasFixedTime = fixedTimeParam !== null && !Number.isNaN( parseFloat(fixedTimeParam) );
    const fixedTimeValue = hasFixedTime ? parseFloat(fixedTimeParam!) : 0;

    const reducedMotion =
      modeParam === 'static' ||
      hasFixedTime ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      container.removeChild(canvas);
      return;
    }

    const volumeProg = createProgram(gl, UNIFIED_VOLUME_VERT, UNIFIED_VOLUME_FRAG);
    const particleProg = createProgram(gl, PARTICLE_VERT, PARTICLE_FRAG);
    if (!volumeProg || !particleProg) {
      container.removeChild(canvas);
      return;
    }

    const coverScale: [number, number] = [1, 1];
    const coverOffset: [number, number] = [0, 0];

    const updateCoverMapping = (width: number, height: number) => {
      const viewAspect = width / Math.max(height, 1);
      if (viewAspect > IMAGE_ASPECT) {
        coverScale[0] = 1.0;
        coverScale[1] = IMAGE_ASPECT / viewAspect;
        coverOffset[0] = 0.0;
        coverOffset[1] = (1.0 - coverScale[1]) * 0.5;
      } else {
        coverScale[0] = viewAspect / IMAGE_ASPECT;
        coverScale[1] = 1.0;
        coverOffset[0] = (1.0 - coverScale[0]) * 0.5;
        coverOffset[1] = 0.0;
      }
    };

    // 1. Fullscreen Quad for Unified Volumetric Cooling Field
    const quadData = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

    // 2. Abundant Fine Cooling Micro-Motes (`particle-system`)
    const PARTICLE_COUNT = 360;
    const particleData = new Float32Array(PARTICLE_COUNT * 4);
    const particleBuffer = gl.createBuffer();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      // Low-discrepancy Halton-like sequence for even, non-clumped distribution
      const h1 = ((i * 73 + 19) % 359) / 359;
      const h2 = ((i * 151 + 43) % 349) / 349;
      const h3 = ((i * 211 + 61) % 337) / 337;
      const h4 = ((i * 97 + 29) % 331) / 331;
      return {
        u0: h1,
        vBand: 0.03 + h2 * 0.92, // Spans the entire unified cooling volume including behind technician
        speed: 0.038 + h3 * 0.036, // Calm 13-26s drift
        baseAlpha: 0.34 + h4 * 0.42, // Crisp, clearly visible tiny micro-motes
        size: (1.4 + h3 * 2.4) * dpr, // Fine, delicate specks (1.4px - 3.8px)
      };
    });

    const updateParticles = (elapsed: number) => {
      const t = Math.max(0, elapsed);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const linearS = (((p.u0 + t * p.speed) % 1.0) + 1.0) % 1.0;
        // Decelerate smoothly as air disperses across the room
        const s = Math.pow(linearS, 0.86);

        // Map (s, vBand) into the unified cooling volume in image UV
        const imgX = 0.908 - s * 0.68;
        const dxVent = Math.max(0.0, 0.905 - imgX);
        const yHigh = 0.768 - 0.28 * dxVent - 0.34 * Math.pow(Math.max(0.0, 0.44 - imgX), 1.45);
        const dxBot = Math.max(0.0, 0.924 - imgX);
        const yLow = 0.142 + 0.625 * Math.exp(-16.5 * Math.pow(dxBot, 1.36));
        const baseImgY = yLow + (yHigh - yLow) * p.vBand;

        const [curlX, curlY] = curlNoise2D(imgX * 4.5 - t * 0.20, baseImgY * 4.5 + i * 0.37);
        const eddy = 0.014 * Math.min(1.0, s * 2.2);
        const imgXFinal = imgX + curlX * eddy;
        const imgYFinal = baseImgY + curlY * eddy;

        // Protect 100% of the family on the sofa (zero particles over any part of the family).
        // Particles behind the technician are allowed so the foreground technician layer occludes them naturally!
        const ny = 1.0 - imgYFinal;
        const inFamily =
          Math.hypot((imgXFinal - 0.353) / 0.028, (ny - 0.562) / 0.044) < 1.0 ||
          Math.hypot((imgXFinal - 0.414) / 0.028, (ny - 0.580) / 0.040) < 1.0 ||
          Math.hypot((imgXFinal - 0.398) / 0.074, (ny - 0.658) / 0.074) < 1.0 ||
          distToSegment2D(imgXFinal, ny, 0.425, 0.608, 0.495, 0.612) < 0.020 ||
          distToSegment2D(imgXFinal, ny, 0.415, 0.715, 0.482, 0.798) < 0.048 ||
          distToSegment2D(imgXFinal, ny, 0.468, 0.688, 0.548, 0.762) < 0.040;

        // Subtle twinkle modulation so micro-motes feel suspended in cool air
        const twinkle = 0.78 + 0.22 * Math.sin(t * 2.1 + i * 1.73);

        const clipX = ((imgXFinal - coverOffset[0]) / coverScale[0]) * 2.0 - 1.0;
        const clipY = ((imgYFinal - coverOffset[1]) / coverScale[1]) * 2.0 - 1.0;
        const envelope = inFamily
          ? 0.0
          : Math.sin(s * Math.PI) * Math.min(1.0, s * 6.5) * twinkle;

        const base = i * 4;
        particleData[base] = clipX;
        particleData[base + 1] = clipY;
        particleData[base + 2] = p.baseAlpha * envelope;
        particleData[base + 3] = p.size;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);
    };

    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * ratio);
      canvas.height = Math.round(cssH * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      updateCoverMapping(cssW, cssH);
    };

    syncSize();

    const volumeLoc = {
      aPosition: gl.getAttribLocation(volumeProg, 'aPosition'),
      aUv: gl.getAttribLocation(volumeProg, 'aUv'),
      uTime: gl.getUniformLocation(volumeProg, 'uTime'),
      uStatic: gl.getUniformLocation(volumeProg, 'uStatic'),
      uCoverScale: gl.getUniformLocation(volumeProg, 'uCoverScale'),
      uCoverOffset: gl.getUniformLocation(volumeProg, 'uCoverOffset'),
    };

    const particleLoc = {
      aPosition: gl.getAttribLocation(particleProg, 'aPosition'),
      aAlpha: gl.getAttribLocation(particleProg, 'aAlpha'),
      aSize: gl.getAttribLocation(particleProg, 'aSize'),
    };

    const renderFrame = (rawElapsed: number) => {
      const elapsed = hasFixedTime ? fixedTimeValue : Math.max(0, rawElapsed);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // Pass 1: Unified Cohesive Volumetric Cooling Field
      gl.useProgram(volumeProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(volumeLoc.aPosition);
      gl.vertexAttribPointer(volumeLoc.aPosition, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(volumeLoc.aUv);
      gl.vertexAttribPointer(volumeLoc.aUv, 2, gl.FLOAT, false, 16, 8);

      gl.uniform1f(volumeLoc.uTime, elapsed);
      gl.uniform1f(volumeLoc.uStatic, modeParam === 'static' ? 1.0 : 0.0);
      gl.uniform2f(volumeLoc.uCoverScale, coverScale[0], coverScale[1]);
      gl.uniform2f(volumeLoc.uCoverOffset, coverOffset[0], coverOffset[1]);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(volumeLoc.aPosition);
      gl.disableVertexAttribArray(volumeLoc.aUv);

      // Pass 2: Sparse, Ultra-Subtle Atmospheric Micro-Motes
      updateParticles(elapsed);
      gl.useProgram(particleProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      const pStride = 16;
      gl.enableVertexAttribArray(particleLoc.aPosition);
      gl.vertexAttribPointer(particleLoc.aPosition, 2, gl.FLOAT, false, pStride, 0);
      gl.enableVertexAttribArray(particleLoc.aAlpha);
      gl.vertexAttribPointer(particleLoc.aAlpha, 1, gl.FLOAT, false, pStride, 8);
      gl.enableVertexAttribArray(particleLoc.aSize);
      gl.vertexAttribPointer(particleLoc.aSize, 1, gl.FLOAT, false, pStride, 12);

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
      gl.disableVertexAttribArray(particleLoc.aPosition);
      gl.disableVertexAttribArray(particleLoc.aAlpha);
      gl.disableVertexAttribArray(particleLoc.aSize);
    };

    const startTime = performance.now();

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      renderFrame((performance.now() - startTime) * 0.001);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let isVisible = true;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(container);

    const animate = (now: number) => {
      if (isVisible) {
        renderFrame(Math.max(0, (now - startTime) * 0.001));
      }
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    renderFrame(fixedTimeValue);
    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(particleBuffer);
      gl.deleteProgram(volumeProg);
      gl.deleteProgram(particleProg);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className={`mn-hero-airflow ${styles.airflow}`} aria-hidden="true" />;
}
