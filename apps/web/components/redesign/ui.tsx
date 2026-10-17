import Link from 'next/link';
import {
  contentImageSizes,
  halfContentImageSizes,
  thirdContentImageSizes,
} from '@/lib/image-sizes';
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
export function ServiceGrid({
  limit,
  areaSlug,
  category = 'all',
  home = false,
}: {
  limit?: number;
  areaSlug?: string;
  category?: string;
  home?: boolean;
}) {
  const homeDescriptions: Record<string, string> = {
    'sua-may-lanh': 'Kiểm tra máy không lạnh, chảy nước, báo lỗi. Tư vấn trước khi sửa.',
    've-sinh-may-lanh': 'Làm sạch dàn nóng, dàn lạnh và lưới lọc, giúp máy vận hành ổn định.',
    'sua-may-giat': 'Kiểm tra lỗi không vắt, không xả, rung và tiếng ồn.',
    'sua-tu-lanh': 'Kiểm tra yếu lạnh, không đông đá, rò nước và tiếng ồn.',
    'sua-dien-nuoc': 'Kiểm tra điện nước, xử lý rò rỉ và thay thiết bị phù hợp.',
  };
  const filteredServices = serviceCards.filter((service) => {
    if (category === 'all') return true;
    if (category === 'dien-nuoc')
      return !['may-lanh', 'may-giat', 'tu-lanh'].some((group) => service.slug.includes(group));
    return service.slug.includes(category);
  });
  return (
    <div className={`mn-service-grid ${limit === 6 ? 'mn-service-grid-preview' : ''}`}>
      {filteredServices.slice(0, limit).map((service, i) => (
        <Link
          key={service.slug}
          href={areaSlug ? `/areas/${areaSlug}/${service.slug}` : `/services/${service.slug}`}
          className={`mn-service-card ${i < 2 ? 'mn-service-featured' : ''} ${home && service.slug === 'thao-lap-may-lanh' ? 'mn-installation-card' : ''}`}
          data-service-icon={home ? service.icon : undefined}
        >
          <div className="mn-card-photo">
            <Image
              src={service.image}
              fill
              sizes={
                i < 2
                  ? `(max-width: 480px) calc(100vw - 32px), ${halfContentImageSizes}`
                  : i >= 5
                    ? halfContentImageSizes
                    : thirdContentImageSizes
              }
              alt={`${service.title} – ảnh minh họa`}
            />
          </div>
          <div className="mn-card-copy">
            <span className="mn-icon-box">
              <Icon name={service.icon} />
            </span>
            <div>
              <h3>{service.title}</h3>
              <p>
                {home
                  ? (homeDescriptions[service.slug] ?? service.description)
                  : service.description}
              </p>
              {home && service.slug === 'thao-lap-may-lanh' && (
                <span className="mn-installation-cta">
                  Xem chi tiết dịch vụ <ArrowRight size={17} aria-hidden="true" />
                </span>
              )}
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
      <ProcessTimeline steps={processSteps} />
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
        sizes={contentImageSizes}
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
