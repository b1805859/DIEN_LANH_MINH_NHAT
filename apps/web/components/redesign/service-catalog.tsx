'use client';
import { useState } from 'react';
import { ServiceGrid } from './ui';
import { serviceCards } from '@/lib/content/site-content';
const categories = [
  ['all', 'Tất cả dịch vụ'],
  ['may-lanh', 'Máy lạnh'],
  ['may-giat', 'Máy giặt'],
  ['tu-lanh', 'Tủ lạnh'],
  ['dien-nuoc', 'Điện nước · Nóng lạnh'],
];
export function ServiceCatalog() {
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {expanded && (
        <div className="mn-filters mn-service-filters" role="group" aria-label="Lọc dịch vụ">
          {categories.map(([value, label]) => (
            <button
              key={value}
              aria-pressed={category === value}
              aria-controls="service-catalog"
              onClick={() => setCategory(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div id="service-catalog" aria-live="polite">
        <ServiceGrid category={expanded ? category : 'all'} limit={expanded ? undefined : 6} />
      </div>
      <button
        className="mn-catalog-toggle mn-button mn-button-secondary"
        aria-expanded={expanded}
        aria-controls="service-catalog"
        onClick={() => {
          setExpanded(!expanded);
          setCategory('all');
        }}
      >
        {expanded ? 'Thu gọn dịch vụ' : `Xem tất cả ${serviceCards.length} dịch vụ`}
      </button>
    </>
  );
}
