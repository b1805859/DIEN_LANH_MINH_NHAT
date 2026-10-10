import Link from 'next/link';
import { Clock3, Facebook, Phone } from 'lucide-react';
import { APP_NAME, PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { integrationSettings } from '@/lib/integrations/settings';

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

export function SiteFooter() {
  return (
    <footer className="mock-footer">
      <div className="mock-shell mock-footer-main">
        <Link href="/" className="mock-footer-brand">
          <MinhNhatLogoMark className="h-10 w-10" idPrefix="site-footer-logo" />
          <span>
            <strong>{APP_NAME}</strong>
            <small>Đồng hành cùng ngôi nhà bạn</small>
          </span>
        </Link>
        <div className="mock-footer-contact">
          <h2>Liên hệ</h2>
          <a href={`tel:${integrationSettings.phone}`}>
            <Phone size={14} /> 0939 370 109
          </a>
          <span>
            <Clock3 size={14} /> 08:00 – 17:00 Thứ 2 – CN
          </span>
          <a
            href="https://www.facebook.com/profile.php?id=100063792110691"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook size={14} /> Facebook Điện Lạnh Minh Nhật
          </a>
        </div>
        <div className="mock-footer-areas">
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
      <div className="mock-footer-bottom">
        <div className="mock-shell">
          <span>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </span>
          <nav aria-label="Liên kết cuối trang">
            {footerLinks.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
