'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * High-performance, hardware-accelerated scroll reveal engine inspired by vietnet.net.vn.
 *
 * Characteristics:
 * 1. Uses native IntersectionObserver with rootMargin: '0px 0px -8% 0px' (anticipatory trigger).
 * 2. Unobserves targets immediately once revealed (single entrance, no flashing/disappearing on scroll back).
 * 3. Supports cascading stagger via CSS variable `--d` (e.g. style={{ '--d': `${i * 80}ms` }}).
 * 4. Uses MutationObserver to auto-discover dynamically added content (tabs, filters, modals).
 * 5. Respects prefers-reduced-motion: reduce (reveals instantly with no motion).
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        el.dataset.reveal = 'in';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.dataset.reveal = 'in';
            observer.unobserve(target);
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.05,
      },
    );

    const observePending = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '[data-reveal=""]:not([data-reveal="in"]), [data-reveal="up"]:not([data-reveal="in"]), [data-reveal="left"]:not([data-reveal="in"]), [data-reveal="right"]:not([data-reveal="in"]), [data-reveal="scale"]:not([data-reveal="in"])',
      );
      elements.forEach((el) => {
        // Elements already scrolled past above the screen stay revealed
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) {
          el.dataset.reveal = 'in';
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observePending();

    // Re-run after paint to catch late-hydrated elements
    const timer = setTimeout(observePending, 80);

    const mutationObserver = new MutationObserver(() => {
      observePending();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
