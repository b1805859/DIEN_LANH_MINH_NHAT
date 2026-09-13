import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { LoadingImage } from '@/components/ui/loading-image';
import { Reveal } from '@/components/ui/reveal';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Bài viết điện lạnh Cần Thơ',
  description:
    'Kiến thức sử dụng, vệ sinh và nhận biết lỗi máy lạnh, máy giặt, tủ lạnh, điện nước dành cho gia đình tại Cần Thơ.',
  path: '/blog',
});

export default function BlogPage() {
  const featuredPost = BLOG_POSTS[0];
  const posts = BLOG_POSTS.slice(1);

  return (
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-[#0b172a] py-12 text-white sm:py-16 lg:py-20">
        <LoadingImage
          src="/images/service-tools.png"
          alt="Dụng cụ điện lạnh Minh Nhật"
          fill
          priority
          className="object-cover opacity-[0.34]"
          sizes="100vw"
          reveal="filter"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_23_42_/_0.86)_0%,rgb(11_23_42_/_0.72)_48%,rgb(11_23_42_/_0.32)_100%)]" />
        <div className="container relative">
          <p className="inline-flex max-w-full items-center gap-2 rounded-md border border-cyan-200/20 bg-white/10 px-3 py-2 text-xs font-black text-cyan-50 backdrop-blur sm:px-4 sm:text-sm">
            <BookOpen className="h-4 w-4 text-amber-300" />
            Kinh nghiệm điện lạnh
          </p>
          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.08] tracking-normal sm:text-5xl lg:text-6xl">
            Bài viết điện lạnh cho gia đình tại Cần Thơ
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            Tổng hợp dấu hiệu hư hỏng, lịch bảo trì và cách sử dụng thiết bị điện lạnh an toàn hơn
            trước khi cần gọi kỹ thuật viên.
          </p>
        </div>
      </section>

      <section className="container py-10 sm:py-12 lg:py-16">
        <div className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((category, index) => (
            <Reveal key={category.slug} asChild delay={Math.min(index, 4) * 55}>
              <Link
                href={`/blog/category/${category.slug}`}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              >
                {category.name}
              </Link>
            </Reveal>
          ))}
        </div>

        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group mt-8 grid min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="relative min-h-[220px] overflow-hidden bg-slate-100 sm:min-h-[280px]">
            <LoadingImage
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-center p-6 lg:p-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-cyan-50 px-3 py-2 text-xs font-black uppercase text-primary">
              <CalendarDays className="h-4 w-4" />
              Bài nổi bật
            </span>
            <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
              {featuredPost.title}
            </h2>
            <p className="mt-3 leading-7 text-slate-600">{featuredPost.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
              Đọc bài viết
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} asChild delay={Math.min(index, 4) * 55}>
              <Link
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <LoadingImage
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-black leading-6">{post.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:min-h-[4.5rem]">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
