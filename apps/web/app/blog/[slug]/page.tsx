import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, findBlogPost } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
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
    description: `Hướng dẫn thực tế: ${post.title}.`,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="container grid gap-10 py-12 lg:grid-cols-[220px_1fr_280px]">
      <aside className="hidden text-sm text-slate-600 lg:block">
        <p className="font-semibold text-slate-950">Mục lục</p>
        <a className="mt-3 block" href="#dau-hieu">
          Dấu hiệu
        </a>
        <a className="mt-2 block" href="#xu-ly">
          Cách xử lý
        </a>
      </aside>
      <article>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="mt-4 text-slate-700">
          Bài viết cung cấp hướng dẫn thực tế cho khách hàng tại Cần Thơ, giúp nhận biết vấn đề
          và chọn thời điểm gọi kỹ thuật viên.
        </p>
        <h2 id="dau-hieu" className="mt-10 text-2xl font-semibold">
          Dấu hiệu cần chú ý
        </h2>
        <p className="mt-3 text-slate-700">
          Thiết bị giảm hiệu suất, phát tiếng ồn, rò nước, báo lỗi hoặc tiêu thụ điện bất thường
          là các dấu hiệu nên kiểm tra sớm.
        </p>
        <h2 id="xu-ly" className="mt-10 text-2xl font-semibold">
          Cách xử lý an toàn
        </h2>
        <p className="mt-3 text-slate-700">
          Ngắt nguồn khi có dấu hiệu nguy hiểm, ghi nhận hiện tượng và liên hệ kỹ thuật viên để
          được kiểm tra đúng quy trình.
        </p>
        <div className="mt-8 flex gap-3 text-sm">
          <a className="rounded-md border px-3 py-2" href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${slug}`}>
            Chia sẻ Facebook
          </a>
          <a className="rounded-md border px-3 py-2" href={`https://zalo.me/share?u=/blog/${slug}`}>
            Chia sẻ Zalo
          </a>
        </div>
      </article>
      <aside>
        <p className="font-semibold">Bài liên quan</p>
        <div className="mt-3 grid gap-3">
          {BLOG_POSTS.filter((item) => item.slug !== slug)
            .slice(0, 4)
            .map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-md border p-3 text-sm">
                {item.title}
              </Link>
            ))}
        </div>
      </aside>
      <JsonLdScript data={articleJsonLd(post.title, `/blog/${post.slug}`)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </main>
  );
}

