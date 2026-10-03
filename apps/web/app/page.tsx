import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Headset,
  Phone,
  ShieldCheck,
  Star,
  UsersRound,
} from 'lucide-react';
import { ReferenceIcon } from '@/components/home-reference/reference-icon';
import { buildMetadata } from '@/lib/seo/metadata';
import { HomeGallery, VideoButton } from '@/components/home-reference/interactions';
import { homeServices, homeTrust, workflow } from '@/components/home-reference/data';
import { integrationSettings } from '@/lib/integrations/settings';
import styles from '@/components/home-reference/home.module.css';

export const metadata = buildMetadata({
  title: 'Sửa chữa điện lạnh tại Cần Thơ',
  description:
    'Điện Lạnh Minh Nhật — dịch vụ sửa chữa, lắp đặt, vệ sinh máy lạnh, máy giặt, tủ lạnh chuyên nghiệp tại Cần Thơ.',
  path: '/',
  image: '/images/home-reference/hero.webp',
});

const heroFeatures = [
  { icon: 'cooling', label: 'Làm lạnh hiệu quả' },
  { icon: 'efficient', label: 'Tiết kiệm điện' },
  { icon: 'clean-air', label: 'Không khí trong lành' },
  { icon: 'durable', label: 'Hoạt động bền bỉ' },
] as const;

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image
          className={styles.heroImage}
          src="/images/home-reference/hero.webp"
          alt="Kỹ thuật viên Điện Lạnh Minh Nhật chăm sóc máy lạnh"
          fill
          unoptimized
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>DỊCH VỤ ĐIỆN LẠNH CHUYÊN NGHIỆP TẠI CẦN THƠ</p>
          <h1 id="home-title">
            Không chỉ là sửa chữa
            <br />
            <span className={styles.heroSecondLine}>Chúng tôi mang đến</span>
            <br />
            <span>không gian sống tốt hơn</span>
          </h1>
          <p className={styles.heroSummary}>
            Giải pháp điện lạnh toàn diện cho gia đình và doanh nghiệp
            <br /> Nhanh chóng – Uy tín – Chuyên nghiệp
          </p>
          <div className={styles.heroActions}>
            <Link href="/booking" className={styles.primaryButton}>
              Đặt lịch ngay <ArrowRight />
            </Link>
            <VideoButton variant="outline" />
          </div>
        </div>
        <div className={styles.heroFeatures}>
          {heroFeatures.map(({ icon, label }) => (
            <div className={styles.heroFeature} key={label}>
              <span>
                <ReferenceIcon name={icon} />
              </span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
        <div className={styles.benefits}>
          <div>
            <span className={styles.benefitIcon}>
              <ReferenceIcon name="quick" />
            </span>
            <p>
              Có mặt nhanh
              <br />
              trong 30 phút
            </p>
          </div>
          <div>
            <span className={styles.benefitIcon}>
              <UsersRound />
            </span>
            <p>
              Kỹ thuật viên
              <br />
              chuyên nghiệp
            </p>
          </div>
          <div>
            <span className={styles.benefitIcon}>
              <ReferenceIcon name="parts" />
            </span>
            <p>Linh kiện chính hãng</p>
          </div>
          <div>
            <span className={styles.benefitIcon}>
              <ShieldCheck />
            </span>
            <p>Bảo hành rõ ràng</p>
          </div>
        </div>
      </section>
      <section className={styles.services} id="dich-vu" aria-labelledby="services-title">
        <div className={styles.sectionHeading}>
          <h2 id="services-title">Dịch vụ nổi bật</h2>
          <p>Đáp ứng mọi nhu cầu điện lạnh tại Cần Thơ</p>
          <Link href="/services">
            Xem tất cả dịch vụ <ArrowRight />
          </Link>
        </div>
        <div className={styles.serviceGrid}>
          {homeServices.map(({ title, description, image, href, icon: Icon }) => (
            <Link href={href} className={styles.serviceCard} key={href}>
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, (max-width: 1199px) 33vw, (min-width: 1440px) 248px, 20vw"
              />
              <div className={styles.serviceContent}>
                <span className={styles.serviceIcon}>
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.about} id="gioi-thieu" aria-labelledby="about-title">
        <div className={styles.aboutRoom}>
          <Image
            src="/images/home-reference/about.webp"
            alt="Không gian nhà ở với máy lạnh và phòng khách"
            fill
            sizes="(min-width: 961px) 25vw, 1px"
            className={styles.aboutImage}
            unoptimized
          />
        </div>
        <div className={styles.aboutCopy}>
          <h2 id="about-title">
            Vì sao chọn
            <br />
            Điện Lạnh Minh Nhật?
          </h2>
          <p>
            Chúng tôi cam kết mang đến dịch vụ chất lượng, nhanh chóng
            <br className={styles.desktopBreak} /> và uy tín tại Cần Thơ.
          </p>
          <ul>
            <li>
              <span>
                <UsersRound />
              </span>
              Đội ngũ kỹ thuật viên giàu kinh nghiệm
            </li>
            <li>
              <span>
                <BadgeCheck />
              </span>
              Quy trình làm việc chuyên nghiệp
            </li>
            <li>
              <span>
                <ShieldCheck />
              </span>
              Linh kiện chính hãng, bảo hành rõ ràng
            </li>
            <li>
              <span>
                <Headset />
              </span>
              Tư vấn tận tình, hỗ trợ nhanh chóng
            </li>
          </ul>
          <Link href="/about" className={styles.primaryButton}>
            Tìm hiểu thêm <ArrowRight />
          </Link>
        </div>
        <VideoButton variant="feature" />
      </section>
      <section className={styles.process} id="quy-trinh" aria-labelledby="process-title">
        <div className={styles.processImage} />
        <div className={styles.processInner}>
          <h2 id="process-title">Quy trình làm việc chuyên nghiệp</h2>
          <p className={styles.processSubtitle}>Đơn giản – Minh bạch – Hiệu quả</p>
          <div className={styles.processRow}>
            <ol>
              {workflow.map(({ number, title, description }) => (
                <li key={number}>
                  <span className={styles.stepCircle}>{number}</span>
                  <div>
                    <b>{number}</b>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/booking" className={styles.primaryButton}>
              Đặt lịch ngay <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.trust} aria-labelledby="trust-title">
        <div className={styles.sectionHeading}>
          <h2 id="trust-title">Cam kết của Minh Nhật</h2>
          <p>Nhanh chóng – Uy tín – Chuyên nghiệp – Tận tâm.</p>
        </div>
        {homeTrust.statisticsVerified ? (
          <dl className={styles.statistics}>
            {homeTrust.statistics.map(({ value, label }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className={styles.commitmentGrid}>
            {homeTrust.commitments.map(({ title, description, icon: Icon }) => (
              <article className={styles.commitmentCard} key={title}>
                <span>
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        )}
        <div className={styles.reviewGrid}>
          {homeTrust.reviews
            .filter((review) => review.verified)
            .slice(0, 3)
            .map((review) => (
              <figure className={styles.reviewCard} key={`${review.name}-${review.service}`}>
                <figcaption>
                  <span className={styles.avatar} aria-hidden="true">
                    {review.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.area}</small>
                  </span>
                </figcaption>
                <div className={styles.stars} aria-label={`${review.rating} trên 5 sao`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      aria-hidden="true"
                      fill={index < review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <blockquote>{review.content}</blockquote>
                <p>{review.service}</p>
              </figure>
            ))}
        </div>
      </section>
      <HomeGallery />
      <section className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.finalCtaInner}>
          <div>
            <h2 id="final-cta-title">Máy lạnh đang gặp sự cố?</h2>
            <p>Để kỹ thuật viên Điện Lạnh Minh Nhật hỗ trợ bạn nhanh chóng và chuyên nghiệp.</p>
          </div>
          <div className={styles.finalCtaActions}>
            <a
              className={styles.callButton}
              href={`tel:${integrationSettings.phone.replace(/\s/g, '')}`}
            >
              <Phone /> Gọi ngay
            </a>
            <Link className={styles.primaryButton} href="/booking">
              Đặt lịch sửa chữa <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
