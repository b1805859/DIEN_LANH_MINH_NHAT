'use client';

import { useEffect, useRef, useState } from 'react';
import { LoadingImage } from '@/components/ui/loading-image';

type ImageFadeCarouselProps = {
  images: string[];
  alt: string;
  sizes: string;
  startDelayMs?: number;
  imageClassName?: string;
};

export function ImageFadeCarousel({
  images,
  alt,
  sizes,
  startDelayMs = 0,
  imageClassName = '',
}: ImageFadeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const imageCount = Math.max(images.length, 1);
  const fallbackImage = images[0];
  const slotSeconds = imageCount === 2 ? 7 : 8;

  useEffect(() => {
    if (images.length <= 1) return;

    const startTimer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length);

      const interval = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % images.length);
      }, slotSeconds * 1000);

      intervalRef.current = interval;
    }, slotSeconds * 1000 + startDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [images.length, slotSeconds, startDelayMs]);

  return (
    <>
      {fallbackImage ? (
        <LoadingImage
          src={fallbackImage}
          alt={alt}
          fill
          className={`object-cover ${imageClassName}`}
          sizes={sizes}
          reveal="none"
          showLoader={false}
        />
      ) : null}
      {images.map((src, index) => (
        <LoadingImage
          key={src}
          src={src}
          alt={alt}
          fill
          loading="eager"
          className={`object-cover transition-[opacity,transform] ease-in-out group-hover:scale-105 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          } ${imageClassName}`}
          sizes={sizes}
          reveal="none"
          showLoader={false}
          style={{ transitionDuration: '1800ms' }}
        />
      ))}
    </>
  );
}
