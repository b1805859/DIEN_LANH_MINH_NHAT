'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { serviceCards } from '@/lib/content/site-content';
import { ServiceCard } from './ui';

const homeServices = [
  ...serviceCards.slice(0, 5).map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
  })),
  {
    slug: 'bao-duong-dinh-ky',
    title: 'Bảo dưỡng định kỳ',
    description: 'Vệ sinh máy, kiểm tra các bộ phận và chạy thử sau khi bảo dưỡng.',
    icon: 'maintenance',
    image: '/images/redesign/home-carousel/support-condenser.webp',
    href: '/services',
  },
];

export function HomeServicesSection() {
  const [start, setStart] = useState(0);
  const services = [...homeServices.slice(start), ...homeServices.slice(0, start)];

  return (
    <section className="mn-section mn-home-services mn-home-light" aria-labelledby="home-services-title">
      <div className="mn-home-frame">
        <div className="mn-section-heading mn-home-services-heading">
          <div>
            <p className="mn-kicker">DỊCH VỤ CỦA CHÚNG TÔI</p>
            <h2 id="home-services-title">
              <span className="mn-heading-title">Dịch vụ điện lạnh</span>{' '}
              <em>tại Cần Thơ</em>
            </h2>
          </div>
          <div className="mn-home-services-intro">
            <p>
              Nhận sửa, vệ sinh và lắp máy lạnh, máy giặt, tủ lạnh; sửa điện nước tại nhà
              ở Cần Thơ.
            </p>
            <Link href="/services" className="mn-text-link">
              Xem tất cả dịch vụ <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mn-home-service-controls" aria-label="Điều hướng dịch vụ">
            <button type="button" aria-label="Nhóm dịch vụ trước" aria-controls="home-service-grid"
              onClick={() => setStart((value) => (value + 3) % homeServices.length)}>
              <ArrowLeft size={21} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Nhóm dịch vụ tiếp theo" aria-controls="home-service-grid"
              onClick={() => setStart((value) => (value + 3) % homeServices.length)}>
              <ArrowRight size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mn-service-grid" id="home-service-grid" aria-live="polite">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} href={service.href} />
          ))}
        </div>
      </div>
    </section>
  );
}
