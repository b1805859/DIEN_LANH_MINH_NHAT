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
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 60) {
          element.dataset.u251State = 'in';
          observer.unobserve(element);
        }
      }
    }, { rootMargin: '140px 0px 80px 0px', threshold: 0.01 });

    for (const element of targets) {
      // Keep already visible content stable unless this group requests an entrance on load.
      const isVisibleOnLoad =
        !animateInitiallyVisible &&
        element.getClientRects().length > 0 &&
        element.getBoundingClientRect().top < window.innerHeight + 40;
      element.dataset.u251State = isVisibleOnLoad ? 'in' : 'pending';
      if (!isVisibleOnLoad) {
        observer.observe(element);
      }
    }

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('[data-u251-card]');
      if (card) card.dataset.u251State = 'in';
    };
    root.addEventListener('focusin', onFocus);
    return () => {
      observer.disconnect();
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
