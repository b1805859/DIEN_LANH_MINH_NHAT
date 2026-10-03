import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  BriefcaseMedical,
  MapPin,
  Phone,
  ShieldCheck,
  ThumbsUp,
  Tag,
  UsersRound,
  Zap,
} from 'lucide-react';
import { ServicesBookingForm } from '@/components/services-reference/booking-form';
import { integrationSettings } from '@/lib/integrations/settings';
import { AreaButton } from './area-selection';
import { AreasReferenceIcon } from './reference-icon';
import { areas, nearbyAreas } from './data';
import styles from './areas.module.css';
import polishedStyles from '@/components/services-reference/services.module.css';

export function AreasHero() {
  return (
    <section className={styles.hero} aria-labelledby="areas-hero-title">
      <Image
        className={styles.heroImage}
        src="/images/areas/hero-can-tho.webp"
        alt="Cảnh quan đô thị Cần Thơ với sông, cây xanh và vòng xoay trung tâm"
        fill
        unoptimized
        priority
        sizes="100vw"
      />
      <div className={styles.heroShade} />
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>
          <BriefcaseMedical />
          DỊCH VỤ ĐIỆN LẠNH TẠI CẦN THƠ
        </p>
        <h1 id="areas-hero-title">
          Phục vụ khắp
          <br />
          các{' '}
          <span>
            khu vực tại
            <br />
            Cần Thơ
          </span>
        </h1>
        <p className={styles.heroDescription}>
          Điện Lạnh Minh Nhật có mặt nhanh tại mọi quận huyện
          <br className={styles.desktopBreak} /> ở Cần Thơ. Sẵn sàng hỗ trợ sửa chữa, vệ sinh, lắp
          đặt
          <br className={styles.desktopBreak} /> điện lạnh tận nơi.
        </p>
        <div className={styles.heroActions}>
          <a href="#dat-lich" className={styles.primaryButton}>
            <CalendarDays />
            Đặt lịch ngay
            <ArrowRight />
          </a>
          <a
            href={`tel:${integrationSettings.phone.replace(/\s/g, '')}`}
            className={styles.consultButton}
          >
            <Phone />
            <span>
              <small>Gọi tư vấn</small>
              <strong>0939 370 109</strong>
            </span>
          </a>
        </div>
        <ul className={styles.heroHighlights}>
          <li>
            <span>
              <Zap fill="currentColor" />
            </span>
            <p>
              Có mặt nhanh
              <br />
              tại Cần Thơ
            </p>
          </li>
          <li>
            <span>
              <AreasReferenceIcon name="people" />
            </span>
            <p>
              Kỹ thuật viên
              <br />
              chuyên nghiệp
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
    </section>
  );
}

export function AreaCard({ area }: { area: (typeof areas)[number] }) {
  return (
    <AreaButton className={styles.areaCard} area={area.title}>
      <span className={styles.cardPhoto}>
        <Image
          src={`/images/areas/${area.slug}.webp`}
          alt={`Cảnh quan ${area.title}, Cần Thơ`}
          fill
          unoptimized
          sizes="(max-width: 450px) 90vw, (max-width: 819px) 45vw, 23vw"
        />
      </span>
      <span className={styles.cardContent}>
        <strong>{area.title}</strong>
        <span className={styles.cardDescription}>{area.description}</span>
        <span className={styles.cardArrow}>
          <ArrowRight />
        </span>
      </span>
    </AreaButton>
  );
}

export function AreaGrid() {
  return (
    <section className={styles.areas} id="area-list" aria-labelledby="area-list-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>KHU VỰC PHỤC VỤ</p>
          <h2 id="area-list-title">
            Các quận huyện tại <span>Cần Thơ</span>
          </h2>
        </div>
        <a href="#area-cards">
          Xem tất cả khu vực
          <ArrowRight />
        </a>
      </div>
      <p className={styles.sectionDescription}>
        Chúng tôi cung cấp dịch vụ điện lạnh tận nơi tại tất cả các quận, huyện và khu vực lân cận
        <br className={styles.desktopBreak} /> ở Cần Thơ. Chọn khu vực của bạn để xem chi tiết dịch
        vụ.
      </p>
      <div className={styles.areaGrid} id="area-cards">
        {areas.map((area) => (
          <AreaCard key={area.slug} area={area} />
        ))}
      </div>
    </section>
  );
}

export function NearbyAreas() {
  return (
    <section className={styles.nearby} id="nearby-areas" aria-labelledby="nearby-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>KHU VỰC LÂN CẬN</p>
          <h2 id="nearby-title">
            Các khu vực lân cận <span>Cần Thơ</span>
          </h2>
        </div>
        <a href="#nearby-chips">
          Xem tất cả khu vực
          <ArrowRight />
        </a>
      </div>
      <div className={styles.nearbyChips} id="nearby-chips">
        {nearbyAreas.map((area) => (
          <AreaButton className={styles.nearbyChip} key={area} area={area}>
            <MapPin />
            {area}
          </AreaButton>
        ))}
      </div>
    </section>
  );
}

export function TrustBar({
  polished = false,
  className = '',
}: { polished?: boolean; className?: string } = {}) {
  return (
    <section
      className={`${polished ? polishedStyles.commitments : styles.trustBar} ${className}`}
      aria-label="Cam kết dịch vụ"
    >
      <div>
        <span>
          <Zap fill={polished ? 'none' : 'currentColor'} aria-hidden={polished || undefined} />
        </span>
        <p>
          Có mặt nhanh<small>ĐIỆN LẠNH MINH NHẬT</small>
        </p>
      </div>
      <div>
        <span>
          {polished ? <UsersRound aria-hidden="true" /> : <AreasReferenceIcon name="people" />}
        </span>
        <p>
          Kỹ thuật viên
          <br />
          giàu kinh nghiệm
        </p>
      </div>
      <div>
        <span>{polished ? <Tag aria-hidden="true" /> : <AreasReferenceIcon name="tag" />}</span>
        <p>
          Báo giá rõ ràng
          <br />
          minh bạch
        </p>
      </div>
      <div>
        <span>
          <ShieldCheck aria-hidden={polished || undefined} />
        </span>
        <p>
          Bảo hành dịch vụ
          <br />
          dài hạn
        </p>
      </div>
    </section>
  );
}

export function BookingForm({ className = styles.bookingForm }: { className?: string } = {}) {
  return (
    <div className={className}>
      <ServicesBookingForm />
    </div>
  );
}

export function BookingSection({
  polished = false,
  className = '',
}: { polished?: boolean; className?: string } = {}) {
  const sectionStyles = polished ? polishedStyles : styles;
  return (
    <section
      className={`${sectionStyles.booking} ${className}`}
      id="dat-lich"
      aria-labelledby="areas-booking-title"
    >
      <Image
        src="/images/areas/technician-booking.webp"
        className={sectionStyles.bookingImage}
        alt="Kỹ thuật viên Minh Nhật mặc đồng phục xanh, cầm dụng cụ trước xe dịch vụ"
        fill
        unoptimized
        sizes="100vw"
      />
      <div className={sectionStyles.bookingCopy}>
        <p className={sectionStyles.eyebrow}>ĐẶT LỊCH NGAY</p>
        <h2 id="areas-booking-title">
          Cần hỗ trợ điện lạnh
          <br />
          tại <span>Cần Thơ</span>?
        </h2>
        <p className={sectionStyles.bookingDescription}>
          Để lại thông tin, chúng tôi sẽ liên hệ tư vấn
          <br className={styles.desktopBreak} /> và sắp xếp kỹ thuật viên sớm nhất.
        </p>
        <ul>
          <li>
            <span>
              <Phone aria-hidden={polished || undefined} />
            </span>
            Tư vấn miễn phí
          </li>
          <li>
            <span>
              <Zap fill={polished ? 'none' : 'currentColor'} aria-hidden={polished || undefined} />
            </span>
            Có mặt nhanh tại Cần Thơ
          </li>
          <li>
            <span>
              <ShieldCheck aria-hidden={polished || undefined} />
            </span>
            Cam kết dịch vụ uy tín
          </li>
        </ul>
      </div>
      <BookingForm className={sectionStyles.bookingForm} />
    </section>
  );
}
