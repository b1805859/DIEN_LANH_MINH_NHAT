import { notFound } from 'next/navigation';
import { getWebsiteContent } from '@/lib/content/website-content';
import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/lib/content/site-content';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories, posts } = await getWebsiteContent();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    ...buildMetadata({
      title: `Bài viết ${category.name}`,
      description: category.description || `Kiến thức sử dụng và bảo trì ${category.name.toLowerCase()}.`,
      path: `/blog/category/${slug}`,
    }),
    ...(!posts.some((p) => p.category === slug)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories, posts } = await getWebsiteContent();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <main>
      <PageHero
        title="Kiến thức điện lạnh"
        accent={category.name}
        description={category.description || `Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi ${category.name.toLowerCase()}.`}
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content mn-tone-section mn-tone-light">
        <Showcase posts={posts} categories={categories} key={slug} initialTab="news" initialCategory={slug} showTabs={false} />
      </div>
    </main>
  );
}
