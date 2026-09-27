import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Phone,
  SearchCheck,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Sửa chữa điện lạnh tại Cần Thơ',
  description:
    'Điện Lạnh Minh Nhật nhận sửa chữa, bảo trì và lắp đặt máy lạnh, máy giặt, tủ lạnh tại Cần Thơ. Gọi 0939370109 để trao đổi nhu cầu.',
  path: '/',
  image: '/images/hvac-hero-branded.png',
});

const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;

const serviceCards = [
  {
    name: 'Máy lạnh',
    image: '/images/home-mobile-hero.png',
    imageClass: 'mock-card-air',
    links: [
      { label: 'Sửa chữa', href: '/services/sua-may-lanh' },
      { label: 'Vệ sinh', href: '/services/ve-sinh-may-lanh' },
      { label: 'Lắp đặt', href: '/services/thao-lap-may-lanh' },
    ],
  },
  {
    name: 'Máy giặt',
    image: '/images/service-tools.png',
    imageClass: 'mock-card-washer',
    links: [
      { label: 'Sửa chữa', href: '/services/sua-may-giat' },
      { label: 'Vệ sinh', href: '/services/ve-sinh-may-giat' },
      { label: 'Lắp đặt', href: '/services/sua-may-giat' },
    ],
  },
  {
    name: 'Tủ lạnh',
    image: '/images/service-tools.png',
    imageClass: 'mock-card-fridge',
    links: [
      { label: 'Sửa chữa', href: '/services/sua-tu-lanh' },
      { label: 'Vệ sinh', href: '/services/sua-tu-lanh' },
      { label: 'Lắp đặt', href: '/services/sua-tu-lanh' },
    ],
  },
];

const workflow = [
  {
    icon: Phone,
    number: '01',
    title: 'Liên hệ',
    detail: 'Liên hệ qua điện thoại, Zalo hoặc điền form yêu cầu.',
  },
  {
    icon: ClipboardList,
    number: '02',
    title: 'Khảo sát / Tư vấn',
    detail: 'Kỹ thuật viên kiểm tra thiết bị và báo giá rõ ràng.',
  },
  {
    icon: Settings,
    number: '03',
    title: 'Thực hiện / Hoàn tất',
    detail: 'Tiến hành phù hợp, bàn giao và hướng dẫn sử dụng.',
  },
];

export default function HomePage() {
  return (
    <main className="mock-page mock-home">
      <section className="mock-hero mock-shell">
        <div className="mock-hero-copy">
          <p className="mock-pill">
            <ClipboardList size={15} /> Sửa chữa – Bảo trì – Lắp đặt
          </p>
          <h1>
            Sửa chữa điện lạnh
            <br />
            tại Cần Thơ
          </h1>
          <p className="mock-hero-summary">
            Máy lạnh, máy giặt, tủ lạnh và nhiều thiết bị khác.
            <br className="mock-desktop-break" /> Tận tâm – Chu đáo – Phục vụ tận nhà.
          </p>
          <div className="mock-hero-actions">
            <a className="mock-button mock-button-primary" href={phoneHref}>
              <Phone size={22} />{' '}
              <span>
                Gọi ngay<strong>0939 370 109</strong>
              </span>
            </a>
            <a
              className="mock-button mock-button-outline"
              href={integrationSettings.zaloUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Image src="/icons/zalo.svg" width={22} height={22} alt="" /> Nhắn Zalo
            </a>
          </div>
          <div className="mock-benefits">
            <span>
              <SearchCheck />{' '}
              <span>
                <strong>Tại Cần Thơ</strong>
                <small>Liên hệ trực tiếp</small>
              </span>
            </span>
            <span>
              <BadgeCheck />{' '}
              <span>
                <strong>Kỹ thuật tại nhà</strong>
                <small>Trao đổi rõ ràng</small>
              </span>
            </span>
            <span>
              <ShieldCheck />{' '}
              <span>
                <strong>Kiểm tra trước</strong>
                <small>Báo giá trước khi làm</small>
              </span>
            </span>
          </div>
        </div>
        <div className="mock-hero-photo">
          <Image
            src="/images/services/sua-may-lanh-branded.png"
            alt="Kỹ thuật viên Điện Lạnh Minh Nhật kiểm tra máy lạnh"
            fill
            priority
            sizes="(min-width: 768px) 75vw, 100vw"
          />
        </div>
        <p className="mock-hero-script">
          Không chỉ sửa máy
          <br />
          Chúng tôi giữ cho
          <br />
          cuộc sống của bạn mát mẻ hơn!
        </p>
      </section>

      <section className="mock-shell mock-services" aria-label="Nhóm dịch vụ chính">
        {serviceCards.map((card) => (
          <article className="mock-service-card" key={card.name}>
            <div className={`mock-service-photo ${card.imageClass}`}>
              <Image
                src={card.image}
                alt={`Dịch vụ ${card.name.toLocaleLowerCase('vi-VN')}`}
                fill
                sizes="1448px"
              />
            </div>
            <h2>{card.name}</h2>
            <div className="mock-service-links">
              {card.links.map((link) => (
                <Link href={link.href} key={`${card.name}-${link.label}`}>
                  {link.label}
                </Link>
              ))}
              <ArrowRight size={18} aria-hidden="true" />
            </div>
          </article>
        ))}
      </section>

      <section className="mock-shell mock-process" id="process">
        <header>
          <h2>
            <span className="mock-desktop-label">Quy trình làm việc</span>
            <span className="mock-mobile-label">Quy trình chỉ 3 bước</span>
          </h2>
          <p>Đơn giản – Nhanh chóng – Minh bạch</p>
        </header>
        <div className="mock-process-grid">
          {workflow.map(({ icon: Icon, number, title, detail }, index) => (
            <div className="mock-process-item" key={number}>
              <div className="mock-process-icon">
                <Icon size={32} />
                <span>{number}</span>
              </div>
              <div>
                <strong className="mock-step-number">{number}</strong>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
              {index < workflow.length - 1 ? (
                <ArrowRight className="mock-process-arrow" size={22} aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mock-shell mock-booking-strip">
        <CalendarDays size={38} aria-hidden="true" />
        <div>
          <h2>Đặt lịch ngay</h2>
          <p>Gửi yêu cầu để Minh Nhật liên hệ xác nhận thời gian.</p>
        </div>
        <Link href="/booking">
          Đặt lịch ngay <ArrowRight size={19} />
        </Link>
      </section>
    </main>
  );
}
