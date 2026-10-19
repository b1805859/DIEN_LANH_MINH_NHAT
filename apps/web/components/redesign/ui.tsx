import Link from 'next/link';
import { contentImageSizes } from '@/lib/image-sizes';
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
  Settings,
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
import { ProcessTimeline } from './process-timeline';
import { ImagePreview } from './image-preview';
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
  showEyebrow = true,
  imagePreview = false,
}: {
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  label?: string;
  className?: string;
  showEyebrow?: boolean;
  imagePreview?: boolean;
}) {
  return (
    <section className={`mn-container mn-page-hero ${className}`}>
      <Image
        src={image}
        fill
        priority
        loading="eager"
        sizes={contentImageSizes}
        alt="Không gian và dịch vụ điện lạnh Minh Nhật – ảnh minh họa"
      />
      <div className="mn-page-hero-shade" />
      <div className="mn-container">
        {showEyebrow && <Eyebrow>{label}</Eyebrow>}
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
      {imagePreview && <ImagePreview src={image} title={title} />}
    </section>
  );
}
type ServiceCardContent = { title: string; description: string; image: string; icon: string };

export function ServiceCard({ service, href }: { service: ServiceCardContent; href: string }) {
  return (
    <Link href={href} className="mn-service-card">
      <div className="mn-card-photo">
        <Image src={service.image} fill
          sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 46vw, 420px"
          alt={`${service.title} – ảnh minh họa`} />
      </div>
      <div className="mn-card-copy">
        <span className="mn-icon-box">
          {service.icon === 'maintenance'
            ? <Settings strokeWidth={1.65} aria-hidden="true" />
            : <Icon name={service.icon} />}
        </span>
        <div><h3>{service.title}</h3><p>{service.description}</p></div>
        <ArrowRight className="mn-card-arrow" aria-hidden="true" />
      </div>
    </Link>
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
    <div className={`mn-service-grid ${limit === 6 ? 'mn-service-grid-preview' : ''}`}>
      {filteredServices.slice(0, limit).map((service) => (
        <ServiceCard key={service.slug} service={service}
          href={areaSlug ? `/areas/${areaSlug}/${service.slug}` : `/services/${service.slug}`} />
      ))}
    </div>
  );
}
export function Process({ home = false }: { home?: boolean }) {
  return (
    <section className={home ? 'mn-process mn-home-process-journey' : 'mn-process mn-home-process-journey mn-tone-section mn-tone-content'}
      data-custom-motion="true">
      <SectionHeading title="Các bước" accent="đặt lịch và sửa chữa" />
      <ProcessTimeline steps={processSteps} />
    </section>
  );
}
export function Reasons() {
  return (
    <div className="mn-reasons">
      {[
        ['users', 'Hỏi rõ tình trạng máy', 'Bạn mô tả lỗi đang gặp trước khi hẹn thợ'],
        ['clock', 'Hẹn giờ trước', 'Xác nhận địa chỉ và giờ đến với bạn'],
        ['shield', 'Báo giá trước khi sửa', 'Bạn đồng ý chi phí rồi thợ mới làm'],
        ['wrench', 'Hỗ trợ sau khi sửa', 'Liên hệ lại nếu máy còn gặp lỗi'],
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
        sizes={contentImageSizes}
        alt="Kỹ thuật viên điện lạnh – ảnh minh họa"
      />
      <div>
        <p>Cần hỗ trợ ngay?</p>
        <h2>
          Gọi <a href={siteContent.phoneHref}>{siteContent.phoneDisplay}</a>
        </h2>
        <p>Cho Minh Nhật biết máy bị lỗi gì và địa chỉ cần đến.</p>
        <Link className="mn-button" href="/booking">
          Đặt lịch ngay <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
