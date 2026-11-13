'use client';

import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { ScrollRevealCopy } from '@/components/home-ice-blue/scroll-reveal-copy';
import { canMotionHover } from '@/components/layout/use-home-motion';
import { siteContent } from '@/lib/content/site-content';
import { contentImageSizes } from '@/lib/image-sizes';
import mapData from '@/lib/content/can-tho-map.json';
import { areaPhotos } from '@/lib/content/area-photos';

// Label offsets are cartographic callouts only. The pins remain at the verified
// source polygon centroids recorded with their longitude/latitude in the data.
const labels: Record<string, { x: number; y: number; anchor?: 'start' | 'middle' | 'end' }> = {
  'Vĩnh Thạnh': { x: 54, y: 74 },
  'Thốt Nốt': { x: 236, y: 62 },
  'Cờ Đỏ': { x: 90, y: 168 },
  'Ô Môn': { x: 291, y: 137 },
  'Bình Thủy': { x: 420, y: 173 },
  'Ninh Kiều': { x: 420, y: 211 },
  'Cái Răng': { x: 420, y: 250 },
  'Phong Điền': { x: 249, y: 278 },
};

export function VerifiedServiceArea({ revealIntro = false }: { revealIntro?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const activeName = hovered ?? focused ?? selected;
  const activePhoto = areaPhotos.find((photo) => photo.area === activeName);
  useEffect(() => {
    const clearHover = () => setHovered(null);
    const reset = () => {
      setHovered(null);
      setFocused(null);
      setSelected(null);
    };
    const trackPointer = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const control =
        event.target instanceof Element ? event.target.closest('[data-coverage-area]') : null;
      if (!control || !sectionRef.current?.contains(control)) clearHover();
    };
    const dismissTouch = (event: globalThis.PointerEvent) => {
      const control =
        event.target instanceof Element ? event.target.closest('[data-coverage-area]') : null;
      if (!control || !sectionRef.current?.contains(control)) reset();
    };
    window.addEventListener('scroll', clearHover, { passive: true });
    window.addEventListener('wheel', clearHover, { passive: true });
    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('pointerdown', dismissTouch, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('pointercancel', reset);
    return () => {
      window.removeEventListener('scroll', clearHover);
      window.removeEventListener('wheel', clearHover);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('pointerdown', dismissTouch);
      window.removeEventListener('blur', reset);
      window.removeEventListener('pointercancel', reset);
    };
  }, []);
  const titleId = useId();
  const preview = (name: string, event: PointerEvent<Element>) => {
    if (event.pointerType !== 'mouse') return;
    setSelected(null);
    if (canMotionHover(event.currentTarget)) setHovered(name);
  };
  const areaInteractions = (name: string) => ({
    onPointerEnter: (event: PointerEvent<Element>) => preview(name, event),
    onPointerMove: (event: PointerEvent<Element>) => preview(name, event),
    onPointerLeave: () => setHovered(null),
    onPointerDown: (event: PointerEvent<Element>) => {
      setFocused(null);
      if (event.pointerType === 'mouse') setSelected(null);
    },
    onPointerUp: (event: PointerEvent<Element>) => {
      if (event.pointerType !== 'mouse')
        setSelected((previous) => (previous === name ? null : name));
    },
    onFocus: (event: FocusEvent<Element>) => {
      if (event.currentTarget.matches(':focus-visible')) {
        setHovered(null);
        setFocused(name);
      }
    },
    onBlur: () => setFocused(null),
    onKeyDown: (event: KeyboardEvent<Element>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setSelected(null);
        setFocused(name);
      }
    },
  });
  const areas = siteContent.areas.filter((area) =>
    mapData.regions.some((region) => region.name === area.name),
  );

  return (
    <section
      ref={sectionRef}
      className="mn-service-area mn-verified-area"
      id="khu-vuc"
      aria-labelledby={titleId}
      onPointerLeave={() => setHovered(null)}
    >
      <Image
        src={siteContent.images.panorama}
        fill
        sizes={contentImageSizes}
        alt="Cảnh cầu Cần Thơ về đêm – hình ảnh minh họa"
      />
      <div className="mn-area-photo-stack" aria-hidden="true">
        {areaPhotos.map((photo) => (
          <picture key={photo.area}>
            <source
              media="(max-width: 700px)"
              srcSet={
                getImageProps({
                  src: `/images/areas/${photo.slug}-mobile.webp`,
                  alt: '',
                  fill: true,
                  sizes: '100vw',
                  quality: 92,
                }).props.srcSet
              }
            />
            <Image
              src={photo.src}
              alt=""
              fill
              quality={92}
              sizes="100vw"
              className="mn-area-photo"
              data-active={activeName === photo.area}
            />
          </picture>
        ))}
      </div>
      <div className="mn-area-shade" />
      <div className="mn-area-copy">
        {revealIntro ? (
          <ScrollRevealCopy id={titleId} title="Nhận sửa tại nhà" secondLine="ở Cần Thơ" descriptionClassName="mn-area-description">
            Bạn chọn khu vực bên dưới hoặc gửi địa chỉ để Minh Nhật hẹn giờ đến.
          </ScrollRevealCopy>
        ) : (
          <>
            <h2 id={titleId}>Nhận sửa tại nhà<br />ở Cần Thơ</h2>
            <p className="mn-area-description">
              Bạn chọn khu vực bên dưới hoặc gửi địa chỉ để Minh Nhật hẹn giờ đến.
            </p>
          </>
        )}
        <div className="mn-area-chips" role="group" aria-label="Chọn khu vực phục vụ" data-reveal="">
          {areas.map((area) => (
            <button
              type="button"
              key={area.name}
              aria-pressed={activeName === area.name}
              data-area-active={activeName === area.name}
              data-coverage-area={area.name}
              {...areaInteractions(area.name)}
            >
              <MapPin size={15} aria-hidden="true" />
              {area.name}
            </button>
          ))}
          <Link href="/contact">
            <MapPin size={15} aria-hidden="true" />
            Khu vực lân cận
          </Link>
        </div>
      </div>
      <div className="mn-verified-map-wrap">
        <svg
          className="mn-verified-map"
          viewBox={mapData.viewBox}
          role="group"
          aria-label="Bản đồ các khu vực phục vụ theo ranh giới tham khảo năm 2020. Không phải vị trí cơ sở kinh doanh."
        >
          <title>Các khu vực phục vụ Cần Thơ theo tên quen dùng</title>
          <desc>
            Nguồn bản đồ: geoBoundaries / OCHA · Ranh giới {mapData.source.year} ·{' '}
            {mapData.source.license}. {mapData.source.url}
          </desc>
          <g className="mn-map-boundaries">
            {mapData.regions.map((region) => (
              <path
                key={region.shapeId}
                d={region.path}
                data-region-active={activeName === region.name}
              />
            ))}
          </g>
          {areas.map((area) => {
            const region = mapData.regions.find((item) => item.name === area.name)!;
            const { x, y } = region.marker;
            const label = labels[area.name];
            const isActive = activeName === area.name;
            return (
              <g
                key={area.name}
                className="mn-geographic-location"
                role="button"
                tabIndex={0}
                data-active={isActive}
                aria-label={`Xem hỗ trợ tại ${area.name}`}
                aria-pressed={activeName === area.name}
                data-coverage-area={area.name}
                {...areaInteractions(area.name)}
              >
                <path className="mn-map-region-hit" d={region.path} />
                <path
                  className="mn-map-label-leader"
                  d={`M${x} ${y}L${label.x - 5} ${label.y - 5}`}
                />
                <rect
                  className="mn-map-label-hit"
                  x={label.x - 4}
                  y={label.y - 20}
                  width={area.name.length * 10 + 12}
                  height="28"
                  rx="5"
                />
                {isActive && (
                  <circle
                    key={activeName}
                    className="mn-location-pulse"
                    cx={x}
                    cy={y - 8}
                    r="13"
                    aria-hidden="true"
                  />
                )}
                <g transform={`translate(${x} ${y})`} className="mn-verified-pin">
                  <path d="M0 0C-3-4-8-8-8-13a8 8 0 1 1 16 0C8-8 3-4 0 0Z" />
                  <circle cy="-13" r="3" />
                </g>
                <text x={label.x} y={label.y} textAnchor={label.anchor ?? 'start'}>
                  {area.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {activePhoto && (
        <div className="mn-area-photo-credit">
          <strong>{activePhoto.landmark}</strong>
          <span>
            Ảnh: <a href={activePhoto.source} target="_blank" rel="noreferrer">{activePhoto.author}</a> ·{' '}
            {activePhoto.licenseUrl ? (
              <a href={activePhoto.licenseUrl} target="_blank" rel="noreferrer">{activePhoto.license}</a>
            ) : activePhoto.license}
          </span>
        </div>
      )}
    </section>
  );
}
