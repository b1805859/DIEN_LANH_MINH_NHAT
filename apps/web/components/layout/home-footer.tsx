import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
  Youtube,
} from 'lucide-react';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import type { WebsiteService } from '@/lib/content/website-content';
import { integrationSettings } from '@/lib/integrations/settings';
import styles from './home-footer.module.css';

const servicesList = [
  { title: 'Sửa chữa máy lạnh', href: '/services/sua-may-lanh' },
  { title: 'Vệ sinh máy lạnh', href: '/services/ve-sinh-may-lanh' },
  { title: 'Lắp đặt, di dời máy lạnh', href: '/services/lap-dat-may-lanh' },
  { title: 'Sửa chữa máy giặt', href: '/services/sua-may-giat' },
  { title: 'Vệ sinh máy giặt', href: '/services/ve-sinh-may-giat' },
  { title: 'Sửa chữa tủ lạnh', href: '/services/sua-tu-lanh' },
  { title: 'Sửa điện nước dân dụng', href: '/services/sua-dien-nuoc' },
];

const areasList = [
  { name: 'Quận Ninh Kiều', href: '/areas/ninh-kieu' },
  { name: 'Quận Cái Răng', href: '/areas/cai-rang' },
  { name: 'Quận Bình Thủy', href: '/areas/binh-thuy' },
  { name: 'Quận Ô Môn', href: '/areas/o-mon' },
  { name: 'Phong Điền & các quận lân cận', href: '/contact' },
];

export function HomeFooter({ services }: { services: WebsiteService[] }) {
  const links = servicesList.flatMap((link) => {
    const slug = link.href.split('/').at(-1);
    const service = services.find((item) => item.slug === slug);
    if (!service) return [];
    const original = serviceCards.find((item) => item.slug === slug);
    return [{ ...link, title: service.title === original?.title ? link.title : service.title }];
  });
  // Format address nicely without raw Plus Codes
  const cleanAddress = siteContent.address
    ? siteContent.address.replace(/^XP8W\+263,\s*Unnamed,\s*Road,\s*/i, '').trim()
    : 'Cái Răng, TP. Cần Thơ';
  const displayAddress = cleanAddress.startsWith('Cái Răng')
    ? `${cleanAddress} (Phục vụ tận nơi toàn Cần Thơ)`
    : cleanAddress;

  return (
    <footer className={`mn-footer mn-home-footer ${styles.footerWrapper}`}>
      <div className={styles.glowBorder} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Cột 1: Thương hiệu, giới thiệu & giờ làm việc */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLink} aria-label="Điện Lạnh Minh Nhật – Trang chủ">
              <MinhNhatLogoMark idPrefix="home-footer-modern" />
              <span className={styles.brandText}>
                <span className={styles.brandTitle}>ĐIỆN LẠNH</span>
                <span className={styles.brandName}>MINH NHẬT</span>
                <span className={styles.brandLoc}>CẦN THƠ</span>
              </span>
            </Link>

            <p className={styles.brandDesc}>
              Dịch vụ sửa chữa, bảo dưỡng máy lạnh, máy giặt, tủ lạnh và điện nước tận nơi nhanh chóng, uy tín tại TP. Cần Thơ.
            </p>

            <div className={styles.workHours}>
              <Clock size={16} aria-hidden="true" />
              <div>
                <strong>Giờ phục vụ: 07:00 – 21:00</strong>
                <span>Hoạt động tất cả các ngày (Hỗ trợ khẩn cấp 24/7)</span>
              </div>
            </div>

            <div className={styles.socialRow} aria-label="Mạng xã hội">
              {integrationSettings.facebookUrl && (
                <a
                  href={integrationSettings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook Điện Lạnh Minh Nhật"
                  className={styles.socialBtn}
                >
                  <Facebook size={18} />
                </a>
              )}
              {integrationSettings.youtubeUrl && (
                <a
                  href={integrationSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube Điện Lạnh Minh Nhật"
                  className={styles.socialBtn}
                >
                  <Youtube size={18} />
                </a>
              )}
              <a
                href={siteContent.zalo}
                target="_blank"
                rel="noreferrer"
                aria-label="Tư vấn qua Zalo"
                className={styles.socialBtn}
              >
                <Image loading="eager" src="/icons/zalo.svg" width={20} height={20} alt="Zalo" />
              </a>
            </div>
          </div>

          {/* Cột 2: Danh mục dịch vụ chính */}
          <div>
            <h2 className={styles.colHeading}>
              Dịch vụ tận nơi
              <span className={styles.headingUnderline} aria-hidden="true" />
            </h2>
            <ul className={styles.linkList}>
              {links.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className={styles.navLink}>
                    <ChevronRight size={14} aria-hidden="true" />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Khu vực phục vụ & Cam kết chất lượng */}
          <div>
            <h2 className={styles.colHeading}>
              Khu vực & Cam kết
              <span className={styles.headingUnderline} aria-hidden="true" />
            </h2>
            <ul className={styles.linkList}>
              {areasList.map((area) => (
                <li key={area.name}>
                  <Link href={area.href} className={styles.navLink}>
                    <ChevronRight size={14} aria-hidden="true" />
                    <span>{area.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className={styles.trustList} aria-label="Cam kết chất lượng dịch vụ">
              <div className={styles.trustItem}>
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>Có mặt sau 30 phút hẹn</span>
              </div>
              <div className={styles.trustItem}>
                <ShieldCheck size={15} aria-hidden="true" />
                <span>Báo giá minh bạch trước khi làm</span>
              </div>
              <div className={styles.trustItem}>
                <Wrench size={15} aria-hidden="true" />
                <span>Bảo hành chu đáo 3 – 6 tháng</span>
              </div>
            </div>
          </div>

          {/* Cột 4: Thông tin liên hệ & Hotline */}
          <div className={styles.contactCol}>
            <h2 className={styles.colHeading}>
              Thông tin liên hệ
              <span className={styles.headingUnderline} aria-hidden="true" />
            </h2>

            {/* Thẻ Hotline lớn */}
            <a href={siteContent.phoneHref} className={styles.hotlineBox} aria-label={`Gọi hotline: ${siteContent.phoneDisplay}`}>
              <span className={styles.hotlineIcon}>
                <Phone size={22} />
              </span>
              <span className={styles.hotlineCopy}>
                <span className={styles.hotlineLabel}>Hotline tư vấn 24/7</span>
                <span className={styles.hotlineNumber}>{siteContent.phoneDisplay}</span>
              </span>
            </a>

            {/* Địa chỉ & bản đồ */}
            <a
              href={integrationSettings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
            >
              <MapPin size={18} aria-hidden="true" />
              <span>{displayAddress}</span>
            </a>

            {/* Email nếu có */}
            {siteContent.email && (
              <a href={`mailto:${siteContent.email}`} className={styles.contactItem}>
                <Mail size={18} aria-hidden="true" />
                <span>{siteContent.email}</span>
              </a>
            )}

            {/* Nút Chat Zalo kỹ thuật */}
            <a
              href={siteContent.zalo}
              target="_blank"
              rel="noreferrer"
              className={styles.zaloAction}
              aria-label="Nhắn tin Zalo với kỹ thuật viên Minh Nhật"
            >
              <Image loading="eager" src="/icons/zalo.svg" width={22} height={22} alt="" />
              <span>Nhắn Zalo tư vấn ngay</span>
            </a>
          </div>
        </div>

        {/* Thanh chân trang (Copyright & Legal) */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Điện Lạnh Minh Nhật. Tất cả quyền được bảo lưu.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy" className={styles.legalLink}>
              Chính sách bảo mật
            </Link>
            <Link href="/terms-of-service" className={styles.legalLink}>
              Điều khoản sử dụng
            </Link>
            <Link href="/contact" className={styles.legalLink}>
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
