import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
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
    title: `Bài viết ${category.name}`,
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
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white py-10 sm:py-12">
        <div className="container">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-black text-primary">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Tất cả bài viết
          </Link>
          <h1 className="mt-5 text-3xl font-black tracking-normal sm:text-4xl">Bài viết {category.name}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Các hướng dẫn và dấu hiệu cần chú ý liên quan đến {category.name.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-black leading-6">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 sm:min-h-[4.5rem]">{post.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                  Đọc bài viết
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
