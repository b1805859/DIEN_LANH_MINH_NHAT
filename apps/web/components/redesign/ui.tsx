import Link from 'next/link';
import Image from 'next/image';
import {
  AirVent,
  ArrowRight,
  ClipboardList,
  Clock3,
  Droplets,
  Gauge,
  MapPin,
  Phone,
  Plug,
  Refrigerator,
  ShieldCheck,
  Snowflake,
  Users,
  WashingMachine,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { processSteps, serviceCards, siteContent } from '@/lib/content/site-content';
const icons: Record<string, LucideIcon> = {
  snowflake: Snowflake,
  wind: Wind,
  airvent: AirVent,
  washer: WashingMachine,
  fridge: Refrigerator,
  plug: Plug,
  gauge: Gauge,
  droplet: Droplets,
  shield: ShieldCheck,
  clock: Clock3,
  users: Users,
  zap: Zap,
  list: ClipboardList,
  pin: MapPin,
  wrench: Wrench,
};
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  const Component = icons[name] || Snowflake;
  return <Component className={className} strokeWidth={1.65} aria-hidden="true" />;
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mn-eyebrow">
      <Snowflake size={17} />
      {children}
      <span>›</span>
    </span>
  );
}
export function Actions({ booking = false }: { booking?: boolean }) {
  return (
    <div className="mn-actions">
      {booking ? (
        <Link className="mn-button" href="/booking">
          Đặt lịch dịch vụ <ArrowRight size={18} />
        </Link>
      ) : (
        <a className="mn-button" href={siteContent.phoneHref}>
          <Phone size={18} />
          Gọi ngay {siteContent.phoneDisplay}
          <ArrowRight size={17} />
        </a>
      )}
      <a
        href={siteContent.zalo}
        target="_blank"
        rel="noreferrer"
        className="mn-button mn-button-secondary"
      >
        <Image src="/icons/zalo.svg" width={32} height={32} alt="Zalo" />
        <span>
          Chat Zalo<small>tư vấn nhanh</small>
        </span>
      </a>
    </div>
  );
}
export function SectionHeading({
  label,
  title,
  accent,
  href,
}: {
  label?: string;
  title: string;
  accent?: string;
  href?: string;
}) {
  return (
    <div className="mn-section-heading">
      <div>
        {label && <p className="mn-kicker">{label}</p>}
        <h2>
          {title} {accent && <em>{accent}</em>}
        </h2>
      </div>
      {href && (
        <Link href={href} className="mn-text-link">
          Xem tất cả <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function PageHero({
  title,
  accent,
  description,
  image = siteContent.images.services,
  label = 'Điện lạnh tận nơi tại Cần Thơ',
  className = '',
}: {
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  label?: string;
  className?: string;
}) {
  return (
    <section className={`mn-page-hero ${className}`}>
      <Image
        src={image}
        fill
        priority
        loading="eager"
        sizes="100vw"
        alt="Không gian và dịch vụ điện lạnh Minh Nhật – ảnh minh họa"
      />
      <div className="mn-page-hero-shade" />
      <div className="mn-container">
        <Eyebrow>{label}</Eyebrow>
        <h1>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
export function ServiceGrid({
  limit,
  areaSlug,
  category = 'all',
}: {
  limit?: number;
  areaSlug?: string;
  category?: string;
}) {
  const filteredServices = serviceCards.filter((service) => {
    if (category === 'all') return true;
    if (category === 'dien-nuoc')
      return !['may-lanh', 'may-giat', 'tu-lanh'].some((group) => service.slug.includes(group));
    return service.slug.includes(category);
  });
  return (
    <div className="mn-service-grid">
      {filteredServices.slice(0, limit).map((service, i) => (
        <Link
          key={service.slug}
          href={areaSlug ? `/areas/${areaSlug}/${service.slug}` : `/services/${service.slug}`}
          className={`mn-service-card ${i < 2 ? 'mn-service-featured' : ''}`}
        >
          <div className="mn-card-photo">
            <Image
              src={service.image}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 40vw"
              alt={`${service.title} – ảnh minh họa`}
            />
          </div>
          <div className="mn-card-copy">
            <span className="mn-icon-box">
              <Icon name={service.icon} />
            </span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <ArrowRight className="mn-card-arrow" size={19} />
          </div>
        </Link>
      ))}
    </div>
  );
}
export function Process() {
  return (
    <section className="mn-process">
      <SectionHeading title="Quy trình phục vụ" accent="chuyên nghiệp" />
      <div className="mn-process-grid">
        {processSteps.map(([title, desc], i) => (
          <article key={title}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function Reasons() {
  return (
    <div className="mn-reasons">
      {[
        ['users', 'Đội ngũ tận tâm', 'Trao đổi rõ ràng, làm việc cẩn thận'],
        ['clock', 'Có mặt nhanh', 'Xác nhận thời gian khi đặt lịch'],
        ['shield', 'Giá cả minh bạch', 'Thống nhất trước khi thực hiện'],
        ['wrench', 'Hỗ trợ sau dịch vụ', 'Tư vấn sử dụng và bảo trì'],
      ].map(([icon, title, desc]) => (
        <article key={title}>
          <Icon name={icon} />
          <h3>{title}</h3>
          <p>{desc}</p>
        </article>
      ))}
    </div>
  );
}
export function SupportBanner() {
  return (
    <section className="mn-support">
      <Image
        src={siteContent.images.support}
        fill
        sizes="100vw"
        alt="Kỹ thuật viên điện lạnh – ảnh minh họa"
      />
      <div>
        <p>Cần hỗ trợ ngay?</p>
        <h2>
          Gọi <a href={siteContent.phoneHref}>{siteContent.phoneDisplay}</a>
        </h2>
        <p>Trao đổi tình trạng thiết bị, hẹn lịch phù hợp tại Cần Thơ.</p>
        <Link className="mn-button" href="/booking">
          Đặt lịch ngay <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
