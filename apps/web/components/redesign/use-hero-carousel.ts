'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

type Gesture = {
  id: number;
  x: number;
  y: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  axis: 'pending' | 'horizontal' | 'vertical';
};

const interactive = 'a, button, input, textarea, select, summary, [contenteditable="true"]';
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useHeroCarousel(count: number) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const current = useRef(0);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const wheelReset = useRef<(() => void) | null>(null);
  const width = useCallback(() => viewport.current?.clientWidth || 1, []);

  const select = useCallback(
    (index: number) => {
      if (count < 1) return;
      // Wrap in both directions, only in response to a user gesture or key press.
      const next = ((index % count) + count) % count;
      current.current = next;
      setActive(next);
    },
    [count],
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      suppressClick.current = false;
      if (
        count < 2 ||
        !event.isPrimary ||
        event.button !== 0 ||
        (event.target as HTMLElement).closest(interactive)
      )
        return;
      wheelReset.current?.();
      gesture.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        velocity: 0,
        axis: 'pending',
      };
      if (event.pointerType === 'mouse') event.currentTarget.setPointerCapture(event.pointerId);
    },
    [count],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (start.axis === 'pending') {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) * 1.25 ? 'horizontal' : 'vertical';
      if (start.axis === 'horizontal') {
        event.currentTarget.dataset.motion = 'dragging';
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (start.axis !== 'horizontal') return;
    event.preventDefault();
    const elapsed = event.timeStamp - start.lastTime;
    if (elapsed > 0) {
      const sample = (event.clientX - start.lastX) / elapsed;
      start.velocity = elapsed > 80 ? sample : start.velocity * 0.35 + sample * 0.65;
    }
    start.lastX = event.clientX;
    start.lastTime = event.timeStamp;
  }, []);

  const finishPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
      const start = gesture.current;
      if (!start || start.id !== event.pointerId) return;
      gesture.current = null;
      delete event.currentTarget.dataset.motion;
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      if (start.axis !== 'horizontal') return;
      suppressClick.current = true;
      const dx = event.clientX - start.x;
      const threshold = clamp(width() * 0.1, 36, 90);
      const flick =
        event.timeStamp - start.lastTime < 100 &&
        Math.abs(start.velocity) > 0.4 &&
        Math.abs(dx) > 18 &&
        Math.sign(start.velocity) === Math.sign(dx);
      if (!cancelled && (Math.abs(dx) >= threshold || flick))
        select(current.current + (dx < 0 ? 1 : -1));
    },
    [select, width],
  );

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let distance = 0;
    let cooldown = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reset = () => {
      clearTimeout(timer);
      distance = 0;
      cooldown = 0;
    };
    const finish = () => {
      clearTimeout(timer);
      if (Math.abs(distance) >= 32) select(current.current + Math.sign(distance));
      distance = 0;
      cooldown = performance.now() + 220;
    };
    wheelReset.current = reset;
    const onWheel = (event: WheelEvent) => {
      // Vertical page scrolling and pinch-to-zoom remain native.
      if (
        count < 2 ||
        event.ctrlKey ||
        gesture.current ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.25
      )
        return;
      event.preventDefault();
      const now = performance.now();
      if (now < cooldown) {
        cooldown = now + 220;
        return;
      }
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width() : 1;
      distance += event.deltaX * factor;
      clearTimeout(timer);
      if (Math.abs(distance) >= clamp(width() * 0.1, 45, 80)) finish();
      else timer = setTimeout(finish, 150);
    };
    const cancel = () => {
      const pointer = gesture.current;
      gesture.current = null;
      if (pointer && element.hasPointerCapture(pointer.id))
        element.releasePointerCapture(pointer.id);
      delete element.dataset.motion;
      reset();
    };
    const visibility = () => {
      if (document.hidden) cancel();
    };
    element.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('blur', cancel);
    window.addEventListener('resize', cancel);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearTimeout(timer);
      wheelReset.current = null;
      element.removeEventListener('wheel', onWheel);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('resize', cancel);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [count, select, width]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (
        (event.target as HTMLElement).closest(interactive) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      const direction = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      if (!direction) return;
      event.preventDefault();
      wheelReset.current?.();
      select(current.current + direction);
    },
    [select],
  );

  return {
    root,
    viewport,
    active,
    onKeyDown,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finishPointer(event),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) => finishPointer(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => finishPointer(event, true),
      onClickCapture: (event: MouseEvent<HTMLDivElement>) => {
        if (!suppressClick.current || event.detail === 0) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      },
      onDragStart: (event: DragEvent<HTMLDivElement>) => event.preventDefault(),
    },
  };
}
