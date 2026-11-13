import Image from 'next/image';
import { Headset, Mail, Phone } from 'lucide-react';
import { ConsultationForm } from '@/components/forms/consultation-form';
import { siteContent } from '@/lib/content/site-content';
import { PageHero } from './ui';
import { ContactMap } from './service-area';
import styles from './contact-page.module.css';

export function ContactPageContent() {
  return (
    <main className="mn-reference-page mn-contact-page">
      <PageHero
        className="mn-contact-hero"
        showEyebrow={false}
        title="Liên hệ"
        accent="và tư vấn"
        description="Gọi, nhắn Zalo hoặc để lại thông tin để nhân viên Minh Nhật gọi lại tư vấn."
        image={siteContent.images.contact}
      />
      <div className={`mn-container mn-contact-layout mn-tone-section mn-tone-light ${styles.layout}`}>
        <div className={styles.contactStack}>
          <section
            id="tu-van"
            className={`mn-booking-shell mn-panel ${styles.booking}`}
            aria-labelledby="consultation-heading"
            tabIndex={-1}
          >
            <span id="dat-lich" className={styles.legacyAnchor} aria-hidden="true" />
            <div className="mn-form-panel">
              <header className={styles.heading}>
                <Headset aria-hidden="true" />
                <div>
                  <h2 id="consultation-heading">Để lại thông tin tư vấn</h2>
                  <p>Nhân viên Minh Nhật sẽ gọi lại để trao đổi về tình trạng máy và giải đáp thắc mắc của bạn.</p>
                </div>
              </header>
              <ConsultationForm />
            </div>
          </section>
          <section className={`mn-panel ${styles.help}`} aria-labelledby="contact-heading">
            <h2 id="contact-heading">Muốn trao đổi ngay?</h2>
            <p>Gọi để trao đổi hoặc gửi ảnh tình trạng máy qua Zalo.</p>
            <div className={styles.actions}>
              <a className="mn-button" href={siteContent.phoneHref}>
                <Phone size={18} aria-hidden="true" />
                Gọi {siteContent.phoneDisplay}
              </a>
              <a className="mn-button mn-button-secondary" href={siteContent.zalo} target="_blank" rel="noreferrer">
                <Image src="/icons/zalo.svg" alt="" width={22} height={22} />
                Nhắn Zalo
              </a>
            </div>
            {siteContent.email && (
              <a className={styles.email} href={`mailto:${siteContent.email}`}>
                <Mail size={18} aria-hidden="true" />
                {siteContent.email}
              </a>
            )}
          </section>
        </div>
        <ContactMap />
      </div>
    </main>
  );
}
