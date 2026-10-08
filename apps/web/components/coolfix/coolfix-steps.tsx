'use client';

import React, { useState } from 'react';
import styles from './coolfix.module.css';

const steps = [
  {
    stepNum: '01. TIẾP NHẬN',
    title: 'Tiếp nhận thông tin',
    desc: 'Khách hàng gọi hotline 0939 370 109, nhắn Zalo hoặc đặt hẹn qua website — kỹ thuật viên sẽ liên hệ lại xác nhận sớm nhất.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22,4 40,36 4,36" />
        <circle cx="22" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNum: '02. HẸN LỊCH',
    title: 'Khảo sát tận nơi',
    desc: 'Sắp xếp khung giờ thuận tiện nhất theo lịch sinh hoạt và làm việc của quý khách tại Cần Thơ.',
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
    stepNum: '03. KIỂM TRA',
    title: 'Kiểm tra & Báo phương án',
    desc: 'Kỹ thuật viên đến tận nơi, kiểm tra chính xác nguyên nhân và giải thích rõ phương án trước khi thực hiện.',
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
    stepNum: '04. THỰC HIỆN',
    title: 'Thi công chuẩn kỹ thuật',
    desc: 'Thực hiện sửa chữa, vệ sinh hoặc lắp đặt bằng đồ nghề chuyên dụng, bảo đảm an toàn điện và sạch sẽ.',
    icon: (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="22" cy="22" r="14" />
        <circle cx="22" cy="8" r="3" fill="currentColor" />
        <circle cx="36" cy="22" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    stepNum: '05. NGHIỆM THU',
    title: 'Bàn giao & Bảo hành',
    desc: 'Vận hành thử nghiệm chu đáo, hướng dẫn gia chủ sử dụng an toàn và dán tem bảo hành theo dõi.',
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
