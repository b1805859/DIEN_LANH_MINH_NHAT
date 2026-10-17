'use client';

import { useEffect, useRef } from 'react';
import styles from './hero.module.css';

// Source hero image aspect ratio (1376 x 768) used by object-fit: cover
const IMAGE_ASPECT = 1376 / 768;

// ---------------------------------------------------------------------------
// Lightweight Catmull-Rom Spline Evaluator (`threejs-animation` trajectory math)
// ---------------------------------------------------------------------------
class CatmullRomSpline2D {
  private pts: Array<[number, number]>;
  constructor(points: Array<[number, number]>) {
    this.pts = points;
  }

  getPoint(t: number): [number, number] {
    const pts = this.pts;
    const n = pts.length - 1;
    const p = Math.max(0, Math.min(1, t)) * n;
    const intPoint = Math.min(Math.floor(p), n - 1);
    const weight = p - intPoint;

    const p0 = pts[Math.max(0, intPoint - 1)];
    const p1 = pts[intPoint];
    const p2 = pts[Math.min(n, intPoint + 1)];
    const p3 = pts[Math.min(n, intPoint + 2)];

    const w2 = weight * weight;
    const w3 = w2 * weight;

    const interpolate = (v0: number, v1: number, v2: number, v3: number) =>
      0.5 *
      (2 * v1 +
        (-v0 + v2) * weight +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * w2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * w3);

    return [
      interpolate(p0[0], p1[0], p2[0], p3[0]),
      interpolate(p0[1], p1[1], p2[1], p3[1]),
    ];
  }

  getTangent(t: number): [number, number] {
    const eps = 0.002;
    const a = this.getPoint(Math.max(0, t - eps));
    const b = this.getPoint(Math.min(1, t + eps));
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [dx / len, dy / len];
  }
}

// ---------------------------------------------------------------------------
// Shared GLSL 2D Simplex Noise & fBM (`shader-glsl` cookbook)
// ---------------------------------------------------------------------------
const GLSL_NOISE = /* glsl */ `
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

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    p = rot * p * 2.02 + vec2(13.7, 9.2);
    amp *= 0.5;
  }
  return value;
}
`;

// ---------------------------------------------------------------------------
// Pass 1: Full-Frame Flow-Map Advected Reference Airflow Shader (`shader-glsl`)
// ---------------------------------------------------------------------------
const FLOW_FIELD_VERT = /* glsl */ `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FLOW_FIELD_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform sampler2D uRefMap;
uniform float uTime;
uniform float uStatic;
uniform vec2 uCoverScale;
uniform vec2 uCoverOffset;

${GLSL_NOISE}

vec2 toImageUv(vec2 viewUv) {
  return viewUv * uCoverScale + uCoverOffset;
}

void main() {
  vec2 imgUv = toImageUv(vUv);
  if (imgUv.x < 0.0 || imgUv.x > 1.0 || imgUv.y < 0.0 || imgUv.y > 1.0) {
    discard;
  }

  vec2 ventCenter = vec2(0.878, 0.754);
  vec2 rel = imgUv - ventCenter;
  float dist = length(rel * vec2(1.0, 1.15));

  vec2 radialDir = normalize(rel + vec2(-0.001, -0.001));
  float lift = smoothstep(0.75, 0.25, imgUv.x) * 0.28;
  vec2 flowDir = normalize(vec2(radialDir.x - 0.18, radialDir.y + lift));
  vec2 normalDir = vec2(-flowDir.y, flowDir.x);
  float fanAngle = atan(-rel.y, -rel.x);

  if (uStatic > 0.5) {
    vec2 texUv = vec2(imgUv.x, 1.0 - imgUv.y);
    vec4 refSample = texture2D(uRefMap, texUv);
    if (refSample.a < 0.005) discard;
    gl_FragColor = vec4(refSample.rgb, refSample.a);
    return;
  }

  float ventAnchor = smoothstep(0.015, 0.14, dist);

  float cycleSpeed = 0.22;
  float phase0 = fract(uTime * cycleSpeed);
  float phase1 = fract(uTime * cycleSpeed + 0.5);
  float blendW = abs(2.0 * phase0 - 1.0);

  float wave0 = fbm(vec2(dist * 7.5 - phase0 * 2.2, fanAngle * 4.5 + uTime * 0.18));
  float wave1 = fbm(vec2(dist * 7.5 - phase1 * 2.2 + 4.1, fanAngle * 4.5 + uTime * 0.18 + 2.7));

  float advectAmp = 0.046 * ventAnchor;
  float swayAmp   = 0.0075 * ventAnchor;

  vec2 uv0 = imgUv - flowDir * ((phase0 - 0.32) * advectAmp) + normalDir * (wave0 * swayAmp);
  vec2 uv1 = imgUv - flowDir * ((phase1 - 0.32) * advectAmp) + normalDir * (wave1 * swayAmp);

  vec4 samp0 = texture2D(uRefMap, vec2(uv0.x, 1.0 - uv0.y));
  vec4 samp1 = texture2D(uRefMap, vec2(uv1.x, 1.0 - uv1.y));
  vec4 baseSample = texture2D(uRefMap, vec2(imgUv.x, 1.0 - imgUv.y));

  vec4 advected = mix(samp0, samp1, blendW);
  vec3 flowRgb = mix(advected.rgb, baseSample.rgb, 0.22);
  float flowAlpha = mix(advected.a, baseSample.a, 0.28);

  if (flowAlpha < 0.004) discard;

  float streamCoord = dist * 24.0 - uTime * 2.85 + fanAngle * 3.0;
  float fineStream  = dist * 42.0 - uTime * 4.10 - fanAngle * 5.5;
  float noiseMod    = fbm(vec2(dist * 10.0 - uTime * 0.95, fanAngle * 8.0));

  float pulsePrimary   = 0.5 + 0.5 * sin(streamCoord + noiseMod * 2.4);
  float pulseSecondary = 0.5 + 0.5 * sin(fineStream  + noiseMod * 1.8);
  float silkWave = mix(pulsePrimary, pulseSecondary, 0.42);

  float alphaMod = mix(0.76, 1.22, silkWave);
  float highlightBand = pow(silkWave, 3.0) * smoothstep(0.08, 0.45, flowAlpha) * (1.0 - smoothstep(0.62, 0.85, dist));

  vec3 iceHighlight = vec3(0.78, 0.97, 1.0);
  vec3 finalColor = mix(flowRgb, iceHighlight, highlightBand * 0.36);
  float finalAlpha = clamp(flowAlpha * alphaMod, 0.0, 0.96);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

// ---------------------------------------------------------------------------
// Pass 2: Curved Spline Ribbon Shader (`threejs-animation` + `shader-glsl`)
// ---------------------------------------------------------------------------
const RIBBON_VERT = /* glsl */ `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;
uniform float uTime;
uniform float uStatic;
uniform float uSpeed;
uniform float uPhase;

void main() {
  vUv = aUv;
  vec2 pos = aPosition;
  if (uStatic < 0.5) {
    float anchor = smoothstep(0.0, 0.18, aUv.x);
    float wave = sin(aUv.x * 10.0 - uTime * uSpeed * 2.4 + uPhase) * 0.009 * anchor;
    pos.y += wave;
  }
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const RIBBON_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uStatic;
uniform float uSpeed;
uniform float uPhase;
uniform float uOpacity;

${GLSL_NOISE}

void main() {
  float headFade = smoothstep(0.0, 0.09, vUv.x);
  float tailFade = 1.0 - smoothstep(0.58, 1.0, vUv.x);
  float longMask = headFade * tailFade;

  float distCenter = abs(vUv.y - 0.5) * 2.0;
  float coreMask   = exp(-distCenter * distCenter * 5.5);
  float haloMask   = smoothstep(1.0, 0.0, distCenter);

  float t = (uStatic > 0.5) ? 0.0 : uTime * uSpeed;

  vec2 flowUv = vec2(vUv.x * 4.2 - t + uPhase, vUv.y * 2.4 + sin(vUv.x * 5.0 - t * 0.7) * 0.25);
  float n1 = fbm(flowUv);
  float n2 = snoise(vec2(vUv.x * 9.5 - t * 1.45 + uPhase * 1.7, vUv.y * 5.0));

  float travelingPulse = 0.5 + 0.5 * sin(vUv.x * 16.0 - t * 4.2 + n1 * 2.6 + uPhase);
  float streak = smoothstep(-0.15, 0.65, n1 * 0.65 + n2 * 0.35);

  float combined = (haloMask * 0.45 + coreMask * (0.55 + 0.45 * travelingPulse * streak)) * longMask;
  float alpha = combined * uOpacity;

  if (alpha < 0.003) discard;

  vec3 deepCyan  = vec3(0.08, 0.72, 0.96);
  vec3 brightIce = vec3(0.76, 0.96, 1.00);
  vec3 color = mix(deepCyan, brightIce, clamp(coreMask * 0.65 + travelingPulse * 0.35, 0.0, 1.0));

  gl_FragColor = vec4(color, alpha);
}
`;

// ---------------------------------------------------------------------------
// Pass 3: Sparse Micro-Particle Shader (`particle-system`)
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
precision highp float;
varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float r = length(p) * 2.0;
  if (r > 1.0) discard;
  float glow = exp(-r * r * 3.6) * (1.0 - r * r);
  vec3 col = mix(vec3(0.28, 0.88, 1.0), vec3(0.88, 0.98, 1.0), exp(-r * r * 5.0));
  gl_FragColor = vec4(col, glow * vAlpha);
}
`;

interface RibbonSpec {
  points: Array<[number, number]>;
  widthStart: number;
  widthEnd: number;
  speed: number;
  phase: number;
  opacity: number;
}

const RIBBON_SPECS: RibbonSpec[] = [
  {
    points: [
      [0.844, 0.736],
      [0.720, 0.695],
      [0.560, 0.655],
      [0.390, 0.665],
      [0.215, 0.725],
    ],
    widthStart: 0.018,
    widthEnd: 0.052,
    speed: 0.34,
    phase: 0.4,
    opacity: 0.22,
  },
  {
    points: [
      [0.856, 0.742],
      [0.735, 0.672],
      [0.575, 0.608],
      [0.410, 0.605],
      [0.240, 0.648],
    ],
    widthStart: 0.020,
    widthEnd: 0.058,
    speed: 0.41,
    phase: 1.5,
    opacity: 0.28,
  },
  {
    points: [
      [0.870, 0.749],
      [0.745, 0.652],
      [0.590, 0.572],
      [0.425, 0.542],
      [0.255, 0.568],
    ],
    widthStart: 0.022,
    widthEnd: 0.065,
    speed: 0.46,
    phase: 2.8,
    opacity: 0.34,
  },
  {
    points: [
      [0.882, 0.756],
      [0.760, 0.630],
      [0.610, 0.515],
      [0.455, 0.455],
      [0.280, 0.460],
    ],
    widthStart: 0.020,
    widthEnd: 0.062,
    speed: 0.38,
    phase: 3.9,
    opacity: 0.26,
  },
  {
    points: [
      [0.893, 0.762],
      [0.775, 0.605],
      [0.625, 0.445],
      [0.445, 0.325],
      [0.215, 0.285],
    ],
    widthStart: 0.022,
    widthEnd: 0.072,
    speed: 0.43,
    phase: 5.1,
    opacity: 0.30,
  },
  {
    points: [
      [0.903, 0.768],
      [0.795, 0.585],
      [0.655, 0.405],
      [0.495, 0.275],
      [0.310, 0.225],
    ],
    widthStart: 0.018,
    widthEnd: 0.064,
    speed: 0.36,
    phase: 0.9,
    opacity: 0.24,
  },
  {
    points: [
      [0.913, 0.773],
      [0.818, 0.575],
      [0.705, 0.385],
      [0.575, 0.255],
      [0.420, 0.195],
    ],
    widthStart: 0.016,
    widthEnd: 0.056,
    speed: 0.31,
    phase: 2.2,
    opacity: 0.20,
  },
];

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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

// Build triangle-strip interleaved buffer [clipX, clipY, u, v] for a Catmull-Rom ribbon
function buildRibbonInterleavedData(
  spline: CatmullRomSpline2D,
  widthStart: number,
  widthEnd: number,
  coverScale: [number, number],
  coverOffset: [number, number],
  segments = 64,
): Float32Array {
  const data = new Float32Array((segments + 1) * 2 * 4);
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const [px, py] = spline.getPoint(u);
    const [tx, ty] = spline.getTangent(u);
    const perpX = -ty;
    const perpY = tx;

    const halfW = (widthStart + (widthEnd - widthStart) * Math.pow(u, 0.85)) * 0.5;

    const imgX0 = px + perpX * halfW;
    const imgY0 = py + perpY * halfW;
    const imgX1 = px - perpX * halfW;
    const imgY1 = py - perpY * halfW;

    // Convert image UV (0..1) -> viewport UV (0..1) -> WebGL clip space (-1..1)
    const clipX0 = ((imgX0 - coverOffset[0]) / coverScale[0]) * 2.0 - 1.0;
    const clipY0 = ((imgY0 - coverOffset[1]) / coverScale[1]) * 2.0 - 1.0;
    const clipX1 = ((imgX1 - coverOffset[0]) / coverScale[0]) * 2.0 - 1.0;
    const clipY1 = ((imgY1 - coverOffset[1]) / coverScale[1]) * 2.0 - 1.0;

    const base = i * 8;
    data[base] = clipX0;
    data[base + 1] = clipY0;
    data[base + 2] = u;
    data[base + 3] = 0.0;

    data[base + 4] = clipX1;
    data[base + 5] = clipY1;
    data[base + 6] = u;
    data[base + 7] = 1.0;
  }
  return data;
}

export function HeroAirflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('airflow');
    if (modeParam === 'off') return;

    const reducedMotion =
      modeParam === 'static' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      container.removeChild(canvas);
      return;
    }

    const flowProg = createProgram(gl, FLOW_FIELD_VERT, FLOW_FIELD_FRAG);
    const ribbonProg = createProgram(gl, RIBBON_VERT, RIBBON_FRAG);
    const particleProg = createProgram(gl, PARTICLE_VERT, PARTICLE_FRAG);
    if (!flowProg || !ribbonProg || !particleProg) {
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

    // 1. Fullscreen Quad Buffer for Flow-Map Advected Plane
    const quadData = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.STATIC_DRAW);

    // 2. 7 Catmull-Rom Splines & Ribbon Buffers
    const RIBBON_SEGMENTS = 64;
    const splines = RIBBON_SPECS.map((spec) => new CatmullRomSpline2D(spec.points));
    const ribbonBuffers = RIBBON_SPECS.map(() => gl.createBuffer());

    const rebuildRibbonBuffers = () => {
      RIBBON_SPECS.forEach((spec, idx) => {
        const data = buildRibbonInterleavedData(
          splines[idx],
          spec.widthStart,
          spec.widthEnd,
          coverScale,
          coverOffset,
          RIBBON_SEGMENTS,
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, ribbonBuffers[idx]);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      });
    };

    // 3. Sparse Micro-Particle System (`particle-system`)
    const PARTICLE_COUNT = 52;
    const particleData = new Float32Array(PARTICLE_COUNT * 4); // [clipX, clipY, alpha, size]
    const particleBuffer = gl.createBuffer();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const h1 = ((i * 73 + 19) % 97) / 97;
      const h2 = ((i * 151 + 43) % 89) / 89;
      const h3 = ((i * 211 + 61) % 83) / 83;
      return {
        curveIdx: i % splines.length,
        u0: h1,
        speed: 0.055 + h2 * 0.055,
        offsetNormal: (h3 - 0.5) * 0.032,
        baseAlpha: 0.16 + h2 * 0.24,
        size: (2.2 + h3 * 3.2) * dpr,
      };
    });

    const updateParticles = (elapsed: number) => {
      const t = reducedMotion ? 0 : elapsed;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const u = (p.u0 + t * p.speed) % 1.0;
        const spline = splines[p.curveIdx];
        const [px, py] = spline.getPoint(u);
        const [tx, ty] = spline.getTangent(u);
        const nx = -ty;
        const ny = tx;
        const sway = Math.sin(u * 9.0 + t * 1.4 + i) * 0.006 * u;
        const imgX = px + nx * (p.offsetNormal * u + sway);
        const imgY = py + ny * (p.offsetNormal * u + sway);

        const clipX = ((imgX - coverOffset[0]) / coverScale[0]) * 2.0 - 1.0;
        const clipY = ((imgY - coverOffset[1]) / coverScale[1]) * 2.0 - 1.0;
        const envelope = Math.sin(u * Math.PI) * Math.min(1, u * 6.0);

        const base = i * 4;
        particleData[base] = clipX;
        particleData[base + 1] = clipY;
        particleData[base + 2] = p.baseAlpha * envelope;
        particleData[base + 3] = p.size;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.DYNAMIC_DRAW);
    };

    // Load Reference Airflow Texture
    const refTex = gl.createTexture();
    let texReady = false;
    let disposed = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, refTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      texReady = true;
      renderFrame(0);
    };
    img.src = '/images/redesign/hero-airflow-map.webp';

    const syncSize = () => {
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * ratio);
      canvas.height = Math.round(cssH * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      updateCoverMapping(cssW, cssH);
      rebuildRibbonBuffers();
    };

    syncSize();

    // Cached attribute & uniform locations
    const flowLoc = {
      aPosition: gl.getAttribLocation(flowProg, 'aPosition'),
      aUv: gl.getAttribLocation(flowProg, 'aUv'),
      uRefMap: gl.getUniformLocation(flowProg, 'uRefMap'),
      uTime: gl.getUniformLocation(flowProg, 'uTime'),
      uStatic: gl.getUniformLocation(flowProg, 'uStatic'),
      uCoverScale: gl.getUniformLocation(flowProg, 'uCoverScale'),
      uCoverOffset: gl.getUniformLocation(flowProg, 'uCoverOffset'),
    };

    const ribbonLoc = {
      aPosition: gl.getAttribLocation(ribbonProg, 'aPosition'),
      aUv: gl.getAttribLocation(ribbonProg, 'aUv'),
      uTime: gl.getUniformLocation(ribbonProg, 'uTime'),
      uStatic: gl.getUniformLocation(ribbonProg, 'uStatic'),
      uSpeed: gl.getUniformLocation(ribbonProg, 'uSpeed'),
      uPhase: gl.getUniformLocation(ribbonProg, 'uPhase'),
      uOpacity: gl.getUniformLocation(ribbonProg, 'uOpacity'),
    };

    const particleLoc = {
      aPosition: gl.getAttribLocation(particleProg, 'aPosition'),
      aAlpha: gl.getAttribLocation(particleProg, 'aAlpha'),
      aSize: gl.getAttribLocation(particleProg, 'aSize'),
    };

    const renderFrame = (elapsed: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);

      // Pass 1: Flow-Map Advected Reference Airflow Plane
      if (texReady) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(flowProg);
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(flowLoc.aPosition);
        gl.vertexAttribPointer(flowLoc.aPosition, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(flowLoc.aUv);
        gl.vertexAttribPointer(flowLoc.aUv, 2, gl.FLOAT, false, 16, 8);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, refTex);
        gl.uniform1i(flowLoc.uRefMap, 0);
        gl.uniform1f(flowLoc.uTime, elapsed);
        gl.uniform1f(flowLoc.uStatic, reducedMotion ? 1.0 : 0.0);
        gl.uniform2f(flowLoc.uCoverScale, coverScale[0], coverScale[1]);
        gl.uniform2f(flowLoc.uCoverOffset, coverOffset[0], coverOffset[1]);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      // Pass 2: 7 Curved Spline Ribbons (Cyan-to-ice silk streams visible across bright window)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(ribbonProg);
      gl.uniform1f(ribbonLoc.uTime, elapsed);
      gl.uniform1f(ribbonLoc.uStatic, reducedMotion ? 1.0 : 0.0);

      RIBBON_SPECS.forEach((spec, idx) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, ribbonBuffers[idx]);
        gl.enableVertexAttribArray(ribbonLoc.aPosition);
        gl.vertexAttribPointer(ribbonLoc.aPosition, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(ribbonLoc.aUv);
        gl.vertexAttribPointer(ribbonLoc.aUv, 2, gl.FLOAT, false, 16, 8);

        gl.uniform1f(ribbonLoc.uSpeed, spec.speed);
        gl.uniform1f(ribbonLoc.uPhase, spec.phase);
        gl.uniform1f(ribbonLoc.uOpacity, reducedMotion ? spec.opacity * 0.45 : spec.opacity);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, (RIBBON_SEGMENTS + 1) * 2);
      });

      // Pass 3: Sparse Micro-Particles
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      updateParticles(elapsed);
      gl.useProgram(particleProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      gl.enableVertexAttribArray(particleLoc.aPosition);
      gl.vertexAttribPointer(particleLoc.aPosition, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(particleLoc.aAlpha);
      gl.vertexAttribPointer(particleLoc.aAlpha, 1, gl.FLOAT, false, 16, 8);
      gl.enableVertexAttribArray(particleLoc.aSize);
      gl.vertexAttribPointer(particleLoc.aSize, 1, gl.FLOAT, false, 16, 12);

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      renderFrame((performance.now() - startTime) * 0.001);
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let isVisible = true;
    const startTime = performance.now();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(container);

    const animate = (now: number) => {
      if (isVisible) {
        renderFrame((now - startTime) * 0.001);
      }
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    renderFrame(0);
    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(animate);
    }

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteBuffer(quadBuffer);
      ribbonBuffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteBuffer(particleBuffer);
      gl.deleteTexture(refTex);
      gl.deleteProgram(flowProg);
      gl.deleteProgram(ribbonProg);
      gl.deleteProgram(particleProg);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.airflow} aria-hidden="true" />;
}
