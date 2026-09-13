'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, type CSSProperties, type SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';

type LoadingImageProps = ImageProps & {
  reveal?: 'fade' | 'filter' | 'none';
  showLoader?: boolean;
};

export function LoadingImage({
  alt,
  className,
  fill,
  onLoad,
  onError,
  priority,
  reveal = 'fade',
  showLoader = true,
  src,
  width,
  height,
  sizes,
  loading,
  style,
  ...props
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const srcValue = typeof src === 'string' ? src : '';
  const isSvg = srcValue.endsWith('.svg');
  const effectiveReveal = isSvg ? 'none' : reveal;
  const shouldShowLoader = showLoader && !isSvg;
  const useNativeImage =
    srcValue.startsWith('data:') ||
    srcValue.startsWith('blob:') ||
    srcValue.startsWith('http://') ||
    isSvg;
  const imageClassName = cn(
    className,
    effectiveReveal !== 'none' &&
      'transition-[filter,opacity] duration-700 ease-out motion-reduce:transition-none',
    effectiveReveal === 'fade' && (loaded && !failed ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'),
    effectiveReveal === 'filter' && (loaded || failed ? 'blur-0' : 'blur-sm'),
  );
  const loader = (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-10 grid place-items-center overflow-hidden bg-slate-100/80 transition-opacity duration-500 motion-reduce:transition-none',
        loaded || failed || !shouldShowLoader ? 'opacity-0' : 'opacity-100',
      )}
    >
      <span className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgb(226_232_240_/_0.45)_0%,rgb(255_255_255_/_0.7)_42%,rgb(226_232_240_/_0.45)_78%)] motion-reduce:animate-none" />
      <span className="relative h-7 w-7 rounded-full border-2 border-slate-300 border-t-primary motion-safe:animate-spin" />
    </span>
  );

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setFailed(true);
    setLoaded(true);
    onError?.(event);
  };

  const fallback = failed ? (
    <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-slate-100 px-3 text-center text-xs font-bold text-slate-500">
      Khong tai duoc anh
    </span>
  ) : null;

  const nativeStyle: CSSProperties | undefined = fill
    ? {
        ...style,
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }
    : style;

  const image = useNativeImage ? (
    // eslint-disable-next-line @next/next/no-img-element -- CMS/admin URLs can fall outside Next image optimization.
    <img
      alt={alt}
      className={cn(imageClassName, fill && 'absolute inset-0 h-full w-full')}
      height={typeof height === 'number' ? height : undefined}
      loading={priority ? 'eager' : loading}
      onError={handleError}
      onLoad={handleLoad}
      sizes={sizes}
      src={srcValue}
      style={nativeStyle}
      width={typeof width === 'number' ? width : undefined}
    />
  ) : (
    <Image
      {...props}
      alt={alt}
      className={imageClassName}
      fill={fill}
      height={height}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      sizes={sizes}
      src={src}
      style={style}
      width={width}
    />
  );

  if (fill) {
    return (
      <>
        {shouldShowLoader ? loader : null}
        {image}
        {fallback}
      </>
    );
  }

  return (
    <span className="relative inline-flex max-w-full overflow-hidden">
      {shouldShowLoader ? loader : null}
      {image}
      {fallback}
    </span>
  );
}
