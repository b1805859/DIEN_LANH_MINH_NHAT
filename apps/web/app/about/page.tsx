import Image from 'next/image';
import { Icon, PageHero, Reasons, SectionHeading } from '@/components/redesign/ui';
import { ServiceArea } from '@/components/redesign/service-area';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { contentImageSizes } from '@/lib/image-sizes';
import { CountUp } from '@/components/ui/count-up';
export const metadata = buildMetadata({
  title: 'Giới thiệu Điện Lạnh Minh Nhật',
  description: 'Minh Nhật nhận sửa máy lạnh, máy giặt, tủ lạnh và điện nước tại nhà ở Cần Thơ.',
  path: '/about',
});
export default function AboutPage() {
  return (
    <main className="mn-reference-page mn-about-page">
      <PageHero
        className="mn-about-hero"
        showEyebrow
        title="Thợ điện lạnh tại nhà"
        accent="ở Cần Thơ"
        image={siteContent.images.technician}
        description="Minh Nhật nhận sửa máy lạnh, máy giặt, tủ lạnh và điện nước. Thợ đến kiểm tra, báo giá và chỉ làm khi bạn đồng ý."
      />
      <div className="mn-container">
        <div className="mn-tone-section mn-tone-light" aria-label="Điểm nổi bật của Minh Nhật">
          <div className="mn-about-facts mn-panel">
            {siteContent.aboutFacts.map(({ value, label }, index) => (
              <div key={label}>
                <span className="mn-fact-icon">
                  <Icon name={['shield', 'users', 'shield'][index]} />
                </span>
                <div>
                  <strong><CountUp value={value} /></strong>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="mn-tone-section mn-tone-content">
          <SectionHeading title="Cách Minh Nhật làm việc" />
          <Reasons />
        </section>
        <section className="mn-tone-section mn-tone-light mn-team-section" aria-label="Đội ngũ Minh Nhật">
          <div className="mn-team-photo">
            <Image
              src={siteContent.images.team}
              fill
              sizes={contentImageSizes}
              alt="Ảnh minh họa bốn kỹ thuật viên Minh Nhật chuẩn bị dụng cụ và kiểm tra danh sách công việc trong căn hộ"
            />
          </div>
          <p className="mn-image-note">Hình ảnh minh họa dịch vụ.</p>
        </section>
        <div className="mn-tone-section mn-tone-deep mn-shared-coverage-section">
          <ServiceArea />
        </div>
      </div>
    </main>
  );
}
