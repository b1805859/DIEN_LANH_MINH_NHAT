'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { animate } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { Icon } from './ui';
import { HeroAirflow } from './hero-airflow';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import styles from './hero.module.css';

const quick = [
  ['snowflake', 'Sửa chữa', 'máy lạnh', '/services/sua-may-lanh'],
  ['washer', 'Sửa chữa', 'máy giặt', '/services/sua-may-giat'],
  ['fridge', 'Sửa chữa', 'tủ lạnh', '/services/sua-tu-lanh'],
  ['plug', 'Điện nước', 'dân dụng', '/services/sua-dien-nuoc'],
  ['clock', 'Đặt lịch', 'tại Cần Thơ', '/booking'],
  ['wrench', 'Bảo dưỡng', 'định kỳ', '/services'],
  ['shield', 'Hỗ trợ bảo hành', 'theo hạng mục', '/about'],
  ['pin', 'Khu vực', 'nhận sửa', '/#khu-vuc'],
] as const;

export function HomeHero() {
  const motionBudget = useMotionBudget();
  const copy = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = copy.current;
    if (!content || typeof window.matchMedia !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;

    const targets = Array.from(content.querySelectorAll<HTMLElement>('[data-hero-enter]'));
    const timings = [
      { delay: 0.10, duration: 0.70 },
      { delay: 0.22, duration: 0.70 },
      { delay: 0.38, duration: 0.75 },
      { delay: 0.54, duration: 0.70 },
      { delay: 0.70, duration: 0.75 },
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
          animations.push(animate(element, { opacity: [0, 1], y: [24, 0] }, {
            ...timings[index],
            type: 'tween',
            ease: [0.22, 1, 0.36, 1],
          }));
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
      className={`mn-home-hero ${styles.carousel}`}
      data-motion-budget={motionBudget}
      role="region"
      aria-label="Điện Lạnh Minh Nhật – Sửa điện lạnh tại nhà ở Cần Thơ"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          <article className={`${styles.slide} ${styles.family} ${styles.active}`}>
            <div className={styles.scene}>
              {/* Layer 1: Clean Living-Room Background Plate (static airflow removed) */}
              <div className={styles.media}>
                <div className={styles.stage}>
                  <Image
                    src="/images/redesign/hero-family-natural-arms.webp"
                    alt="Gia đình và kỹ thuật viên trong phòng khách – ảnh minh họa"
                    fill
                    priority
                    unoptimized
                    fetchPriority="high"
                    sizes="100vw"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Layer 2: Left gradient overlay for text readability */}
              <div className={styles.shade} aria-hidden="true" />

              {/* Layers 5, 6, 7: Back airflow, Main curved airflow ribbons, Front mist & micro-particles */}
              <HeroAirflow />

              {/* Reuse the original plate so the full technician stays pixel-aligned. */}
              <div
                className={`${styles.occlusionLayer} ${styles.technicianLayer}`}
                aria-hidden="true"
              >
                <Image
                  src="/images/redesign/hero-family-natural-arms.webp"
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  draggable={false}
                />
              </div>
            </div>
            {/* Layer 9: Foreground UI Copy & CTA */}
            <div className={styles.copy} ref={copy}>
              <h1 className={styles.headline}>
                <span className={styles.headlineLine} data-hero-enter="headline-first">Sửa điện lạnh</span>
                <br />
                <em className={styles.headlineLine} data-hero-enter="headline-second">ngay tại nhà</em>
              </h1>
              <p className={styles.description} data-hero-enter="description">
                Máy lạnh, máy giặt, tủ lạnh
                <br />
                và điện nước tại Cần Thơ.
              </p>
              <div className={styles.ctaEntrance} data-hero-enter="cta">
                <Link className={`mn-button ${styles.booking}`} href="/booking">
                  Đặt lịch ngay
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <ul className={styles.benefits} aria-label="Cách làm việc" data-hero-enter="benefits">
                {['Hẹn giờ trước', 'Báo giá trước', 'Chạy thử sau sửa'].map((benefit) => (
                  <li key={benefit}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        {/* Layer 9: Bottom 8-item Services Navigation Bar */}
        <nav className={styles.services} aria-label="Dịch vụ điện lạnh">
          {quick.map(([icon, line1, line2, href]) => (
            <Link href={href} key={icon}>
              <span className={styles.serviceIcon}>
                <Icon name={icon} />
              </span>
              <span>
                {line1}
                <br />
                {line2}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
