import Image from 'next/image';
import Link from 'next/link';
import { HomeHero } from '@/components/redesign/hero';
import { HomeServicesSection } from '@/components/redesign/home-services-section';
import { Process, Reasons } from '@/components/redesign/ui';
import { VerifiedServiceArea } from '@/components/redesign/verified-service-area';
import { Showcase } from '@/components/redesign/showcase';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { halfContentImageSizes } from '@/lib/image-sizes';
import './home-refinement.css';
import './home-approved.css';
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
                <strong>Tận tâm</strong>
                <span>Chuyên nghiệp</span>
                <span>Vì khách hàng Cần Thơ</span>
              </span>
            </div>
          </div>
          <div>
            <p className="mn-kicker">GIỚI THIỆU MINH NHẬT</p>
            <h2>
              Tận tâm đồng hành
              <br />
              <em>cùng người dân Cần Thơ</em>
            </h2>
            <p>
              Minh Nhật chăm chút từng công việc, từ kiểm tra, tư vấn đến thi công và bàn giao, để
              thiết bị trong nhà vận hành ổn định, bền bỉ.
            </p>
            <Reasons />
            <Link href="/about" className="mn-text-link">
              Tìm hiểu về Minh Nhật →
            </Link>
          </div>
        </section>
        </div>
        <section className="mn-section mn-home-projects mn-home-light" aria-label="Dự án minh họa và tin tức hữu ích">
          <div className="mn-home-frame">
          <Showcase
            home
            compact
            projectCovers={{
              'lap-dat-may-lanh-ninh-kieu': {
                src: '/images/redesign/carousel-maintenance.webp',
                position: 'right center',
                alt: 'Kỹ thuật viên kiểm tra dàn lạnh trong nhà – ảnh minh họa hạng mục máy lạnh',
              },
              'sua-tu-lanh-binh-thuy': {
                src: '/images/redesign/home-carousel/support-fridge.webp',
                alt: 'Kỹ thuật viên kiểm tra tủ lạnh tại nhà – ảnh minh họa',
              },
              'dien-nuoc-nha-pho': {
                src: '/images/redesign/home-carousel/support-plumbing.webp?v=20261015-realism',
                alt: 'Kỹ thuật viên kiểm tra ống nước dưới bồn rửa – ảnh minh họa',
              },
            }}
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
