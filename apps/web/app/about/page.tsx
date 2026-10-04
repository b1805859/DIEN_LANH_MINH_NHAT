import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Heart,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Snowflake,
  UsersRound,
} from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { BookingSection, TrustBar } from '@/components/areas-reference/sections';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import serviceStyles from '@/components/services-reference/services.module.css';
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
const commitments = [
  {
    title: 'Tư vấn rõ ràng',
    text: 'Lắng nghe nhu cầu và tư vấn phương án phù hợp với tình trạng thiết bị.',
  },
  {
    title: 'Kiểm tra trước khi xử lý',
    text: 'Kiểm tra thực tế, trao đổi cách xử lý trước khi làm.',
  },
  {
    title: 'Báo giá minh bạch',
    text: 'Thông báo chi phí trước khi thực hiện để khách hàng chủ động quyết định.',
  },
  {
    title: 'Bảo hành rõ ràng',
    text: 'Trao đổi thông tin bảo hành theo dịch vụ và hỗ trợ sau khi bàn giao.',
  },
];
const teamApproach = [
  {
    icon: MessageCircle,
    title: 'Lắng nghe và giải thích',
    text: 'Trao đổi dễ hiểu về tình trạng thiết bị, phương án và chi phí.',
  },
  {
    icon: ClipboardCheck,
    title: 'Làm việc có trình tự',
    text: 'Kiểm tra, xử lý và chạy thử trước khi bàn giao.',
  },
  {
    icon: UsersRound,
    title: 'Chu đáo khi bàn giao',
    text: 'Giữ khu vực làm việc gọn gàng, hướng dẫn khách hàng sử dụng và chăm sóc thiết bị.',
  },
];
const photos = [
  {
    src: '/images/home-reference/gallery-repair.webp',
    alt: 'Minh họa kỹ thuật viên kiểm tra máy lạnh tại nhà',
    title: 'Kiểm tra & sửa chữa',
    text: 'Kiểm tra thiết bị kỹ trước khi tư vấn phương án xử lý.',
  },
  {
    src: '/images/services-reference/clean-air.webp',
    alt: 'Minh họa vệ sinh dàn lạnh với túi hứng nước',
    title: 'Vệ sinh & bảo trì',
    text: 'Chăm sóc thiết bị định kỳ để hoạt động ổn định và sạch sẽ.',
  },
  {
    src: '/images/home-reference/install.webp',
    alt: 'Minh họa kỹ thuật viên lắp đặt dàn nóng máy lạnh',
    title: 'Lắp đặt tận nơi',
    text: 'Hỗ trợ lắp đặt đúng vị trí, đúng kỹ thuật và dễ sử dụng.',
  },
];

export default function AboutPage() {
  return (
    <main className={`${serviceStyles.page} ${styles.page} ${styles.aboutPage}`}>
      <section className={`${styles.hero} ${styles.aboutHero}`} aria-labelledby="about-hero-title">
        <Image
          src="/images/home-reference/hero.webp"
          alt="Kỹ thuật viên trong đồng phục Minh Nhật chăm sóc máy lạnh"
          fill
          priority
          unoptimized
          sizes="100vw"
          className={styles.heroImage}
          data-motion="hero-image"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow} data-motion="hero">
            <Snowflake aria-hidden="true" /> VỀ CHÚNG TÔI
          </p>
          <h1 id="about-hero-title" data-motion="hero" data-motion-delay="70">
            Điện Lạnh
            <br />
            <span>Minh Nhật</span>
          </h1>
          <p className={styles.heroDescription} data-motion="hero" data-motion-delay="140">
            Tận tâm trong từng dịch vụ.
            <br /> Chăm sóc thiết bị điện lạnh cho gia đình bạn tại Cần Thơ.
          </p>
          <div className={styles.heroActions} data-motion="hero" data-motion-delay="210">
            <a href="#dat-lich" className={serviceStyles.primaryButton} data-motion-hover="button">
              <CalendarDays aria-hidden="true" /> Đặt lịch ngay <ArrowRight aria-hidden="true" />
            </a>
            <Link href="/services" className={styles.outlineButton} data-motion-hover="button">
              Khám phá dịch vụ <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.introduction} aria-labelledby="about-intro-title">
        <div className={styles.introHeading} data-motion="up">
          <p className={styles.eyebrow}>ĐIỆN LẠNH MINH NHẬT</p>
          <h2 id="about-intro-title">
            Dịch vụ tận tâm,
            <br /> <span>gắn bó cùng Cần Thơ</span>
          </h2>
        </div>
        <div className={styles.introCopy} data-motion="up" data-motion-delay="80">
          <p>
            Điện Lạnh Minh Nhật cung cấp dịch vụ sửa chữa, vệ sinh, bảo trì và lắp đặt thiết bị điện
            lạnh cho các gia đình tại Cần Thơ.
          </p>
          <p>
            Chúng tôi bắt đầu từ việc lắng nghe tình trạng thiết bị, kiểm tra thực tế và tư vấn
            phương án phù hợp. Chi phí được trao đổi rõ trước khi thực hiện.
          </p>
          <Link className={styles.textLink} href="/areas">
            Xem khu vực phục vụ <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="about-values-title">
        <h2 id="about-values-title" className="sr-only">
          Giá trị cốt lõi
        </h2>
        <div className={styles.valuesGrid} data-motion-stagger="80">
          {values.map(({ icon: Icon, title, description }) => (
            <article className={styles.valueCard} key={title} data-motion-hover="card">
              <span className={styles.valueIcon} data-motion-hover="icon">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection} aria-labelledby="about-story-title">
        <div className={styles.storyCopy} data-motion="up">
          <p className={styles.eyebrow}>TINH THẦN MINH NHẬT</p>
          <h2 id="about-story-title">
            Đồng hành cùng từng <span>không gian sống</span>
          </h2>
          <p>
            Một chiếc máy lạnh hoạt động ổn định, một chiếc tủ lạnh giữ thực phẩm tươi hay máy giặt
            sạch sẽ đều góp phần giúp sinh hoạt gia đình thuận tiện hơn.
          </p>
          <p>
            Minh Nhật chăm sóc thiết bị từ những nhu cầu gần gũi ấy. Chúng tôi ưu tiên giải pháp phù
            hợp, trao đổi rõ ràng và tiếp tục hỗ trợ khách hàng sau khi công việc hoàn thành.
          </p>
        </div>
        <div className={styles.commitmentPanel} data-motion="up" data-motion-delay="80">
          <h3>Cam kết của Minh Nhật</h3>
          <ul>
            {commitments.map(({ title, text }) => (
              <li key={title}>
                <span className={styles.commitmentIcon}>
                  <Check aria-hidden="true" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.workSection} aria-labelledby="about-work-title">
        <div className={styles.sectionHeading} data-motion="up">
          <div>
            <p className={styles.eyebrow}>CHĂM SÓC ĐIỆN LẠNH TẬN NƠI</p>
            <h2 id="about-work-title">
              Chu đáo trong <span>từng công việc</span>
            </h2>
          </div>
          <Link href="/services" className={styles.textLink}>
            Xem dịch vụ <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.workGrid} data-motion-stagger="80">
          {photos.map((photo) => (
            <article key={photo.src} className={styles.workCard} data-motion-hover="card">
              <div className={styles.workPhoto} data-motion-hover="image">
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

      <section className={styles.teamSection} aria-labelledby="about-team-title">
        <div className={styles.teamHeading} data-motion="up">
          <p className={styles.eyebrow}>CON NGƯỜI MINH NHẬT</p>
          <h2 id="about-team-title">
            Đội ngũ kỹ thuật viên <span>Minh Nhật</span>
          </h2>
          <p>
            Sự tận tâm thể hiện từ cách lắng nghe đến từng bước xử lý thiết bị. Minh Nhật chú trọng
            kỹ thuật, thái độ phục vụ và sự rõ ràng trong mỗi lần hỗ trợ tại nhà.
          </p>
        </div>
        <ul className={styles.teamApproach} data-motion-stagger="70">
          {teamApproach.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className={styles.teamIcon}>
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <TrustBar polished className={styles.aboutTrust} />
      <BookingSection polished className={styles.aboutBooking} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Giới thiệu', path: '/about' },
        ])}
      />
    </main>
  );
}
