'use client';

import { getImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type HeroImage = {
  src: string;
  alt: string;
  objectClassName?: string;
};

type MobileHeroImage = {
  src: string;
  alt: string;
  objectClassName?: string;
};

type HeroImageCarouselProps = {
  images: HeroImage[];
  mobileImage: MobileHeroImage;
  intervalMs?: number;
};

type CarouselState = {
  activeIndex: number;
  loadedIndexes: number[];
};

const DESKTOP_MEDIA = '(min-width: 1024px)';
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

function getInitialLoadedIndexes(imageCount: number) {
  return Array.from({ length: Math.min(imageCount, 2) }, (_, index) => index);
}

function moveToSlide(current: CarouselState, nextIndex: number, imageCount: number) {
  const normalizedIndex = (nextIndex + imageCount) % imageCount;

  return {
    activeIndex: normalizedIndex,
    loadedIndexes: current.loadedIndexes.includes(normalizedIndex)
      ? current.loadedIndexes
      : [...current.loadedIndexes, normalizedIndex],
  };
}

function optimizedImageProps({
  alt,
  priority,
  sizes,
  src,
}: {
  alt: string;
  priority: boolean;
  sizes: string;
  src: string;
}) {
  return getImageProps({
    alt,
    fill: true,
    quality: 72,
    sizes,
    src,
    ...(priority ? { priority: true } : { loading: 'lazy' as const }),
  }).props;
}

export function HeroImageCarousel({
  images,
  mobileImage,
  intervalMs = 8000,
}: HeroImageCarouselProps) {
  const [carousel, setCarousel] = useState<CarouselState>(() => ({
    activeIndex: 0,
    loadedIndexes: getInitialLoadedIndexes(images.length),
  }));
  const { activeIndex, loadedIndexes } = carousel;

  useEffect(() => {
    if (images.length <= 1) return;

    const desktopMedia = window.matchMedia(DESKTOP_MEDIA);
    let timer: number | null = null;

    const stopTimer = () => {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    };

    const syncTimer = () => {
      stopTimer();
      if (!desktopMedia.matches) return;

      timer = window.setInterval(() => {
        if (document.visibilityState !== 'visible') return;

        setCarousel((current) => moveToSlide(current, current.activeIndex + 1, images.length));
      }, intervalMs);
    };

    syncTimer();
    desktopMedia.addEventListener('change', syncTimer);

    return () => {
      stopTimer();
      desktopMedia.removeEventListener('change', syncTimer);
    };
  }, [images.length, intervalMs]);

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

  const mobileProps = optimizedImageProps({
    alt: mobileImage.alt,
    priority: true,
    sizes: '100vw',
    src: mobileImage.src,
  });
  const firstDesktopProps = optimizedImageProps({
    alt: images[0]?.alt ?? '',
    priority: true,
    sizes: '100vw',
    src: images[0]?.src ?? mobileImage.src,
  });

  return (
    <>
      <link
        as="image"
        fetchPriority="high"
        href={mobileProps.src}
        imageSizes={mobileProps.sizes}
        imageSrcSet={mobileProps.srcSet}
        media="(max-width: 1023px)"
        rel="preload"
      />
      <link
        as="image"
        fetchPriority="high"
        href={firstDesktopProps.src}
        imageSizes={firstDesktopProps.sizes}
        imageSrcSet={firstDesktopProps.srcSet}
        media={DESKTOP_MEDIA}
        rel="preload"
      />
      <div className="absolute inset-x-0 top-0 h-svh lg:inset-0 lg:h-auto">
        {loadedIndexes.map((index) => {
          const image = images[index];
          if (!image) return null;

          const desktopProps =
            index === 0
              ? firstDesktopProps
              : optimizedImageProps({
                  alt: image.alt,
                  priority: false,
                  sizes: '100vw',
                  src: image.src,
                });
          const isActive = index === activeIndex;

          if (index === 0) {
            return (
              <picture key={image.src}>
                <source
                  media={DESKTOP_MEDIA}
                  sizes={desktopProps.sizes}
                  srcSet={desktopProps.srcSet}
                />
                <img
                  {...mobileProps}
                  alt={mobileImage.alt}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out motion-reduce:transition-none lg:brightness-[1.1] lg:saturate-[1.16] lg:contrast-[1.04]',
                    isActive ? 'opacity-100' : 'opacity-100 lg:opacity-0',
                    mobileImage.objectClassName,
                    image.objectClassName,
                  )}
                  decoding="sync"
                  fetchPriority="high"
                  style={{ transitionDuration: '2200ms' }}
                />
              </picture>
            );
          }

          return (
            <picture key={image.src}>
              <source
                media={DESKTOP_MEDIA}
                sizes={desktopProps.sizes}
                srcSet={desktopProps.srcSet}
              />
              <img
                alt={isActive ? image.alt : ''}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 hidden h-full w-full object-cover opacity-0 brightness-[1.1] saturate-[1.16] contrast-[1.04] transition-opacity ease-in-out motion-reduce:transition-none lg:block',
                  isActive && 'lg:opacity-100',
                  image.objectClassName,
                )}
                decoding="async"
                loading="lazy"
                src={TRANSPARENT_PIXEL}
                style={{ transitionDuration: '2200ms' }}
              />
            </picture>
          );
        })}
      </div>
    </>
  );
}
