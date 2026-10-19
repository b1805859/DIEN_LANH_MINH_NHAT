'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionBudget } from '@/components/ui/use-motion-budget';

// Each detail has its own short scroll range. Scrolling back through that
// range reverses only that detail, in the opposite order to its entrance.
// Structural and interactive surfaces only fade:
// adding/removing transforms there can change an absolute child's containing block.
type MotionElement = HTMLElement | SVGElement;
const homeTargets = [
  '.mn-home .mn-section-heading .mn-kicker',
  '.mn-home .mn-section-heading h2:not(:has(.mn-heading-title))',
  '.mn-home .mn-heading-title',
  '.mn-home .mn-section-heading h2 em:is(.mn-home-services *)',
  '.mn-home .mn-section-heading > .mn-text-link',
  '.mn-home-services-intro > :is(p, .mn-text-link)',
  '.mn-home-service-controls',
  '.mn-home-showcase-heading > :is(h2, .mn-text-link)',
  '.mn-home .mn-service-card',
  '.mn-home :is(.mn-service-card, .mn-project-card) .mn-card-photo > img',
  '.mn-home .mn-service-card .mn-card-copy :is(.mn-icon-box, h3, p, .mn-card-arrow)',
  '.mn-home .mn-project-card :is(.mn-demo-tag, .mn-project-copy > h3, .mn-project-copy > p, .mn-project-copy > div)',
  '.mn-home-about-photo',
  '.mn-about-brand-badge',
  '.mn-home-about > div:last-child > :is(p, h2, .mn-text-link)',
  '.mn-home .mn-reasons > article',
  '.mn-home .mn-reasons > article > :is(svg, h3, p)',
  '.mn-home .mn-tabs',
  '.mn-home .mn-project-card',
  '.mn-home .mn-area-copy > :is(h2, p)',
  '.mn-home .mn-area-chips > *',
  '.mn-home .mn-area-selection',
  '.mn-home .mn-verified-map-wrap',
  '.mn-home .mn-verified-map',
  '.mn-home .mn-map-source',
  '.mn-home .mn-process-grid > article',
  '.mn-home .mn-process-illustration',
  '.mn-home .mn-journey-connector',
  '.mn-home .mn-journey-milestone',
  '.mn-home-process-journey .mn-section-heading h2 em',
  '.mn-home .mn-process-grid > article > :is(span, h3, p, .mn-home-process-icon)',
  '.mn-footer-grid > div > *',
  '.mn-footer-bottom > span',
  '.mn-footer-bottom a',
].join(',');

// Inner pages follow the same reversible scroll rhythm as Home. Keep forms,
// maps and cards free of transforms so sticky positioning and hover still work.
const innerTargets = [
  'main .mn-section-heading .mn-kicker',
  'main .mn-section-heading h2',
  'main .mn-section-heading > .mn-text-link',
  'main .mn-service-card',
  'main .mn-service-card .mn-card-photo > img',
  'main .mn-service-card .mn-card-copy :is(.mn-icon-box, h3, p, .mn-card-arrow)',
  'main .mn-project-card',
  'main .mn-project-card .mn-card-photo > img',
  'main .mn-project-copy > :is(h3, p, div)',
  'main :is(.mn-tabs, .mn-filters, .mn-catalog-toggle)',
  'main .mn-process-grid > article',
  'main .mn-process-illustration',
  'main .mn-home-process-icon',
  'main .mn-journey-connector',
  'main .mn-journey-milestone',
  'main .mn-home-process-journey h2 em',
  'main .mn-process-grid > article > :is(span, h3, p)',
  'main .mn-reasons > article',
  'main .mn-reasons > article > :is(svg, h3, p)',
  'main .mn-about-facts > div',
  'main .mn-team-photo',
  'main .mn-image-note',
  'main .mn-service-area',
  'main .mn-area-copy > :is(h2, p)',
  'main .mn-area-chips > *',
  'main .mn-area-selection',
  'main .mn-verified-map-wrap',
  'main .mn-verified-map',
  'main .mn-support',
  'main .mn-support > div > :is(h2, p, a)',
  'main :is(.mn-booking-shell, .mn-detail-booking, .mn-contact-map)',
  'main .mn-contact-methods > a',
  'main :is(.mn-contact-email, .mn-contact-hint)',
  'main .mn-faq-card',
  'main .mn-faq-card > :is(h2, p)',
  'main .mn-detail-layout > article > :is(.mn-text-link, .mn-detail-description, .mn-faq-heading, .mn-actions)',
  'main .mn-service-symptoms > li',
  'main .mn-faq-list > details',
  'main .mn-article > :is(a, p, h2, .mn-actions)',
  'main .mn-editorial-layout > article > :is(p, h2, div)',
  'main .mn-editorial-layout > aside:last-child > p',
  'main .mn-editorial-layout > aside:last-child > div > a',
  '.mn-footer-grid > div > *',
  '.mn-footer-bottom > span',
  '.mn-footer-bottom a',
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
      const targets = [node, ...node.querySelectorAll<MotionElement>(revealTargets)].filter(
        (element) =>
          element.matches(revealTargets) &&
          !tweens.has(element) &&
          (home || !element.closest('[inert], dialog')),
      );
      context.add(() => {
        for (const element of targets) {
          const siblings = Array.from(element.parentElement?.children ?? []).filter((sibling) =>
            sibling.matches(revealTargets) && !sibling.matches('.mn-journey-connector, .mn-journey-milestone'),
          );
          const index = element.matches('.mn-journey-milestone')
            ? Number(element.dataset.stepIndex)
            : siblings.indexOf(element);
          // Offset siblings slightly in scroll space, so a row also unfolds in order.
          const process = !!element.closest('.mn-home-process-journey');
          const processCard = process ? element.closest<HTMLElement>('.mn-process-grid > article') : null;
          const processCards = processCard
            ? Array.from(processCard.parentElement?.querySelectorAll(':scope > article') ?? [])
            : [];
          const scrollOffset = processCard
            ? processCards.indexOf(processCard) * 16 +
              (element === processCard ? 0 : Math.min(Math.max(index, 0), 4) * 16)
            : Math.min(Math.max(index, 0), 4) * (process ? 24 : 12);
          const surface = element.matches(
            '.mn-home-about, .mn-home-about-photo, .mn-service-area, .mn-verified-map-wrap, .mn-process-grid, .mn-service-card, .mn-project-card, .mn-reasons > article, .mn-process-grid > article, .mn-tabs, .mn-footer, .mn-footer-bottom, .mn-home-service-controls, .mn-home-process-icon, .mn-icon-box, .mn-card-arrow, .mn-card-photo > img, .mn-project-copy > div, .mn-process-illustration, .mn-journey-connector, .mn-journey-milestone, .mn-home-process-journey h2 em',
          ) || (!home && element.matches(
            '.mn-booking-shell, .mn-detail-booking, .mn-contact-map, .mn-contact-email, .mn-contact-methods > a, .mn-support, .mn-service-area, .mn-team-photo, .mn-tabs, .mn-filters, .mn-faq-card, .mn-faq-list > details, .mn-service-symptoms > li, .mn-project-copy > div, .mn-about-facts > div, .mn-editorial-layout > aside:last-child > div > a',
          ));
          const distance = surface ? 0 : budget === 'limited' ? 10 : 22;
          const from = {
            opacity: 0,
            ...(distance ? { y: distance } : {}),
          };
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
          const position = (edge: 'start' | 'end') => {
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            // Start all details from their card's entrance. Tall cartoons must
            // not postpone the description until it is already on screen.
            const anchor = processCard ?? element;
            const top =
              anchor.getBoundingClientRect().top +
              window.scrollY -
              Number(gsap.getProperty(anchor, 'y'));
            const range = Math.min(
              max,
              process
                ? Math.max(100, Math.min(180, window.innerHeight * 0.2))
                : Math.max(64, Math.min(120, window.innerHeight * 0.14)),
            );
            // Reserve the full range for the last footer details before the page ends.
            const start = Math.max(
              0,
              Math.min(top - window.innerHeight * 0.92 + scrollOffset, max - range),
            );
            return edge === 'start' ? start : start + range;
          };

          // Visible content (including freshly filtered cards and short pages)
          // enters immediately instead of requiring an extra scroll to read it.
          const bounds = element.getBoundingClientRect();
          const enterNow = !home && bounds.top < window.innerHeight && bounds.bottom > 0;
          const tween = gsap.fromTo(element, from, {
            opacity: 1,
            ...(distance ? { y: 0 } : {}),
            duration: enterNow ? 0.42 : 1,
            delay: enterNow ? Math.min(Math.max(index, 0), 4) * 0.04 : 0,
            ease: home ? 'none' : 'power1.out',
            onUpdate() {
              setReady(this.progress() >= 0.999);
            },
            onComplete: () => setReady(true),
            onReverseComplete: () => setReady(false),
            // Keep the end values so reverse can retrace the same tween reliably.
            // Hoverable surfaces animate opacity only, leaving CSS transforms free.
            scrollTrigger: enterNow ? undefined : {
              trigger: element,
              start: () => position('start'),
              end: () => position('end'),
              scrub: process ? 0.35 : budget === 'limited' ? 0.12 : 0.2,
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
        if (target.contains(element) || element.contains(target)) tween.progress(1).pause();
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
  }, [budget, pathname, root, home]);
}
