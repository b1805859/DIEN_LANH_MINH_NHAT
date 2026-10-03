import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Phone,
  Settings,
  ShieldCheck,
  Tag,
  ThumbsUp,
  UsersRound,
  Zap,
} from 'lucide-react';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ServicesBookingForm } from '@/components/services-reference/booking-form';
import { serviceCards } from '@/components/services-reference/data';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import styles from '@/components/services-reference/services.module.css';

export const metadata = buildMetadata({
  title: 'Dịch vụ điện lạnh tại Cần Thơ',
  description:
    'Sửa chữa, vệ sinh, lắp đặt và bảo trì điện lạnh nhanh chóng, uy tín, chuyên nghiệp tại Cần Thơ. Đặt lịch dịch vụ với Điện Lạnh Minh Nhật.',
  path: '/services',
  image: '/images/services-reference/hero.webp',
});

const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;
const steps = [
  { number: '01', icon: Phone, title: 'Liên hệ', description: 'Đặt lịch nhanh' },
  { number: '02', icon: CalendarDays, title: 'Xác nhận', description: 'Tư vấn & báo giá' },
  { number: '03', icon: Settings, title: 'Kỹ thuật viên', description: 'Đến tận nơi xử lý' },
  { number: '04', icon: Check, title: 'Hoàn thành', description: 'Bàn giao & bảo hành' },
];

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="services-hero-title">
        <Image
          className={styles.heroImage}
          src="/images/services-reference/hero.webp"
          alt="Kỹ thuật viên Minh Nhật cùng máy lạnh, máy giặt, tủ lạnh và dụng cụ điện lạnh"
          fill
          unoptimized
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>DỊCH VỤ ĐIỆN LẠNH CHUYÊN NGHIỆP</p>
          <h1 id="services-hero-title">
            Dịch vụ điện lạnh
            <br />
            <span>tại Cần Thơ</span>
          </h1>
          <p className={styles.heroDescription}>
            Sửa chữa – Vệ sinh – Lắp đặt – Bảo trì nhanh chóng,
            <br />
            uy tín, chuyên nghiệp.
          </p>
          <div className={styles.heroActions}>
            <a href="#dat-lich" className={styles.primaryButton}>
              <CalendarDays />
              Đặt lịch ngay <ArrowRight />
            </a>
            <a href={phoneHref} className={styles.consultButton}>
              <Phone fill="currentColor" />
              <span>
                <small>Gọi tư vấn</small>
                <strong>0939 370 109</strong>
              </span>
            </a>
          </div>
          <ul className={styles.heroHighlights}>
            <li>
              <span>
                <ShieldCheck />
              </span>
              <p>
                Có mặt nhanh
                <br />
                tại Cần Thơ
              </p>
            </li>
            <li>
              <span>
                <UsersRound />
              </span>
              <p>
                Kỹ thuật viên
                <br />
                chuyên nghiệp.
              </p>
            </li>
            <li>
              <span>
                <ThumbsUp fill="currentColor" />
              </span>
              <p>
                Dịch vụ uy tín
                <br />
                hàng đầu
              </p>
            </li>
          </ul>
        </div>
        <p className={styles.handwriting}>
          Giải pháp
          <br />
          điện lạnh cho
          <br />
          mọi gia đình
          <span />
        </p>
      </section>

      <section className={styles.services} id="service-list" aria-labelledby="service-list-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>DANH SÁCH DỊCH VỤ</p>
            <h2 id="service-list-title">
              Các dịch vụ <span>điện lạnh của chúng tôi</span>
            </h2>
          </div>
          <a href="#service-cards">
            Xem tất cả dịch vụ <ArrowRight />
          </a>
        </div>
        <div id="service-cards" className={styles.serviceGrid}>
          {serviceCards.map(({ slug, title, description, image, icon: Icon }) => (
            <Link className={styles.serviceCard} href={`/services/${slug}`} key={slug}>
              <div className={styles.cardPhoto}>
                <Image
                  src={`/images/services-reference/${image}.webp`}
                  alt={title}
                  fill
                  sizes="(max-width: 600px) 50vw, 25vw"
                />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardIcon}>
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className={styles.cardArrow}>
                  <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.commitments} aria-label="Cam kết dịch vụ">
        <div>
          <span>
            <Zap fill="currentColor" />
          </span>
          <p>
            Có mặt nhanh
            <br />
            trong <strong>30 phút</strong>
          </p>
        </div>
        <div>
          <span>
            <UsersRound />
          </span>
          <p>
            Kỹ thuật viên
            <br />
            giàu kinh nghiệm
          </p>
        </div>
        <div>
          <span>
            <Tag />
          </span>
          <p>
            Báo giá rõ ràng
            <br />
            minh bạch
          </p>
        </div>
        <div>
          <span>
            <ShieldCheck />
          </span>
          <p>
            Bảo hành dịch vụ
            <br />
            dài hạn
          </p>
        </div>
      </section>

      <section className={styles.process} aria-labelledby="services-process-title">
        <p className={styles.eyebrow}>QUY TRÌNH DỊCH VỤ</p>
        <h2 id="services-process-title">
          4 bước <span>đơn giản</span>
        </h2>
        <ol className={styles.steps}>
          {steps.map(({ number, icon: Icon, title, description }, index) => (
            <li key={number}>
              <span className={styles.stepIcon}>
                <span>
                  <Icon />
                </span>
              </span>
              <div>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              {index < steps.length - 1 && <ChevronRight className={styles.stepArrow} />}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.booking} id="dat-lich" aria-labelledby="services-booking-title">
        <Image
          className={styles.bookingImage}
          src="/images/services-reference/booking.webp"
          alt="Kỹ thuật viên Điện Lạnh Minh Nhật sẵn sàng hỗ trợ khách hàng"
          fill
          unoptimized
          sizes="100vw"
        />
        <div className={styles.bookingCopy}>
          <p className={styles.eyebrow}>ĐẶT LỊCH NGAY</p>
          <h2 id="services-booking-title">
            Cần hỗ trợ điện lạnh
            <br />
            tại <span>Cần Thơ?</span>
          </h2>
          <p className={styles.bookingDescription}>
            Để lại thông tin, chúng tôi sẽ liên hệ tư vấn
            <br />
            và sắp xếp kỹ thuật viên sớm nhất.
          </p>
          <ul>
            <li>
              <span>
                <Phone fill="currentColor" />
              </span>
              Tư vấn miễn phí
            </li>
            <li>
              <span>
                <Zap fill="currentColor" />
              </span>
              Có mặt nhanh tại Cần Thơ
            </li>
            <li>
              <span>
                <ShieldCheck />
              </span>
              Cam kết dịch vụ uy tín
            </li>
          </ul>
        </div>
        <div className={styles.bookingForm}>
          <ServicesBookingForm />
        </div>
      </section>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
        ])}
      />
    </main>
  );
}
