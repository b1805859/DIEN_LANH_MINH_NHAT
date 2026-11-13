'use client';

import { useState, useMemo, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutGrid,
  Snowflake,
  WashingMachine,
  Refrigerator,
  Droplets,
  ShieldCheck,
  Zap,
  Award,
  Coins,
  Headphones,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { HeroWords } from '@/components/home-ice-blue/hero-words';
import type { WebsiteService } from '@/lib/content/website-content';
import styles from './services-page.module.css';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả dịch vụ', icon: LayoutGrid },
  { id: 'may-lanh', label: 'Máy lạnh', icon: Snowflake },
  { id: 'may-giat', label: 'Máy giặt', icon: WashingMachine },
  { id: 'tu-lanh', label: 'Tủ lạnh', icon: Refrigerator },
  { id: 'dien-nuoc', label: 'Điện nước – Nóng lạnh', icon: Droplets },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

const BENEFITS = [
  { icon: ShieldCheck, label: 'Uy tín – Chuyên nghiệp' },
  { icon: Zap, label: 'Xử lý nhanh chóng' },
  { icon: Award, label: 'Linh kiện chính hãng' },
  { icon: Coins, label: 'Chi phí minh bạch' },
  { icon: Headphones, label: 'Hỗ trợ 24/7' },
] as const;

export function ServicesPageView({ services }: { services: WebsiteService[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'dien-nuoc') {
        return !['may-lanh', 'may-giat', 'tu-lanh'].some((group) =>
          service.slug.includes(group),
        );
      }
      return service.slug.includes(activeCategory);
    });
  }, [activeCategory, services]);

  const firstRow = filteredServices.slice(0, 4);
  const restServices = filteredServices.slice(4);

  const renderCard = (service: WebsiteService, index: number) => (
    <Link
      key={service.slug}
      href={`/services/${service.slug}`}
      className={`mn-services-catalog-card ${styles.serviceCard}`}
      data-reveal=""
      style={{ '--d': `${(index % 4) * 80}ms` } as CSSProperties}
    >
      <Image
        src={service.imagery.src}
        alt={service.imagery.alt}
        style={{ objectPosition: service.imagery.cardPosition }}
        fill
        sizes="(max-width: 680px) calc((100vw - 44px) / 2), (max-width: 1023px) 50vw, (max-width: 2400px) 25vw, 480px"
        className={styles.cardImg}
        priority={index < 4}
      />
      <div className={styles.cardCaption}>
        <h2 className={styles.cardTitle}>{service.title}</h2>
        <span className={styles.cardArrow} aria-hidden="true">
          <ArrowRight size={18} strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );

  return (
    <div className={styles.pageRoot}>
      <div className="mn-container">
        <section className={`mn-services-catalog-hero ${styles.heroSection}`} aria-label="Giới thiệu dịch vụ" data-u216-hero>
          <div className={styles.heroHeader}>
            <div className={styles.badgePill} data-u216="badge">
              <Settings size={16} strokeWidth={2.2} className={styles.badgeIcon} aria-hidden="true" />
              <span>Dịch vụ của chúng tôi</span>
            </div>
            <h1 className={styles.heroTitle} aria-label="Dịch vụ điện lạnh chuyên nghiệp">
              <HeroWords text="Dịch vụ điện lạnh" />
              <span className={styles.cyanHighlight}><HeroWords text="chuyên nghiệp" start={4} /></span>
            </h1>
          </div>
          <div className={styles.heroArt}>
            <Image
              src="/images/redesign/services-hero-ice-blue.webp"
              alt=""
              fill
              unoptimized
              className={styles.heroImg}
              data-u216="backdrop"
              priority
            />
          </div>
        </section>

        <nav
          className={styles.filterBarWrapper}
          aria-label="Lọc danh mục dịch vụ"
          data-reveal=""
        >
          <div className={styles.filterBar} role="tablist">
            {CATEGORIES.map((category) => {
              const IconComp = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="services-grid"
                  onClick={() => setActiveCategory(category.id)}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                >
                  <IconComp size={18} strokeWidth={2.2} className={styles.pillIcon} aria-hidden="true" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section
          id="services-grid"
          aria-label="Danh sách dịch vụ"
          aria-live="polite"
        >
          <div className={styles.cardsGrid} key={activeCategory}>
            {firstRow.map((service, idx) => renderCard(service, idx))}
          </div>
        </section>

        <section className={styles.benefitsSection} aria-label="Cam kết và lợi ích dịch vụ" data-reveal="">
          <div className={styles.benefitsBar}>
            {BENEFITS.map((item) => {
              const BenefitIcon = item.icon;
              return (
                <div key={item.label} className={styles.benefitItem}>
                  <BenefitIcon size={24} strokeWidth={2.3} className={styles.benefitIcon} aria-hidden="true" />
                  <span className={styles.benefitLabel}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {restServices.length > 0 && (
          <section
            className={styles.gridWrapperMore}
            aria-label="Danh sách dịch vụ khác"
          >
            <div className={styles.cardsGrid} key={activeCategory}>
              {restServices.map((service, idx) => renderCard(service, idx + 4))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
