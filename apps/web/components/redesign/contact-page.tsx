import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { BookingForm } from '@/components/forms/booking-form';
import { PageHero } from './ui';
import { ContactMap } from './service-area';
import { siteContent } from '@/lib/content/site-content';
export function ContactPageContent({ contact = false }: { contact?: boolean }) {
  return (
    <main className="mn-reference-page mn-contact-page">
      <PageHero
        showEyebrow={false}
        title={contact ? 'Liên hệ Minh Nhật' : 'Đặt lịch dịch vụ'}
        accent={contact ? 'gọi điện hoặc nhắn Zalo' : 'để thợ đến kiểm tra'}
        description={contact ? 'Cho Minh Nhật biết máy đang gặp lỗi gì và địa chỉ của bạn. Bạn có thể gọi điện, nhắn Zalo hoặc để lại thông tin bên dưới.' : 'Bạn chọn dịch vụ, điền địa chỉ và giờ muốn hẹn. Minh Nhật sẽ gọi lại để xác nhận.'}
        image={siteContent.images.contact}
      />
      <div className="mn-container mn-contact-layout mn-tone-section mn-tone-light">
        <section className="mn-booking-shell mn-panel">
          <nav className="mn-tabs" aria-label="Liên hệ và đặt lịch">
            <Link href="/booking" aria-current={!contact ? 'page' : undefined}>
              Đặt lịch dịch vụ
            </Link>
            <Link href="/contact" aria-current={contact ? 'page' : undefined}>
              Liên hệ tư vấn
            </Link>
          </nav>
          <div className="mn-form-panel">
            <BookingForm />
          </div>
        </section>
        <aside className="mn-contact-aside">
          <div className="mn-contact-methods">
            <a href={siteContent.phoneHref}>
              <Phone />
              <span>
                <small>Hotline tư vấn</small>
                <strong>{siteContent.phoneDisplay}</strong>
                <small>Liên hệ để xác nhận lịch</small>
              </span>
            </a>
            <a href={siteContent.zalo} target="_blank" rel="noreferrer">
              <Image src="/icons/zalo.svg" alt="Zalo" width={35} height={35} />
              <span>
                <strong>Chat Zalo</strong>
                <small>Tư vấn nhanh</small>
              </span>
            </a>
          </div>
          {siteContent.email ? (
            <a className="mn-contact-email" href={`mailto:${siteContent.email}`}>
              <Mail />
              <span>
                <small>Email</small>
                {siteContent.email}
              </span>
            </a>
          ) : (
            <div className="mn-contact-email">
              <Mail />
              <span>
                <small>Email</small>Đang cập nhật
              </span>
            </div>
          )}
          <ContactMap />
        </aside>
      </div>
    </main>
  );
}
