'use client';

import React, { useState } from 'react';
import styles from './coolfix.module.css';

const advantages = [
  {
    badge: 'ĐÚNG BỆNH',
    title: 'Kiểm tra chính xác',
    label: 'Khảo sát tận nhà, bắt đúng bệnh và giải thích rõ nguyên nhân kỹ thuật.',
  },
  {
    badge: 'MINH BẠCH',
    title: 'Báo rõ phương án',
    label: 'Thống nhất giải pháp kỹ thuật cụ thể trước khi thực hiện, không mập mờ.',
  },
  {
    badge: 'TẬN NƠI',
    title: 'Cơ động Cần Thơ',
    label: 'Ưu tiên hỗ trợ nhanh tại Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt.',
  },
  {
    badge: 'BẢO HÀNH',
    title: 'Trách nhiệm cao',
    label: 'Dán tem bảo hành, xuất phiếu theo dõi và hỗ trợ chu đáo sau dịch vụ.',
  },
];

export function CoolFixAdvantages() {
  const [activeAdvantage, setActiveAdvantage] = useState(0);

  return (
    <section className={styles.advantages} aria-labelledby="advantages-title">
      <div className={styles.advantagesHead}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          CAM KẾT DỊCH VỤ
        </span>

        <div className={styles.advantagesTitleWrap}>
          <h2 id="advantages-title" className={styles.advantagesTitle}>
            Cam Kết Từ Điện Lạnh Minh Nhật
          </h2>
        </div>
      </div>

      <div className={styles.counterContainer} role="region" aria-label="Cam kết dịch vụ">
        {advantages.map((item, index) => (
          <div
            key={item.title}
            className={styles.counterCard}
            data-active={activeAdvantage === index}
            onMouseEnter={() => setActiveAdvantage(index)}
            onClick={() => setActiveAdvantage(index)}
          >
            <span className={styles.counterNumber}>{item.badge}</span>
            <span className={styles.counterTitle}>{item.title}</span>
            <span className={styles.counterLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
