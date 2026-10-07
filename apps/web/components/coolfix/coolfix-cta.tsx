'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';
import styles from './coolfix.module.css';

export function CoolFixCta() {
  const phone = integrationSettings.phone.replace(/\s/g, '');

  return (
    <div className={styles.breatheEasy} aria-label="Đặt lịch sửa chữa nhanh chóng">
      <Image
        src="/images/home-reference/air-natural.webp"
        alt="Không gian phòng khách mát lành tiện nghi"
        fill
        sizes="(max-width: 1024px) 100vw, 1320px"
        className={styles.breatheImage}
      />

      <div className={styles.breatheOverlay} />
      <div className={styles.breatheGlow} aria-hidden="true" />

      <div className={styles.breatheContent}>
        <h2 className={styles.breatheTitle}>
          Tận Hưởng Không Gian Mát Lành —
          <br />
          Đã Có Minh Nhật Lo
        </h2>

        <p className={styles.breatheSubtitle}>
          Phục vụ tận nơi cho gia đình và doanh nghiệp tại Ninh Kiều, Cái Răng, Bình Thủy...
          Có mặt nhanh trong 30 phút, bảo hành uy tín dài hạn.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/booking" className={styles.heroBtnWhite}>
            Đặt lịch ngay <ArrowRight size={17} />
          </Link>
          <a href={`tel:${phone}`} className={styles.heroBtnGlass}>
            <Phone size={17} /> Gọi 0939 370 109
          </a>
        </div>
      </div>
    </div>
  );
}
