import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Share2 } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS, findBlogPost } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

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
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== slug).slice(0, 4);

  return (
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="container">
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

      <section className="container grid min-w-0 gap-8 py-10 sm:py-12 lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:gap-10">
        <aside className="hidden text-sm text-slate-600 lg:block">
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
            Bài viết cung cấp hướng dẫn thực tế cho khách hàng tại Cần Thơ, giúp nhận biết vấn đề và
            chọn thời điểm gọi kỹ thuật viên phù hợp. Các dấu hiệu dưới đây chỉ nên dùng để tham
            khảo ban đầu, những lỗi liên quan điện, gas hoặc rò nước nên được kiểm tra bằng dụng cụ
            chuyên môn.
          </p>

          <h2 id="dau-hieu" className="mt-10 text-2xl font-black">
            Dấu hiệu cần chú ý
          </h2>
          <p className="mt-3 leading-8 text-slate-700">
            Thiết bị giảm hiệu suất, phát tiếng ồn, rò nước, báo lỗi hoặc tiêu thụ điện bất thường
            là các dấu hiệu nên kiểm tra sớm. Nếu tình trạng lặp lại nhiều lần, việc tiếp tục sử
            dụng có thể làm hư thêm linh kiện bên trong.
          </p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-md bg-slate-100">
            <LoadingImage
              src={post.image}
              alt={`Minh họa: ${post.title}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 720px, 100vw"
            />
          </div>

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
              href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${slug}`}
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ Facebook
            </a>
            <a
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              href={`https://zalo.me/share?u=/blog/${slug}`}
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
