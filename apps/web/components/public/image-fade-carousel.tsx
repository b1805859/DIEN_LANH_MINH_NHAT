'use client';

import { getImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ImageFadeCarouselProps = {
  images: string[];
  alt: string;
  sizes: string;
  startDelayMs?: number;
  imageClassName?: string;
  desktopOnly?: boolean;
};

type CarouselState = {
  activeIndex: number;
  loadedIndexes: number[];
};

const DESKTOP_MEDIA = '(min-width: 1024px)';

function getInitialLoadedIndexes(imageCount: number) {
  return Array.from({ length: Math.min(imageCount, 2) }, (_, index) => index);
}

function moveToNextSlide(current: CarouselState, imageCount: number) {
  const nextIndex = (current.activeIndex + 1) % imageCount;

  return {
    activeIndex: nextIndex,
    loadedIndexes: current.loadedIndexes.includes(nextIndex)
      ? current.loadedIndexes
      : [...current.loadedIndexes, nextIndex],
  };
}

export function ImageFadeCarousel({
  images,
  alt,
  sizes,
  startDelayMs = 0,
  imageClassName = '',
  desktopOnly = false,
}: ImageFadeCarouselProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [carousel, setCarousel] = useState<CarouselState>(() => ({
    activeIndex: 0,
    loadedIndexes: getInitialLoadedIndexes(images.length),
  }));
  const [isVisible, setIsVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const { activeIndex, loadedIndexes } = carousel;
  const imageCount = Math.max(images.length, 1);
  const slotSeconds = imageCount === 2 ? 7 : 8;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: '160px 0px', threshold: 0.05 },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (images.length <= 1 || paused || !isVisible) return;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA);
    let interval: number | null = null;
    let startTimer: number | null = null;

    const stopTimers = () => {
      if (startTimer !== null) {
        window.clearTimeout(startTimer);
        startTimer = null;
      }
      if (interval !== null) {
        window.clearInterval(interval);
        interval = null;
      }
    };

    const syncTimers = () => {
      stopTimers();
      if (desktopOnly && !desktopMedia.matches) return;

      startTimer = window.setTimeout(() => {
        setCarousel((current) => moveToNextSlide(current, images.length));

        interval = window.setInterval(() => {
          if (document.visibilityState !== 'visible') return;

          setCarousel((current) => moveToNextSlide(current, images.length));
        }, slotSeconds * 1000);
      }, slotSeconds * 1000 + startDelayMs);
    };

    syncTimers();
    desktopMedia.addEventListener('change', syncTimers);

    return () => {
      stopTimers();
      desktopMedia.removeEventListener('change', syncTimers);
    };
  }, [desktopOnly, images.length, isVisible, paused, slotSeconds, startDelayMs]);

  useEffect(() => {
    if (images.length <= 1) return;

    const nextIndex = (activeIndex + 1) % images.length;
    setCarousel((current) =>
      current.loadedIndexes.includes(nextIndex)
        ? current
        : {
            ...current,
            loadedIndexes: [...current.loadedIndexes, nextIndex],
          },
    );
  }, [activeIndex, images.length]);

  if (!images.length) return null;

  return (
    <span
      ref={containerRef}
      className="absolute inset-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {loadedIndexes.map((index) => {
        const src = images[index];
        if (!src) return null;

        const optimizedProps = getImageProps({
          alt: index === activeIndex ? alt : '',
          fill: true,
          loading: 'lazy',
          quality: 72,
          sizes,
          src,
        }).props;
        const imageClasses = `absolute inset-0 h-full w-full object-cover transition-[opacity,transform] ease-in-out motion-reduce:transition-none sm:group-hover:scale-105 ${
          index === activeIndex ? 'opacity-100' : 'opacity-0'
        } ${imageClassName}`;

        if (desktopOnly) {
          return (
            <picture key={src}>
              <source
                media={DESKTOP_MEDIA}
                sizes={optimizedProps.sizes}
                srcSet={optimizedProps.srcSet}
              />
              <img
                {...optimizedProps}
                alt={index === activeIndex ? alt : ''}
                aria-hidden={index !== activeIndex}
                className={imageClasses}
                decoding="async"
                loading="lazy"
                style={{ transitionDuration: '1800ms' }}
              />
            </picture>
          );
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element -- getImageProps supplies Next-optimized responsive image attributes.
          <img
            {...optimizedProps}
            key={src}
            alt={index === activeIndex ? alt : ''}
            aria-hidden={index !== activeIndex}
            className={imageClasses}
            style={{ transitionDuration: '1800ms' }}
          />
        );
      })}
    </span>
  );
}
