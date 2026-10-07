'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './coolfix.module.css';

const stats = [
  {
    number: '10',
    label: 'Năm kinh nghiệm giữ không gian mát mẻ tại Cần Thơ',
  },
  {
    number: '1 500+',
    label: 'Thiết bị & khách hàng được phục vụ thành công',
  },
  {
    number: '4.9',
    label: 'Điểm đánh giá dịch vụ trung bình từ khách hàng',
  },
  {
    number: '30',
    label: 'Phút có mặt tận nơi trong mùa cao điểm nắng nóng',
  },
];

export function CoolFixAdvantages() {
  const [activeStat, setActiveStat] = useState(0);

  return (
    <section className={styles.advantages} aria-labelledby="advantages-title">
      <div className={styles.advantagesHead}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          ƯU ĐIỂM NỔI BẬT
        </span>

        <div className={styles.advantagesTitleWrap}>
          <h2 id="advantages-title" className={styles.advantagesTitle}>
            Đội Ngũ Kỹ Thuật Viên Lành Nghề
          </h2>

          <div className={styles.avatarStack} aria-label="Đội ngũ hơn 16 kỹ thuật viên">
            <div className={styles.avatarItem}>
              <Image
                src="/images/mockup/portrait.png"
                alt="Kỹ thuật viên Minh Nhật"
                fill
                sizes="48px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.avatarItem}>
              <Image
                src="/images/hvac-hero.png"
                alt="Thợ điện lạnh kiểm tra dàn lạnh"
                fill
                sizes="48px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.avatarItem}>
              <Image
                src="/images/home-reference/technician.webp"
                alt="Thợ sửa dàn nóng điều hòa"
                fill
                sizes="48px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.avatarBadge}>+16</div>
          </div>
        </div>
      </div>

      <div className={styles.counterContainer} role="region" aria-label="Số liệu hoạt động">
        {stats.map((item, index) => (
          <div
            key={item.number}
            className={styles.counterCard}
            data-active={activeStat === index}
            onMouseEnter={() => setActiveStat(index)}
            onClick={() => setActiveStat(index)}
          >
            <span className={styles.counterNumber}>{item.number}</span>
            <span className={styles.counterLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
