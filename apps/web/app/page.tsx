import Image from 'next/image';
import Link from 'next/link';
import { HomeHero } from '@/components/redesign/hero';
import { HomeServicesSection } from '@/components/redesign/home-services-section';
import { Process, Reasons } from '@/components/redesign/ui';
import { VerifiedServiceArea } from '@/components/redesign/verified-service-area';
import { Showcase } from '@/components/redesign/showcase';
import { sharedProjectCovers } from '@/lib/content/shared-project-covers';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { halfContentImageSizes } from '@/lib/image-sizes';
import { ShieldCheck } from 'lucide-react';
export const metadata = buildMetadata({
  title: 'Điện lạnh tận nơi tại Cần Thơ',
  description:
    'Điện Lạnh Minh Nhật – sửa chữa, vệ sinh, lắp đặt máy lạnh, máy giặt, tủ lạnh và điện nước tại Cần Thơ.',
  path: '/',
});
export default function HomePage() {
  return (
    <main className="mn-home">
      <HomeHero />
      <div className="mn-home-content">
        <HomeServicesSection />
        <div className="mn-home-about-band">
        <section className="mn-home-about mn-home-frame">
          <div className="mn-home-about-photo">
            <Image
              src={siteContent.images.technician}
              fill
              sizes={`(max-width: 480px) calc(100vw - 32px), (max-width: 800px) calc(100vw - 48px), ${halfContentImageSizes}`}
              alt="Kỹ thuật viên điện lạnh – ảnh minh họa"
            />
            <div className="mn-about-brand-badge">
              <ShieldCheck size={34} aria-hidden="true" />
              <span>
                <strong>Kiểm tra</strong>
                <span>Báo giá</span>
                <span>Rồi mới sửa</span>
              </span>
            </div>
          </div>
          <div>
            <p className="mn-kicker">GIỚI THIỆU MINH NHẬT</p>
            <h2>
              Sửa điện lạnh tại nhà
              <br />
              <em>ở Cần Thơ</em>
            </h2>
            <p>
              Bạn cho biết máy đang gặp lỗi gì, Minh Nhật hẹn giờ đến kiểm tra. Thợ sẽ trao đổi
              cách sửa và báo giá trước khi làm.
            </p>
            <Reasons />
            <Link href="/about" className="mn-text-link">
              Tìm hiểu về Minh Nhật →
            </Link>
          </div>
        </section>
        </div>
        <section className="mn-section mn-home-projects mn-home-light" aria-label="Dự án và bài viết">
          <div className="mn-home-frame">
          <Showcase
            home
            compact
            projectCovers={sharedProjectCovers}
          />
          </div>
        </section>
        <div className="mn-home-coverage-band">
          <VerifiedServiceArea />
        </div>
        <div className="mn-home-process-band mn-home-light">
          <div className="mn-home-frame"><Process home /></div>
        </div>
      </div>
    </main>
  );
}
