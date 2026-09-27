import Image from 'next/image';
import { Heart, SearchCheck, ShieldCheck } from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `Giới thiệu ${APP_NAME}`,
  description:
    'Điện Lạnh Minh Nhật nhận sửa chữa, bảo trì và lắp đặt thiết bị điện lạnh tại Cần Thơ.',
  path: '/about',
});

const photos = [
  { src: '/images/services/sua-tu-lanh.jpg', alt: 'Kỹ thuật viên Minh Nhật kiểm tra tủ lạnh' },
  {
    src: '/images/services/sua-may-lanh-branded.png',
    alt: 'Kỹ thuật viên Minh Nhật kiểm tra thiết bị tại nhà',
  },
  {
    src: '/images/services/sua-lap-may-nuoc-uong-nong-lanh.jpg',
    alt: 'Kiểm tra thiết bị nước uống nóng lạnh',
  },
];

export default function AboutPage() {
  return (
    <main className="mock-page mock-inner-page mock-about">
      <div className="mock-shell">
        <div className="mock-about-intro">
          <div>
            <p className="mock-eyebrow">Về chúng tôi</p>
            <h1>Về Điện Lạnh Minh Nhật</h1>
            <p>
              Điện Lạnh Minh Nhật nhận sửa chữa, bảo trì và lắp đặt các thiết bị điện lạnh tại Cần
              Thơ. Minh Nhật tiếp nhận nhu cầu, trao đổi tình trạng và báo phương án trước khi thực
              hiện.
            </p>
          </div>
          <p className="mock-about-script">
            Uy tín
            <br />
            Tạo nên
            <br />
            sự khác biệt
          </p>
        </div>
        <div className="mock-about-gallery">
          {photos.map((photo) => (
            <div key={photo.src}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 33vw" />
            </div>
          ))}
        </div>
        <div className="mock-about-values">
          <div>
            <Heart />
            <span>
              <strong>Tận tâm</strong>
              <small>Luôn đặt khách hàng lên hàng đầu</small>
            </span>
          </div>
          <div>
            <SearchCheck />
            <span>
              <strong>Chu đáo</strong>
              <small>Tư vấn kỹ, rõ ràng, minh bạch</small>
            </span>
          </div>
          <div>
            <ShieldCheck />
            <span>
              <strong>Phục vụ tận nơi</strong>
              <small>Tại các khu vực ở Cần Thơ</small>
            </span>
          </div>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Giới thiệu', path: '/about' },
        ])}
      />
    </main>
  );
}
