import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Heart, SearchCheck, ShieldCheck, Snowflake } from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { BookingSection, TrustBar } from '@/components/areas-reference/sections';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import areasStyles from '@/components/areas-reference/areas.module.css';
import styles from '@/components/company-reference/company.module.css';

export const metadata = buildMetadata({
  title: `Giới thiệu ${APP_NAME}`,
  description:
    'Điện Lạnh Minh Nhật nhận sửa chữa, bảo trì và lắp đặt thiết bị điện lạnh tại Cần Thơ. Tận tâm, chu đáo và phục vụ nhanh tại nhà.',
  path: '/about',
  image: '/images/home-reference/hero.webp',
});

const values = [
  { icon: Heart, title: 'Tận tâm', description: 'Luôn đặt khách hàng lên hàng đầu' },
  { icon: SearchCheck, title: 'Chu đáo', description: 'Tư vấn kỹ, rõ ràng, minh bạch' },
  { icon: ShieldCheck, title: 'Phục vụ nhanh', description: 'Có mặt nhanh tại khu vực Cần Thơ' },
];
const photos = [
  {
    src: '/images/home-reference/gallery-repair.webp',
    alt: 'Minh họa kỹ thuật viên kiểm tra máy lạnh tại nhà',
    title: 'Kiểm tra & sửa chữa',
    text: 'Kiểm tra thiết bị và tư vấn phương án xử lý.',
  },
  {
    src: '/images/services-reference/clean-air.webp',
    alt: 'Minh họa vệ sinh dàn lạnh với túi hứng nước',
    title: 'Vệ sinh & bảo trì',
    text: 'Chăm sóc thiết bị điện lạnh trong gia đình.',
  },
  {
    src: '/images/home-reference/install.webp',
    alt: 'Minh họa kỹ thuật viên lắp đặt dàn nóng máy lạnh',
    title: 'Lắp đặt tận nơi',
    text: 'Hỗ trợ lắp đặt, tháo dỡ và di dời thiết bị.',
  },
];

export default function AboutPage() {
  return (
    <main className={`${areasStyles.page} ${styles.page}`}>
      <section className={`${styles.hero} ${styles.aboutHero}`} aria-labelledby="about-hero-title">
        <Image
          src="/images/home-reference/hero.webp"
          alt="Kỹ thuật viên trong đồng phục Minh Nhật chăm sóc máy lạnh"
          fill
          priority
          unoptimized
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>
            <Snowflake /> VỀ CHÚNG TÔI
          </p>
          <h1 id="about-hero-title">
            Điện Lạnh
            <br />
            <span>Minh Nhật</span>
          </h1>
          <p className={styles.heroDescription}>
            Tận tâm trong từng dịch vụ.
            <br />
            Chăm sóc thiết bị điện lạnh cho gia đình bạn tại Cần Thơ.
          </p>
          <div className={styles.heroActions}>
            <a href="#dat-lich" className={areasStyles.primaryButton}>
              <CalendarDays /> Đặt lịch ngay <ArrowRight />
            </a>
            <Link href="/services" className={styles.outlineButton}>
              Khám phá dịch vụ <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.introduction} aria-labelledby="about-intro-title">
        <div className={styles.introHeading}>
          <p className={styles.eyebrow}>ĐIỆN LẠNH MINH NHẬT</p>
          <h2 id="about-intro-title">
            Dịch vụ tận tâm,
            <br />
            <span>gắn bó cùng Cần Thơ</span>
          </h2>
        </div>
        <div className={styles.introCopy}>
          <p>
            Điện Lạnh Minh Nhật là đơn vị chuyên sửa chữa, lắp đặt các thiết bị điện lạnh tại Cần
            Thơ. Chúng tôi luôn đặt uy tín và sự hài lòng của khách hàng lên hàng đầu, đảm bảo dịch
            vụ tận tâm và chuyên nghiệp.
          </p>
          <Link className={styles.textLink} href="/areas">
            Xem khu vực phục vụ <ArrowRight />
          </Link>
        </div>
      </section>

      <section className={styles.valuesSection} aria-label="Giá trị phục vụ">
        <div className={styles.valuesGrid}>
          {values.map(({ icon: Icon, title, description }) => (
            <article className={styles.valueCard} key={title}>
              <span className={styles.valueIcon}>
                <Icon />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workSection} aria-labelledby="about-work-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>CHĂM SÓC ĐIỆN LẠNH TẬN NƠI</p>
            <h2 id="about-work-title">
              Chu đáo trong <span>từng công việc</span>
            </h2>
          </div>
          <Link href="/services" className={styles.textLink}>
            Xem dịch vụ <ArrowRight />
          </Link>
        </div>
        <div className={styles.workGrid}>
          {photos.map((photo) => (
            <article key={photo.src} className={styles.workCard}>
              <div className={styles.workPhoto}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 600px) 90vw, 30vw"
                />
              </div>
              <div className={styles.workCopy}>
                <h3>{photo.title}</h3>
                <p>{photo.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.photoCaption}>Hình ảnh minh họa dịch vụ của Điện Lạnh Minh Nhật.</p>
      </section>
      <TrustBar />
      <BookingSection />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Giới thiệu', path: '/about' },
        ])}
      />
    </main>
  );
}
