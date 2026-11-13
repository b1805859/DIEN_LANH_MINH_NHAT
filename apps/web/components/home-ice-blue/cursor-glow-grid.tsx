// Lucian UX/UI Prompt #228 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#228
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './cursor-glow-grid.module.css';

export function CursorGlowGrid({ className, children }: { className: string; children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = grid.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(':scope > [data-u228-card]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    let point: { x: number; y: number } | undefined;
    let target = 0;
    let opacity = 0;
    let frame = 0;
    let last = 0;

    function draw(now: number) {
      frame = 0;
      const elapsed = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      opacity += (target - opacity) * (reduced.matches ? 1 : Math.min(1, elapsed * (target ? 8 : 2.5)));
      if (Math.abs(target - opacity) <= 0.005) opacity = target;

      if (point) {
        const { x, y } = point;
        // Read every card before writing so a single cursor position lights adjacent cards.
        const rects = cards.map((card) => card.getBoundingClientRect());
        cards.forEach((card, index) => {
          card.style.setProperty('--u228-x', `${(x - rects[index].left).toFixed(1)}px`);
          card.style.setProperty('--u228-y', `${(y - rects[index].top).toFixed(1)}px`);
        });
        point = undefined;
      }
      root?.style.setProperty('--u228-opacity', opacity.toFixed(3));
      if (opacity !== target) frame = requestAnimationFrame(draw);
    }

    function schedule() {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    }

    const move = (event: PointerEvent) => {
      if (!hover.matches || event.pointerType === 'touch') return;
      point = { x: event.clientX, y: event.clientY };
      target = 1;
      schedule();
    };
    const leave = () => {
      if (!target) return;
      target = 0;
      schedule();
    };

    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointercancel', leave);
    hover.addEventListener('change', leave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', leave);
      hover.removeEventListener('change', leave);
      root.style.removeProperty('--u228-opacity');
      for (const card of cards) {
        card.style.removeProperty('--u228-x');
        card.style.removeProperty('--u228-y');
      }
    };
  }, []);

  return <div ref={grid} className={`${className} ${styles.u228}`}>{children}</div>;
}
