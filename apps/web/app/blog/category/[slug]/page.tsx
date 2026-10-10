import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { PageHero } from '@/components/redesign/ui';
import { Showcase } from '@/components/redesign/showcase';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteContent } from '@/lib/content/site-content';
export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    ...buildMetadata({
      title: `Bài viết ${category.name}`,
      description: `Kiến thức sử dụng và bảo trì ${category.name.toLowerCase()}.`,
      path: `/blog/category/${slug}`,
    }),
    ...(!BLOG_POSTS.some((p) => p.category === slug)
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <main>
      <PageHero
        title="Kiến thức điện lạnh"
        accent={category.name}
        description={`Kinh nghiệm sử dụng, bảo trì và nhận biết lỗi ${category.name.toLowerCase()}.`}
        image={siteContent.images.editorial}
      />
      <div className="mn-container mn-projects-content">
        <Showcase initialTab="news" initialCategory={slug} />
      </div>
    </main>
  );
}
