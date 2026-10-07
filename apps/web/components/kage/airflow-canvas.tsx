'use client';

import { useEffect, useRef } from 'react';

/**
 * Atmospheric "cool airflow" layer: thin, slow streaks drifting through a soft
 * flow field, gently bending away from the pointer. Pauses off-screen / hidden
 * tab, uses fewer particles on small screens, disabled for reduced motion.
 */
export function AirflowCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    type P = { x: number; y: number; life: number; max: number; speed: number; w: number };
    let particles: P[] = [];

    const spawn = (p?: P): P => {
      const next = p ?? ({} as P);
      next.x = Math.random() * width * 1.1 - width * 0.1;
      next.y = Math.random() * height;
      next.life = 0;
      next.max = 180 + Math.random() * 260;
      next.speed = 0.35 + Math.random() * 0.75;
      next.w = Math.random() < 0.12 ? 1.4 : 0.7;
      return next;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (width * height) / (width < 760 ? 14000 : 7000)));
      particles = Array.from({ length: count }, () => {
        const p = spawn();
        p.life = Math.random() * p.max;
        return p;
      });
      ctx.clearRect(0, 0, width, height);
    };

    let t = 0;
    const tick = () => {
      raf = 0;
      if (!visible) return;
      t += 0.0025;
      // Trail fade keeps streaks soft and short.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.085)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const p of particles) {
        const angle =
          Math.sin(p.y * 0.0042 + t * 3) * 0.35 +
          Math.cos(p.x * 0.0028 - t * 2) * 0.25 -
          0.08;
        let vx = Math.cos(angle) * p.speed * 1.6;
        let vy = Math.sin(angle) * p.speed;
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 32000) {
          const f = (1 - d2 / 32000) * 2.2;
          vx += (dx / Math.sqrt(d2 + 1)) * f;
          vy += (dy / Math.sqrt(d2 + 1)) * f;
        }
        const nx = p.x + vx;
        const ny = p.y + vy;
        const fade = Math.sin((p.life / p.max) * Math.PI);
        ctx.strokeStyle = `rgba(191, 226, 255, ${(0.22 * fade).toFixed(3)})`;
        ctx.lineWidth = p.w;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.life += 1;
        if (p.life > p.max || p.x > width + 20 || p.y < -20 || p.y > height + 20) spawn(p);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else start();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });

    resize();
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
