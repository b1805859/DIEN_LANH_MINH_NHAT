'use client';
import { useState } from 'react';
import { ServiceGrid } from './ui';
const categories = [
  ['all', 'Tất cả dịch vụ'],
  ['may-lanh', 'Máy lạnh'],
  ['may-giat', 'Máy giặt'],
  ['tu-lanh', 'Tủ lạnh'],
  ['dien-nuoc', 'Điện nước · Nóng lạnh'],
];
export function ServiceCatalog() {
  const [category, setCategory] = useState('all');
  return (
    <>
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
      <div id="service-catalog" aria-live="polite">
        <ServiceGrid category={category} />
      </div>
    </>
  );
}
