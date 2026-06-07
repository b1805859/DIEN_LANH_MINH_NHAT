import Link from 'next/link';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Blog điện lạnh Cần Thơ',
  description: 'Kiến thức máy lạnh, máy giặt, tủ lạnh, điện nước và tiết kiệm điện.',
  path: '/blog',
});

export default function BlogPage() {
  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold">Blog điện lạnh</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {BLOG_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}`}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-md border p-5">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">Có mục lục, bài liên quan và metadata SEO.</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

