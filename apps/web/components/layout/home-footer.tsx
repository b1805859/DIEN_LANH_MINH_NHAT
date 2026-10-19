import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Facebook, Mail, MapPin, Phone, Users, Youtube } from 'lucide-react';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import { integrationSettings } from '@/lib/integrations/settings';

const quickLinks = [
  ['Trang chủ', '/'],
  ['Giới thiệu', '/about'],
  ['Dịch vụ', '/services'],
  ['Dự án', '/projects'],
  ['Tin tức', '/blog'],
  ['Liên hệ', '/contact'],
];

export function HomeFooter() {
  return (
    <footer className="mn-footer mn-home-footer">
      <div className="mn-home-frame">
        <div className="mn-footer-grid">
          <div className="mn-home-footer-brand">
            <Link href="/" className="mn-brand" aria-label="Điện Lạnh Minh Nhật – Trang chủ">
              <MinhNhatLogoMark idPrefix="home-footer" />
              <span>ĐIỆN LẠNH<strong>MINH NHẬT</strong><small>CẦN THƠ</small></span>
            </Link>
            <p>Nhận sửa máy lạnh, máy giặt, tủ lạnh và điện nước tại nhà ở Cần Thơ.</p>
            <div className="mn-home-footer-socials" aria-label="Kết nối với Minh Nhật">
              {integrationSettings.facebookUrl && <a href={integrationSettings.facebookUrl}
                target="_blank" rel="noreferrer" aria-label="Facebook Minh Nhật"><Facebook size={19} /></a>}
              {integrationSettings.youtubeUrl && <a href={integrationSettings.youtubeUrl}
                target="_blank" rel="noreferrer" aria-label="YouTube Minh Nhật"><Youtube size={19} /></a>}
              {integrationSettings.tiktokUrl && <a href={integrationSettings.tiktokUrl}
                target="_blank" rel="noreferrer" aria-label="TikTok Minh Nhật">TikTok</a>}
              <a href={siteContent.zalo} target="_blank" rel="noreferrer" aria-label="Tư vấn qua Zalo">
                <Image src="/icons/zalo.svg" width={24} height={24} alt="Zalo" />
              </a>
            </div>
          </div>
          <div>
            <h2>Liên kết nhanh</h2>
            {quickLinks.map(([title, href]) => <Link key={href} href={href}>
              <ChevronRight size={14} aria-hidden="true" />{title}
            </Link>)}
          </div>
          <div>
            <h2>Dịch vụ nổi bật</h2>
            {serviceCards.slice(0, 5).map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>
              <ChevronRight size={14} aria-hidden="true" />{service.title}
            </Link>)}
            <Link href="/services"><ChevronRight size={14} aria-hidden="true" />Bảo dưỡng định kỳ</Link>
          </div>
          <div className="mn-home-footer-contact">
            <h2>Thông tin liên hệ</h2>
            <a href={siteContent.phoneHref}><Phone size={18} aria-hidden="true" /><strong>{siteContent.phoneDisplay}</strong></a>
            <a href={integrationSettings.googleMapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} aria-hidden="true" />{siteContent.address}
            </a>
            {siteContent.email && <a href={`mailto:${siteContent.email}`}>
              <Mail size={18} aria-hidden="true" />{siteContent.email}
            </a>}
            <a href={siteContent.zalo} target="_blank" rel="noreferrer">
              <Image src="/icons/zalo.svg" width={18} height={18} alt="" />Tư vấn qua Zalo
            </a>
            {integrationSettings.facebookUrl && <a href={integrationSettings.facebookUrl} target="_blank" rel="noreferrer">
              <Facebook size={18} aria-hidden="true" />Facebook
            </a>}
          </div>
          <div className="mn-home-footer-about">
            <div><span className="mn-home-footer-about-icon"><Users size={32} aria-hidden="true" /></span>
              <div><h2>Về chúng tôi</h2><p>Thợ kiểm tra, báo giá trước khi sửa và chạy thử máy sau khi làm.</p></div>
            </div>
            <Link className="mn-button" href="/about">Tìm hiểu thêm <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="mn-footer-bottom">
          <span>© {new Date().getFullYear()} Điện Lạnh Minh Nhật. Tất cả quyền được bảo lưu.</span>
          <div><Link href="/privacy-policy">Chính sách bảo mật</Link><Link href="/terms-of-service">Điều khoản sử dụng</Link></div>
        </div>
      </div>
    </footer>
  );
}
