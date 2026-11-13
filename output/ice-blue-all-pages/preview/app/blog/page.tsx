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
    <main className="mn-reference-page mn-news-page">
      <PageHero
        showEyebrow={false}
        title="Cách dùng, vệ sinh"
        accent="và nhận biết lỗi máy"
        description="Các bài viết về máy lạnh, máy giặt và tủ lạnh: khi nào cần vệ sinh, lỗi nào thường gặp và lúc nào nên gọi thợ."
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content">
        <section className="mn-tone-section mn-tone-light" aria-label="Kiến thức điện lạnh">
          <Showcase key="news" initialTab="news" />
        </section>
      </div>
    </main>
  );
}
