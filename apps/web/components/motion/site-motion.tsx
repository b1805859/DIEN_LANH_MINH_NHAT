'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, revealFrames } from '@/lib/motion/config';

/** Progressive enhancement: nothing is hidden while JS is unavailable. */
export function SiteMotion() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const revealed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.public-site');
    if (!root || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)');
    const registered = new WeakSet<Element>();
    const running = new Map<HTMLElement, Animation>();
    const seen = revealed.current;

    const cancelAnimations = () => {
      running.forEach((animation) => animation.cancel());
      running.clear();
    };
    const animate = (node: HTMLElement, variant: string, delay = 0) => {
      if (seen.has(node)) return;
      seen.add(node);
      node.dataset.motionState = 'visible';
      if (node.classList.contains('reveal')) node.dataset.revealState = 'visible';
      if (
        preference.matches ||
        document.hidden ||
        node.contains(document.activeElement) ||
        variant === 'workflow'
      )
        return;
      const hero = variant.startsWith('hero');
      const animation = node.animate(revealFrames(variant, compact.matches), {
        duration: hero
          ? motion.duration.hero
          : variant === 'header'
            ? motion.duration.reveal
            : variant === 'image'
              ? motion.duration.image
              : motion.duration.scroll,
        delay:
          Math.min(Math.max(0, delay) * motion.stagger.pacing, motion.stagger.maxDelay) *
          (compact.matches ? 0.55 : 1),
        easing: hero || variant === 'header' ? motion.easing.enter : motion.easing.scroll,
        fill: 'backwards',
      });
      running.set(node, animation);
      animation.onfinish = () => {
        animation.cancel();
        running.delete(node);
      };
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < motion.viewport.threshold) continue;
        const node = entry.target as HTMLElement;
        const group = node.parentElement;
        const stagger = group?.hasAttribute('data-motion-stagger');
        const step = Number(group?.dataset.motionStagger) || motion.stagger.normal;
        const index = stagger ? Array.from(group!.children).indexOf(node) : 0;
        const delay =
          node.dataset.motionDelay !== undefined
            ? Number(node.dataset.motionDelay) || 0
            : index * step;
        animate(node, node.dataset.motion || group?.dataset.motionGroupVariant || 'up', delay);
        observer.unobserve(node);
      }
    }, motion.viewport);

    const register = (node: HTMLElement) => {
      if (registered.has(node) || seen.has(node) || node.matches('script, style, dialog, .sr-only'))
        return;
      registered.add(node);
      if (node.dataset.motion?.startsWith('hero') || node.dataset.motion === 'header') {
        animate(node, node.dataset.motion, Number(node.dataset.motionDelay) || 0);
      } else observer.observe(node);
    };
    const scan = (scope: HTMLElement) => {
      if (scope.matches('[data-motion], [data-motion-stagger] > *')) register(scope);
      scope
        .querySelectorAll<HTMLElement>('[data-motion], [data-motion-stagger] > *')
        .forEach(register);
    };
    // Deferring one frame avoids starting/cancelling the entrance during Strict Mode's probe.
    const initialFrame = requestAnimationFrame(() => scan(root));

    // Discover streamed content and new gallery/filter items; never scan on scroll.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node);
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observer.unobserve(node);
          node
            .querySelectorAll('[data-motion], [data-motion-stagger] > *')
            .forEach((child) => observer.unobserve(child));
        });
      }
      running.forEach((animation, node) => {
        if (!node.isConnected) {
          animation.cancel();
          running.delete(node);
        }
      });
    });
    mutations.observe(root, { childList: true, subtree: true });
    const finishForFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const target = event.target;
      running.forEach((animation, node) => {
        if (node.contains(target)) {
          animation.cancel();
          running.delete(node);
        }
      });
    };
    const onPreference = () => {
      if (preference.matches) cancelAnimations();
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimations();
    };
    root.addEventListener('focusin', finishForFocus);
    preference.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);

    // Never delay navigation, remount forms, or transform fixed UI.
    if (previousPath.current !== pathname && !preference.matches) {
      const content = root.querySelector<HTMLElement>('#main-content');
      if (content) {
        const entry = content.animate([{ opacity: 0.88 }, { opacity: 1 }], {
          duration: motion.duration.normal,
          easing: motion.easing.enter,
        });
        running.set(content, entry);
        entry.onfinish = () => {
          entry.cancel();
          running.delete(content);
        };
      }
    }
    previousPath.current = pathname;
    return () => {
      cancelAnimationFrame(initialFrame);
      observer.disconnect();
      mutations.disconnect();
      root.removeEventListener('focusin', finishForFocus);
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimations();
    };
  }, [pathname]);
  return null;
}
