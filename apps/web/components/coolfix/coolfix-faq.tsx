'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import styles from './coolfix.module.css';

const faqs = [
  {
    num: '01',
    q: 'Kỹ thuật viên có mặt sau bao lâu khi đặt lịch?',
    a: 'Tại các quận trung tâm Cần Thơ (Ninh Kiều, Cái Răng, Bình Thủy), kỹ thuật viên thường có mặt tận nơi trong vòng 20 - 30 phút kể từ lúc tiếp nhận cuộc gọi. Các khu vực lân cận được hẹn giờ chính xác.',
  },
  {
    num: '02',
    q: 'Chi phí kiểm tra tận nhà có phát sinh phụ phí không?',
    a: 'Chúng tôi kiểm tra tình trạng máy và báo giá chi tiết, trọn gói trước khi làm. Khách hàng đồng ý phương án mới tiến hành sửa chữa. Tuyệt đối không phát sinh chi phí ẩn.',
  },
  {
    num: '03',
    q: 'Điện Lạnh Minh Nhật có chính sách bảo hành như thế nào?',
    a: 'Mọi dịch vụ sửa chữa và thay thế linh kiện đều đi kèm phiếu bảo hành chính thức từ 3 đến 6 tháng. Trong thời gian bảo hành, nếu gặp lại lỗi cũ, thợ sẽ đến xử lý hoàn toàn miễn phí.',
  },
  {
    num: '04',
    q: 'Linh kiện thay thế có phải chính hãng không?',
    a: 'Minh Nhật cam kết 100% linh kiện thay thế (block, tụ điện, rơ-le, quạt, gas R32/R410A) đều chính hãng từ các thương hiệu Panasonic, Daikin, Toshiba, LG, Casper,... với tem mác rõ ràng.',
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
