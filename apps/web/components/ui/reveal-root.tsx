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
        rootMargin: '160px 0px 120px 0px',
        threshold: 0.01,
      },
    );

    const observePending = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        '[data-reveal=""]:not([data-reveal="in"]), [data-reveal="up"]:not([data-reveal="in"]), [data-reveal="left"]:not([data-reveal="in"]), [data-reveal="right"]:not([data-reveal="in"]), [data-reveal="scale"]:not([data-reveal="in"])',
      );
      const viewportEdge = window.innerHeight + 90;
      const nearDocBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 240;
      elements.forEach((el) => {
        // Reveal elements already inside/above the initial viewport or near document bottom immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportEdge || rect.bottom < 0 || nearDocBottom) {
          el.dataset.reveal = 'in';
          observer.unobserve(el);
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observePending();

    let scrollRaf = 0;
    const onScrollCheck = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        observePending();
      });
    };
    window.addEventListener('scroll', onScrollCheck, { passive: true });

    // Re-run after paint to catch late-hydrated elements
    const timer = setTimeout(observePending, 80);

    const mutationObserver = new MutationObserver(() => {
      observePending();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScrollCheck);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
