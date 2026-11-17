'use client';

import Image from 'next/image';
import { Snowflake } from 'lucide-react';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import { HeroWords } from '@/components/home-ice-blue/hero-words';
import { HeroAirflow } from './hero-airflow';
import styles from './about-family-hero.module.css';

const familyImage = '/images/redesign/hero-family-service-finder-wrist-v1.webp';

export function AboutFamilyHero() {
  const motionBudget = useMotionBudget();

  return (
    <section className={styles.hero} aria-labelledby="about-page-title" data-u216-hero>
      <div className={styles.photo} data-u216="backdrop">
        <Image
          src={familyImage}
          alt="Gia đình và kỹ thuật viên Minh Nhật trong phòng khách – ảnh minh họa"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 800px) calc(100vw - 32px), (max-width: 1440px) calc(100vw - 64px), 1360px"
        />
      </div>
      <div className={styles.airflow}>
        <HeroAirflow composition="finder" budget={motionBudget} showToggle={false} compactFinder />
      </div>
      <div className={styles.technician} data-u216="backdrop" aria-hidden="true">
        <Image src={familyImage} alt="" fill priority sizes="100vw" />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.copy}>
        <span className={styles.eyebrow} data-u216="badge">
          <Snowflake aria-hidden="true" /> Điện lạnh tận nơi tại Cần Thơ
        </span>
        <h1 id="about-page-title" className={styles.title} aria-label="Thợ điện lạnh tại nhà ở Cần Thơ">
          <HeroWords text="Thợ điện lạnh tại nhà" /><br />
          <em><HeroWords text="ở Cần Thơ" start={5} /></em>
        </h1>
        <p className={styles.description} data-u216="description">
          Minh Nhật nhận sửa máy lạnh, máy giặt, tủ lạnh và điện nước. Thợ đến kiểm tra, báo giá và chỉ làm khi bạn đồng ý.
        </p>
      </div>
    </section>
  );
}
