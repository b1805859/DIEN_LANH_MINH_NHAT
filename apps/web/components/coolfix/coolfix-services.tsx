'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './coolfix.module.css';

const services = [
  {
    id: 'diagnostics',
    title: 'Sửa chữa & Khắc phục sự cố',
    subtitle: 'Kiểm tra hiện trạng, xác định nguyên nhân và đưa ra giải pháp sửa chữa phù hợp.',
    image: '/images/home-reference/air-natural.webp',
    alt: 'Sửa chữa máy lạnh không lạnh, chảy nước tại Cần Thơ',
    href: '/services/sua-may-lanh',
  },
  {
    id: 'installation',
    title: 'Lắp đặt & Di dời máy lạnh',
    subtitle: 'Khảo sát vị trí tối ưu, lắp đặt chuẩn kỹ thuật, bảo đảm an toàn điện và thẩm mỹ không gian.',
    image: '/images/home-reference/install.webp',
    alt: 'Lắp đặt máy lạnh chuyên nghiệp tại Cần Thơ',
    href: '/services/thao-lap-may-lanh',
  },
  {
    id: 'maintenance',
    title: 'Vệ sinh & Bảo dưỡng định kỳ',
    subtitle: 'Vệ sinh sâu dàn lạnh và dàn nóng bằng máy xịt chuyên dụng, kiểm tra áp suất gas và diệt khuẩn.',
    image: '/images/services-reference/clean-air.webp',
    alt: 'Vệ sinh máy lạnh sạch sâu tại Cần Thơ',
    href: '/services/ve-sinh-may-lanh',
  },
  {
    id: 'appliances',
    title: 'Sửa máy giặt & Tủ lạnh tận nơi',
    subtitle: 'Khắc phục sự cố máy giặt không vắt, tủ lạnh yếu lạnh, kiểm tra linh kiện và dán tem bảo hành.',
    image: '/images/home-reference/washer.webp',
    alt: 'Sửa chữa máy giặt và tủ lạnh tại Cần Thơ',
    href: '/services/sua-may-giat',
  },
];

export function CoolFixServices() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className={styles.servicesSection} id="dich-vu" aria-labelledby="services-title">
      <div className={styles.servicesGrid}>
        {/* Left: Product & Visual Showcase */}
        <div className={styles.servicesVisual}>
          <Image
            key={services[activeTab].image}
            src={services[activeTab].image}
            alt={services[activeTab].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            priority={activeTab === 0}
          />
        </div>

        {/* Right: Interactive Tabs & Content */}
        <div className={styles.servicesContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            DỊCH VỤ CỦA CHÚNG TÔI
          </span>

          <h2 id="services-title" className={styles.servicesTitle}>
            Dịch Vụ Điện Lạnh Trọng Tâm
          </h2>

          <p className={styles.servicesSubtitle}>
            Từ xử lý sự cố đến bảo dưỡng định kỳ — kỹ thuật viên Minh Nhật hỗ trợ tận nơi, kiểm tra rõ ràng và thi công cẩn thận tại Cần Thơ.
          </p>

          <ul className={styles.serviceList} role="tablist">
            {services.map((item, index) => {
              const isActive = activeTab === index;
              return (
                <li
                  key={item.id}
                  className={styles.serviceItem}
                  data-active={isActive}
                  onMouseEnter={() => setActiveTab(index)}
                  onClick={() => setActiveTab(index)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <div className={styles.serviceItemHead}>
                    <h3 className={styles.serviceItemTitle}>{item.title}</h3>
                    <Link
                      href={item.href}
                      className={styles.serviceItemArrow}
                      aria-label={`Xem chi tiết dịch vụ ${item.title}`}
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>

                  {isActive && <div className={styles.serviceItemBody}>{item.subtitle}</div>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
