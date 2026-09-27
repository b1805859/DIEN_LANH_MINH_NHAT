import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, MapPin, Phone } from 'lucide-react';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Gửi yêu cầu dịch vụ điện lạnh tại Cần Thơ',
  description:
    'Gửi yêu cầu sửa chữa điện lạnh đến Minh Nhật. Chọn dịch vụ, nhập họ tên, số điện thoại và địa chỉ; Minh Nhật sẽ liên hệ để xác nhận lịch.',
  path: '/booking',
});

export default function BookingPage() {
  return (
    <main className="mock-page mock-inner-page mock-booking">
      <div className="mock-shell">
        <nav className="mock-breadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={15} />
          <span>Đặt lịch</span>
        </nav>
        <div className="mock-booking-layout">
          <section className="mock-booking-main">
            <h1>Đặt lịch sửa chữa điện lạnh</h1>
            <p>Để lại thông tin, Minh Nhật sẽ liên hệ trong thời gian phù hợp.</p>
            <BookingForm />
            <p className="mock-booking-check">
              <CheckCircle2 size={18} />{' '}
              <a href={integrationSettings.zaloUrl} target="_blank" rel="noreferrer">
                Hoặc nhắn trực tiếp qua Zalo
              </a>
            </p>
          </section>
          <aside className="mock-booking-aside">
            <div className="mock-booking-image">
              <Image
                src="/images/hvac-hero-branded.png"
                alt="Kỹ thuật viên Minh Nhật đang kiểm tra máy lạnh"
                fill
                priority
                sizes="(min-width: 768px) 80vw, 100vw"
              />
            </div>
            <p>
              Cảm ơn bạn
              <br />
              đã tin tưởng Minh Nhật!
              <br />
              Chúng tôi sẽ luôn hỗ trợ bạn hết mình.
            </p>
          </aside>
        </div>
        <div className="mock-contact-strip">
          <a href={`tel:${integrationSettings.phone}`}>
            <Phone />
            <span>
              <strong>0939 370 109</strong>
              <small>08:00 – 17:00 Thứ 2 – CN</small>
            </span>
          </a>
          <a href={integrationSettings.zaloUrl} target="_blank" rel="noreferrer">
            <Image src="/icons/zalo.svg" width={30} height={30} alt="" />
            <span>
              <strong>Nhắn Zalo</strong>
              <small>Liên hệ qua số 0939 370 109</small>
            </span>
          </a>
          <span>
            <MapPin />
            <span>
              <strong>Phục vụ tận nơi</strong>
              <small>Tại các khu vực ở Cần Thơ</small>
            </span>
          </span>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Đặt lịch', path: '/booking' },
        ])}
      />
    </main>
  );
}
