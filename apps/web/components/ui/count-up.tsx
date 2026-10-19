'use client';

import { useEffect, useRef } from 'react';

/** Animate explicit statistics only; leave labels and contact numbers as text. */
export function CountUp({ value }: { value: string }) {
  const display = useRef<HTMLSpanElement>(null);
  const numeric = /^(\d+)([+%]?)$/.exec(value);
  const target = numeric ? Number(numeric[1]) : null;
  const suffix = numeric?.[2] ?? '';

  useEffect(() => {
    const element = display.current;
    if (!element || target === null) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let started = false;
    let observer: IntersectionObserver | undefined;
    const finish = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.textContent = value;
    };
    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      const beginning = performance.now();
      const tick = (now: number) => {
        const progress = Math.max(0, Math.min(1, (now - beginning) / 1000));
        const eased = 1 - (1 - progress) ** 3;
        const next = `${Math.round(target * eased)}${suffix}`;
        if (element.textContent !== next) element.textContent = next;
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const onPreferenceChange = () => {
      if (preference.matches) {
        started = true;
        finish();
      }
    };

    if (!preference.matches) {
      element.textContent = `0${suffix}`;
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        }, { threshold: 0.5 });
        observer.observe(element);
      } else {
        start();
      }
    } else {
      started = true;
      finish();
    }
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      finish();
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [target, suffix, value]);

  if (target === null) return <>{value}</>;

  return (
    <>
      <span className="sr-only">{value}</span>
      <span
        ref={display}
        aria-hidden="true"
        data-mn-count-up={value}
        style={{ display: 'inline-block', minWidth: `${value.length}ch`, font: 'inherit', fontVariantNumeric: 'tabular-nums', color: 'inherit' }}
      >
        {value}
      </span>
    </>
  );
}
