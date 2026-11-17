'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';
import { useCallback, useRef } from 'react';

/**
 * Interactive tactile card with pointer-tracking specular ice-blue sheen
 * on fine pointers and compositor-only lift/press physics.
 */
export function TactileCard({
  children,
  className = '',
  lift = 4,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
    node.style.setProperty('--mx', `${x.toFixed(1)}%`);
    node.style.setProperty('--my', `${y.toFixed(1)}%`);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      whileHover={{ y: -lift }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.8 }}
      className={`mn-tactile-card ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
