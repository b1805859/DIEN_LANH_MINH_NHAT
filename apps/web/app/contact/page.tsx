import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { TrustBar } from '@/components/areas-reference/sections';
import { ServicesBookingForm } from '@/components/services-reference/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import serviceStyles from '@/components/services-reference/services.module.css';
import styles from './contact.module.css';

export const metadata = buildMetadata({
  title: 'Liên hệ Điện Lạnh Minh Nhật',
  description:
    'Liên hệ Điện Lạnh Minh Nhật qua điện thoại, Zalo hoặc Facebook. Phục vụ Ninh Kiều, Bình Thủy, Cái Răng, Ô Môn và Thốt Nốt tại Cần Thơ.',
  path: '/contact',
  image: '/images/areas/hero-can-tho.webp',
});

const phone = integrationSettings.phone.replace(/\s/g, '');
const phoneLabel = /^0939370109$/.test(phone) ? '0939 370 109' : integrationSettings.phone;
const facebookUrl =
  integrationSettings.facebookUrl || 'https://www.facebook.com/profile.php?id=100063792110691';
const mapUrl =
  integrationSettings.googleMapsUrl ||
  'https://www.google.com/maps/search/?api=1&query=C%E1%BA%A7n+Th%C6%A1';

const contactChannels = [
  {
    label: 'ĐIỆN THOẠI', value: phoneLabel,
    description: 'Gọi để được tư vấn trực tiếp', href: `tel:${phone}`, external: false,
    icon: <Phone aria-hidden="true" />,
  },
  {
    label: 'ZALO', value: phoneLabel,
    description: 'Nhắn tin qua số Zalo của Minh Nhật',
    href: integrationSettings.zaloUrl, external: true,
    icon: <Image src="/icons/zalo.svg" alt="" width={26} height={26} />,
  },
  {
    label: 'FACEBOOK', value: 'Điện Lạnh - Nhựt',
    description: 'Kết nối qua trang Facebook', href: facebookUrl, external: true,
    icon: <Facebook aria-hidden="true" />,
  },
  {
    label: 'EMAIL', value: 'dienlanhminhnhat@gmail.com',
    description: 'Gửi thông tin cần hỗ trợ',
    href: 'mailto:dienlanhminhnhat@gmail.com', external: false,
    icon: <Mail aria-hidden="true" />,
  },
];

export default function ContactPage() {
  return (
    <main className={`${serviceStyles.page} ${styles.page}`}>
      <section
        className={`${serviceStyles.hero} ${styles.hero}`}
        aria-labelledby="contact-hero-title"
      >
        <Image
          src="/images/areas/hero-can-tho.webp"
          alt="Cảnh quan trung tâm Cần Thơ"
          fill
          priority
          unoptimized
          sizes="100vw"
          className={`${serviceStyles.heroImage} ${styles.heroImage}`}
        />
        <div className={`${serviceStyles.heroShade} ${styles.heroShade}`} aria-hidden="true" />
        <div className={`${serviceStyles.heroCopy} ${styles.heroCopy}`}>
          <p className={`${serviceStyles.heroEyebrow} ${styles.heroEyebrow}`}>
            <Phone aria-hidden="true" /> KẾT NỐI VỚI MINH NHẬT
          </p>
          <h1 id="contact-hero-title">
            Sẵn sàng hỗ trợ
            <br />
            <span>khi bạn cần</span>
          </h1>
          <p className={serviceStyles.heroDescription}>
            Liên hệ để được tư vấn sửa chữa, vệ sinh và lắp đặt điện lạnh tận nơi tại Cần Thơ.
          </p>
          <div className={`${serviceStyles.heroActions} ${styles.heroActions}`}>
            <a href={`tel:${phone}`} className={serviceStyles.primaryButton}>
              <Phone aria-hidden="true" /> {phoneLabel} <ArrowRight aria-hidden="true" />
            </a>
            <a href="#dat-lich" className={styles.outlineButton}>
              <CalendarDays aria-hidden="true" /> Đặt lịch dịch vụ
            </a>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} aria-labelledby="contact-info-title">
        <div className={styles.contactCopy}>
          <p className={`${serviceStyles.eyebrow} ${styles.eyebrow}`}>THÔNG TIN LIÊN HỆ</p>
          <h2 id="contact-info-title">
            Liên hệ với <span>Minh Nhật</span>
          </h2>
          <p className={styles.sectionDescription}>
            Mọi thắc mắc về dịch vụ, liên hệ qua các kênh dưới đây.
          </p>
          <div className={styles.contactList}>
            {contactChannels.map((channel) => (
              <a
                className={styles.contactCard}
                href={channel.href}
                key={channel.label}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
              >
                <span className={styles.contactIcon} aria-hidden="true">{channel.icon}</span>
                <span className={styles.channelCopy}>
                  <small>{channel.label}</small>
                  <strong>{channel.value}</strong>
                  <span>{channel.description}</span>
                </span>
                <ArrowRight className={styles.channelArrow} aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className={styles.openingHours}>
            <span className={styles.contactIcon} aria-hidden="true"><Clock3 /></span>
            <p>
              <strong>THỜI GIAN LIÊN HỆ</strong>
              <span>{integrationSettings.openingHours || '08:00 – 20:00 (T2 – CN)'}</span>
            </p>
          </div>
        </div>
        <div className={`${serviceStyles.bookingForm} ${styles.contactBooking}`} id="dat-lich">
          <ServicesBookingForm />
          <p className={styles.formNote}>
            <ShieldCheck aria-hidden="true" />
            <span>Chúng tôi sẽ liên hệ tư vấn và xác nhận lịch.</span>
          </p>
        </div>
      </section>

      <section className={styles.coverageSection} aria-labelledby="contact-coverage-title">
        <div className={styles.coverageCopy}>
          <p className={`${serviceStyles.eyebrow} ${styles.eyebrow}`}>KHU VỰC PHỤC VỤ</p>
          <h2 id="contact-coverage-title">
            Có mặt nhanh
            <br /> tại <span>Cần Thơ</span>
          </h2>
          <p className={styles.sectionDescription}>
            Ninh Kiều, Bình Thủy, Cái Răng, Ô Môn, Thốt Nốt và các khu vực lân cận.
          </p>
          {integrationSettings.hasConfiguredAddress && (
            <p className={styles.configuredAddress}>
              <MapPin aria-hidden="true" />
              {integrationSettings.address}
            </p>
          )}
          <div className={styles.coverageActions}>
            <Link href="/areas" className={serviceStyles.primaryButton}>
              Xem tất cả khu vực <ArrowRight aria-hidden="true" />
            </Link>
            <a href={mapUrl} target="_blank" rel="noreferrer" className={styles.textLink}>
              Mở Google Maps <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className={styles.map}>
          <iframe
            title="Bản đồ khu vực phục vụ Cần Thơ"
            src={
              integrationSettings.googleMapsEmbedUrl ||
              'https://maps.google.com/maps?q=C%E1%BA%A7n%20Th%C6%A1&z=12&output=embed'
            }
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
      <TrustBar polished />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Liên hệ', path: '/contact' },
        ])}
      />
    </main>
  );
}
