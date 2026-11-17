'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Top viewport reading/scroll progress bar using GPU-only scaleX transform.
 */
export function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-gradient-to-r from-[#0ea5e9] via-[#18d5f5] to-[#0070f3] shadow-[0_0_12px_rgba(24,213,245,0.55)]"
      style={{ scaleX }}
    />
  );
}
