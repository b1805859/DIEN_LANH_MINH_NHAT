'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

const ambientTargets = '.mn-home-hero, .mn-page-hero, .mn-service-area, .mn-contact-map';

// Ambient visibility is separate from the shared Home/inner-page scroll reveals.
export function useSiteMotion(
  root: RefObject<HTMLDivElement | null>,
  pathname: string,
  enabled: boolean,
) {
  const budget = useMotionBudget();
  useEffect(() => {
    const site = root.current;
    if (!enabled || !site || !('IntersectionObserver' in window)) return;
    site.dataset.motionBudget = budget;
    let disposeMotion = () => {};

    const configure = () => {
      disposeMotion();
      if (budget === 'reduced') return;

      const ambientElements = new Set<HTMLElement>();
      let disposed = false;

      const ambient = new IntersectionObserver((entries) => {
        if (disposed) return;
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.motionVisible = String(entry.isIntersecting);
        }
      });

      const register = (node: HTMLElement) => {
        const decorative = [node, ...node.querySelectorAll<HTMLElement>(ambientTargets)];
        for (const element of decorative) {
          if (!element.matches(ambientTargets) || ambientElements.has(element)) continue;
          ambientElements.add(element);
          ambient.observe(element);
        }
      };

      register(site);

      // One scroll listener and one frame for the warm-to-cool page lighting.
      // No scroll work on touch/low-power devices, and no image color changes.
      let frame = 0;
      let scrollRange = 1;
      const paintTemperature = () => {
        frame = 0;
        const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
        site.style.setProperty('--mn-warm-light', String((1 - progress) * 0.65));
        site.style.setProperty('--mn-cool-light', String(0.2 + progress * 0.65));
      };
      const scheduleTemperature = () => {
        if (budget !== 'full' || frame || document.hidden) return;
        frame = requestAnimationFrame(paintTemperature);
      };
      const measure = () => {
        scrollRange = Math.max(1, site.scrollHeight - window.innerHeight);
        scheduleTemperature();
      };
      const size =
        budget === 'full' && 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
      if (budget === 'full' && pathname === '/') {
        size?.observe(site);
        window.addEventListener('scroll', scheduleTemperature, { passive: true });
        window.addEventListener('resize', measure, { passive: true });
        measure();
      }
      const changes = new MutationObserver((records) => {
        if (disposed) return;
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement) register(node);
          }
        }
        // Release detached cards after filtering instead of retaining old DOM nodes.
        for (const element of ambientElements) {
          if (site.contains(element)) continue;
          ambient.unobserve(element);
          ambientElements.delete(element);
        }
      });
      changes.observe(site, { childList: true, subtree: true });

      const visibility = () => {
        site.dataset.motionPaused = String(document.hidden);
        if (!document.hidden) scheduleTemperature();
      };
      visibility();
      document.addEventListener('visibilitychange', visibility);
      disposeMotion = () => {
        disposed = true;
        ambient.disconnect();
        changes.disconnect();
        size?.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scheduleTemperature);
        window.removeEventListener('resize', measure);
        site.style.removeProperty('--mn-warm-light');
        site.style.removeProperty('--mn-cool-light');
        document.removeEventListener('visibilitychange', visibility);
        for (const element of ambientElements) delete element.dataset.motionVisible;
        ambientElements.clear();
        delete site.dataset.motionPaused;
      };
    };

    configure();
    return () => {
      disposeMotion();
      delete site.dataset.motionBudget;
    };
  }, [budget, enabled, pathname, root]);
}
