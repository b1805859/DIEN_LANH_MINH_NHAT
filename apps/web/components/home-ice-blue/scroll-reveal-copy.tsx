'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { HeroWords } from './hero-words';

const bottomInset = 96;

export function ScrollRevealCopy({
  id,
  title,
  secondLine,
  children,
  descriptionClassName,
  underline = false,
}: {
  id: string;
  title: string;
  secondLine?: string;
  children: ReactNode;
  descriptionClassName?: string;
  underline?: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = heading.current;
    if (!element || typeof IntersectionObserver !== 'function') return;

    // Keep the server-rendered copy readable until its scroll state is known.
    const isBelowRevealZone = () => element.getBoundingClientRect().top >= window.innerHeight - bottomInset;
    element.dataset.scrollCopy = !element.getClientRects().length || isBelowRevealZone() ? 'pending' : 'in';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        element.dataset.scrollCopy = 'in';
        observer.unobserve(element);
      }
    }, { rootMargin: `0px 0px -${bottomInset}px 0px`, threshold: 0.08 });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <h2
        ref={heading}
        id={id}
        aria-label={secondLine ? `${title} ${secondLine}` : title}
        data-scroll-copy=""
        data-u251-title={underline ? '' : undefined}
      >
        <HeroWords text={title} />
        {secondLine && <><br /><HeroWords text={secondLine} start={title.trim().split(/\s+/).length} /></>}
      </h2>
      <p className={descriptionClassName} data-scroll-description>{children}</p>
    </>
  );
}
