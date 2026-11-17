import { HeroWords } from '@/components/home-ice-blue/hero-words';
import Link from 'next/link';
import { contentImageSizes } from '@/lib/image-sizes';
import Image from 'next/image';
import {
  AirVent,
  Headset,
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
import { PageHeroAtmosphere } from './page-hero-atmosphere';
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
export function Eyebrow({ children, entrance }: { children: React.ReactNode; entrance?: boolean }) {
  return (
    <span className="mn-eyebrow" data-u216={entrance ? 'badge' : undefined}>
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
        <Link className="mn-button" href="/contact#tu-van">
          Nhận tư vấn <ArrowRight size={18} />
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
        <Image loading="eager" src="/icons/zalo.svg" width={32} height={32} alt="Zalo" />
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
    <div className="mn-section-heading" data-reveal="">
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
  imageAlt = 'Không gian và dịch vụ điện lạnh Minh Nhật – ảnh minh họa',
  imagePosition,
  insetImage = false,
  label = 'Điện lạnh tận nơi tại Cần Thơ',
  className = '',
  showEyebrow = true,
  showAtmosphere = true,
  imagePreview = false,
}: {
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  insetImage?: boolean;
  label?: string;
  className?: string;
  showEyebrow?: boolean;
  showAtmosphere?: boolean;
  imagePreview?: boolean;
}) {
  return (
    <section className={`mn-container mn-page-hero ${className}`} data-u216-hero data-inset-image={insetImage || undefined}>
      <Image
        src={image}
        data-u216="backdrop"
        fill
        priority
        loading="eager"
        quality={92}
        sizes={contentImageSizes}
        alt={imageAlt}
        style={imagePosition ? { objectPosition: imagePosition } : undefined}
      />
      {showAtmosphere && <PageHeroAtmosphere image={image} heroClassName={className} />}
      <div className="mn-page-hero-shade" />
      <svg className="mn-page-hero-wave" viewBox="0 0 640 160" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="mnInnerWaveLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5cc5f6" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0e84d6" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="mnInnerWaveDeep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0979c6" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#0060ac" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <path d="M120 160 C275 152, 435 110, 640 24 L640 160 Z" fill="url(#mnInnerWaveLight)" />
        <path d="M210 160 C365 148, 505 112, 640 48 L640 160 Z" fill="url(#mnInnerWaveDeep)" />
      </svg>
      <div className="mn-container">
        {showEyebrow && <Eyebrow entrance>{label}</Eyebrow>}
        <h1 aria-label={accent ? `${title} ${accent}` : title}>
          <HeroWords text={title} />
          {accent && (
            <>
              <br />
              <em><HeroWords text={accent} start={title.trim().split(/\s+/).length} /></em>
            </>
          )}
        </h1>
        {description && <p data-u216="description">{description}</p>}
      </div>
      {imagePreview && <ImagePreview src={image} title={title} />}
    </section>
  );
}
type ServiceCardContent = Pick<(typeof serviceCards)[number], 'title' | 'description' | 'icon' | 'imagery'>;

export function ServiceCard({
  service,
  href,
  index = 0,
}: {
  service: ServiceCardContent;
  href: string;
  index?: number;
}) {
  return (
    <Link
      href={href}
      className="mn-service-card"
      data-reveal=""
      style={{ '--d': `${(index % 4) * 80}ms` } as React.CSSProperties}
    >
      <div className="mn-card-photo">
        <Image
          loading="lazy"
          src={service.imagery.src}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (min-width: 1920px) 360px, 25vw"
          alt={service.imagery.alt}
          style={{ objectPosition: service.imagery.cardPosition }}
        />
        <span className="mn-card-icon-badge" aria-hidden="true">
          {service.icon === 'maintenance' ? (
            <Settings size={18} strokeWidth={1.8} />
          ) : (
            <Icon name={service.icon} />
          )}
        </span>
      </div>
      <div className="mn-card-copy">
        <div className="mn-card-body">
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
        <div className="mn-card-action">
          <span>Xem chi tiết</span>
          <ArrowRight className="mn-card-arrow" aria-hidden="true" size={14} />
        </div>
      </div>
    </Link>
  );
}

export function ServiceGrid({
  services = serviceCards,
  limit,
  areaSlug,
  category = 'all',
}: {
  services?: Array<ServiceCardContent & { slug: string }>;
  limit?: number;
  areaSlug?: string;
  category?: string;
}) {
  const filteredServices = services.filter((service) => {
    if (category === 'all') return true;
    if (category === 'dien-nuoc')
      return !['may-lanh', 'may-giat', 'tu-lanh'].some((group) => service.slug.includes(group));
    return service.slug.includes(category);
  });
  return (
    <div className={`mn-service-grid ${limit === 6 ? 'mn-service-grid-preview' : ''}`}>
      {filteredServices.slice(0, limit).map((service, idx) => (
        <ServiceCard key={service.slug} service={service} index={idx}
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
      <Link className="mn-button mn-process-booking" href="/contact#tu-van">
        <Headset size={20} aria-hidden="true" /> Nhận tư vấn
      </Link>
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
      ].map(([icon, title, desc], idx) => (
        <article
          key={title}
          data-reveal=""
          style={{ '--d': `${idx * 0.08}s` } as React.CSSProperties}
        >
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
    <section className="mn-support" data-reveal="">
      <Image loading="lazy"
        src={siteContent.images.support}
        fill
        sizes={contentImageSizes}
        alt="Kỹ thuật viên điện lạnh – ảnh minh họa"
      />
      <PageHeroAtmosphere mode="dispatch-radar" />
      <div>
        <p>Cần hỗ trợ ngay?</p>
        <h2>
          Gọi <a href={siteContent.phoneHref}>{siteContent.phoneDisplay}</a>
        </h2>
        <p>Cho Minh Nhật biết máy bị lỗi gì và địa chỉ cần đến.</p>
        <Link className="mn-button" href="/contact#tu-van">
          Nhận tư vấn <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
