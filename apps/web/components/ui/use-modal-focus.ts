'use client';

import { useEffect, type RefObject } from 'react';

/** Keep keyboard focus in a modal and return it to its invoker on dismissal. */
export function useModalFocus(open: boolean, ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const panel = ref.current;
    if (!open || !panel) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) => element.getClientRects().length > 0 && !element.closest('[inert], [hidden]'),
      );
    (focusable()[0] ?? panel).focus({ preventScroll: true });
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const targets = focusable();
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first || !last) {
        event.preventDefault();
        panel.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first || !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !panel.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [open, ref]);
}
