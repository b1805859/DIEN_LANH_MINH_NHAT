import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Tin tức & Kiến thức điện lạnh',
  description: 'Kiến thức máy lạnh, máy giặt, tủ lạnh và điện nước dành cho gia đình tại Cần Thơ.',
  path: '/blog',
});
export default function BlogPage() {
  return (
    <main>
      <PageHero
        title="Dự án thực tế"
        accent="& Tin tức hữu ích"
        description="Chia sẻ kinh nghiệm bảo trì, nhận biết lỗi và sử dụng thiết bị điện lạnh trong gia đình."
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content">
        <Showcase initialTab="news" />
      </div>
    </main>
  );
}
