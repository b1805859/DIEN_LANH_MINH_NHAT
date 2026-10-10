import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { ServiceArea } from '@/components/redesign/service-area';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Dự án & Tin tức điện lạnh Cần Thơ',
  description: 'Khám phá các hạng mục thi công minh họa và kiến thức sử dụng thiết bị điện lạnh.',
  path: '/projects',
});
export default function ProjectsPage() {
  return (
    <main>
      <PageHero
        title="Dự án thực tế"
        accent="& Tin tức hữu ích"
        description="Khám phá các hạng mục dịch vụ và chia sẻ thiết thực, giúp bạn sử dụng thiết bị điện lạnh hiệu quả hơn."
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content">
        <Showcase />
        <ServiceArea />
      </div>
    </main>
  );
}
