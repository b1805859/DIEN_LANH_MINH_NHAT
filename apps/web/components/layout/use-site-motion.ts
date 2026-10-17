'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

const revealTargets = [
  '.mn-section-heading',
  '.mn-service-card',
  '.mn-project-card',
  '.mn-process-grid > article',
  '.mn-reasons > article',
  '.mn-home-about',
  '.mn-service-area',
  '.mn-support',
  '.mn-about-facts',
  '.mn-team-photo',
  '.mn-faq-card',
  '.mn-contact-map',
  '.mn-booking-shell',
  '.mn-detail-booking',
  '.mn-contact-methods > a',
  '.mn-contact-email',
  '.mn-article',
  '.mn-editorial-hero',
  '.mn-editorial-layout > article',
].join(',');
const ambientTargets = '.mn-home-hero, .mn-page-hero, .mn-service-area, .mn-contact-map';

// Animate the existing DOM without inserting wrappers or hiding content in CSS.
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

      const known = new WeakSet<HTMLElement>();
      const ambientElements = new Set<HTMLElement>();
      const animations = new Set<Animation>();
      const pausedAnimations = new Set<Animation>();
      let disposed = false;

      const playEntrance = (
        element: HTMLElement,
        frames: Keyframe[],
        duration: number,
        delay = 0,
      ) => {
        if (!element.animate) return;
        const animation = element.animate(frames, {
          duration,
          delay,
          easing: 'cubic-bezier(0.22,1,0.36,1)',
          fill: 'backwards',
        });
        animations.add(animation);
        const release = () => {
          animations.delete(animation);
          pausedAnimations.delete(animation);
        };
        animation.finished.then(release, release);
      };

      const reveal = new IntersectionObserver(
        (entries) => {
          if (disposed) return;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target as HTMLElement;
            reveal.unobserve(element);
            if (
              disposed ||
              document.hidden ||
              !element.animate ||
              element.closest('[inert], [aria-hidden="true"]')
            )
              continue;

            // One coordinated entrance on Home; never move or continuously animate the person.
            if (pathname === '/' && element.matches('.mn-home-about')) {
              const photo = element.querySelector<HTMLElement>('.mn-home-about-photo');
              if (photo)
                playEntrance(
                  photo,
                  budget === 'full'
                    ? [
                        { opacity: 0.55, clipPath: 'inset(0 5% 0 0)' },
                        { opacity: 1, clipPath: 'inset(0 0 0 0)' },
                      ]
                    : [{ opacity: 0.7 }, { opacity: 1 }],
                  budget === 'full' ? 560 : 250,
                );
              const copy = element.querySelector<HTMLElement>(':scope > div:last-child');
              copy
                ?.querySelectorAll<HTMLElement>(
                  ':scope > .mn-kicker, :scope > h2, :scope > p, .mn-reasons > article, :scope > .mn-text-link',
                )
                .forEach((target, index) =>
                  playEntrance(
                    target,
                    [
                      { opacity: 0.4, transform: 'translateY(8px)' },
                      { opacity: 1, transform: 'translateY(0)' },
                    ],
                    budget === 'full' ? 480 : 250,
                    Math.min(index, 6) * (budget === 'full' ? 45 : 20),
                  ),
                );
              continue;
            }

            const siblings = Array.from(element.parentElement?.children || []).filter((sibling) =>
              sibling.matches(revealTargets),
            );
            const delay = Math.min(Math.max(siblings.indexOf(element), 0), 4) * 40;
            const isCard = element.matches('.mn-service-card, .mn-project-card');
            playEntrance(
              element,
              [
                { opacity: 0.35, transform: `translateY(${isCard ? 6 : 12}px)` },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              isCard ? 280 : 420,
              delay,
            );
          }
        },
        { threshold: 0, rootMargin: '0px 0px -24px 0px' },
      );

      const ambient = new IntersectionObserver((entries) => {
        if (disposed) return;
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.motionVisible = String(entry.isIntersecting);
        }
      });

      const register = (node: HTMLElement) => {
        const candidates = [node, ...node.querySelectorAll<HTMLElement>(revealTargets)];
        for (const element of candidates) {
          if (known.has(element) || !element.matches(revealTargets)) continue;
          known.add(element);
          // A parent panel already supplies the entrance for its nested content.
          if (element.parentElement?.closest(revealTargets)) continue;
          reveal.observe(element);
        }
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
      if (budget === 'full') {
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
        for (const node of records.flatMap((record) => Array.from(record.removedNodes))) {
          if (!(node instanceof HTMLElement) || site.contains(node)) continue;
          reveal.unobserve(node);
          node.querySelectorAll(revealTargets).forEach((element) => reveal.unobserve(element));
        }
      });
      changes.observe(site, { childList: true, subtree: true });

      const visibility = () => {
        site.dataset.motionPaused = String(document.hidden);
        if (document.hidden) {
          for (const animation of animations) {
            if (animation.playState !== 'running') continue;
            animation.pause();
            pausedAnimations.add(animation);
          }
        } else {
          for (const animation of pausedAnimations) animation.play();
          pausedAnimations.clear();
          scheduleTemperature();
        }
      };
      visibility();
      document.addEventListener('visibilitychange', visibility);
      disposeMotion = () => {
        disposed = true;
        reveal.disconnect();
        ambient.disconnect();
        changes.disconnect();
        size?.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', scheduleTemperature);
        window.removeEventListener('resize', measure);
        site.style.removeProperty('--mn-warm-light');
        site.style.removeProperty('--mn-cool-light');
        document.removeEventListener('visibilitychange', visibility);
        for (const animation of animations) animation.cancel();
        animations.clear();
        pausedAnimations.clear();
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
