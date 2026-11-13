'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { isServicePage } from '@/lib/service-pages';

export type AtmosphereMode =
  | 'window-sunbeams'
  | 'ceiling-cassette-mist'
  | 'skyline-bokeh-reflection'
  | 'morning-canopy-light'
  | 'ac-filter-breeze'
  | 'precision-hud'
  | 'cryo-lattice'
  | 'aurora-ribbons'
  | 'dispatch-radar'
  | 'chrono-orbit';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function resolveAtmosphereMode(image: string, className = ''): AtmosphereMode {
  if (className.includes('mn-about-hero') || image.includes('technician')) {
    return 'window-sunbeams';
  }
  if (className.includes('mn-contact-hero') || image.includes('contact-home-visit')) {
    return 'morning-canopy-light';
  }
  if (
    className.includes('mn-booking-hero') ||
    image.includes('carousel-maintenance') ||
    image.includes('contact-interior')
  ) {
    return 'ac-filter-breeze';
  }
  if (image.includes('editorial') || className.includes('mn-editorial')) {
    return 'skyline-bokeh-reflection';
  }
  return 'ceiling-cassette-mist';
}

function normalizeMode(mode: AtmosphereMode): AtmosphereMode {
  if (mode === 'precision-hud') return 'window-sunbeams';
  if (mode === 'cryo-lattice') return 'ceiling-cassette-mist';
  if (mode === 'aurora-ribbons') return 'skyline-bokeh-reflection';
  if (mode === 'dispatch-radar') return 'morning-canopy-light';
  if (mode === 'chrono-orbit') return 'ac-filter-breeze';
  return mode;
}

export function PageHeroAtmosphere({
  mode,
  image = '',
  heroClassName = '',
  className = '',
}: {
  mode?: AtmosphereMode;
  image?: string;
  heroClassName?: string;
  className?: string;
}) {
  const resolvedMode = normalizeMode(mode || resolveAtmosphereMode(image, heroClassName));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const servicePage = isServicePage(usePathname());

  useEffect(() => {
    if (servicePage) return;
    const activeMode = resolvedMode;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let rafId = 0;
    let visible = true;
    let currentElapsed = 0;

    const pointer = {
      x: 0.62,
      y: 0.45,
      targetX: 0.62,
      targetY: 0.45,
      active: false,
      energy: 0,
    };

    const stepPointer = (dt: number) => {
      pointer.x += (pointer.targetX - pointer.x) * Math.min(1, dt * 5);
      pointer.y += (pointer.targetY - pointer.y) * Math.min(1, dt * 5);
      const targetEnergy = pointer.active ? 1 : 0;
      pointer.energy += (targetEnergy - pointer.energy) * Math.min(1, dt * 4);
    };

    const rng = mulberry32(20261027);
    const bokehNodes = Array.from({ length: 48 }, () => ({
      rx: rng(),
      ry: rng(),
      size: 3.5 + Math.pow(rng(), 1.7) * 14,
      phase: rng() * Math.PI * 2,
      speed: 0.7 + rng() * 1.4,
      warm: rng() > 0.45,
    }));

    const fillRadialOrb = (
      cx: number,
      cy: number,
      r: number,
      stops: Array<[number, string]>,
    ) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      for (const [offset, color] of stops) {
        g.addColorStop(offset, color);
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    };

    // =========================================================================
    // 1. /about (technician.webp):
    //    VOLUMETRIC WINDOW SUNBEAMS, LENS PRISM FLARE & COVE LIGHT HALO
    //    - Anchored to the apartment's floor-to-ceiling windows (x: 0.14..0.44)
    //    - Anchored to ceiling downlight (0.421, 0.044) & kitchen warm cove (0.675, 0.41)
    // =========================================================================
    const drawWindowSunbeams = (elapsed: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const sway = Math.sin(elapsed * 0.6) * 0.018 + (pointer.x - 0.5) * 0.025 * pointer.energy;

      // 4 slanted volumetric daylight shafts entering through the apartment window bays
      const beams = [
        { topX: 0.13, topW: 0.075, botX: 0.34, botW: 0.15, alpha: 0.24 },
        { topX: 0.23, topW: 0.09, botX: 0.45, botW: 0.18, alpha: 0.32 },
        { topX: 0.33, topW: 0.075, botX: 0.55, botW: 0.15, alpha: 0.28 },
        { topX: 0.41, topW: 0.06, botX: 0.62, botW: 0.12, alpha: 0.2 },
      ];

      ctx.save();
      ctx.filter = 'blur(16px)';
      beams.forEach((b, i) => {
        const pulse = 0.84 + 0.16 * Math.sin(elapsed * 0.95 + i * 1.2);
        const tx = (b.topX + sway * 0.4) * width;
        const tw = b.topW * width;
        const bx = (b.botX + sway) * width;
        const bw = b.botW * width;

        const grad = ctx.createLinearGradient(tx, 0, bx, height * 0.95);
        grad.addColorStop(0, `rgba(205, 248, 255, ${(b.alpha * 1.3 * pulse).toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(110, 234, 255, ${(b.alpha * 0.9 * pulse).toFixed(3)})`);
        grad.addColorStop(0.82, `rgba(56, 204, 248, ${(b.alpha * 0.38 * pulse).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(56, 204, 248, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(tx, 0);
        ctx.lineTo(tx + tw, 0);
        ctx.lineTo(bx + bw, height);
        ctx.lineTo(bx, height);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // Ceiling recessed downlight glow at exact photo position (0.421, 0.044)
      fillRadialOrb(width * 0.421, height * 0.044, width * 0.13, [
        [0, 'rgba(255, 252, 230, 0.65)'],
        [0.35, 'rgba(165, 242, 255, 0.26)'],
        [1, 'rgba(165, 242, 255, 0)'],
      ]);

      // Warm kitchen cabinet cove glow at exact photo position (0.675, 0.41)
      const covePulse = 0.86 + 0.14 * Math.sin(elapsed * 1.5);
      fillRadialOrb(width * 0.675, height * 0.41, width * 0.11, [
        [0, `rgba(255, 234, 180, ${(0.42 * covePulse).toFixed(3)})`],
        [0.5, `rgba(120, 236, 255, ${(0.16 * covePulse).toFixed(3)})`],
        [1, 'rgba(120, 236, 255, 0)'],
      ]);

      // Floating sunlit bokeh motes inside the window sunbeam corridor (x: 0.28..0.60)
      for (let i = 0; i < 22; i++) {
        const b = bokehNodes[i];
        const progress = (b.ry + elapsed * 0.03 * b.speed) % 1;
        const nx = 0.28 + b.rx * 0.3 + progress * 0.07;
        const ny = 0.06 + progress * 0.84;
        if (nx > 0.61) continue;
        const px = nx * width;
        const py = ny * height;
        const r = 3 + (b.size % 7);
        const alpha = Math.sin(progress * Math.PI) * (0.28 + 0.16 * Math.sin(elapsed * 2.2 + b.phase));

        fillRadialOrb(px, py, r * 2.4, [
          [0, `rgba(240, 254, 255, ${alpha.toFixed(3)})`],
          [0.5, `rgba(125, 242, 255, ${(alpha * 0.5).toFixed(3)})`],
          [1, 'rgba(125, 242, 255, 0)'],
        ]);
      }

      ctx.restore();
    };

    // =========================================================================
    // 2. /services (services-banner.webp):
    //    4-WAY CEILING CASSETTE AC LAMINAR COOLING MIST & SPARKLING FROST VAPOR
    //    - Anchored precisely to the left discharge louver of the ceiling cassette AC
    //      (x: 0.65..0.74, y: 0.09..0.19) — naturally to the left of the technician's head!
    //    - No hard clip polygon! Uses smooth radial & linear feathering.
    // =========================================================================
    const drawCeilingCassetteMist = (elapsed: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const pulse = 0.88 + 0.12 * Math.sin(elapsed * 1.35);

      // 1. Soft volumetric condensation cloud emerging from the left AC louver (0.69, 0.13) -> (0.42, 0.78)
      ctx.save();
      ctx.filter = 'blur(24px)';
      const mistGrad = ctx.createLinearGradient(
        width * 0.7,
        height * 0.11,
        width * 0.38,
        height * 0.78,
      );
      mistGrad.addColorStop(0, `rgba(195, 252, 255, ${(0.56 * pulse).toFixed(3)})`);
      mistGrad.addColorStop(0.32, `rgba(92, 236, 255, ${(0.38 * pulse).toFixed(3)})`);
      mistGrad.addColorStop(0.68, `rgba(34, 211, 238, ${(0.18 * pulse).toFixed(3)})`);
      mistGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.fillStyle = mistGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.64, height * 0.08);
      ctx.quadraticCurveTo(width * 0.72, height * 0.12, width * 0.72, height * 0.19);
      ctx.quadraticCurveTo(width * 0.58, height * 0.48, width * 0.45, height * 0.88);
      ctx.lineTo(width * 0.3, height * 0.68);
      ctx.quadraticCurveTo(width * 0.48, height * 0.32, width * 0.64, height * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Silky laminar cooling streamlines starting right at the left AC louver (x: 0.65..0.71, y: 0.10..0.18)
      const streamCount = 7;
      for (let s = 0; s < streamCount; s++) {
        const frac = s / (streamCount - 1);
        const startX = width * (0.655 + frac * 0.055);
        const startY = height * (0.095 + frac * 0.085);
        const endX = width * (0.35 + frac * 0.15);
        const endY = height * (0.54 + frac * 0.3);

        const waveOffset = Math.sin(elapsed * 1.7 - s * 0.65) * width * 0.014;
        const cp1x = startX - (startX - endX) * 0.35 + waveOffset;
        const cp1y = startY + (endY - startY) * 0.25;
        const cp2x = startX - (startX - endX) * 0.7 - waveOffset;
        const cp2y = startY + (endY - startY) * 0.68;

        const streamGrad = ctx.createLinearGradient(startX, startY, endX, endY);
        const flowPhase = (elapsed * 0.55 + s * 0.17) % 1;
        streamGrad.addColorStop(0, 'rgba(210, 252, 255, 0)');
        streamGrad.addColorStop(0.12, 'rgba(185, 248, 255, 0.36)');
        streamGrad.addColorStop(
          Math.max(0.18, Math.min(0.82, 0.18 + flowPhase * 0.6)),
          'rgba(140, 244, 255, 0.48)',
        );
        streamGrad.addColorStop(1, 'rgba(56, 224, 255, 0)');

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = 2.0 - frac * 0.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
      }

      // 3. Ceiling recessed downlights at exact photo coordinates (0.581, 0.246) & (0.506, 0.422)
      const lights = [
        { x: 0.581, y: 0.246, r: 0.085 },
        { x: 0.506, y: 0.422, r: 0.068 },
      ];
      lights.forEach((l, idx) => {
        const lp = 0.85 + 0.15 * Math.sin(elapsed * 1.6 + idx);
        fillRadialOrb(width * l.x, height * l.y, width * l.r, [
          [0, `rgba(240, 254, 255, ${(0.55 * lp).toFixed(3)})`],
          [0.4, `rgba(110, 238, 255, ${(0.24 * lp).toFixed(3)})`],
          [1, 'rgba(110, 238, 255, 0)'],
        ]);
      });

      ctx.restore();
    };

    // =========================================================================
    // 3. /blog (editorial-night.webp):
    //    NIGHT SKYLINE AURORA GLOW, CITY BOKEH & RIVER WATER REFLECTION RIPPLES
    //    - Strictly inside the panoramic glass windows on the right (x: 0.55..0.98)
    // =========================================================================
    const drawSkylineBokehReflection = (elapsed: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Subtle night-sky aurora glow above the skyscraper skyline (x: 0.56..0.98, y: 0.04..0.28)
      fillRadialOrb(
        width * (0.76 + Math.sin(elapsed * 0.5) * 0.03),
        height * 0.14,
        width * 0.22,
        [
          [0, 'rgba(92, 236, 255, 0.28)'],
          [0.55, 'rgba(45, 212, 191, 0.12)'],
          [1, 'rgba(14, 165, 233, 0)'],
        ],
      );

      // 2. Soft breathing bokeh orbs over the city skyscrapers (x: 0.56..0.98, y: 0.25..0.56)
      for (let i = 0; i < bokehNodes.length; i++) {
        const b = bokehNodes[i];
        const nx = 0.56 + b.rx * 0.41;
        const ny = 0.25 + b.ry * 0.31;

        const parallaxX = (pointer.x - 0.65) * 14 * (b.size / 16) * pointer.energy;
        const parallaxY = (pointer.y - 0.5) * 10 * (b.size / 16) * pointer.energy;
        const px = nx * width + parallaxX;
        const py = ny * height + parallaxY;

        const twinkle = 0.45 + 0.55 * Math.sin(elapsed * b.speed * 1.6 + b.phase);
        const alpha = 0.38 * twinkle;
        const r = b.size;

        if (b.warm) {
          fillRadialOrb(px, py, r, [
            [0, `rgba(255, 240, 190, ${(alpha * 1.25).toFixed(3)})`],
            [0.55, `rgba(255, 200, 108, ${(alpha * 0.68).toFixed(3)})`],
            [1, 'rgba(255, 180, 80, 0)'],
          ]);
        } else {
          fillRadialOrb(px, py, r, [
            [0, `rgba(195, 250, 255, ${(alpha * 1.25).toFixed(3)})`],
            [0.55, `rgba(56, 224, 255, ${(alpha * 0.68).toFixed(3)})`],
            [1, 'rgba(14, 165, 233, 0)'],
          ]);
        }
      }

      // 3. Tower spire beacon pulses at the skyscraper tips
      const spires = [
        { x: 0.79, y: 0.175, r: 22 },
        { x: 0.715, y: 0.285, r: 16 },
        { x: 0.865, y: 0.325, r: 16 },
      ];
      spires.forEach((sp, idx) => {
        const bp = 0.5 + 0.5 * Math.sin(elapsed * 3.0 + idx * 1.8);
        fillRadialOrb(width * sp.x, height * sp.y, sp.r, [
          [0, `rgba(255, 245, 250, ${(0.88 * bp).toFixed(3)})`],
          [0.4, `rgba(110, 238, 255, ${(0.45 * bp).toFixed(3)})`],
          [1, 'rgba(110, 238, 255, 0)'],
        ]);
      });

      // 4. Shimmering river water reflection ripples in the lower window (x: 0.58..0.97, y: 0.61..0.86)
      for (let w = 0; w < 28; w++) {
        const b = bokehNodes[w % bokehNodes.length];
        const rx = width * (0.58 + b.rx * 0.38);
        const ry = height * (0.61 + b.ry * 0.24);
        const waveShift = Math.sin(elapsed * 2.1 + w * 0.9) * 8;
        const len = 14 + (w % 5) * 9;
        const alpha = 0.26 + 0.22 * Math.sin(elapsed * 2.6 + b.phase);

        const rg = ctx.createLinearGradient(rx + waveShift - len, ry, rx + waveShift + len, ry);
        rg.addColorStop(0, 'rgba(125, 242, 255, 0)');
        rg.addColorStop(
          0.5,
          b.warm
            ? `rgba(255, 224, 150, ${alpha.toFixed(3)})`
            : `rgba(120, 240, 255, ${alpha.toFixed(3)})`,
        );
        rg.addColorStop(1, 'rgba(125, 242, 255, 0)');

        ctx.strokeStyle = rg;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(rx + waveShift - len, ry);
        ctx.lineTo(rx + waveShift + len, ry);
        ctx.stroke();
      }

      ctx.restore();
    };

    // =========================================================================
    // 4. /contact (contact-home-visit.webp):
    //    DAPPLED MORNING SUNBEAMS & GARDEN FOLIAGE BOKEH
    //    - Uses full-circle radial orbs (no rectangular fillRect clipping!)
    //    - Matches the natural sunlight on the top-left wall & top-right tree canopy
    //    - Keeps the homeowner and technician 100% crisp and unobstructed
    // =========================================================================
    const drawMorningCanopyLight = (elapsed: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const leafSway = Math.sin(elapsed * 0.85) * 0.012;

      // 1. Natural diagonal morning sunbeams along the top-left blue wall (matching the photo's real shadow angle)
      ctx.save();
      ctx.filter = 'blur(16px)';
      const wallBeams = [
        { x0: 0.02, w0: 0.075, x1: 0.25, y1: 0.54, alpha: 0.22 },
        { x0: 0.13, w0: 0.085, x1: 0.39, y1: 0.58, alpha: 0.26 },
        { x0: 0.25, w0: 0.065, x1: 0.47, y1: 0.5, alpha: 0.18 },
      ];
      wallBeams.forEach((wb, i) => {
        const pulse = 0.84 + 0.16 * Math.sin(elapsed * 1.1 + i * 1.5);
        const sx = (wb.x0 + leafSway) * width;
        const sw = wb.w0 * width;
        const ex = (wb.x1 + leafSway * 1.4) * width;
        const ey = wb.y1 * height;

        const g = ctx.createLinearGradient(sx, 0, ex, ey);
        g.addColorStop(0, `rgba(215, 250, 255, ${(wb.alpha * pulse).toFixed(3)})`);
        g.addColorStop(0.6, `rgba(120, 232, 255, ${(wb.alpha * 0.55 * pulse).toFixed(3)})`);
        g.addColorStop(1, 'rgba(120, 232, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + sw, 0);
        ctx.lineTo(ex + sw * 1.5, ey);
        ctx.lineTo(ex, ey);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // 2. Smooth unclipped sunburst orb in the top-right tree canopy (0.92, 0.08)
      const sunPulse = 0.88 + 0.12 * Math.sin(elapsed * 1.1);
      fillRadialOrb(width * 0.92, height * 0.08, width * 0.18, [
        [0, `rgba(255, 252, 220, ${(0.52 * sunPulse).toFixed(3)})`],
        [0.45, `rgba(175, 246, 255, ${(0.24 * sunPulse).toFixed(3)})`],
        [1, 'rgba(175, 246, 255, 0)'],
      ]);

      // 3. Dappled sunlit bokeh on the garden plants (bottom foliage y: 0.68..0.96, x: 0.04..0.52 & central plant x: 0.72..0.77)
      for (let i = 0; i < 22; i++) {
        const b = bokehNodes[i];
        const zone = i % 3;
        const nx =
          zone === 0
            ? 0.86 + b.rx * 0.12
            : zone === 1
              ? 0.715 + b.rx * 0.055
              : 0.05 + b.rx * 0.45;
        const ny =
          zone === 0
            ? 0.03 + b.ry * 0.18
            : zone === 1
              ? 0.34 + b.ry * 0.34
              : 0.7 + b.ry * 0.25;
        const px = (nx + Math.sin(elapsed * 0.9 + b.phase) * 0.006) * width;
        const py = (ny + Math.cos(elapsed * 0.8 + b.phase) * 0.006) * height;
        const r = 4.5 + (b.size % 8);
        const alpha = 0.34 * (0.45 + 0.55 * Math.sin(elapsed * 1.8 + b.phase));

        fillRadialOrb(px, py, r * 2.0, [
          [0, `rgba(248, 255, 225, ${alpha.toFixed(3)})`],
          [0.55, `rgba(135, 244, 255, ${(alpha * 0.52).toFixed(3)})`],
          [1, 'rgba(135, 244, 255, 0)'],
        ]);
      }

      ctx.restore();
    };

    // =========================================================================
    // 5. /booking (carousel-maintenance.webp):
    //    BALCONY WINDOW DAYLIGHT RAYS, FLOOR LAMP HALO & CEILING SPOTLIGHT
    //    - Anchored to the ceiling spotlight (0.553, 0.046), warm floor lamp (0.554, 0.565),
    //      and the tall balcony glass window (x: 0.64..0.72, y: 0.12..0.85)
    //      casting natural daylight onto the blue wall (x: 0.36..0.54, y: 0.24..0.72)
    //    - No hard clip polygon and zero lines crossing the technician!
    // =========================================================================
    const drawAcFilterBreeze = (elapsed: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Ceiling spotlight glow at exact photo position (0.553, 0.046)
      const spotPulse = 0.9 + 0.1 * Math.sin(elapsed * 1.5);
      fillRadialOrb(width * 0.553, height * 0.046, width * 0.13, [
        [0, `rgba(255, 253, 238, ${(0.68 * spotPulse).toFixed(3)})`],
        [0.4, `rgba(155, 242, 255, ${(0.28 * spotPulse).toFixed(3)})`],
        [1, 'rgba(155, 242, 255, 0)'],
      ]);

      // 2. Warm floor lamp ambient halo & light cone at exact photo position (0.554, 0.565)
      const lampPulse = 0.86 + 0.14 * Math.sin(elapsed * 1.25);
      fillRadialOrb(width * 0.554, height * 0.565, width * 0.14, [
        [0, `rgba(255, 228, 165, ${(0.54 * lampPulse).toFixed(3)})`],
        [0.5, `rgba(255, 198, 115, ${(0.22 * lampPulse).toFixed(3)})`],
        [1, 'rgba(255, 198, 115, 0)'],
      ]);

      // 3. Soft diagonal window daylight patches on the dark-blue wall (matching the real window reflection at x: 0.36..0.53)
      ctx.save();
      ctx.filter = 'blur(18px)';
      const windowLightGrad = ctx.createLinearGradient(
        width * 0.68,
        height * 0.18,
        width * 0.36,
        height * 0.68,
      );
      windowLightGrad.addColorStop(0, `rgba(185, 248, 255, ${(0.34 * spotPulse).toFixed(3)})`);
      windowLightGrad.addColorStop(0.5, `rgba(96, 234, 255, ${(0.22 * spotPulse).toFixed(3)})`);
      windowLightGrad.addColorStop(1, 'rgba(56, 204, 248, 0)');
      ctx.fillStyle = windowLightGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.68, height * 0.14);
      ctx.lineTo(width * 0.68, height * 0.48);
      ctx.lineTo(width * 0.36, height * 0.74);
      ctx.lineTo(width * 0.36, height * 0.32);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Gentle clean-air shimmer orbs drifting in the sunlit window zone (x: 0.38..0.67, y: 0.18..0.76)
      for (let i = 0; i < 18; i++) {
        const b = bokehNodes[i];
        const prog = (b.rx + elapsed * 0.035 * b.speed) % 1;
        const nx = 0.67 - prog * 0.28;
        const ny = 0.18 + b.ry * 0.56 + Math.sin(prog * Math.PI * 2 + b.phase) * 0.03;
        const px = nx * width;
        const py = ny * height;
        const r = 3 + (b.size % 6);
        const alpha = Math.sin(prog * Math.PI) * 0.32;

        fillRadialOrb(px, py, r * 2.2, [
          [0, `rgba(235, 254, 255, ${alpha.toFixed(3)})`],
          [0.5, `rgba(110, 238, 255, ${(alpha * 0.48).toFixed(3)})`],
          [1, 'rgba(110, 238, 255, 0)'],
        ]);
      }

      ctx.restore();
    };

    const renderFrame = (elapsed: number) => {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (activeMode === 'window-sunbeams') {
        drawWindowSunbeams(elapsed);
      } else if (activeMode === 'ceiling-cassette-mist') {
        drawCeilingCassetteMist(elapsed);
      } else if (activeMode === 'skyline-bokeh-reflection') {
        drawSkylineBokehReflection(elapsed);
      } else if (activeMode === 'morning-canopy-light') {
        drawMorningCanopyLight(elapsed);
      } else {
        drawAcFilterBreeze(elapsed);
      }

      ctx.restore();
    };

    const freezeParam = new URLSearchParams(window.location.search).get('t');
    const isStatic = freezeParam !== null || reducedMotion;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (isStatic) {
        renderFrame(currentElapsed);
      }
    };

    if (isStatic) {
      currentElapsed = freezeParam !== null ? Math.max(0, parseFloat(freezeParam) || 1.4) : 1.4;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const onPointerMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.targetX = (e.clientX - rect.left) / rect.width;
      pointer.targetY = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    io.observe(parent);

    if (isStatic) {
      return () => {
        ro.disconnect();
        io.disconnect();
        parent.removeEventListener('pointermove', onPointerMove);
        parent.removeEventListener('pointerleave', onPointerLeave);
      };
    }

    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 1 / 30);
      prev = now;
      if (visible) {
        currentElapsed += dt;
        stepPointer(dt);
        renderFrame(currentElapsed);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [resolvedMode, servicePage]);

  if (servicePage) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-atmosphere-mode={resolvedMode}
      className={`mn-page-hero-atmosphere ${className}`}
    />
  );
}
