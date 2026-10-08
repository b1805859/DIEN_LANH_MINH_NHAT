'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './coolfix.module.css';

const faqs = [
  {
    num: '01',
    q: 'Bao lâu nên vệ sinh máy lạnh một lần?',
    a: 'Đối với hộ gia đình, nên vệ sinh máy lạnh định kỳ mỗi 3 đến 6 tháng tùy theo tần suất sử dụng thực tế để đảm bảo luồng gió trong lành và tiết kiệm điện.',
  },
  {
    num: '02',
    q: 'Có kiểm tra và tư vấn phương án trước khi sửa không?',
    a: 'Có. Kỹ thuật viên Minh Nhật luôn kiểm tra hiện trạng thiết bị, giải thích rõ nguyên nhân và tư vấn phương án kỹ thuật minh bạch trước khi thực hiện.',
  },
  {
    num: '03',
    q: 'Máy lạnh yếu lạnh có phải luôn cần nạp gas không?',
    a: 'Không hẳn. Bụi bẩn bám dàn lạnh, quạt gió yếu, cảm biến nhiệt độ hoặc dàn nóng bị bí gió cũng có thể làm máy lạnh yếu. Kỹ thuật viên cần đo áp suất gas thực tế trước khi kết luận.',
  },
  {
    num: '04',
    q: 'Khu vực nào tại Cần Thơ được hỗ trợ tận nơi?',
    a: 'Chúng tôi ưu tiên phục vụ tận nơi tại các phường thuộc Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt và các khu vực lân cận thuộc TP. Cần Thơ.',
  },
];

export function CoolFixFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // 03 is open by default like in video frame 9

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqSection} id="faq">
      <span className={styles.eyebrow}>
        <span className={styles.eyebrowDot} />
        CÂU HỎI THƯỜNG GẶP
      </span>

      <h2 className={styles.darkTitle}>Thắc Mắc Thường Gặp</h2>

      <p className={styles.darkSubtitle}>
        Giải đáp minh bạch mọi thắc mắc về chi phí, bảo hành và thời gian phục vụ tại Cần Thơ.
      </p>

      <div style={{ marginTop: 40 }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.num} className={styles.faqItem} data-open={isOpen}>
              <button
                type="button"
                className={styles.faqButton}
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className={styles.faqNum}>{faq.num}</span>
                <span className={styles.faqQuestion}>{faq.q}</span>
                <span className={styles.faqIcon}>
                  <Plus size={20} />
                </span>
              </button>

              {isOpen && <p className={styles.faqAnswer}>{faq.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
