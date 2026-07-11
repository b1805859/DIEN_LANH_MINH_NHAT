'use client';

import { useEffect, useState } from 'react';
import { LoadingImage } from '@/components/ui/loading-image';
import { cn } from '@/lib/utils';

type HeroImage = {
  src: string;
  alt: string;
  objectClassName?: string;
};

type HeroImageCarouselProps = {
  images: HeroImage[];
  intervalMs?: number;
};

export function HeroImageCarousel({ images, intervalMs = 8000 }: HeroImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((image, index) => (
        <LoadingImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          loading={index === 0 ? undefined : 'eager'}
          className={cn(
            'hidden object-cover brightness-[1.1] saturate-[1.16] contrast-[1.04] transition-opacity ease-in-out lg:block',
            index === activeIndex ? 'opacity-100' : 'opacity-0',
            image.objectClassName,
          )}
          sizes="100vw"
          reveal="none"
          showLoader={false}
          style={{ transitionDuration: '2200ms' }}
        />
      ))}
    </>
  );
}
