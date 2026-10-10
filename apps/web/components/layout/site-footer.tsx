import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { siteContent } from '@/lib/content/site-content';
import { integrationSettings } from '@/lib/integrations/settings';
export function SiteFooter() {
  return (
    <footer className="mn-footer">
      <div className="mn-container">
        <div className="mn-footer-grid">
          <div>
            <Link href="/" className="mn-brand">
              <MinhNhatLogoMark idPrefix="footer" />
              <span>
                ĐIỆN LẠNH<strong>MINH NHẬT</strong>
                <small>CẦN THƠ</small>
              </span>
            </Link>
            <p>
              Sửa chữa, vệ sinh và lắp đặt điện lạnh tận nơi.
              <br />
              Tận tâm trong từng công việc, an tâm từng mái nhà.
            </p>
          </div>
          <div>
            <h2>Kết nối với Minh Nhật</h2>
            <a href={siteContent.phoneHref}>
              <Phone size={16} />
              {siteContent.phoneDisplay}
            </a>
            <p>
              <MapPin size={16} />
              {siteContent.address}
            </p>
            {siteContent.email && (
              <a href={`mailto:${siteContent.email}`}>
                <Mail size={16} />
                {siteContent.email}
              </a>
            )}
            <a target="_blank" rel="noreferrer" href={siteContent.zalo}>
              Tư vấn qua Zalo ↗
            </a>
            {integrationSettings.facebookUrl && (
              <a target="_blank" rel="noreferrer" href={integrationSettings.facebookUrl}>
                <Facebook size={16} />
                Facebook
              </a>
            )}
            {integrationSettings.tiktokUrl && (
              <a target="_blank" rel="noreferrer" href={integrationSettings.tiktokUrl}>
                TikTok ↗
              </a>
            )}
          </div>
          <div>
            <h2>Thông tin hữu ích</h2>
            <Link href="/services">Dịch vụ điện lạnh</Link>
            <Link href="/about">Giới thiệu Minh Nhật</Link>
            <Link href="/faq">Câu hỏi thường gặp</Link>
            <Link href="/booking">Đặt lịch dịch vụ</Link>
          </div>
        </div>
        <div className="mn-footer-bottom">
          <span>© {new Date().getFullYear()} Điện Lạnh Minh Nhật</span>
          <div>
            <Link href="/privacy-policy">Chính sách bảo mật</Link>
            <Link href="/terms-of-service">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
