import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { ServiceArea } from '@/components/redesign/service-area';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Dự án & Tin tức điện lạnh Cần Thơ',
  description: 'Các hạng mục sửa chữa, lắp đặt minh họa và bài viết về cách dùng thiết bị điện lạnh.',
  path: '/projects',
});
export default function ProjectsPage() {
  return (
    <main className="mn-reference-page mn-news-page">
      <PageHero
        showEyebrow={false}
        title="Dự án minh họa"
        accent="& Bài viết"
        description="Xem các hạng mục sửa chữa, lắp đặt và bài viết về cách dùng thiết bị. Hình ảnh dự án dùng để minh họa."
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content">
        <section className="mn-tone-section mn-tone-light" aria-label="Dự án và tin tức">
          <Showcase key="projects" />
        </section>
        <div className="mn-tone-section mn-tone-deep mn-shared-coverage-section">
          <ServiceArea />
        </div>
      </div>
    </main>
  );
}
