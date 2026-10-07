'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { AirflowCanvas } from '@/components/kage/airflow-canvas';
import { integrationSettings } from '@/lib/integrations/settings';
import styles from './coolfix.module.css';

export function CoolFixHero() {
  const phone = integrationSettings.phone.replace(/\s/g, '');

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Cool airflow streaks background */}
      <AirflowCanvas className={styles.heroCanvas} />

      {/* Decorative wall-mounted AC unit glowing with cool air */}
      <div className={styles.heroAcUnit} aria-hidden="true">
        <svg viewBox="0 0 460 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="acBody" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="coolFlow" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.45)" />
              <stop offset="60%" stopColor="rgba(96, 165, 250, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
            <filter id="acShadow" x="-10" y="-10" width="480" height="200" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0F172A" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* AC Unit Body */}
          <rect x="20" y="20" width="420" height="110" rx="16" fill="url(#acBody)" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#acShadow)" />
          
          {/* Top air vent slots */}
          <line x1="50" y1="36" x2="410" y2="36" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="44" x2="410" y2="44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

          {/* Lower air exhaust flap */}
          <rect x="40" y="98" width="380" height="20" rx="4" fill="#E2E8F0" />
          <rect x="44" y="102" width="372" height="12" rx="3" fill="#1E293B" opacity="0.85" />

          {/* Power / cooling status LED light */}
          <circle cx="395" cy="74" r="3" fill="#3B82F6" />
          <circle cx="395" cy="74" r="7" fill="#3B82F6" opacity="0.3" />

          {/* Flowing blue cool breeze rays emanating from the louvers */}
          <path d="M60 118 C 90 150, 140 180, 160 210" stroke="url(#coolFlow)" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
          <path d="M140 118 C 170 155, 230 185, 260 215" stroke="url(#coolFlow)" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          <path d="M240 118 C 270 155, 330 185, 360 215" stroke="url(#coolFlow)" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
          <path d="M340 118 C 360 150, 400 175, 420 200" stroke="url(#coolFlow)" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>

      <div className={styles.heroContent}>
        <h1 id="hero-title" className={styles.heroTitle}>
          Sửa Chữa Máy Lạnh Cần Thơ —
          <br />
          Khi Bạn Cần Nhất.
        </h1>
        <p className={styles.heroSubtitle}>
          Có mặt nhanh trong 30 phút. Kỹ thuật viên chuyên nghiệp tận tâm.
          <br />
          Cam kết 100% hài lòng và bảo hành dài hạn.
        </p>

        <div className={styles.heroActions}>
          <Link href="/booking" className={styles.heroBtnWhite}>
            Đặt lịch ngay <ArrowRight size={17} />
          </Link>
          <a href={`tel:${phone}`} className={styles.heroBtnGlass}>
            <Phone size={17} /> Báo giá nhanh
          </a>
        </div>
      </div>
    </section>
  );
}
