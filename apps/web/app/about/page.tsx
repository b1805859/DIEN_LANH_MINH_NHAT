import Image from 'next/image';
import { Icon, PageHero, Reasons, SectionHeading } from '@/components/redesign/ui';
import { ServiceArea } from '@/components/redesign/service-area';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
import { contentImageSizes } from '@/lib/image-sizes';
export const metadata = buildMetadata({
  title: 'Giới thiệu Điện Lạnh Minh Nhật',
  description: 'Dịch vụ điện lạnh tận nơi, tận tâm đồng hành cùng người dân Cần Thơ.',
  path: '/about',
});
export default function AboutPage() {
  return (
    <main className="mn-reference-page mn-about-page">
      <PageHero
        className="mn-about-hero"
        showEyebrow
        title="Tận tâm đồng hành"
        accent="cùng người dân Cần Thơ"
        image={siteContent.images.technician}
        description="Chúng tôi hiểu cuộc sống thoải mái đến từ những dịch vụ điện lạnh chất lượng, cùng một người thợ chu đáo, đáng tin cậy."
      />
      <div className="mn-container">
        <div className="mn-about-facts mn-panel">
          {siteContent.aboutFacts.map(({ value, label }, index) => (
            <div key={label}>
              <span className="mn-fact-icon">
                <Icon name={['shield', 'users', 'shield'][index]} />
              </span>
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
        <section>
          <SectionHeading title="Vì sao chọn Điện Lạnh Minh Nhật?" />
          <Reasons />
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
        <ServiceArea />
      </div>
    </main>
  );
}
