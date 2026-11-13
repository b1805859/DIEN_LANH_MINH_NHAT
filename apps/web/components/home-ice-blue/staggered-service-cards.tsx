// Lucian UX/UI Prompt #251 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#251
'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './staggered-service-cards.module.css';

const targetSelector = '[data-u251-card]';

export function StaggeredServiceCards({ className, labelledBy, children, animateInitiallyVisible = false }: {
  className: string;
  labelledBy: string;
  children: ReactNode;
  animateInitiallyVisible?: boolean;
}) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root || typeof IntersectionObserver !== 'function') return;

    const targets = root.querySelectorAll<HTMLElement>(targetSelector);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio >= .18) {
          element.dataset.u251State = 'in';
        } else if (
          entry.boundingClientRect.width === 0 ||
          (!entry.isIntersecting && entry.rootBounds && entry.boundingClientRect.top >= entry.rootBounds.bottom - 1)
        ) {
          element.dataset.u251State = 'pending';
        }
      }
    }, { threshold: [0, .18] });

    for (const element of targets) {
      // Keep already visible content stable unless this group requests an entrance on load.
      element.dataset.u251State = !animateInitiallyVisible && element.getClientRects().length &&
        element.getBoundingClientRect().top < window.innerHeight
        ? 'in'
        : 'pending';
      observer.observe(element);
    }

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('[data-u251-card]');
      if (card) card.dataset.u251State = 'in';
    };
    let frame = 0;
    let lastScroll = window.scrollY;
    const resetOnScrollUp = () => {
      const scroll = window.scrollY;
      // A scrollbar or Home-key jump can skip all observer thresholds.
      if (scroll < lastScroll && !frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          for (const element of targets) {
            if (element.dataset.u251State === 'in' &&
                element.getBoundingClientRect().top >= window.innerHeight) {
              element.dataset.u251State = 'pending';
            }
          }
        });
      }
      lastScroll = scroll;
    };
    window.addEventListener('scroll', resetOnScrollUp, { passive: true });
    root.addEventListener('focusin', onFocus);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', resetOnScrollUp);
      cancelAnimationFrame(frame);
      root.removeEventListener('focusin', onFocus);
      for (const element of targets) delete element.dataset.u251State;
    };
  }, [animateInitiallyVisible]);

  return (
    <section ref={section} className={`${className} ${styles.u251}`} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
