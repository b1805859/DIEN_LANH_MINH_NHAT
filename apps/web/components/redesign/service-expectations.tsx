import { BadgeCheck, CalendarClock, ReceiptText } from 'lucide-react';

const items = [
  { icon: ReceiptText, title: 'Chi phí trước khi làm', text: 'Hỏi rõ phí kiểm tra, tiền công, vật tư và khoản phát sinh nếu có. Thợ kiểm tra và trao đổi báo giá để bạn quyết định trước khi sửa.' },
  { icon: BadgeCheck, title: 'Hỗ trợ sau sửa chữa', text: 'Trước khi đồng ý sửa, hãy xác nhận hạng mục nào được bảo hành, thời hạn và điều kiện áp dụng. Giữ lại thông tin công việc để tiện liên hệ hỗ trợ.' },
  { icon: CalendarClock, title: 'Xác nhận lịch đến', text: 'Gửi ngày và khung giờ bạn thuận tiện. Lịch gửi trên web là yêu cầu hẹn; giờ đến cụ thể được thống nhất khi Minh Nhật liên hệ lại.' },
];

export function ServiceExpectations() {
  return (
    <section className="mn-service-expectations" aria-label="Thông tin cần trao đổi trước khi đặt dịch vụ" data-reveal="">
      <h2>Thông tin cần rõ trước khi hẹn thợ</h2>
      <div>
        {items.map(({ icon: Icon, title, text }, index) => (
          <article
            key={title}
            data-reveal=""
            style={{ '--d': `${index * 0.08}s` } as React.CSSProperties}
          >
            <Icon size={24} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
