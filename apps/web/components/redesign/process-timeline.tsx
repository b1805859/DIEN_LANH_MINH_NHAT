'use client';

import { useEffect, useRef } from 'react';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

export function ProcessTimeline({ steps }: { steps: string[][] }) {
  const root = useRef<HTMLDivElement>(null);
  const budget = useMotionBudget();
  useEffect(() => {
    const element = root.current;
    if (!element || budget === 'reduced' || !('IntersectionObserver' in window)) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>('article'));
    let visible = false;
    let frame = 0;
    let previousActive = -1;
    const paint = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const { top, height } = element.getBoundingClientRect();
      // A short footer can prevent the section from reaching the viewport's top.
      // Finish the journey at the actual page end instead of leaving steps dim.
      const start = top + window.scrollY - window.innerHeight * 0.8;
      const end = Math.min(
        start + height + window.innerHeight * 0.25,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / Math.max(1, end - start)),
      );
      const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      element.dataset.tracking = 'true';
      element.style.setProperty('--mn-process-progress', String(progress));
      if (active !== previousActive) {
        cards.forEach((card, index) => {
          card.dataset.stepState =
            index < active ? 'complete' : index === active ? 'current' : 'upcoming';
        });
        previousActive = active;
      }
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      element.style.removeProperty('--mn-process-progress');
      delete element.dataset.tracking;
      cards.forEach((card) => {
        delete card.dataset.stepState;
      });
    };
  }, [budget, steps.length]);
  return (
    <div className="mn-process-grid" ref={root} role="list" aria-label="Các bước phục vụ">
      {steps.map(([title, description], index) => (
        <article role="listitem" key={title}>
          <span aria-label={`Bước ${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}
