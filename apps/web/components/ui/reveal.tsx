'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  delay?: number;
  variant?: 'up' | 'left' | 'right' | 'scale' | 'fade';
  [key: string]: unknown;
};

export function Reveal({
  children,
  asChild = false,
  className,
  delay = 0,
  variant = 'up',
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const revealProps = {
    ...props,
    ref,
    className: cn('reveal', className),
    'data-reveal-state': visible ? 'visible' : 'hidden',
    'data-reveal-variant': variant,
    style: { ...(props.style as React.CSSProperties | undefined), '--reveal-delay': `${delay}ms` },
  } as Record<string, unknown>;

  if (asChild) {
    // Slot preserves the child's classes, styles, and ref, including children
    // streamed from a Server Component. The reveal remains on that element.
    return <Slot {...revealProps}>{children}</Slot>;
  }
  return <div {...revealProps}>{children}</div>;
}
