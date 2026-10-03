import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, ChevronRight, ShieldAlert, UserRound } from 'lucide-react';
import {
  APP_NAME,
  BLOG_CATEGORIES,
  BLOG_POSTS,
  findBlogArticleContent,
  findBlogPost,
  findService,
} from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

function formatDisplayDate(value: string) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

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
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  const article = findBlogArticleContent(slug);
  if (!post || !article) notFound();

  const category = BLOG_CATEGORIES.find((item) => item.slug === post.category);
  const sameCategoryPosts = BLOG_POSTS.filter(
    (item) => item.slug !== slug && item.category === post.category,
  );
  const otherPosts = BLOG_POSTS.filter(
    (item) => item.slug !== slug && item.category !== post.category,
  );
  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 4);
  const relatedServices = article.relatedServiceSlugs
    .map((serviceSlug) => findService(serviceSlug))
    .filter((service): service is NonNullable<ReturnType<typeof findService>> => Boolean(service));

  return (
    <main className="public-page bg-[#f4f8fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="container">
          <nav aria-label="Điều hướng">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
              <li>
                <Link className="transition hover:text-primary" href="/">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/blog">
                  Bài viết
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden="true">
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li>
                    <Link
                      className="transition hover:text-primary"
                      href={`/blog/category/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="line-clamp-1 text-slate-950" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-8">
            <div className="min-w-0">
              {category ? (
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-black uppercase text-primary"
                >
                  <CalendarDays className="h-4 w-4" />
                  {category.name}
                </Link>
              ) : null}
              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.08] tracking-normal sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />
                  Biên soạn bởi {APP_NAME}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Cập nhật{' '}
                  <time dateTime={post.updatedAt}>{formatDisplayDate(post.updatedAt)}</time>
                </span>
              </div>
            </div>
            <div className="relative aspect-[16/11] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200">
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

      <section className="container grid min-w-0 gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[180px_minmax(0,1fr)_240px] lg:gap-10">
        <aside className="hidden text-sm text-slate-600 xl:block">
          <p className="font-black text-slate-950">Mục lục</p>
          {article.sections.map((section, index) => (
            <a
              key={section.id}
              className={`${index === 0 ? 'mt-3' : 'mt-2'} block transition hover:text-primary`}
              href={`#${section.id}`}
            >
              {section.title}
            </a>
          ))}
        </aside>

        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-8">
          <p className="border-l-4 border-primary pl-4 text-lg font-medium leading-8 text-slate-800">
            {article.lead}
          </p>

          <details className="my-6 rounded-xl border border-slate-200 p-4 xl:hidden">
            <summary className="cursor-pointer font-bold">Mục lục bài viết</summary>
            <nav aria-label="Mục lục bài viết" className="mt-3 grid gap-2">
              {article.sections.map((section) => (
                <a className="py-2 text-primary" key={section.id} href={`#${section.id}`}>
                  {section.title}
                </a>
              ))}
            </nav>
          </details>
          {article.sections.map((section, sectionIndex) => (
            <section key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={section.id} className="scroll-mt-24 pt-10 text-2xl font-black">
                <span id={`${section.id}-title`}>{section.title}</span>
              </h2>
              <div className="mt-3 space-y-4 leading-8 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-700">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {sectionIndex === 0 ? (
                <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                  <LoadingImage
                    src={post.image}
                    alt={`Minh họa cho nội dung ${section.title.toLocaleLowerCase('vi-VN')}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 720px, 100vw"
                  />
                </div>
              ) : null}
            </section>
          ))}

          {article.safetyNote ? (
            <aside className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />
                <div>
                  <h2 className="font-black text-amber-950">Lưu ý an toàn</h2>
                  <p className="mt-2 text-sm leading-6 text-amber-950/80">{article.safetyNote}</p>
                </div>
              </div>
            </aside>
          ) : null}

          {relatedServices.length ? (
            <section className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-black">Dịch vụ liên quan tại Cần Thơ</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {relatedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
                  >
                    {service.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="min-w-0">
          <p className="font-black">Bài liên quan</p>
          <div className="mt-3 grid gap-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group grid grid-cols-[82px_1fr] gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-sm transition hover:border-primary/40"
              >
                <span className="relative h-20 overflow-hidden rounded-xl bg-slate-100">
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
        data={articleJsonLd(post.title, post.excerpt, post.image, `/blog/${post.slug}`, {
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        })}
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
