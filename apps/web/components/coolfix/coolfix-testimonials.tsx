'use client';

import React from 'react';
import Image from 'next/image';
import { BadgeCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import styles from './coolfix.module.css';

const coreValues = [
  {
    title: 'Kỹ Thuật Chuẩn Xác',
    tagline: 'Đúng quy trình — Đúng bệnh',
    desc: 'Kiểm tra hiện trạng tỉ mỉ, thao tác chuẩn kỹ thuật bằng dụng cụ đo đạc chuyên nghiệp, bảo vệ độ bền thiết bị tối đa.',
    image: '/images/home-reference/hero.webp',
    icon: <BadgeCheck size={20} />,
  },
  {
    title: 'Minh Bạch Phương Án',
    tagline: 'Rõ ràng — Khách duyệt mới làm',
    desc: 'Giải thích cặn kẽ nguyên nhân sự cố và tư vấn giải pháp tối ưu cho gia đình. Khách hàng an tâm tuyệt đối.',
    image: '/images/mockup/portrait.png',
    icon: <ShieldCheck size={20} />,
  },
  {
    title: 'Tận Tâm & Chu Đáo',
    tagline: 'Phục vụ văn minh — Bảo hành trách nhiệm',
    desc: 'Thợ địa phương lễ phép, giữ gìn sạch sẽ không gian gia đình, bàn giao kèm tem bảo hành và hướng dẫn sử dụng bền lâu.',
    image: '/images/hvac-hero.png',
    icon: <HeartHandshake size={20} />,
  },
];

export function CoolFixTestimonials() {
  return (
    <div className={styles.testimonials} id="danh-gia">
      <div className={styles.testimonialsHead}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          GIÁ TRỊ CỐT LÕI
        </span>

        <h2 className={styles.darkTitle}>Vì Sao Khách Hàng Tin Chọn Minh Nhật?</h2>

        <p className={styles.darkSubtitle}>
          Chúng tôi xây dựng uy tín dựa trên sự trung thực, tay nghề vững vàng và tinh thần trách nhiệm trong từng công việc tại Cần Thơ.
        </p>
      </div>

      <div className={styles.testimonialsTrack}>
        {coreValues.map((item) => (
          <div key={item.title} className={styles.testimonialCard}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className={styles.testimonialImage}
            />

            <div className={styles.testimonialOverlay} />

            <div className={styles.testimonialContent}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--cf-blue)' }}>
                {item.icon}
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {item.tagline}
                </span>
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '4px 0 0' }}>
                {item.title}
              </h3>

              <p className={styles.testimonialQuote}>{item.desc}</p>

              <div className={styles.testimonialAuthor}>
                <span>ĐIỆN LẠNH MINH NHẬT CẦN THƠ</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
