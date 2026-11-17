'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

// Prepare each reveal offscreen so it can replay as the reader scrolls back.
type MotionElement = HTMLElement | SVGElement;
const homeTargets = [
  '.mn-home .mn-section-heading .mn-kicker',
  '.mn-home .mn-section-heading h2',
  '.mn-home .mn-section-heading > .mn-text-link',
  '.mn-home-services-intro > :is(p, .mn-text-link)',
  '.mn-home-service-controls',
  '.mn-home-showcase-heading > :is(h2, .mn-text-link)',
  '.mn-home .mn-service-card',
  '.mn-home-about-photo',
  '.mn-home-about > div:last-child > :is(p, h2, .mn-text-link)',
  '.mn-home .mn-reasons > article',
  '.mn-home .mn-tabs',
  '.mn-home .mn-project-card',
  '.mn-home .mn-area-chips > *',
  '.mn-home .mn-area-selection',
  '.mn-home .mn-verified-map-wrap',
  '.mn-home .mn-map-source',
  '.mn-home .mn-process-grid > article',
  '.mn-home .mn-journey-milestone',
  '.mn-footer-grid > div',
  '.mn-footer-bottom',
].join(',');

// Inner pages follow the same bidirectional scroll rhythm as Home.
const innerTargets = [
  'main .mn-section-heading .mn-kicker',
  'main .mn-section-heading h2',
  'main .mn-section-heading > .mn-text-link',
  'main .mn-service-card',
  'main .mn-project-card',
  'main :is(.mn-tabs, .mn-filters, .mn-catalog-toggle)',
  'main .mn-process-grid > article',
  'main .mn-journey-milestone',
  'main .mn-reasons > article',
  'main .mn-about-facts > div',
  'main .mn-team-photo',
  'main .mn-image-note',
  'main .mn-area-copy > :is(h2, p)',
  'main .mn-area-chips > *',
  'main .mn-area-selection',
  'main .mn-verified-map-wrap',
  'main .mn-support',
  'main :is(.mn-booking-shell, .mn-detail-booking, .mn-contact-map)',
  'main .mn-contact-methods > a',
  'main :is(.mn-contact-email, .mn-contact-hint)',
  'main .mn-faq-card',
  'main .mn-detail-layout > article > :is(.mn-text-link, .mn-detail-description, .mn-faq-heading, .mn-actions)',
  'main .mn-service-symptoms > li',
  'main .mn-faq-list > details',
  'main .mn-article > :is(a, p, h2, .mn-actions)',
  'main .mn-editorial-layout > article > :is(p, h2, div)',
  'main .mn-editorial-layout > aside:last-child > p',
  'main .mn-editorial-layout > aside:last-child > div > a',
  '.mn-footer-grid > div',
  '.mn-footer-bottom',
].join(',');

export function canMotionHover(element: Element) {
  return !element.closest('[data-mn-hover-blocked]');
}

export function useHomeMotion(root: RefObject<HTMLDivElement | null>, pathname: string) {
  usePageScrollMotion(root, pathname, true);
}

export function useInnerPageMotion(root: RefObject<HTMLDivElement | null>, pathname: string) {
  usePageScrollMotion(root, pathname, false);
}

function usePageScrollMotion(root: RefObject<HTMLDivElement | null>, pathname: string, home: boolean) {
  const budget = useMotionBudget();

  useEffect(() => {
    const site = root.current;
    if ((pathname === '/') !== home || pathname.startsWith('/admin') || !site || budget === 'reduced') return;
    const revealTargets = home ? homeTargets : innerTargets;
    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    let refreshFrame = 0;
    const triggers = new Map<MotionElement, ScrollTrigger>();
    const tweens = new Map<MotionElement, gsap.core.Tween>();

    const context = gsap.context(() => {}, site);
    const register = (node: MotionElement) => {
      const targets = [node, ...node.querySelectorAll<MotionElement>(revealTargets)].filter(
        (element) =>
          element.matches(revealTargets) &&
          !triggers.has(element) &&
          !element.hasAttribute('data-reveal') &&
          !element.closest('[data-reveal]') &&
          (home || !element.closest('[inert], dialog')),
      );
      context.add(() => {
        for (const element of targets) {
          const isFooterItem = !!element.closest('.mn-home-footer');
          const distance = isFooterItem ? 6 : budget === 'limited' ? 8 : 12;
          const enterDuration = isFooterItem ? 0.22 : budget === 'limited' ? 0.24 : 0.34;

          const setReady = (ready: boolean) => {
            const state = ready ? 'ready' : 'pending';
            if (element.dataset.mnReveal === state) return;
            element.dataset.mnReveal = state;
            element.toggleAttribute('data-mn-hover-blocked', !ready);
            const card = element.closest<MotionElement>('.mn-service-card, .mn-project-card');
            if (card)
              card.toggleAttribute(
                'data-mn-hover-blocked',
                card.dataset.mnReveal !== 'ready' ||
                  !!card.querySelector('[data-mn-reveal="pending"]'),
              );
          };

          const hasKeyboardFocus = () => {
            const focused = document.activeElement;
            return focused?.matches(':focus-visible') && element.contains(focused);
          };

          const prepareEnter = () => {
            if (hasKeyboardFocus()) return;
            tweens.get(element)?.kill();
            tweens.delete(element);
            setReady(false);
            gsap.set(element, { opacity: 0, clearProps: 'transform' });
          };

          const playEnter = (fromDirection: 'bottom' | 'top') => {
            if (element.dataset.mnReveal === 'ready' || hasKeyboardFocus()) return;
            tweens.get(element)?.kill();
            const tween = gsap.fromTo(
              element,
              { opacity: 0, y: fromDirection === 'bottom' ? distance : -distance * 0.8 },
              {
                opacity: 1,
                y: 0,
                duration: enterDuration,
                ease: 'sine.out',
                overwrite: 'auto',
                onComplete: () => {
                  gsap.set(element, { clearProps: 'transform' });
                  setReady(true);
                  tweens.delete(element);
                },
              },
            );
            tweens.set(element, tween);
          };

          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight + 40 || hasKeyboardFocus()) {
            gsap.set(element, { opacity: 1, clearProps: 'transform' });
            setReady(true);
          } else {
            prepareEnter();
          }

          const st = ScrollTrigger.create({
            trigger: element,
            start: 'top bottom',
            once: true,
            onEnter: () => playEnter('bottom'),
          });

          triggers.set(element, st);
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
      for (const [target] of triggers) {
        if (target.contains(element) || element.contains(target)) {
          tweens.get(target)?.kill();
          gsap.set(target, { opacity: 1, clearProps: 'transform' });
          target.dataset.mnReveal = 'ready';
          target.removeAttribute('data-mn-hover-blocked');
        }
      }
    };
    site.addEventListener('focusin', revealFocused);

    // Tabs replace their cards. Register only new content and release removed nodes.
    const changes = new MutationObserver((records) => {
      if (disposed) return;
      let changed = false;
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof HTMLElement || node instanceof SVGElement) {
            if (register(node)) changed = true;
          }
        }
      }
      for (const [element, st] of triggers) {
        if (site.contains(element)) continue;
        tweens.get(element)?.kill();
        tweens.delete(element);
        st.kill();
        triggers.delete(element);
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
      cancelAnimationFrame(refreshFrame);
      site.removeEventListener('focusin', revealFocused);
      for (const tween of tweens.values()) tween.kill();
      for (const st of triggers.values()) st.kill();
      context.revert();
      for (const element of triggers.keys()) {
        delete element.dataset.mnReveal;
        element.removeAttribute('data-mn-hover-blocked');
      }
      tweens.clear();
      triggers.clear();
      site.removeAttribute('data-mn-hover-blocked');
    };
  }, [budget, pathname, root, home]);
}
