'use client';

import React, { useState } from 'react';
import styles from './coolfix.module.css';

const steps = [
  {
    stepNum: '01. LIÊN HỆ',
    title: 'Tiếp nhận nhanh chóng',
    desc: 'Gọi hotline 0939 370 109 hoặc để lại thông tin online — chúng tôi phản hồi ngay trong 5 phút.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,4 40,36 4,36" />
        <circle cx="22" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNum: '02. HẸN GIỜ',
    title: 'Chọn giờ thuận tiện',
    desc: 'Lựa chọn khung giờ phù hợp nhất với gia đình bạn — chúng tôi có mặt linh hoạt, kể cả ngoài giờ hành chính.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="14" cy="14" r="3" />
        <circle cx="22" cy="14" r="3" />
        <circle cx="30" cy="14" r="3" />
        <circle cx="14" cy="22" r="3" fill="currentColor" />
        <circle cx="22" cy="22" r="3" />
        <circle cx="30" cy="22" r="3" />
        <circle cx="14" cy="30" r="3" />
        <circle cx="22" cy="30" r="3" />
        <circle cx="30" cy="30" r="3" />
      </svg>
    ),
  },
  {
    stepNum: '03. KHẢO SÁT',
    title: 'Kiểm tra & Báo giá',
    desc: 'Kỹ thuật viên đến tận nơi, kiểm tra chính xác nguyên nhân và báo giá minh bạch trước khi thực hiện.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="8" y="8" width="28" height="28" rx="4" />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <circle cx="36" cy="36" r="3" fill="currentColor" />
        <line x1="8" y1="22" x2="36" y2="22" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    stepNum: '04. THI CÔNG',
    title: 'Xử lý chuẩn kỹ thuật',
    desc: 'Thực hiện sửa chữa, vệ sinh hoặc lắp đặt bằng đồ nghề chuyên dụng, bảo đảm an toàn và sạch sẽ.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="22" cy="22" r="14" />
        <circle cx="22" cy="8" r="3" fill="currentColor" />
        <circle cx="36" cy="22" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNum: '05. BẢO HÀNH',
    title: 'An tâm tận hưởng',
    desc: 'Bàn giao thiết bị mát lạnh hoàn hảo, kèm phiếu bảo hành chu đáo từ 3 đến 6 tháng không lo tái phát.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="22" cy="10" r="3" />
        <circle cx="22" cy="34" r="3" />
        <circle cx="10" cy="22" r="3" />
        <circle cx="34" cy="22" r="3" />
        <circle cx="22" cy="22" r="4" fill="currentColor" />
      </svg>
    ),
  },
];

export function CoolFixSteps() {
  const [activeStep, setActiveStep] = useState(3); // 04. THI CÔNG is active by default like in video frame 7

  return (
    <section className={styles.stepsSection} id="quy-trinh" aria-labelledby="steps-title">
      <div className={styles.stepsHead}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          QUY TRÌNH LÀM VIỆC
        </span>

        <h2 id="steps-title" className={styles.stepsTitle}>
          Từ Lúc Gọi Đến Khi Mát Lạnh Trong 5 Bước
        </h2>

        <p className={styles.stepsSubtitle}>
          Khắc phục sự cố thiết bị nhanh chóng hơn bạn nghĩ — quy trình rõ ràng, minh bạch giúp bạn hoàn toàn an tâm.
        </p>
      </div>

      <div className={styles.stepsGrid}>
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          return (
            <div
              key={step.stepNum}
              className={styles.stepCard}
              data-active={isActive}
              onMouseEnter={() => setActiveStep(index)}
              onClick={() => setActiveStep(index)}
              tabIndex={0}
              role="button"
              aria-label={`Bước ${index + 1}: ${step.title}`}
            >
              <span className={styles.stepCardNum}>{step.stepNum}</span>

              {isActive ? (
                <div className={styles.stepCardContent}>
                  <h3 className={styles.stepCardHeading}>{step.title}</h3>
                  <p className={styles.stepCardDesc}>{step.desc}</p>
                </div>
              ) : null}

              <div className={styles.stepCardIcon}>{step.icon}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
