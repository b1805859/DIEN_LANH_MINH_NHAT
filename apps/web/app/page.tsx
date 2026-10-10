import Image from 'next/image';
import Link from 'next/link';
import { HomeHero } from '@/components/redesign/hero';
import { Process, Reasons, SectionHeading, ServiceGrid } from '@/components/redesign/ui';
import { ServiceArea } from '@/components/redesign/service-area';
import { Showcase } from '@/components/redesign/showcase';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
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
      <div className="mn-container">
        <section className="mn-section">
          <SectionHeading
            label="DỊCH VỤ CỦA CHÚNG TÔI"
            title="Dịch vụ điện lạnh"
            accent="toàn diện tại Cần Thơ"
            href="/services"
          />
          <ServiceGrid limit={6} />
        </section>
        <section className="mn-home-about mn-panel">
          <div className="mn-home-about-photo">
            <Image
              src={siteContent.images.technician}
              fill
              sizes="50vw"
              alt="Kỹ thuật viên điện lạnh – ảnh minh họa"
            />
          </div>
          <div>
            <p className="mn-kicker">GIỚI THIỆU MINH NHẬT</p>
            <h2>
              Tận tâm đồng hành
              <br />
              <em>cùng người dân Cần Thơ</em>
            </h2>
            <p>
              Chúng tôi hiểu sự thoải mái trong mỗi ngôi nhà bắt đầu từ những thiết bị hoạt động ổn
              định. Minh Nhật chăm chút từng công việc, từ kiểm tra, tư vấn đến thi công và bàn
              giao.
            </p>
            <Reasons />
            <Link href="/about" className="mn-text-link">
              Tìm hiểu về Minh Nhật →
            </Link>
          </div>
        </section>
        <section className="mn-section">
          <SectionHeading title="Dự án thực tế" accent="& Tin tức hữu ích" href="/projects" />
          <Showcase compact />
        </section>
        <ServiceArea />
        <Process />
      </div>
    </main>
  );
}
