'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { canMotionHover } from '@/components/layout/use-home-motion';
import { siteContent } from '@/lib/content/site-content';
import { contentImageSizes } from '@/lib/image-sizes';
import mapData from '@/lib/content/can-tho-map.json';

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

export function VerifiedServiceArea() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const activeName = hovered ?? focused ?? selected;
  useEffect(() => {
    const clearHover = () => setHovered(null);
    window.addEventListener('scroll', clearHover, { passive: true });
    window.addEventListener('wheel', clearHover, { passive: true });
    return () => {
      window.removeEventListener('scroll', clearHover);
      window.removeEventListener('wheel', clearHover);
    };
  }, []);
  const active = siteContent.areas.find((area) => area.name === activeName);
  const titleId = useId();
  const select = (name: string) => setSelected((previous) => (previous === name ? null : name));
  const areas = siteContent.areas.filter((area) =>
    mapData.regions.some((region) => region.name === area.name),
  );

  return (
    <section className="mn-service-area mn-verified-area" id="khu-vuc" aria-labelledby={titleId}>
      <Image
        src={siteContent.images.panorama}
        fill
        sizes={contentImageSizes}
        alt="Cảnh cầu Cần Thơ về đêm – hình ảnh minh họa"
      />
      <div className="mn-area-shade" />
      <div className="mn-area-copy">
        <h2 id={titleId}>
          Hỗ trợ tận nơi
          <br />
          tại Cần Thơ
        </h2>
        <p className="mn-area-description">
          Hỗ trợ tại các khu vực dưới đây. Liên hệ để xác nhận lịch.
        </p>
        <div className="mn-area-chips" role="group" aria-label="Chọn khu vực phục vụ">
          {areas.map((area) => (
            <button
              type="button"
              key={area.name}
              aria-pressed={selected === area.name}
              data-area-active={activeName === area.name}
              onClick={() => select(area.name)}
              onFocus={(event) => {
                if (!event.currentTarget.matches(':focus-visible')) return;
                setHovered(null);
                setFocused(area.name);
              }}
              onBlur={() => setFocused(null)}
              onPointerDown={() => setFocused(null)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && canMotionHover(event.currentTarget))
                  setHovered(area.name);
              }}
              onPointerMove={(event) => {
                if (event.pointerType === 'mouse' && canMotionHover(event.currentTarget))
                  setHovered(area.name);
              }}
              onPointerLeave={() => setHovered(null)}
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
        <div className="mn-area-selection" aria-live="polite" aria-atomic="true">
          <span>{activeName ? `${activeName} · Cần Thơ` : 'Chọn khu vực cần hỗ trợ'}</span>
          <Link href={active?.slug ? `/areas/${active.slug}` : '/contact'}>
            {active?.slug ? 'Xem dịch vụ' : 'Liên hệ xác nhận'} <span aria-hidden="true">↗</span>
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
                aria-pressed={selected === area.name}
                onClick={() => select(area.name)}
                onKeyDown={(event) => {
                  if (!['Enter', ' '].includes(event.key)) return;
                  event.preventDefault();
                  select(area.name);
                }}
                onFocus={(event) => {
                  if (!event.currentTarget.matches(':focus-visible')) return;
                  setHovered(null);
                  setFocused(area.name);
                }}
                onBlur={() => setFocused(null)}
                onPointerDown={() => setFocused(null)}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse' && canMotionHover(event.currentTarget))
                    setHovered(area.name);
                }}
                onPointerMove={(event) => {
                  if (event.pointerType === 'mouse' && canMotionHover(event.currentTarget))
                    setHovered(area.name);
                }}
                onPointerLeave={() => setHovered(null)}
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
        <p className="mn-map-source">
          Khu vực theo tên quen dùng · Ranh giới {mapData.source.year}
          <br />
          <a href={mapData.source.url} target="_blank" rel="noreferrer">
            geoBoundaries / OCHA
          </a>{' '}
          · {mapData.source.license}
        </p>
      </div>
    </section>
  );
}
