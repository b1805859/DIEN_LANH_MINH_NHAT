'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

// Reveal each visible detail at its own position, including content near the
// bottom of tall cards. Replay in either scroll direction at a readable pace.
type MotionElement = HTMLElement | SVGElement;
const homeTargets = [
  '.mn-home .mn-section-heading .mn-kicker',
  '.mn-home .mn-section-heading h2:not(:has(.mn-heading-title))',
  '.mn-home .mn-heading-title',
  '.mn-home .mn-section-heading h2 em:is(.mn-home-services *)',
  '.mn-home .mn-section-heading > .mn-text-link',
  '.mn-home .mn-service-card',
  '.mn-home :is(.mn-service-card, .mn-project-card) .mn-card-photo > img',
  '.mn-home .mn-service-card .mn-card-copy :is(.mn-icon-box, h3, p, .mn-card-arrow)',
  '.mn-home .mn-project-card :is(.mn-demo-tag, .mn-project-copy > h3, .mn-project-copy > p, .mn-project-copy > div)',
  '.mn-home-about',
  '.mn-home-about-photo',
  '.mn-home-about-photo > img',
  '.mn-about-brand-badge',
  '.mn-home-about > div:last-child > :is(p, h2, .mn-text-link)',
  '.mn-home .mn-reasons > article',
  '.mn-home .mn-reasons > article > :is(svg, h3, p)',
  '.mn-home .mn-tabs',
  '.mn-home .mn-project-card',
  '.mn-home .mn-service-area',
  '.mn-home .mn-area-copy > :is(h2, p)',
  '.mn-home .mn-area-chips > *',
  '.mn-home .mn-area-selection',
  '.mn-home .mn-verified-map-wrap',
  '.mn-home .mn-verified-map',
  '.mn-home .mn-map-source',
  '.mn-home .mn-process-grid > article',
  '.mn-home .mn-process-grid > article > :is(span, h3, p)',
  '.mn-home .mn-process-grid',
  '.mn-footer',
  '.mn-footer-grid > div > *',
  '.mn-footer-bottom',
  '.mn-footer-bottom > span',
  '.mn-footer-bottom a',
].join(',');

export function canMotionHover(element: Element) {
  return !element.closest('[data-mn-hover-blocked]');
}

export function useHomeMotion(root: RefObject<HTMLDivElement | null>, pathname: string) {
  const budget = useMotionBudget();

  useEffect(() => {
    const site = root.current;
    if (pathname !== '/' || !site) return;
    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    let scrolling = false;
    let idleTimer = 0;
    let refreshFrame = 0;
    const tweens = new Map<MotionElement, gsap.core.Tween>();
    const blockHover = () => {
      if (!site.hasAttribute('data-mn-hover-blocked'))
        site.setAttribute('data-mn-hover-blocked', '');
      scrolling = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        scrolling = false;
        // A stationary pointer must not hover a card that scrolled underneath it.
        // Hover is restored only by a subsequent intentional mouse movement.
      }, 180);
    };
    const allowHover = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !scrolling && (event.movementX || event.movementY))
        site.removeAttribute('data-mn-hover-blocked');
    };
    site.setAttribute('data-mn-hover-blocked', '');
    window.addEventListener('scroll', blockHover, { passive: true });
    window.addEventListener('wheel', blockHover, { passive: true });
    window.addEventListener('touchmove', blockHover, { passive: true });
    window.addEventListener('pointermove', allowHover, { passive: true, capture: true });

    const context = gsap.context(() => {}, site);
    const register = (node: MotionElement) => {
      const targets = [node, ...node.querySelectorAll<MotionElement>(homeTargets)].filter(
        (element) => element.matches(homeTargets) && !tweens.has(element),
      );
      context.add(() => {
        for (const element of targets) {
          const siblings = Array.from(element.parentElement?.children ?? []).filter((sibling) =>
            sibling.matches(homeTargets),
          );
          const index = siblings.indexOf(element);
          const stagger = Math.min(Math.max(index, 0), 4) * 0.04;
          const reduced = budget === 'reduced';
          const surface = element.matches(
            '.mn-home-about, .mn-home-about-photo, .mn-service-area, .mn-verified-map-wrap, .mn-process-grid, .mn-service-card, .mn-project-card, .mn-reasons > article, .mn-process-grid > article, .mn-tabs, .mn-footer, .mn-footer-bottom',
          );
          const footer = !!element.closest('.mn-footer');
          const distance = reduced || surface ? 0 : budget === 'limited' ? 12 : 24;
          const from = {
            opacity: 0,
            y: distance,
          };
          if (reduced) from.y = 0;
          element.dataset.mnReveal = 'pending';
          element.setAttribute('data-mn-hover-blocked', '');
          const setReady = (ready: boolean) => {
            const state = ready ? 'ready' : 'pending';
            if (element.dataset.mnReveal === state) return;
            element.dataset.mnReveal = state;
            element.toggleAttribute('data-mn-hover-blocked', !ready);
            // A card becomes hoverable only after its last detail has appeared.
            const card = element.closest<MotionElement>('.mn-service-card, .mn-project-card');
            if (card)
              card.toggleAttribute(
                'data-mn-hover-blocked',
                card.dataset.mnReveal !== 'ready' ||
                  !!card.querySelector('[data-mn-reveal="pending"]'),
              );
          };
          const position = (edge: 'enter' | 'leave') => {
            const max = Math.max(1, site.offsetTop + site.offsetHeight - window.innerHeight);
            const top =
              element.getBoundingClientRect().top +
              window.scrollY -
              Number(gsap.getProperty(element, 'y'));
            // Every footer item must trigger before the page reaches its end.
            const start = Math.max(0, Math.min(top - window.innerHeight * 0.96, max - 1));
            const header = site.querySelector('.mn-header')?.getBoundingClientRect().height ?? 64;
            return edge === 'enter'
              ? start
              : Math.max(start + 1, top + element.getBoundingClientRect().height - header);
          };

          const tween = gsap.fromTo(element, from, {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.18 : footer ? 0.85 : budget === 'limited' ? 0.6 : 0.7,
            delay: reduced || surface ? 0 : stagger,
            ease: reduced ? 'power1.out' : 'sine.out',
            onUpdate() {
              setReady(this.progress() >= 0.999);
            },
            onComplete: () => setReady(true),
            onReverseComplete: () => setReady(false),
            // Release the transform at rest so CSS hover can take over cleanly.
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: element,
              start: () => position('enter'),
              end: () => position('leave'),
              toggleActions: 'play reverse play reverse',
            },
          });
          tweens.set(element, tween);
        }
      });
      return targets.length > 0;
    };
    register(site);

    // Keyboard users can focus a link before its scroll entrance has completed.
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element) || !event.target.matches(':focus-visible')) return;
      const element = event.target.closest<MotionElement>('[data-mn-reveal]');
      if (!element) return;
      for (const [target, tween] of tweens)
        if (target.contains(element) || element.contains(target)) tween.progress(1);
    };
    site.addEventListener('focusin', revealFocused);

    // Tabs replace their cards. Register only new content and release removed nodes.
    const changes = new MutationObserver((records) => {
      if (disposed) return;
      let changed = false;
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement || node instanceof SVGElement) {
            // Hover rings and live labels do not change reveal geometry.
            // Only newly registered motion targets need a global refresh.
            if (register(node)) changed = true;
          }
        }
      }
      for (const [element, tween] of tweens) {
        if (site.contains(element)) continue;
        tween.scrollTrigger?.kill();
        tween.revert();
        tweens.delete(element);
        changed = true;
      }
      if (changed && !refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
    });
    changes.observe(site, { subtree: true, childList: true });

    // Fonts and responsive section heights can change trigger positions after hydration.
    const size = new ResizeObserver(() => {
      if (!refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
    });
    size.observe(site);
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      changes.disconnect();
      size.disconnect();
      window.clearTimeout(idleTimer);
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener('scroll', blockHover);
      window.removeEventListener('wheel', blockHover);
      window.removeEventListener('touchmove', blockHover);
      window.removeEventListener('pointermove', allowHover, true);
      site.removeEventListener('focusin', revealFocused);
      context.revert();
      for (const element of tweens.keys()) {
        delete element.dataset.mnReveal;
        element.removeAttribute('data-mn-hover-blocked');
      }
      tweens.clear();
      site.removeAttribute('data-mn-hover-blocked');
    };
  }, [budget, pathname, root]);
}
