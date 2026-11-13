'use client';

import { useCallback, useEffect, useRef, type DragEvent, type MouseEvent, type PointerEvent } from 'react';

type Position = { x: number; y: number };
type Gesture = { id: number; start: Position; origin: Position; moved: boolean };
const mobileQuery = '(max-width: 900px), (max-height: 520px) and (pointer: coarse)';

/** Keeps a mobile contact bubble movable without changing its tap action. */
export function useDraggableBubble<T extends HTMLElement>() {
  const element = useRef<T | null>(null);
  const position = useRef<Position | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);

  const constrain = useCallback((node: T, next: Position) => {
    const viewport = window.visualViewport;
    const styles = getComputedStyle(document.documentElement);
    const safe = (edge: string) => parseFloat(styles.getPropertyValue(`--mn-safe-${edge}`)) || 0;
    const offsetLeft = viewport?.offsetLeft ?? 0;
    const offsetTop = viewport?.offsetTop ?? 0;
    const left = offsetLeft + safe('left') + 12;
    const top = offsetTop + safe('top') + 12;
    const right = offsetLeft + (viewport?.width ?? window.innerWidth) - safe('right') - 12 - node.offsetWidth;
    const bottom = offsetTop + (viewport?.height ?? window.innerHeight) - safe('bottom') - 12 - node.offsetHeight;
    return { x: Math.max(left, Math.min(next.x, right)), y: Math.max(top, Math.min(next.y, bottom)) };
  }, []);

  const place = useCallback((node: T, next: Position) => {
    const bounded = constrain(node, next);
    position.current = bounded;
    node.style.left = `${bounded.x}px`;
    node.style.top = `${bounded.y}px`;
    node.style.right = 'auto';
    node.style.bottom = 'auto';
    node.style.removeProperty('translate');
  }, [constrain]);

  const ref = useCallback((node: T | null) => {
    element.current = node;
    if (node && position.current && window.matchMedia(mobileQuery).matches) place(node, position.current);
  }, [place]);

  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    const sync = () => {
      const node = element.current;
      if (!node) return;
      gesture.current = null;
      node.removeAttribute('data-dragging');
      node.style.removeProperty('translate');
      if (media.matches) {
        if (position.current) place(node, position.current);
      } else {
        // Let the original desktop stylesheet own all positioning again.
        for (const property of ['left', 'top', 'right', 'bottom']) node.style.removeProperty(property);
      }
    };
    media.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('scroll', sync);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('scroll', sync);
    };
  }, [place]);

  const finish = (event: PointerEvent<T>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    const node = event.currentTarget;
    if (current.moved) {
      const rect = node.getBoundingClientRect();
      place(node, { x: rect.left, y: rect.top });
      suppressClick.current = true;
    }
    node.removeAttribute('data-dragging');
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
  };

  return {
    ref,
    onPointerDown(event: PointerEvent<T>) {
      if (!window.matchMedia(mobileQuery).matches || !event.isPrimary || event.button !== 0) return;
      if (event.pointerType === 'mouse') event.preventDefault();
      suppressClick.current = false;
      const rect = event.currentTarget.getBoundingClientRect();
      gesture.current = { id: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: { x: rect.left, y: rect.top }, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: PointerEvent<T>) {
      const current = gesture.current;
      if (!current || current.id !== event.pointerId) return;
      const dx = event.clientX - current.start.x;
      const dy = event.clientY - current.start.y;
      if (!current.moved && Math.hypot(dx, dy) < 6) return;
      current.moved = true;
      const next = constrain(event.currentTarget, { x: current.origin.x + dx, y: current.origin.y + dy });
      event.currentTarget.dataset.dragging = 'true';
      // Translate during the gesture; commit fixed coordinates once on release.
      event.currentTarget.style.translate = `${next.x - current.origin.x}px ${next.y - current.origin.y}px`;
    },
    onPointerUp: finish,
    onPointerCancel: finish,
    onLostPointerCapture: finish,
    onClickCapture(event: MouseEvent<T>) {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
    onDragStart(event: DragEvent<T>) {
      if (window.matchMedia(mobileQuery).matches) event.preventDefault();
    },
  };
}
