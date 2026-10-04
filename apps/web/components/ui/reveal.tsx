import { type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import type { MotionVariant } from '@/lib/motion/config';

type RevealProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  delay?: number;
  variant?: MotionVariant;
  [key: string]: unknown;
};

/** Server-safe marker. SiteMotion owns the one shared observer. */
export function Reveal({
  children,
  asChild = false,
  className,
  delay = 0,
  variant = 'up',
  ...props
}: RevealProps) {
  const Component = asChild ? Slot : 'div';
  return (
    <Component
      {...props}
      className={cn('reveal', className)}
      data-motion={variant}
      data-motion-delay={delay}
    >
      {children}
    </Component>
  );
}
