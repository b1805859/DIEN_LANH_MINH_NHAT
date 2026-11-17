'use client';

import { useEffect, useRef, useState } from 'react';
import type { MotionBudget } from '@/components/ui/use-motion-budget';
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

const LEGACY_IMAGE_ASPECT = 1661 / 947;
const FINDER_IMAGE_ASPECT = 1660 / 947;
const MOCKUP_IMAGE_ASPECT = 1620 / 540;

// Match the outlet tangent before gradually turning into the room.
// The shader and particles use the same upper boundary.
const FINDER_TURN = { slope: (0.8543 - 0.7656) / (0.9494 - 0.8638), downstream: 0.22, length: 0.065 };
function finderUpperEdge(x: number) {
  const distance = Math.max(0, 0.8638 - x);
  return x >= 0.8638
    ? 0.7656 + (x - 0.8638) * FINDER_TURN.slope
    : 0.7656 - FINDER_TURN.downstream * distance
      - (FINDER_TURN.slope - FINDER_TURN.downstream) * FINDER_TURN.length
      * (1 - Math.exp(-distance / FINDER_TURN.length));
}

// Shared continuous lower edge for the finder mist and particle streamlines.
// Broaden the room-side fan without moving its origin or the upper vent tangent.
// Both the mist shader and particle paths consume this same expansion.
const FINDER_FAN = { slope: 0.96, spread: 0.78, expansion: 5.2, floor: 0.035 };
function finderLowerEdge(x: number) {
  const distance = Math.max(0, 0.9494 - x);
  return Math.max(
    FINDER_FAN.floor,
    0.8268 - FINDER_FAN.slope * distance -
      FINDER_FAN.spread * (1 - Math.exp(-FINDER_FAN.expansion * distance)),
  );
}

// Home mockup louver fan coordinates (`hero-mockup-v4.jpg` 1620x540):
// Indoor AC louver sits at top-right (x: 0.742..0.922, bottom-up y: 0.692..0.755).
function mockupUpperEdge(x: number) {
  const distance = Math.max(0, 0.745 - x);
  return x >= 0.745
    ? 0.708 + (Math.min(0.922, x) - 0.745) * 0.25
    : 0.708 - 0.26 * Math.pow(distance, 0.9);
}

function mockupLowerEdge(x: number) {
  const distance = Math.max(0, 0.922 - x);
  return Math.max(0.06, 0.715 - 0.85 * distance - 0.42 * (1 - Math.exp(-4.6 * distance)));
}

// ---------------------------------------------------------------------------
// 1. Divergence-Free 2D Curl Noise LUT (eliminates per-frame noise stalls)
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

const CURL_LUT_SIZE = 64;
const CURL_LUT_X = new Float32Array(CURL_LUT_SIZE * CURL_LUT_SIZE);
const CURL_LUT_Y = new Float32Array(CURL_LUT_SIZE * CURL_LUT_SIZE);
(() => {
  const eps = 0.04;
  for (let iy = 0; iy < CURL_LUT_SIZE; iy++) {
    for (let ix = 0; ix < CURL_LUT_SIZE; ix++) {
      const gx = (ix / CURL_LUT_SIZE) * 8.0;
      const gy = (iy / CURL_LUT_SIZE) * 8.0;
      const dPsiDy = (smoothNoise2D(gx, gy + eps) - smoothNoise2D(gx, gy - eps)) / (2.0 * eps);
      const dPsiDx = (smoothNoise2D(gx + eps, gy) - smoothNoise2D(gx - eps, gy)) / (2.0 * eps);
      const idx = iy * CURL_LUT_SIZE + ix;
      CURL_LUT_X[idx] = dPsiDy;
      CURL_LUT_Y[idx] = -dPsiDx;
    }
  }
})();

function sampleCurlLUT(x: number, y: number): [number, number] {
  const u = (((x * 8.0) % CURL_LUT_SIZE) + CURL_LUT_SIZE) % CURL_LUT_SIZE;
  const v = (((y * 8.0) % CURL_LUT_SIZE) + CURL_LUT_SIZE) % CURL_LUT_SIZE;
  const x0 = Math.floor(u) & (CURL_LUT_SIZE - 1);
  const y0 = Math.floor(v) & (CURL_LUT_SIZE - 1);
  const idx = y0 * CURL_LUT_SIZE + x0;
  return [CURL_LUT_X[idx], CURL_LUT_Y[idx]];
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
// volume to flow continuously behind the foreground technician (hero-technician-focus-mask.svg).
float subjectMask(vec2 imgUv) {
  // Home mockup uses a soft organic arc so cooling mist curls gently around the room without hard edges
  if (uMockup > 0.5) {
    float curveShift = 0.085 * smoothstep(0.16, 0.86, imgUv.y);
    float leftFade = smoothstep(0.24 + curveShift, 0.54 + curveShift, imgUv.x);
    float topFade = 1.0 - smoothstep(0.83, 0.96, imgUv.y);
    float botFade = smoothstep(0.03, 0.15, imgUv.y);
    return leftFade * topFade * botFade;
  }
  // Finder subjects are protected by the source-aligned foreground contour.
  // Do not retain the legacy family's invisible holes or bottom service-bar fade.
  if (uFinder > 0.5) {
    return smoothstep(0.0, 0.025, imgUv.x) * smoothstep(0.0, 0.025, imgUv.y);
  }
  float nx = imgUv.x;
  float ny = 1.0 - imgUv.y; // top-down y [0..1]
  vec2 p = vec2(nx, ny);

  // 1. Complete Family Protection (Father, Mother, Boy, Girl — heads, hair, shirts,
  //    mother's extended arm on sofa backrest, laps, trousers, legs, and bare feet).
  //    Note: Technician is NOT masked out here so the airflow volume passes continuously
  //    right behind his head, hair, ear, neck, and right shoulder, and is naturally
  //    occluded by hero-technician-focus-mask.svg (z-index: 8).
  float dFatherHead  = length((p - vec2(0.316, 0.554)) / vec2(0.027, 0.047));
  float dMotherHead  = length((p - vec2(0.373, 0.576)) / vec2(0.030, 0.045));
  float dFamTorsos   = length((p - vec2(0.368, 0.665)) / vec2(0.080, 0.085));
  float dMotherArm   = sdSegment(p, vec2(0.398, 0.605), vec2(0.457, 0.596)) / 0.016;
  float dFatherLegs  = sdSegment(p, vec2(0.393, 0.720), vec2(0.478, 0.795)) / 0.044;
  float dMotherLegs  = sdSegment(p, vec2(0.440, 0.687), vec2(0.512, 0.758)) / 0.036;

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
  float bottomBarKeep = (1.0 - smoothstep(0.822, 0.862, ny));
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
uniform float uFinder;
uniform float uMockup;
uniform vec2 uPointer;
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

  // AC louver slot segment in bottom-up UV:
  vec2 topA = (uMockup > 0.5) ? vec2(0.745, 0.708) : vec2(0.8638, 0.7656);
  vec2 topB = (uMockup > 0.5) ? vec2(0.922, 0.752) : vec2(0.9494, 0.8543);
  vec2 botA = (uMockup > 0.5) ? vec2(0.752, 0.678) : vec2(0.8735, 0.7381);
  vec2 botB = (uMockup > 0.5) ? vec2(0.925, 0.722) : vec2(0.9542, 0.8268);
  float louverSlope = (topB.y - topA.y) / (topB.x - topA.x);

  // Right boundary of the jet: emerges strictly from topB and angles down-left
  // so airflow never touches or bleeds onto the right wall beside the AC
  float rightEdgeX = topB.x - (topB.y - min(topB.y, imgUv.y)) * 0.09;
  float rightWallMask = 1.0 - smoothstep(rightEdgeX - 0.010, rightEdgeX + 0.012, imgUv.x);

  // Upper boundary of the jet:
  float dxFromA = max(0.0, topA.x - imgUv.x);
  float yHigh = (imgUv.x >= topA.x)
    ? (topA.y + (imgUv.x - topA.x) * louverSlope)
    : (uMockup > 0.5
        ? (topA.y - 0.26 * pow(dxFromA, 0.90))
        : (topA.y - 0.22 * pow(dxFromA, 0.88)));

  if (uFinder > 0.5 && uMockup < 0.5 && imgUv.x < topA.x) {
    yHigh = topA.y - ${FINDER_TURN.downstream} * dxFromA
      - (${FINDER_TURN.slope} - ${FINDER_TURN.downstream}) * ${FINDER_TURN.length}
      * (1.0 - exp(-dxFromA / ${FINDER_TURN.length}));
  }

  // Upper ceiling boundary feather
  float ventCeilingMask = 1.0 - smoothstep(yHigh, yHigh + mix(0.015, 0.008, uFinder), imgUv.y);
  if (ventCeilingMask * rightWallMask < 0.002) {
    discard;
  }

  // Lower boundary of the jet:
  float tVent = clamp((imgUv.x - topA.x) / (topB.x - topA.x), 0.0, 1.0);
  float louverBotY = mix(botA.y, botB.y, tVent);
  float floorY = 0.05;
  float yLow = (imgUv.x >= topA.x)
    ? (louverBotY - (1.0 - tVent) * 0.40)
    : (floorY + (botA.y - 0.40 - floorY) * exp(-8.5 * dxFromA));

  if (uMockup > 0.5) {
    float distance = max(0.0, topB.x - imgUv.x);
    yLow = max(0.06, botB.y - 0.85 * distance - 0.42 * (1.0 - exp(-4.6 * distance)));
  } else if (uFinder > 0.5) {
    float distance = max(0.0, topB.x - imgUv.x);
    yLow = max(${FINDER_FAN.floor}, botB.y - ${FINDER_FAN.slope} * distance
      - ${FINDER_FAN.spread} * (1.0 - exp(-${FINDER_FAN.expansion.toFixed(1)} * distance)));
  }
  float span = max(0.042, yHigh - yLow);
  float v = (imgUv.y - yLow) / span; // 0 at lower boundary -> 1 at upper boundary

  if (imgUv.y > yHigh + 0.015 || v < -0.25) {
    discard;
  }

  // Progression distance s from the AC vent across the room [0 at vent -> 1 at far left/floor]
  float dxVent = max(0.0, topB.x - imgUv.x);
  float dyVent = max(0.0, topB.y - imgUv.y);
  float radialDist = length(vec2(dxVent * 0.88, dyVent * 0.92));
  float s = clamp(radialDist / 0.85, 0.0001, 1.0);

  // Centerline of the physical AC louver slot for the core jet
  vec2 midA = (topA + botA) * 0.5;
  vec2 midB = (topB + botB) * 0.5;
  vec2 ab = midB - midA;
  float h = clamp(dot(imgUv - midA, ab) / dot(ab, ab), 0.0, 1.0);
  vec2 proj = midA + h * ab;
  float distFromSlot = length((imgUv - proj) * vec2(1.0, 1.30));

  // Calm, continuous advection clock (~12-second full room traversal cycle)
  float t = (uStatic > 0.5) ? 0.0 : uTime;
  float flowPhase = t * 0.082;

  // Very subtle, low-frequency edge breathing (amplitude <= 0.012 in screen Y so outer silhouette remains stable)
  float edgeNoise = fbmGas(vec2(s * 1.5 - flowPhase * 0.75, v * 1.4 + 2.1));

  // Physical-distance upper feather so the fan stays full right up to the louver slot and upper curtain/tree
  float distBelowTop = (yHigh - imgUv.y) + edgeNoise * 0.012 * smoothstep(0.03, 0.28, s);
  float upperFeather = smoothstep(mix(-0.012, 0.0, uFinder), mix(0.030, 0.055, uFinder), distBelowTop);
  float lowerFeather = smoothstep(mix(-0.06, 0.0, uFinder), mix(0.12, 0.24, uFinder), v + edgeNoise * 0.025);
  float crossSection = sqrt(max(0.0, 4.0 * v * (1.0 - v)));
  float fanCrossSection = upperFeather * lowerFeather * mix(1.0, crossSection, uFinder);

  // Longitudinal density falloff: retain the visible cooling field farther across the room.
  float roomDecay = mix(
    1.0 - smoothstep(0.40, 0.98, s) * 0.30,
    exp(-0.62 * s) * (1.0 - smoothstep(0.84, 1.0, s) * 0.86), uFinder);
  float primaryFanVolume = fanCrossSection * roomDecay;

  // Dedicated core jet emission right inside and emerging from the louver mouth
  float louverJet = exp(-distFromSlot * distFromSlot * mix(320.0, 1200.0, uFinder)) * (1.0 - smoothstep(topB.x - 0.015, topB.x + 0.005, imgUv.x));

  // Keep the vent highlight inside the same feathered envelope, so it cannot
  // leave a hard curved ledge where the free airflow meets the outlet.
  louverJet *= mix(1.0, upperFeather * lowerFeather, uFinder);

  // Broad living room & curtain cooling mist:
  // Fills the space behind technician and across the curtain & sofa without creating hard cuts
  float livingRoomMist = smoothstep(0.40, 0.65, imgUv.x) * (1.0 - smoothstep(0.80, 0.92, imgUv.x))
                       * smoothstep(0.10, 0.28, imgUv.y) * (1.0 - smoothstep(0.48, 0.72, imgUv.y)) * 0.35 * rightWallMask;

  // Dedicated behind-technician cooling stream reinforcement:
  // Visible behind the technician's head, ear, and neck (x: 0.78..0.915)
  // strictly contained by rightWallMask so it never spills onto the blank right wall
  float behindTechX = smoothstep(0.78, 0.83, imgUv.x) * (1.0 - smoothstep(0.905, 0.925, imgUv.x));
  float behindTechY = smoothstep(0.35, 0.45, imgUv.y) * (1.0 - smoothstep(0.58, 0.70, imgUv.y));
  float behindTechBoost = behindTechX * behindTechY * 0.22 * rightWallMask;

  // Lower-Room & Sofa Cooling Diffusion Pool:
  // Cold air settles gently around the lower sofa base, coffee table, and rug/floor
  float poolX = smoothstep(0.12, 0.26, imgUv.x) * (1.0 - smoothstep(0.55, 0.75, imgUv.x));
  float poolY = smoothstep(0.02, 0.08, imgUv.y) * (1.0 - smoothstep(0.16, 0.24, imgUv.y));
  float floorDiffusionPool = poolX * poolY * 0.12;

  // Seamlessly unify the primary fan volume, louver jet, living room mist, and floor pool
  // Finder air disperses from the vent; avoid disconnected bright patches
  // behind the head and an artificial glowing pool on the rug.
  livingRoomMist *= 1.0 - uFinder;
  behindTechBoost *= 1.0 - uFinder;
  floorDiffusionPool *= 1.0 - uFinder;
  float unifiedEnvelope = clamp(
    primaryFanVolume * 0.88 + louverJet * 0.72 + livingRoomMist + behindTechBoost + floorDiffusionPool,
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
  float pointerBoost = (uPointer.x >= 0.0)
    ? (1.0 - smoothstep(0.0, 0.28, length((vUv - uPointer) * vec2(1.4, 1.0)))) * 0.24
    : 0.0;
  float currentWeight = (1.0 - smoothstep(0.15, 0.85, s)) * 0.16;
  float internalDensity = 0.76 + 0.16 * layerMist + currentWeight * layerCurrents + 0.08 * layerDeep + pointerBoost;

  // Final volumetric alpha with family & UI occlusion mask
  float finderOrMockup = max(uFinder, uMockup);
  float furnitureClarity = mix(mix(0.025, 1.0, finderOrMockup), 1.0, smoothstep(0.32, 0.60, imgUv.y));
  float windowFocus = mix(mix(0.20, 1.0, finderOrMockup), 1.0, smoothstep(0.30, 0.70, imgUv.x));
  float rawAlpha = unifiedEnvelope * internalDensity * ventCeilingMask * rightWallMask * subjectMask(imgUv)
                 * furnitureClarity * windowFocus;
  float maxAlpha = (uMockup > 0.5) ? 0.62 : mix(0.66, 0.50, uFinder);
  float alpha = clamp(rawAlpha * mix(0.76, 0.72, uFinder) * (1.0 + pointerBoost * 0.55), 0.0, maxAlpha);

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
  float lowerRoomLift = (1.0 - smoothstep(0.16, 0.38, imgUv.y)) * 0.05;
  float highlightMix = clamp(
    layerCurrents * (1.0 - 0.45 * s) * 0.55 + layerMist * 0.32 + lowerRoomLift + louverJet * 0.45,
    0.0,
    1.0
  );
  vec3 color = mix(deepCoolingCyan, midAirflowCyan, smoothstep(0.06, 0.62, unifiedEnvelope + lowerRoomLift));
  color = mix(color, softIceMist, highlightMix * mix(0.72, 0.50, uFinder));
  color = mix(color, vec3(0.42, 0.88, 0.98), uFinder * 0.14);

  // Premultiplied RGB and alpha must use the same coverage. The old
  // reduced alpha added light to the furniture and washed out the vent.
  gl_FragColor = vec4(color * alpha, alpha * mix(0.82, 1.0, uFinder));
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
uniform float uFinder;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float r2 = dot(p, p) * 4.0;
  if (r2 > 1.0) discard;

  // Crisp micro-mote core with soft icy halo
  float core = exp(-r2 * 2.8);
  float halo = (1.0 - r2) * 0.72;
  float rays = exp(-abs(p.x) * 36.0 - abs(p.y) * 5.0)
             + exp(-abs(p.y) * 36.0 - abs(p.x) * 5.0);
  float sparkle = rays * uFinder * smoothstep(0.45, 0.85, vAlpha) * 0.38;
  float a = clamp(core * 0.85 + halo * 0.50 + sparkle, 0.0, 1.0) * vAlpha;
  vec3 col = mix(vec3(0.52, 0.90, 1.00), vec3(0.92, 0.99, 1.00), core);
  gl_FragColor = vec4(col * a, a * 0.78);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
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

export function HeroAirflow({
  composition = 'legacy',
  budget = 'reduced',
  showToggle = true,
  compactFinder = false,
  externalPaused,
}: {
  composition?: 'legacy' | 'finder' | 'mockup';
  budget?: MotionBudget;
  showToggle?: boolean;
  compactFinder?: boolean;
  externalPaused?: boolean;
}) {
  const [internalPaused, setInternalPaused] = useState(false);
  const paused = externalPaused ?? internalPaused;
  const [automaticStatic, setAutomaticStatic] = useState(false);
  const [hasBox, setHasBox] = useState(false);
  const finder = composition === 'finder';
  const mockup = composition === 'mockup';
  const canAnimate = budget === 'full' || ((finder || mockup) && compactFinder && budget === 'limited');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const rect = container.getBoundingClientRect();
      const visible = rect.width > 2 && rect.height > 2;
      setHasBox((prev) => (prev === visible ? prev : visible));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !hasBox) return;

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('airflow');
    if (modeParam === 'off') return;

    const fixedTimeParam = params.get('t');
    const hasFixedTime = fixedTimeParam !== null && !Number.isNaN(parseFloat(fixedTimeParam));
    const fixedTimeValue = hasFixedTime ? parseFloat(fixedTimeParam!) : 0;

    const reducedMotion =
      !canAnimate || paused || automaticStatic ||
      modeParam === 'static' ||
      hasFixedTime ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    });
    if (!gl) {
      return;
    }

    const volumeProg = createProgram(gl, UNIFIED_VOLUME_VERT, UNIFIED_VOLUME_FRAG);
    const particleProg = createProgram(gl, PARTICLE_VERT, PARTICLE_FRAG);
    if (!volumeProg || !particleProg) {
      if (volumeProg) gl.deleteProgram(volumeProg);
      if (particleProg) gl.deleteProgram(particleProg);
      return;
    }

    const coverScale: [number, number] = [1, 1];
    const coverOffset: [number, number] = [0, 0];
    const compactViewport = window.matchMedia('(max-width: 800px)');
    const limited = budget === 'limited' && canAnimate;

    const updateCoverMapping = (width: number, height: number) => {
      const viewAspect = width / Math.max(height, 1);
      const imageAspect = mockup
        ? MOCKUP_IMAGE_ASPECT
        : finder
          ? FINDER_IMAGE_ASPECT
          : LEGACY_IMAGE_ASPECT;
      if (viewAspect > imageAspect) {
        coverScale[0] = 1.0;
        coverScale[1] = imageAspect / viewAspect;
        coverOffset[0] = 0.0;
        coverOffset[1] = (1.0 - coverScale[1]) * 0.5;
      } else {
        coverScale[0] = viewAspect / imageAspect;
        coverScale[1] = 1.0;
        const mobileFocus = mockup
          ? compactViewport.matches
            ? 0.86
            : 0.78
          : compactFinder && compactViewport.matches
            ? parseFloat(getComputedStyle(container).getPropertyValue('--finder-mobile-focus')) / 100
            : 0.5;
        coverOffset[0] = (1.0 - coverScale[0]) * (Number.isFinite(mobileFocus) ? mobileFocus : 0.5);
        coverOffset[1] = 0.0;
      }
    };

    // 1. Fullscreen Quad for Unified Volumetric Cooling Field
    const quadData = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

    // 2. Area-scaled cooling micro-motes (balanced count + Curl LUT = 60fps zero Long Tasks)
    const MAX_PARTICLES = 320;
    const REFERENCE_AREA = 1280 * 666;
    let particleCount = MAX_PARTICLES;
    let particleSizeScale = 1;
    let pixelRatio = 1;
    const particleData = new Float32Array(MAX_PARTICLES * 4);
    const particleBuffer = gl.createBuffer();

    const targetPointer: [number, number] = [-1, -1];
    const smoothPointer: [number, number] = [-1, -1];

    const particles = Array.from({ length: MAX_PARTICLES }, (_, i) => {
      const h1 = (0.19 + i * 0.61803398875) % 1;
      const h2 = (finder || mockup) ? hash2D(i, 53) : (0.43 + i * 0.75487766625) % 1;
      const h3 = (finder || mockup) ? hash2D(i, 97) : (0.61 + i * 0.56984029099) % 1;
      const h4 = (0.29 + i * 0.43844718719) % 1;
      return {
        u0: h1,
        vBand: 0.03 + h2 * 0.92,
        speed: 0.042 + h3 * 0.038,
        baseAlpha: (finder || mockup) ? 0.72 + h4 * 0.28 : 0.58 + h4 * 0.36,
        size: (finder || mockup) ? 2.2 + h3 * 2.5 : 2.0 + h3 * 2.5,
      };
    });

    const updateParticles = (elapsed: number) => {
      const t = Math.max(0, elapsed);
      const topAx = mockup ? 0.745 : 0.8638;
      const topAy = mockup ? 0.708 : 0.7656;
      const topBx = mockup ? 0.922 : 0.9494;
      const topBy = mockup ? 0.752 : 0.8543;
      const botAy = mockup ? 0.678 : 0.7381;
      const botBy = mockup ? 0.722 : 0.8268;
      const louverSlope = (topBy - topAy) / (topBx - topAx);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const linearS = (((p.u0 + t * p.speed) % 1.0) + 1.0) % 1.0;
        const s = Math.pow(linearS, 0.86);

        const imgX = topBx - s * (mockup ? 0.68 : finder ? 0.95 : 0.78);
        let yHigh = topBy;
        let yLow = 0.05;

        if (mockup) {
          yHigh = mockupUpperEdge(imgX);
          yLow = mockupLowerEdge(imgX);
        } else if (finder) {
          yHigh = finderUpperEdge(imgX);
          yLow = finderLowerEdge(imgX);
        } else if (imgX >= topAx) {
          yHigh = topAy + (imgX - topAx) * louverSlope;
          const tVent = Math.min(1.0, Math.max(0.0, (imgX - topAx) / (topBx - topAx)));
          const louverBotY = botAy + tVent * (botBy - botAy);
          yLow = louverBotY - (1.0 - tVent) * 0.40;
        } else {
          const dxFromA = topAx - imgX;
          yHigh = topAy - 0.22 * Math.pow(dxFromA, 0.88);
          yLow = 0.05 + (botAy - 0.40 - 0.05) * Math.exp(-8.5 * dxFromA);
        }
        const baseImgY = yLow + (yHigh - yLow) * p.vBand;

        const [curlX, curlY] = sampleCurlLUT(imgX * 4.5 - t * 0.2, baseImgY * 4.5 + i * 0.37);
        const eddy = (finder ? 0.004 : mockup ? 0.008 : 0.014) * Math.min(1.0, s * 2.2);
        let imgXFinal = imgX + curlX * eddy;
        let imgYFinal = baseImgY + curlY * eddy;

        if (smoothPointer[0] >= 0) {
          const pImgX = smoothPointer[0] * coverScale[0] + coverOffset[0];
          const pImgY = smoothPointer[1] * coverScale[1] + coverOffset[1];
          const dx = imgXFinal - pImgX;
          const dy = imgYFinal - pImgY;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0.0001 && d2 < 0.045) {
            const push = (1.0 - d2 / 0.045) * 0.018;
            imgXFinal += (dx / Math.sqrt(d2)) * push;
            imgYFinal += (dy / Math.sqrt(d2)) * push;
          }
        }

        const rightEdgeX = topBx - (topBy - Math.min(topBy, imgYFinal)) * 0.10;
        const outsideRight = imgXFinal > rightEdgeX + 0.005;

        const ny = 1.0 - imgYFinal;
        const inFamily =
          !finder && !mockup &&
          (Math.hypot((imgXFinal - 0.316) / 0.032, (ny - 0.554) / 0.052) < 1.0 ||
            Math.hypot((imgXFinal - 0.373) / 0.035, (ny - 0.576) / 0.05) < 1.0 ||
            Math.hypot((imgXFinal - 0.368) / 0.085, (ny - 0.665) / 0.09) < 1.0 ||
            distToSegment2D(imgXFinal, ny, 0.398, 0.605, 0.457, 0.596) < 0.02 ||
            distToSegment2D(imgXFinal, ny, 0.393, 0.72, 0.478, 0.795) < 0.048 ||
            distToSegment2D(imgXFinal, ny, 0.44, 0.687, 0.512, 0.758) < 0.04);

        const mockupLeftFade = mockup ? Math.min(1, Math.max(0, (imgXFinal - 0.28) / 0.18)) : 1;
        const pulse = 0.5 + 0.5 * Math.sin(t * (1.4 + (i % 7) * 0.12) + i * 1.73);
        const twinkle = (finder || mockup)
          ? 0.65 + 0.35 * Math.pow(pulse, 3)
          : 0.88 + 0.12 * Math.sin(t * 2.1 + i * 1.73);

        const clipX = ((imgXFinal - coverOffset[0]) / coverScale[0]) * 2.0 - 1.0;
        const clipY = ((imgYFinal - coverOffset[1]) / coverScale[1]) * 2.0 - 1.0;
        const entryFade = Math.min(1.0, s * 22.0);
        const exitFade = (finder || mockup)
          ? 1.0 - Math.min(1.0, Math.max(0.0, (s - 0.92) / 0.08))
          : 1.0 - Math.min(1.0, Math.max(0.0, (s - 0.65) / 0.32));
        const band = (imgYFinal - yLow) / Math.max(0.042, yHigh - yLow);
        const edgeFade = (finder || mockup)
          ? Math.max(0, Math.min(1, band / 0.16, (1 - band) / 0.16))
          : 1;
        const dispersion = (finder || mockup) ? Math.exp(-0.22 * s) : 1;
        const envelope = (inFamily || outsideRight) ? 0.0
          : entryFade * exitFade * twinkle * edgeFade * dispersion * mockupLeftFade;

        const base = i * 4;
        particleData[base] = clipX;
        particleData[base + 1] = clipY;
        particleData[base + 2] = Math.min(1, p.baseAlpha * envelope * ((finder || mockup) ? 1.9 : 1));
        particleData[base + 3] =
          p.size * pixelRatio * particleSizeScale * (finder ? 1.05 : 1);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particleData.subarray(0, particleCount * 4), gl.DYNAMIC_DRAW);
    };

    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      // The mist is deliberately soft: a bounded render surface avoids spending
      // millions of fragment-shader invocations on high-DPI and ultrawide screens.
      const maxPixels = limited ? 85_000 : 450_000;
      const ratio = Math.min(window.devicePixelRatio || 1, 1, Math.sqrt(maxPixels / (cssW * cssH)));
      pixelRatio = ratio;
      // Keep particle density tied to visible CSS area, not device resolution.
      // The small mobile room must not squeeze the desktop's entire particle field into it.
      particleCount = Math.max(
        1,
        Math.min(MAX_PARTICLES, Math.round((MAX_PARTICLES * cssW * cssH) / REFERENCE_AREA)),
      );
      particleSizeScale = Math.max(0.8, Math.min(1, cssW / 1280));
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
      uFinder: gl.getUniformLocation(volumeProg, 'uFinder'),
      uMockup: gl.getUniformLocation(volumeProg, 'uMockup'),
      uPointer: gl.getUniformLocation(volumeProg, 'uPointer'),
      uCoverScale: gl.getUniformLocation(volumeProg, 'uCoverScale'),
      uCoverOffset: gl.getUniformLocation(volumeProg, 'uCoverOffset'),
    };

    const particleLoc = {
      aPosition: gl.getAttribLocation(particleProg, 'aPosition'),
      aAlpha: gl.getAttribLocation(particleProg, 'aAlpha'),
      aSize: gl.getAttribLocation(particleProg, 'aSize'),
      uFinder: gl.getUniformLocation(particleProg, 'uFinder'),
    };

    const renderFrame = (rawElapsed: number) => {
      const elapsed = hasFixedTime ? fixedTimeValue : Math.max(0, rawElapsed);
      if (smoothPointer[0] >= 0 && targetPointer[0] >= 0) {
        smoothPointer[0] += (targetPointer[0] - smoothPointer[0]) * 0.14;
        smoothPointer[1] += (targetPointer[1] - smoothPointer[1]) * 0.14;
      } else {
        smoothPointer[0] = targetPointer[0];
        smoothPointer[1] = targetPointer[1];
      }
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
      gl.uniform1f(volumeLoc.uFinder, finder ? 1 : 0);
      gl.uniform1f(volumeLoc.uMockup, mockup ? 1 : 0);
      gl.uniform1f(volumeLoc.uStatic, modeParam === 'static' ? 1.0 : 0.0);
      gl.uniform2f(volumeLoc.uPointer, smoothPointer[0], smoothPointer[1]);
      gl.uniform2f(volumeLoc.uCoverScale, coverScale[0], coverScale[1]);
      gl.uniform2f(volumeLoc.uCoverOffset, coverOffset[0], coverOffset[1]);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(volumeLoc.aPosition);
      gl.disableVertexAttribArray(volumeLoc.aUv);

      // Pass 2: Atmospheric micro-motes following the same fan bounds
      updateParticles(elapsed);
      gl.useProgram(particleProg);
      gl.uniform1f(particleLoc.uFinder, finder || mockup ? 1 : 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      const pStride = 16;
      gl.enableVertexAttribArray(particleLoc.aPosition);
      gl.vertexAttribPointer(particleLoc.aPosition, 2, gl.FLOAT, false, pStride, 0);
      gl.enableVertexAttribArray(particleLoc.aAlpha);
      gl.vertexAttribPointer(particleLoc.aAlpha, 1, gl.FLOAT, false, pStride, 8);
      gl.enableVertexAttribArray(particleLoc.aSize);
      gl.vertexAttribPointer(particleLoc.aSize, 1, gl.FLOAT, false, pStride, 12);

      gl.drawArrays(gl.POINTS, 0, particleCount);
      gl.disableVertexAttribArray(particleLoc.aPosition);
      gl.disableVertexAttribArray(particleLoc.aAlpha);
      gl.disableVertexAttribArray(particleLoc.aSize);
    };

    const pointerTargetEl = container.parentElement ?? container;
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetPointer[0] = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      targetPointer[1] = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      if (smoothPointer[0] < 0) {
        smoothPointer[0] = targetPointer[0];
        smoothPointer[1] = targetPointer[1];
      }
    };
    const onPointerLeave = () => {
      targetPointer[0] = -1;
      targetPointer[1] = -1;
    };
    pointerTargetEl.addEventListener('pointermove', onPointerMove, { passive: true });
    pointerTargetEl.addEventListener('pointerleave', onPointerLeave, { passive: true });

    let rafId = 0;
    let isVisible = true;
    let elapsed = fixedTimeValue;
    let previous = 0;
    let lastRender = 0;
    let samples = 0;
    let slowFrames = 0;
    const mountedAt = performance.now();
    const animate = (now: number) => {
      rafId = 0;
      if (!isVisible || document.hidden || reducedMotion) return;
      if (previous) {
        const delta = now - previous;
        elapsed += Math.min(delta, 50) * 0.001;
        if (now - mountedAt > 800) {
          samples++;
          if (delta > (limited ? 55 : 34)) slowFrames++;
          if (samples >= 35) {
            if (slowFrames > 14) {
              setAutomaticStatic(true);
              return;
            }
            samples = 0;
            slowFrames = 0;
          }
        }
      }
      previous = now;
      if (!limited || now - lastRender >= 32) {
        renderFrame(elapsed);
        lastRender = now;
      }
      rafId = window.requestAnimationFrame(animate);
    };
    const syncPlayback = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      previous = 0;
      if (isVisible && !document.hidden && !reducedMotion) rafId = requestAnimationFrame(animate);
    };
    const updateCrop = () => {
      syncSize();
      renderFrame(elapsed);
    };
    const resizeObserver = new ResizeObserver(updateCrop);
    resizeObserver.observe(container);
    if (compactFinder) compactViewport.addEventListener('change', updateCrop);
    const intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
      syncPlayback();
    }, { threshold: 0.02 });
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', syncPlayback);
    if (hasFixedTime || reducedMotion) {
      renderFrame(fixedTimeValue);
    } else {
      rafId = window.requestAnimationFrame(animate);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      pointerTargetEl.removeEventListener('pointermove', onPointerMove);
      pointerTargetEl.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();
      if (compactFinder) compactViewport.removeEventListener('change', updateCrop);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      gl.deleteBuffer(quadBuffer);
      gl.deleteBuffer(particleBuffer);
      gl.deleteProgram(volumeProg);
      gl.deleteProgram(particleProg);
    };
  }, [finder, mockup, budget, paused, automaticStatic, canAnimate, compactFinder, hasBox]);

  return (
    <>
      <div ref={containerRef} className={`mn-hero-airflow ${styles.airflow}`} aria-hidden="true"
        data-quality={!canAnimate || paused || automaticStatic ? 'static' : 'animated'}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
      {showToggle && canAnimate && !automaticStatic && (
        <button type="button" className="mn-airflow-toggle" aria-pressed={paused}
          onClick={() => setInternalPaused(value => !value)}>
          {paused ? 'Bật luồng gió' : 'Dừng luồng gió'}
        </button>
      )}
    </>
  );
}
