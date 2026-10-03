'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock3, Facebook, Mail, MapPin, Music2, Phone, Youtube } from 'lucide-react';
import { APP_NAME, PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { serviceCards } from '@/components/services-reference/data';
import { integrationSettings } from '@/lib/integrations/settings';
import homeStyles from '@/components/home-reference/home.module.css';
import styles from './site-footer.module.css';

const footerLinks = [
  ['Trang chủ', '/'],
  ['Dịch vụ', '/services'],
  ['Khu vực', '/areas'],
  ['Giới thiệu', '/about'],
  ['Liên hệ', '/contact'],
];
const serviceAreas = ['ninh-kieu', 'binh-thuy', 'cai-rang', 'o-mon', 'thot-not'].map(
  (slug) => PRIORITY_DISTRICTS.find((area) => area.slug === slug)!,
);

function Brand({ tagline = false }: { tagline?: boolean }) {
  return (
    <Link href="/" className={homeStyles.brand} aria-label="Điện Lạnh Minh Nhật — Trang chủ">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {[0, 60, 120].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 24 24)`}
            d="M24 3v42M17 7l7 5 7-5M17 41l7-5 7 5"
          />
        ))}
      </svg>
      <span>
        ĐIỆN LẠNH<strong>MINH NHẬT</strong>
        {tagline ? <small className={styles.tagline}>Đồng hành cùng ngôi nhà bạn</small> : null}
      </span>
    </Link>
  );
}

function SocialLinks() {
  return (
    <div className={styles.socialLinks}>
      <a
        href={
          integrationSettings.facebookUrl ||
          'https://www.facebook.com/profile.php?id=100063792110691'
        }
        aria-label="Facebook"
        target="_blank"
        rel="noreferrer"
      >
        <Facebook fill="currentColor" />
      </a>
      <a href={integrationSettings.zaloUrl} aria-label="Zalo" target="_blank" rel="noreferrer">
        <Image src="/icons/zalo.svg" alt="" width={19} height={19} />
      </a>
      {integrationSettings.youtubeUrl ? (
        <a
          href={integrationSettings.youtubeUrl}
          aria-label="YouTube"
          target="_blank"
          rel="noreferrer"
        >
          <Youtube fill="currentColor" />
        </a>
      ) : (
        <span
          aria-label="YouTube — chưa có kênh được công bố"
          title="Chưa có kênh YouTube được công bố"
        >
          <Youtube fill="currentColor" />
        </span>
      )}
      {integrationSettings.tiktokUrl ? (
        <a
          href={integrationSettings.tiktokUrl}
          aria-label="TikTok"
          target="_blank"
          rel="noreferrer"
        >
          <Music2 fill="currentColor" />
        </a>
      ) : (
        <span
          aria-label="TikTok — chưa có kênh được công bố"
          title="Chưa có kênh TikTok được công bố"
        >
          <Music2 fill="currentColor" />
        </span>
      )}
    </div>
  );
}

function FooterBottom({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className={`${homeStyles.footerBottom} ${styles.bottom}`}>
      {children}
      <nav aria-label={label}>
        {footerLinks.map(([title, href]) => (
          <Link key={href} href={href}>
            {title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function PolicyFooterBottom() {
  return (
    <div className={`${homeStyles.footerBottom} ${styles.bottom}`}>
      <span>© 2024 Điện Lạnh Minh Nhật. Tất cả quyền được bảo lưu.</span>
      <nav aria-label="Chính sách">
        <Link href="/privacy-policy">Chính sách bảo mật</Link>
        <span aria-hidden="true">|</span>
        <Link href="/terms-of-service">Điều khoản sử dụng</Link>
      </nav>
    </div>
  );
}

function ContactDetails() {
  return (
    <div className={homeStyles.footerContact}>
      <h2>Thông tin liên hệ</h2>
      <a href={`tel:${integrationSettings.phone.replace(/\s/g, '')}`}>
        <Phone />
        0939 370 109
      </a>
      <p>
        <Clock3 />
        08:00 – 20:00 (T2 – CN)
      </p>
      <a
        href={
          integrationSettings.googleMapsUrl ||
          'https://www.google.com/maps/search/?api=1&query=Ninh+Kieu+Can+Tho'
        }
        target="_blank"
        rel="noreferrer"
      >
        <MapPin />
        Ninh Kiều, Cần Thơ
      </a>
      <a href="mailto:dienlanhminhnhat@gmail.com">
        <Mail />
        dienlanhminhnhat@gmail.com
      </a>
    </div>
  );
}

function ServicesLinks() {
  return (
    <div className={styles.linkGroup}>
      <h2>Dịch vụ</h2>
      <nav aria-label="Dịch vụ cuối trang">
        {serviceCards.map((service) => (
          <Link href={`/services/${service.slug}`} key={service.slug}>
            {service.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ContactFooter() {
  return (
    <footer className={`${homeStyles.footer} ${styles.sharedFooter}`}>
      <div className={`${homeStyles.footerMain} ${styles.footerGrid} ${styles.contactGrid}`}>
        <div className={`${homeStyles.footerIntro} ${styles.brandColumn}`}>
          <Brand tagline />
          <p>
            Điều hòa – máy giặt – tủ lạnh – điện nước tại nhà.
            <br />
            Tận tâm và chu đáo trong từng dịch vụ.
          </p>
        </div>
        <div className={styles.linkGroup}>
          <h2>Liên hệ</h2>
          <a href={`tel:${integrationSettings.phone}`}>
            <Phone /> 0939 370 109
          </a>
          <p>
            <Clock3 /> 08:00 – 20:00 Thứ 2 – CN
          </p>
          <a
            href="https://www.facebook.com/profile.php?id=100063792110691"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook /> Facebook Điện Lạnh Minh Nhật
          </a>
        </div>
        <div className={styles.linkGroup}>
          <h2>Khu vực phục vụ</h2>
          <p>
            {serviceAreas.map((area, i) => (
              <span key={area.slug}>
                {i === 3 ? <br /> : i > 0 ? ' – ' : ''}
                <Link href={`/areas/${area.slug}`}>{area.shortName}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>
      <FooterBottom label="Liên kết cuối trang">
        <span>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </span>
      </FooterBottom>
    </footer>
  );
}

function ServicesFooter() {
  return (
    <footer className={`${homeStyles.footer} ${styles.sharedFooter} ${styles.polishedFooter}`}>
      <div className={`${homeStyles.footerMain} ${styles.footerGrid}`}>
        <div className={`${homeStyles.footerIntro} ${styles.brandColumn}`}>
          <Brand />
          <p>
            Sửa chữa – Vệ sinh – Lắp đặt – Bảo trì điện lạnh
            <br />
            tại Cần Thơ nhanh chóng – Uy tín – Chuyên nghiệp.
          </p>
          <SocialLinks />
        </div>
        <ServicesLinks />
        <ContactDetails />
        <div className={`${homeStyles.footerSocial} ${styles.linkGroup}`}>
          <h2>Kết nối với chúng tôi</h2>
          <SocialLinks />
        </div>
      </div>
      <PolicyFooterBottom />
    </footer>
  );
}

function AreasFooter({ polished = false }: { polished?: boolean } = {}) {
  return (
    <footer
      className={`${homeStyles.footer} ${styles.sharedFooter}${polished ? ` ${styles.polishedFooter}` : ''}`}
    >
      <div className={`${homeStyles.footerMain} ${styles.footerGrid}`}>
        <div className={`${homeStyles.footerIntro} ${styles.brandColumn}`}>
          <Brand />
          <p>
            Sửa chữa – Vệ sinh – Lắp đặt – Bảo trì điện lạnh
            <br />
            tại Cần Thơ. Nhanh chóng – Uy tín – Chuyên nghiệp.
          </p>
          <SocialLinks />
        </div>
        <ServicesLinks />
        <ContactDetails />
        <div className={`${homeStyles.footerSocial} ${styles.linkGroup}`}>
          <h2>Kết nối với chúng tôi</h2>
          <SocialLinks />
        </div>
      </div>
      <PolicyFooterBottom />
    </footer>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === '/services') return <ServicesFooter />;
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return <ServicesFooter />;
  if (['/about', '/contact'].includes(pathname)) return <AreasFooter polished />;
  if (pathname === '/areas') return <AreasFooter />;
  return <ContactFooter />;
}
