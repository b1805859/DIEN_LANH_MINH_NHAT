'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, Phone } from 'lucide-react';
import { animate } from 'framer-motion';
import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { Icon } from './ui';
import { HeroAirflow } from './hero-airflow';
import { MobileHomeHero } from './home-mobile-hero';
import { HomeServicesSection } from './home-services-section';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import styles from './hero-service-finder.module.css';

// Keep labels and routes tied to the complete catalogue; only the display order is local.
const serviceOrder = [
  'sua-may-lanh',
  've-sinh-may-lanh',
  'thao-di-doi-may-lanh',
  'lap-dat-may-lanh',
  'nap-gas-may-lanh',
  'sua-may-giat',
  've-sinh-may-giat',
  'sua-tu-lanh',
  'sua-dien-nuoc',
  'sua-lap-may-nuoc-uong-nong-lanh',
  'sua-lap-may-nuoc-nong-lanh-tam',
];
const heroServices = [...serviceCards].sort((a, b) => {
  const aIndex = serviceOrder.indexOf(a.slug);
  const bIndex = serviceOrder.indexOf(b.slug);
  return (aIndex < 0 ? serviceOrder.length : aIndex) - (bIndex < 0 ? serviceOrder.length : bIndex);
});

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

  useLayoutEffect(() => {
    const content = copy.current;
    if (!content || typeof window.matchMedia !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const targets = Array.from(content.querySelectorAll<HTMLElement>('[data-hero-enter]'));
    const timings = [
      { delay: 0.1, duration: 0.7 },
      { delay: 0.22, duration: 0.7 },
      { delay: 0.38, duration: 0.75 },
      { delay: 0.54, duration: 0.7 },
      { delay: 0.7, duration: 0.75 },
    ];
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
              { opacity: [0, 1], y: [24, 0] },
              {
                ...timings[index],
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
      element.style.transform = 'translateY(24px)';
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
        <Image
          src="/images/redesign/hero-family-service-finder-v2.webp"
          alt="Gia đình và kỹ thuật viên Minh Nhật trong phòng khách – ảnh minh họa"
          fill
          priority
          unoptimized
          fetchPriority="high"
          sizes="100vw"
          draggable={false}
          className={styles.room}
        />
        <HeroAirflow />
        <div className={styles.technician} aria-hidden="true">
          <Image
            src="/images/redesign/hero-family-service-finder-v2.webp"
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            draggable={false}
          />
        </div>
      </div>

      <div className={styles.panel} ref={copy}>
        <h1 id="home-finder-title" className={styles.headline} data-hero-enter="headline">
          Điện lạnh &amp; điện nước.
          <em>Phục vụ tận nhà.</em>
        </h1>
        <p className={styles.description} data-hero-enter="description">
          Máy lạnh · Máy giặt · Tủ lạnh · Điện nước · Máy nước nóng lạnh tại Cần Thơ.
        </p>

        <nav
          className={styles.catalogue}
          aria-label="Tất cả dịch vụ tại nhà"
          data-hero-enter="services"
        >
          {heroServices.map((service) => {
            const waterService = service.slug.startsWith('sua-lap-may-nuoc-');
            return (
              <Link
                href={`/services/${service.slug}`}
                key={service.slug}
                className={styles.service}
              >
                <span className={styles.serviceIcon}>
                  <Icon name={service.icon} />
                </span>
                <span className={styles.serviceLabel}>
                  <strong>{service.title}</strong>
                  {waterService && <small>Sửa chữa · Lắp đặt</small>}
                </span>
                <ArrowRight size={16} className={styles.serviceArrow} aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions} data-hero-enter="actions">
          <Link className={styles.booking} href="/booking">
            <CalendarDays size={19} aria-hidden="true" />
            Đặt lịch ngay
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
