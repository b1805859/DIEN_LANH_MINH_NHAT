import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);
  if (!category) return {};
  return buildMetadata({
    title: `Blog ${category.name}`,
    description: `Bài viết SEO về ${category.name} cho khách hàng tại Cần Thơ.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = BLOG_POSTS.filter((post) => post.category === slug);

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold">Blog {category.name}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-md border p-5">
            {post.title}
          </Link>
        ))}
      </div>
    </main>
  );
}

