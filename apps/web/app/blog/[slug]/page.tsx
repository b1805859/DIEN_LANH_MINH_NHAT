import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Share2 } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS, findBlogPost } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();

  const category = BLOG_CATEGORIES.find((item) => item.slug === post.category);
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 4);

  return (
    <main className="mn-editorial">
      <section className="mn-container mn-editorial-hero mn-panel">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-black text-primary"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Bài viết
          </Link>
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-8">
            <div className="min-w-0">
              {category ? (
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-2 text-xs font-black uppercase text-primary"
                >
                  <CalendarDays className="h-4 w-4" />
                  {category.name}
                </Link>
              ) : null}
              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.08] tracking-normal sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">{post.excerpt}</p>
            </div>
            <div className="relative aspect-[16/11] min-h-[210px] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200">
              <LoadingImage
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 420px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mn-container mn-editorial-layout mn-tone-section mn-tone-light">
        <aside className="mn-editorial-toc text-sm text-slate-600">
          <p className="font-black text-slate-950">Mục lục</p>
          <a className="mt-3 block transition hover:text-primary" href="#dau-hieu">
            Dấu hiệu
          </a>
          <a className="mt-2 block transition hover:text-primary" href="#xu-ly">
            Cách xử lý
          </a>
        </aside>

        <article className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-8">
          <p className="leading-8 text-slate-700">
            Khi thiết bị có dấu hiệu khác thường, bạn nên ghi lại hiện tượng và mã lỗi nếu có.
            Những thông tin dưới đây giúp bạn nhận biết ban đầu. Với lỗi điện, gas hoặc rò nước,
            hãy để thợ kiểm tra bằng dụng cụ chuyên dụng.
          </p>

          <h2 id="dau-hieu" className="mt-10 text-2xl font-black">
            Dấu hiệu cần chú ý
          </h2>
          <p className="mt-3 leading-8 text-slate-700">
            Máy chạy yếu hơn trước, kêu lớn, rò nước, báo lỗi hoặc tốn điện hơn là những dấu hiệu
            cần kiểm tra. Nếu tình trạng lặp lại, bạn nên gọi thợ để tìm nguyên nhân.
          </p>

          <h2 id="xu-ly" className="mt-10 text-2xl font-black">
            Cách xử lý an toàn
          </h2>
          <p className="mt-3 leading-8 text-slate-700">
            Ngắt nguồn khi có dấu hiệu nguy hiểm, ghi nhận hiện tượng và liên hệ kỹ thuật viên để
            được kiểm tra đúng quy trình. Không tự tháo máy nếu không có dụng cụ bảo hộ hoặc chưa
            biết vị trí nguồn điện, đường nước, đường gas.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl(`/blog/${slug}`))}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ Facebook
            </a>
            <a
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              href={`https://zalo.me/share?u=${encodeURIComponent(absoluteUrl(`/blog/${slug}`))}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ Zalo
            </a>
          </div>
        </article>

        <aside className="min-w-0">
          <p className="font-black">Bài liên quan</p>
          <div className="mt-3 grid gap-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group grid grid-cols-[82px_1fr] gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm shadow-sm transition hover:border-primary/40"
              >
                <span className="relative h-20 overflow-hidden rounded-md bg-slate-100">
                  <LoadingImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="82px"
                  />
                </span>
                <span className="font-bold leading-5 text-slate-800 group-hover:text-primary">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <JsonLdScript
        data={articleJsonLd(post.title, post.excerpt, post.image, `/blog/${post.slug}`)}
      />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Bài viết', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </main>
  );
}
