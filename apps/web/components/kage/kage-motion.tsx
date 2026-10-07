'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight scroll-scene controller for the cinematic public site.
 * - [data-k-reveal]            → sets data-k-in="true" once visible
 * - [data-k-parallax="0.12"]   → translateY relative to viewport centre
 * - [data-k-fade]              → fades/lifts out while scrolling past (hero)
 * - [data-k-steps]             → activates the child [data-k-step] nearest the centre,
 *                                writes --p to [data-k-progress] inside the same scene
 * - [data-k-gallery]           → pinned horizontal track ([data-k-track]) driven by scroll
 * Everything uses transform/opacity and a single rAF loop that only runs while scrolling.
 */
export function KageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 961px)');

    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-k-reveal]'));
    if (reduce.matches) {
      reveals.forEach((node) => node.setAttribute('data-k-in', 'true'));
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).setAttribute('data-k-in', 'true');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    if (!reduce.matches) reveals.forEach((node) => io.observe(node));

    const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-k-parallax]'));
    const fades = Array.from(document.querySelectorAll<HTMLElement>('[data-k-fade]'));
    const stepScenes = Array.from(document.querySelectorAll<HTMLElement>('[data-k-steps]'));
    const galleries = Array.from(document.querySelectorAll<HTMLElement>('[data-k-gallery]'));

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const motionOn = !reduce.matches;
      const strong = motionOn && desktop.matches;

      for (const node of parallax) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        const speed = Number(node.dataset.kParallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed * (strong ? 1 : 0.4);
        node.style.transform = motionOn ? `translate3d(0, ${offset.toFixed(1)}px, 0)` : '';
      }

      for (const node of fades) {
        if (!motionOn) break;
        const progress = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)));
        node.style.opacity = String(1 - progress * 0.9);
        node.style.transform = `translate3d(0, ${(progress * -60).toFixed(1)}px, 0)`;
      }

      for (const scene of stepScenes) {
        const steps = Array.from(scene.querySelectorAll<HTMLElement>('[data-k-step]'));
        let best = 0;
        let bestDistance = Infinity;
        steps.forEach((step, index) => {
          const rect = step.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height * 0.35 - vh * 0.5);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        steps.forEach((step, index) =>
          step.setAttribute('data-active', index <= best ? 'true' : 'false'),
        );
        const rect = scene.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / rect.height));
        scene
          .querySelectorAll<HTMLElement>('[data-k-progress]')
          .forEach((bar) => bar.style.setProperty('--p', progress.toFixed(3)));
      }

      for (const gallery of galleries) {
        const track = gallery.querySelector<HTMLElement>('[data-k-track]');
        if (!track) continue;
        if (!strong) {
          track.style.removeProperty('--x');
          continue;
        }
        const rect = gallery.getBoundingClientRect();
        const distance = rect.height - vh;
        const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, distance)));
        const max = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.setProperty('--x', `${(-max * progress).toFixed(1)}px`);
        gallery
          .querySelectorAll<HTMLElement>('[data-k-progress]')
          .forEach((bar) => bar.style.setProperty('--p', progress.toFixed(3)));
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    desktop.addEventListener('change', request);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      desktop.removeEventListener('change', request);
    };
  }, [pathname]);

  return null;
}
