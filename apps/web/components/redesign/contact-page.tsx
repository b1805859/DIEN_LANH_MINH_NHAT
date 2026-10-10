import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { BookingForm } from '@/components/forms/booking-form';
import { PageHero } from './ui';
import { ContactMap } from './service-area';
import { siteContent } from '@/lib/content/site-content';
export function ContactPageContent({ contact = false }: { contact?: boolean }) {
  return (
    <main>
      <PageHero
        title="Đặt lịch dịch vụ"
        accent="nhanh chóng, tiện lợi"
        description="Chỉ cần điền thông tin, chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất."
        image={siteContent.images.contact}
      />
      <div className="mn-container mn-contact-layout">
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
          <p className="mn-contact-hint">
            Gửi hình ảnh và mô tả tình trạng thiết bị qua Zalo để kỹ thuật viên tư vấn thuận tiện
            hơn.
          </p>
        </aside>
      </div>
    </main>
  );
}
