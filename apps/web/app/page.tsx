import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { ReferenceIcon } from '@/components/home-reference/reference-icon';
import { buildMetadata } from '@/lib/seo/metadata';
import { VideoButton } from '@/components/home-reference/interactions';
import { homeTrust, workflow } from '@/components/home-reference/data';
import { integrationSettings } from '@/lib/integrations/settings';
import { AirflowCanvas } from '@/components/kage/airflow-canvas';
import { CinematicGallery, ServiceSelector } from '@/components/kage/home-scenes';
import k from '@/components/kage/kage.module.css';

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

const benefits = [
  'Có mặt nhanh trong 30 phút',
  'Kỹ thuật viên chuyên nghiệp',
  'Linh kiện chính hãng',
  'Bảo hành rõ ràng',
];

const reasons = [
  'Đội ngũ kỹ thuật viên giàu kinh nghiệm',
  'Quy trình làm việc chuyên nghiệp',
  'Linh kiện chính hãng, bảo hành rõ ràng',
  'Tư vấn tận tình, hỗ trợ nhanh chóng',
];

const pad = (value: number) => String(value).padStart(2, '0');
const delay = (index: number) => ({ ['--i' as string]: index });

export default function HomePage() {
  const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;
  return (
    <main className={`${k.root} ${k.home}`}>
      {/* ───────────── Hero ───────────── */}
      <section className={k.hero} aria-labelledby="home-title">
        <div className={k.heroMedia} data-k-parallax="-0.12">
          <Image
            src="/images/home-reference/hero.webp"
            alt="Kỹ thuật viên Điện Lạnh Minh Nhật chăm sóc máy lạnh"
            fill
            unoptimized
            priority
            sizes="100vw"
          />
        </div>
        <div className={k.heroShade} />
        <AirflowCanvas className={k.heroCanvas} />
        <div className={k.heroBody} data-k-fade>
          <div>
            <p className={`${k.label} ${k.reveal}`} data-k-reveal style={{ ['--d' as string]: '300ms' }}>
              Dịch vụ điện lạnh chuyên nghiệp tại Cần Thơ
            </p>
            <h1 id="home-title" className={k.heroTitle} data-k-reveal style={{ ['--d' as string]: '350ms' }}>
              <span className={k.line} style={delay(0)}>
                <span>Không chỉ là sửa chữa</span>
              </span>
              <span className={k.line} style={delay(1)}>
                <span>Chúng tôi mang đến</span>
              </span>
              <span className={k.line} style={delay(2)}>
                <span>không gian sống tốt hơn</span>
              </span>
            </h1>
          </div>
          <div className={k.heroAside}>
            <p className={`${k.lede} ${k.reveal}`} data-k-reveal style={{ ['--d' as string]: '700ms' }}>
              Giải pháp điện lạnh toàn diện cho gia đình và doanh nghiệp.
              <br />
              Nhanh chóng – Uy tín – Chuyên nghiệp
            </p>
            <div className={`${k.heroActions} ${k.reveal}`} data-k-reveal style={{ ['--d' as string]: '820ms' }}>
              <Link href="/booking" className={k.btn}>
                Đặt lịch ngay <ArrowRight aria-hidden="true" />
              </Link>
              <VideoButton variant="outline" />
            </div>
          </div>
        </div>
        <div className={k.heroFoot}>
          {heroFeatures.map(({ icon, label }, index) => (
            <div
              key={label}
              className={k.reveal}
              data-k-reveal
              style={{ ['--i' as string]: index, ['--d' as string]: '900ms' }}
            >
              <span>{pad(index + 1)}</span>
              <ReferenceIcon name={icon} />
              {label}
            </div>
          ))}
          <div className={k.scrollCue} aria-hidden="true">
            Cuộn <i />
          </div>
        </div>
      </section>

      {/* ───────────── Benefits marquee ───────────── */}
      <div className={k.marquee} aria-label="Lợi ích khi chọn Minh Nhật">
        {[0, 1].map((copy) => (
          <div className={k.marqueeTrack} key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {[...benefits, ...benefits].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        ))}
      </div>

      {/* ───────────── 01 Services ───────────── */}
      <section className={k.chapter} id="dich-vu" aria-labelledby="services-title">
        <p className={k.chapterNumber} aria-hidden="true">
          01
        </p>
        <div className={k.chapterHead}>
          <p className={k.label}>
            <b>01</b> — Dịch vụ nổi bật
          </p>
          <h2 id="services-title" className={k.display} data-k-reveal>
            <span className={k.line}>
              <span>Đáp ứng mọi nhu cầu</span>
            </span>
            <span className={k.line} style={delay(1)}>
              <span>
                <em>điện lạnh</em> tại Cần Thơ.
              </span>
            </span>
          </h2>
          <p className={`${k.lede} ${k.reveal}`} data-k-reveal>
            Sửa chữa, lắp đặt, vệ sinh và bảo trì máy lạnh, máy giặt, tủ lạnh — tận nơi, đúng kỹ
            thuật.
          </p>
        </div>
        <ServiceSelector />
      </section>

      {/* ───────────── 02 About / Why ───────────── */}
      <section className={`${k.chapter} ${k.about}`} id="gioi-thieu" aria-labelledby="about-title">
        <p className={k.chapterNumber} aria-hidden="true">
          02
        </p>
        <div className={k.chapterHead}>
          <p className={k.label}>
            <b>02</b> — Về Minh Nhật
          </p>
          <h2 id="about-title" className={`${k.display} ${k.aboutStatement}`} data-k-reveal>
            <span className={k.line}>
              <span>Vì sao chọn</span>
            </span>
            <span className={k.line} style={delay(1)}>
              <span>
                <em>Điện Lạnh Minh Nhật?</em>
              </span>
            </span>
          </h2>
          <p className={`${k.lede} ${k.reveal}`} data-k-reveal>
            Chúng tôi cam kết mang đến dịch vụ chất lượng, nhanh chóng và uy tín tại Cần Thơ.
          </p>
        </div>
        <div className={`${k.aboutWide} ${k.mask}`} data-k-reveal>
          <div data-k-parallax="0.08">
            <Image
              src="/images/home-reference/about.webp"
              alt="Không gian nhà ở với máy lạnh và phòng khách"
              fill
              sizes="100vw"
              unoptimized
            />
          </div>
          <p className={k.aboutCaption}>Không gian sống tốt hơn — Cần Thơ</p>
        </div>
        <div className={k.reasons}>
          {reasons.map((reason, index) => (
            <div key={reason} className={k.reveal} data-k-reveal style={delay(index)}>
              <b>{pad(index + 1)}</b>
              <p>{reason}</p>
            </div>
          ))}
        </div>
        <div className={k.aboutActions}>
          <Link href="/about" className={k.btnGhost}>
            Tìm hiểu thêm <ArrowRight aria-hidden="true" />
          </Link>
          <VideoButton variant="outline" />
        </div>
      </section>

      {/* ───────────── 03 Process ───────────── */}
      <section
        className={`${k.chapter} ${k.process}`}
        id="quy-trinh"
        aria-labelledby="process-title"
        data-k-steps
      >
        <div className={k.processBg} aria-hidden="true">
          <Image src="/images/home-reference/technician.webp" alt="" fill sizes="100vw" />
        </div>
        <div className={k.processGrid}>
          <div className={k.processSticky}>
            <p className={k.label}>
              <b>03</b> — Quy trình
            </p>
            <h2 id="process-title" className={k.display} data-k-reveal>
              <span className={k.line}>
                <span>Quy trình làm việc</span>
              </span>
              <span className={k.line} style={delay(1)}>
                <span>
                  <em>chuyên nghiệp.</em>
                </span>
              </span>
            </h2>
            <p className={k.lede}>Đơn giản – Minh bạch – Hiệu quả</p>
            <div className={k.progress} data-k-progress>
              <span />
            </div>
            <div>
              <Link href="/booking" className={k.btn}>
                Đặt lịch ngay <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className={k.steps}>
            {workflow.map(({ number, title, description }) => (
              <li key={number} className={k.step} data-k-step>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── 04 Trust ───────────── */}
      <section className={k.chapter} aria-labelledby="trust-title">
        <p className={k.chapterNumber} aria-hidden="true">
          04
        </p>
        <div className={k.chapterHead}>
          <p className={k.label}>
            <b>04</b> — Cam kết
          </p>
          <h2 id="trust-title" className={k.display} data-k-reveal>
            <span className={k.line}>
              <span>Cam kết của</span>
            </span>
            <span className={k.line} style={delay(1)}>
              <span>
                <em>Minh Nhật.</em>
              </span>
            </span>
          </h2>
          <p className={`${k.lede} ${k.reveal}`} data-k-reveal>
            Nhanh chóng – Uy tín – Chuyên nghiệp – Tận tâm.
          </p>
        </div>
        {homeTrust.statisticsVerified ? (
          <dl className={k.stats}>
            {homeTrust.statistics.map(({ value, label }, index) => (
              <div key={label} className={k.reveal} data-k-reveal style={delay(index)}>
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        ) : null}
        <div className={k.trustRows}>
          {homeTrust.commitments.map(({ title, description }, index) => (
            <article key={title} className={`${k.trustRow} ${k.reveal}`} data-k-reveal style={delay(index)}>
              <small>{pad(index + 1)}</small>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        {homeTrust.reviews.some((review) => review.verified) ? (
          <div className={k.quotes}>
            {homeTrust.reviews
              .filter((review) => review.verified)
              .slice(0, 3)
              .map((review) => (
                <figure
                  key={`${review.name}-${review.service}`}
                  className={k.reveal}
                  data-k-reveal
                  aria-label={`${review.rating} trên 5 sao`}
                >
                  <blockquote>“{review.content}”</blockquote>
                  <figcaption>
                    {review.name} — {review.area} · {review.service}
                  </figcaption>
                </figure>
              ))}
          </div>
        ) : null}
      </section>

      {/* ───────────── 05 Gallery ───────────── */}
      <CinematicGallery />

      {/* ───────────── Final scene ───────────── */}
      <section className={k.final} aria-labelledby="final-cta-title">
        <div className={k.finalMedia} data-k-parallax="0.1" aria-hidden="true">
          <Image src="/images/home-reference/gallery-repair.webp" alt="" fill sizes="100vw" />
        </div>
        <div>
          <p className={k.label}>
            <b>06</b> — Liên hệ
          </p>
          <h2 id="final-cta-title" className={k.display} data-k-reveal>
            <span className={k.line}>
              <span>Máy lạnh đang</span>
            </span>
            <span className={k.line} style={delay(1)}>
              <span>
                <em>gặp sự cố?</em>
              </span>
            </span>
          </h2>
          <p className={`${k.lede} ${k.reveal}`} data-k-reveal>
            Để kỹ thuật viên Điện Lạnh Minh Nhật hỗ trợ bạn nhanh chóng và chuyên nghiệp.
          </p>
          <div className={`${k.heroActions} ${k.reveal}`} data-k-reveal>
            <a className={k.btnGhost} href={phoneHref}>
              <Phone aria-hidden="true" /> Gọi ngay
            </a>
            <Link className={k.btn} href="/booking">
              Đặt lịch sửa chữa <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
