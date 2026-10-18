'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Settings } from 'lucide-react';
import { serviceCards } from '@/lib/content/site-content';
import { Icon } from './ui';

const homeServices = [
  ...serviceCards.slice(0, 5).map((service) => ({
    ...service,
    href: `/services/${service.slug}`,
  })),
  {
    slug: 'bao-duong-dinh-ky',
    title: 'Bảo dưỡng định kỳ',
    description: 'Kiểm tra tổng thể, vệ sinh, giúp thiết bị hoạt động bền bỉ và tiết kiệm điện.',
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
              <em>toàn diện tại Cần Thơ</em>
            </h2>
          </div>
          <div className="mn-home-services-intro">
            <p>
              Minh Nhật cung cấp đầy đủ các dịch vụ điện lạnh từ sửa chữa, vệ sinh, lắp đặt đến
              bảo dưỡng định kỳ, phục vụ nhanh chóng tại các khu vực ở Cần Thơ.
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
            <Link key={service.slug} href={service.href} className="mn-service-card">
              <div className="mn-card-photo">
                <Image src={service.image} fill
                  sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 46vw, 420px"
                  alt={`${service.title} – ảnh minh họa`} />
              </div>
              <div className="mn-card-copy">
                <span className="mn-icon-box">
                  {service.icon === 'maintenance'
                    ? <Settings strokeWidth={1.65} aria-hidden="true" />
                    : <Icon name={service.icon} />}
                </span>
                <div><h3>{service.title}</h3><p>{service.description}</p></div>
                <ArrowRight className="mn-card-arrow" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
