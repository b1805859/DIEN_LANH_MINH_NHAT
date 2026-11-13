import { getWebsiteContent } from '@/lib/content/website-content';
import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { buildMetadata } from '@/lib/seo/metadata';
import styles from './blog-hero.module.css';

export const metadata = buildMetadata({
  title: 'Tin tức & Kiến thức điện lạnh',
  description: 'Kiến thức máy lạnh, máy giặt, tủ lạnh và điện nước dành cho gia đình tại Cần Thơ.',
  path: '/blog',
});
export default async function BlogPage() {
  const { posts, categories } = await getWebsiteContent();
  return (
    <main className="mn-reference-page mn-news-page">
      <PageHero
        showEyebrow={false}
        showAtmosphere={false}
        title="Kiến thức"
        accent="điện lạnh"
        description="Cách dùng, vệ sinh và nhận biết lỗi máy lạnh, máy giặt, tủ lạnh."
        image="/images/redesign/blog-home-appliances.webp"
        imageAlt=""
        className={styles.hero}
      />
      <div className="mn-container mn-projects-content">
        <section className={`mn-tone-section mn-tone-light ${styles.listing}`} aria-label="Kiến thức điện lạnh">
          <Showcase posts={posts} categories={categories} key="news" initialTab="news" showTabs={false} />
        </section>
      </div>
    </main>
  );
}
