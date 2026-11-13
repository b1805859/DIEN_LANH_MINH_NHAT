'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeftRight,
  Headset,
  CheckCircle2,
  Phone,
  Settings,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { animate } from 'framer-motion';
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from './ui';
import { HeroAirflow } from './hero-airflow';
import { MobileHomeHero } from './home-mobile-hero';
import { HomeServicesSection } from './home-services-section';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import styles from './hero-service-finder.module.css';

import { equipmentGroups } from '@/lib/content/equipment-groups';

const serviceIcons: Record<string, typeof Wrench> = {
  'sua-may-lanh': Wrench,
  've-sinh-may-lanh': Sparkles,
  'thao-di-doi-may-lanh': ArrowLeftRight,
  'lap-dat-may-lanh': Settings,
};

const mobileQuery = '(max-width: 900px)';
const subscribeToViewport = (notify: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

function useMobileLayout() {
  return useSyncExternalStore(subscribeToViewport, getMobileSnapshot, getServerSnapshot);
}

// The selected redesign is desktop-only. Mount only one photo/WebGL scene at a time.
export function HomeHero() {
  const mobile = useMobileLayout();
  return mobile ? <MobileHomeHero /> : <DesktopHomeHero />;
}

export function MobileHomeServices() {
  const mobile = useMobileLayout();
  return mobile ? <HomeServicesSection /> : null;
}

function DesktopHomeHero() {
  const motionBudget = useMotionBudget();
  const copy = useRef<HTMLDivElement>(null);
  const [selectedEquipment, setSelectedEquipment] = useState(0);
  const equipmentButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const equipment = equipmentGroups[selectedEquipment];
  const visibleServices = equipment.slugs.flatMap((slug) => {
    const service = serviceCards.find((item) => item.slug === slug);
    return service ? [service] : [];
  });

  useLayoutEffect(() => {
    const content = copy.current;
    if (!content || typeof window.matchMedia !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const targets = Array.from(content.querySelectorAll<HTMLElement>('[data-hero-enter="services"], [data-hero-enter="benefits"]'));
    const animations: Array<{ stop: () => void }> = [];
    let observer: IntersectionObserver | undefined;
    let started = false;
    const showImmediately = () => {
      started = true;
      observer?.disconnect();
      animations.forEach((animation) => animation.stop());
      targets.forEach((element) => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
      });
    };
    const start = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      try {
        targets.forEach((element, index) => {
          animations.push(
            animate(
              element,
              { opacity: [0, 1], y: [10, 0] },
              {
                duration: 0.4,
                delay: index * 0.06,
                type: 'tween',
                ease: [0.22, 1, 0.36, 1],
              },
            ),
          );
        });
      } catch {
        showImmediately();
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) showImmediately();
    };

    // Server markup stays visible if JavaScript fails; prepare only after hydration.
    targets.forEach((element) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(10px)';
    });
    preference.addEventListener('change', onPreferenceChange);
    content.addEventListener('focusin', showImmediately);
    try {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        });
        observer.observe(content);
      } else {
        start();
      }
    } catch {
      showImmediately();
    }
    return () => {
      showImmediately();
      preference.removeEventListener('change', onPreferenceChange);
      content.removeEventListener('focusin', showImmediately);
    };
  }, []);

  return (
    <section
      className={`mn-home-finder ${styles.finder}`}
      data-motion-budget={motionBudget}
      aria-labelledby="home-finder-title"
    >
      {/* The original photo, WebGL scene and technician mask share one projection. */}
      <div className={styles.scene}>
        <picture className={styles.photo}>
          <Image
            src="/images/redesign/hero-family-service-finder-wrist-v1.webp"
            alt="Gia đình và kỹ thuật viên Minh Nhật trong phòng khách – ảnh minh họa"
            fill
            loading="eager"
            unoptimized
            fetchPriority="high"
            sizes="100vw"
            draggable={false}
            className={styles.room}
          />
        </picture>
        <HeroAirflow composition="finder" budget={motionBudget} />
        <div className={styles.technician} aria-hidden="true">
          <picture className={styles.photo}>
            <Image
              src="/images/redesign/hero-family-service-finder-wrist-v1.webp"
              alt=""
              fill
              loading="eager"
              unoptimized
              sizes="100vw"
              draggable={false}
            />
          </picture>
        </div>
      </div>

      <div className={styles.panel} ref={copy}>
        <h1 id="home-finder-title" className={styles.headline} data-hero-enter="headline">
          Điện lạnh &amp; điện nước.
          <em>Phục vụ tận nhà.</em>
        </h1>
        <p className={styles.description} data-hero-enter="description">
          Sửa chữa · Vệ sinh · Lắp đặt · Bảo trì tại Cần Thơ.
        </p>

        <div className={styles.selector} data-hero-enter="services">
          <h2 className={styles.selectorTitle}>Bạn cần hỗ trợ gì?</h2>
          <div className={styles.catalogue}>
            <div
              className={styles.equipmentList}
              role="tablist"
              aria-label="Chọn thiết bị cần hỗ trợ"
              aria-orientation="vertical"
            >
              {equipmentGroups.map((group, index) => (
                <button
                  key={group.id}
                  ref={(element) => {
                    equipmentButtons.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`home-equipment-${group.id}`}
                  aria-controls="home-equipment-services"
                  aria-selected={selectedEquipment === index}
                  tabIndex={selectedEquipment === index ? 0 : -1}
                  className={styles.equipment}
                  onClick={() => setSelectedEquipment(index)}
                  onKeyDown={(event) => {
                    let next: number;
                    if (event.key === 'ArrowDown') next = (index + 1) % equipmentGroups.length;
                    else if (event.key === 'ArrowUp')
                      next = (index - 1 + equipmentGroups.length) % equipmentGroups.length;
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = equipmentGroups.length - 1;
                    else return;
                    event.preventDefault();
                    setSelectedEquipment(next);
                    equipmentButtons.current[next]?.focus();
                  }}
                >
                  <Icon name={group.icon} />
                  <span>{group.label}</span>
                </button>
              ))}
            </div>
            <div
              className={styles.servicePanel}
              role="tabpanel"
              id="home-equipment-services"
              aria-labelledby={`home-equipment-${equipment.id}`}
              tabIndex={0}
            >
              <h3 className={styles.serviceHeading}>{equipment.heading}</h3>
              <nav className={styles.serviceList} aria-label={equipment.heading}>
                {visibleServices.map((service) => {
                  const ServiceIcon = serviceIcons[service.slug];
                  const waterService = service.slug.startsWith('sua-lap-may-nuoc-');
                  return (
                    <Link
                      href={`/services/${service.slug}`}
                      key={service.slug}
                      className={styles.service}
                    >
                      <span className={styles.serviceIcon}>
                        {ServiceIcon ? (
                          <ServiceIcon strokeWidth={1.65} aria-hidden="true" />
                        ) : (
                          <Icon name={service.icon} />
                        )}
                      </span>
                      <span className={styles.serviceLabel}>
                        <strong>
                          {service.slug === 'thao-di-doi-may-lanh'
                            ? 'Di dời máy lạnh'
                            : waterService
                              ? 'Sửa chữa · Lắp đặt'
                              : service.title}
                        </strong>
                      </span>
                      <ArrowRight size={18} className={styles.serviceArrow} aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.actions} data-hero-enter="actions">
          <Link className={styles.booking} href="/contact#tu-van">
            <Headset size={19} aria-hidden="true" />
            Nhận tư vấn
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className={styles.phone} href={siteContent.phoneHref}>
            <span>
              <Phone size={20} aria-hidden="true" />
            </span>
            {siteContent.phoneDisplay}
          </a>
        </div>
        <ul className={styles.benefits} aria-label="Cách làm việc" data-hero-enter="benefits">
          {['Hẹn giờ trước', 'Báo giá trước', 'Chạy thử sau sửa'].map((benefit) => (
            <li key={benefit}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
