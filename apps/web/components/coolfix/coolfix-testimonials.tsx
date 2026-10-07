'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from './coolfix.module.css';

const reviews = [
  {
    name: 'Anh Minh Trí',
    location: 'Ninh Kiều, Cần Thơ',
    quote:
      'Máy lạnh phòng khách chảy nước lúc trưa nắng gắt. Gọi Minh Nhật chưa đầy 25 phút thợ đã có mặt, vệ sinh thông ống sạch sẽ, rất lịch sự.',
    image: '/images/home-reference/hero.webp',
  },
  {
    name: 'Chị Bích Ngọc',
    location: 'Cái Răng, Cần Thơ',
    quote:
      'Tôi dọn nhà mới cần tháo lắp 2 máy lạnh. Đội ngũ làm việc rất kỹ càng, bọc đệm cẩn thận và hút chân không đúng kỹ thuật. Giá báo sao thu đúng vậy!',
    image: '/images/mockup/portrait.png',
  },
  {
    name: 'Chú Hoàng Nam',
    location: 'Bình Thủy, Cần Thơ',
    quote:
      'Tủ lạnh không đông đá, tưởng phải thay mới. Thợ Minh Nhật qua đo đạc kỹ, thay rơ-le chính hãng chi phí rất hợp lý. Bảo hành rõ ràng, rất an tâm.',
    image: '/images/hvac-hero.png',
  },
];

export function CoolFixTestimonials() {
  return (
    <div className={styles.testimonials} id="danh-gia">
      <div className={styles.testimonialsHead}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          ĐÁNH GIÁ TỪ KHÁCH HÀNG
        </span>

        <h2 className={styles.darkTitle}>Khách Hàng Nói Gì Về Minh Nhật</h2>

        <p className={styles.darkSubtitle}>
          Phản hồi nhanh chóng, giá cả trung thực và làm đúng ngay từ lần đầu — đó là lý do bà con Cần Thơ luôn tin chọn và gắn bó dài lâu.
        </p>
      </div>

      <div className={styles.testimonialsTrack}>
        {reviews.map((item) => (
          <div key={item.name} className={styles.testimonialCard}>
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className={styles.testimonialImage}
            />

            <div className={styles.testimonialOverlay} />

            <div className={styles.testimonialContent}>
              <p className={styles.testimonialQuote}>“{item.quote}”</p>

              <div className={styles.testimonialAuthor}>
                <span>
                  — {item.name}, {item.location}
                </span>

                <div className={styles.testimonialStars} aria-label="5 trên 5 sao">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
