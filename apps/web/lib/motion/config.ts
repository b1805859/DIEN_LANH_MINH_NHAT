import type { CSSProperties } from 'react';

/** One timing language for native animations and CSS micro-interactions. */
export const motion = {
  duration: { fast: 200, normal: 320, reveal: 720, hero: 900, scroll: 1050, image: 1200 },
  easing: {
    standard: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    enter: 'cubic-bezier(0.22, 0.75, 0.25, 1)',
    scroll: 'cubic-bezier(0.25, 0.46, 0.35, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  distance: { sm: 8, md: 16, lg: 24 },
  stagger: { fast: 50, normal: 70, maxDelay: 420, pacing: 1.15 },
  viewport: { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
} as const;

export const motionVariables = {
  '--motion-fast': `${motion.duration.fast}ms`,
  '--motion-normal': `${motion.duration.normal}ms`,
  '--motion-reveal': `${motion.duration.reveal}ms`,
  '--motion-hero': `${motion.duration.hero}ms`,
  '--motion-ease': motion.easing.standard,
  '--motion-enter': motion.easing.enter,
  '--motion-exit': motion.easing.exit,
  '--motion-distance': `${motion.distance.md}px`,
  '--motion-stagger': `${motion.stagger.normal}ms`,
} as CSSProperties;

export type MotionVariant =
  | 'up'
  | 'left'
  | 'right'
  | 'scale'
  | 'fade'
  | 'image'
  | 'hero'
  | 'hero-image'
  | 'header'
  | 'workflow';

export function revealFrames(variant: string, compact: boolean): Keyframe[] {
  const distance = compact ? motion.distance.sm : motion.distance.md;
  // Independent translate/scale preserve existing image composition and hover transforms.
  if (variant === 'hero-image') return [{ scale: compact ? '1.012' : '1.025' }, { scale: '1' }];
  if (variant === 'image') return [{ scale: compact ? '0.99' : '0.98' }, { scale: '1' }];
  if (variant === 'header') return [{ translate: '0 -6px' }, { translate: '0 0' }];
  // Headline and LCP visual are painted immediately, including before hydration.
  if (variant === 'hero') return [{ translate: `0 ${motion.distance.sm}px` }, { translate: '0 0' }];
  if (variant === 'fade' || variant === 'workflow') return [{ opacity: 0.35 }, { opacity: 1 }];
  if (variant === 'scale') {
    return [
      { opacity: 0.35, scale: compact ? '0.99' : '0.98' },
      { opacity: 1, scale: '1' },
    ];
  }
  const from =
    variant === 'left'
      ? `${-distance}px 0`
      : variant === 'right'
        ? `${distance}px 0`
        : `0 ${distance}px`;
  return [
    { opacity: 0, translate: from },
    { opacity: 1, translate: '0 0' },
  ];
}
