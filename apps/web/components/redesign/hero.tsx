'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Icon } from './ui';
import { HeroAirflow } from './hero-airflow';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import styles from './hero.module.css';

const quick = [
  ['snowflake', 'Sửa chữa', 'máy lạnh', '/services/sua-may-lanh'],
  ['washer', 'Sửa chữa', 'máy giặt', '/services/sua-may-giat'],
  ['fridge', 'Sửa chữa', 'tủ lạnh', '/services/sua-tu-lanh'],
  ['plug', 'Điện nước', 'dân dụng', '/services/sua-dien-nuoc'],
  ['clock', 'Hẹn lịch nhanh', 'tại Cần Thơ', '/booking'],
  ['wrench', 'Bảo dưỡng', 'định kỳ', '/services'],
  ['shield', 'Hỗ trợ bảo hành', 'theo hạng mục', '/about'],
  ['pin', 'Phục vụ khắp', 'các khu vực', '/#khu-vuc'],
] as const;

export function HomeHero() {
  const motionBudget = useMotionBudget();

  return (
    <section
      className={`mn-home-hero ${styles.carousel}`}
      data-motion-budget={motionBudget}
      role="region"
      aria-label="Điện Lạnh Minh Nhật – Không gian sống thoải mái hơn"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          <article className={`${styles.slide} ${styles.family} ${styles.active}`}>
            {/* Layer 1: Clean Living-Room Background Plate (static airflow removed) */}
            <div className={styles.media}>
              <div className={styles.stage}>
                <Image
                  src="/images/redesign/hero-room-clean.webp"
                  alt="Không gian phòng khách hiện đại mát mẻ cùng gia đình và kỹ thuật viên Điện Lạnh Minh Nhật tại Cần Thơ"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  draggable={false}
                />
              </div>
            </div>

            {/* Layer 2: Left gradient overlay for text readability */}
            <div className={styles.shade} />

            {/* Layers 5, 6, 7: Back airflow, Main curved airflow ribbons, Front mist & micro-particles */}
            <HeroAirflow />

            {/* Layers 3, 4, 8: AC vent lip, Family face protection, and Foreground Technician occlusion */}
            <div className={styles.occlusionLayer} aria-hidden="true">
              <Image
                src="/images/redesign/hero-ac-layer.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                draggable={false}
              />
              <Image
                src="/images/redesign/hero-family-layer.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                draggable={false}
              />
              <Image
                src="/images/redesign/hero-technician-layer.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                draggable={false}
              />
            </div>

            {/* Layer 9: Foreground UI Copy & CTA */}
            <div className={styles.copy}>
              <h1 className={styles.headline}>
                Không gian sống
                <br />
                <em>thoải mái hơn</em>
              </h1>
              <p className={styles.description}>
                Giải pháp điện lạnh toàn diện giúp gia đình bạn tận hưởng không gian mát mẻ, trong
                lành và tiết kiệm điện năng tại Cần Thơ.
              </p>
              <Link className={`mn-button ${styles.booking}`} href="/booking">
                Đặt lịch ngay
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <ul className={styles.benefits} aria-label="Tinh thần phục vụ">
                {['Tận tâm', 'Nhanh chóng', 'Chuyên nghiệp'].map((benefit) => (
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
        <nav className={styles.services} aria-label="Dịch vụ và cam kết">
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
