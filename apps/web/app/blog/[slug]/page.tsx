import { HeroWords } from '@/components/home-ice-blue/hero-words';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Share2 } from 'lucide-react';
import { getArticleSections, getWebsiteContent } from '@/lib/content/website-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { PageHeroAtmosphere } from '@/components/redesign/page-hero-atmosphere';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl, buildMetadata } from '@/lib/seo/metadata';
import { blogContent } from '@/lib/content/blog-content';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts } = await getWebsiteContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  const postImage = post.image;
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: postImage,
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts } = await getWebsiteContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const postImage = post.image;

  const { services, categories } = await getWebsiteContent();
  const category = categories.find((item) => item.slug === post.category);
  const sections = getArticleSections(post);
  const relatedServices = Object.entries(blogContent).find(([key]) => key === slug)?.[1].services ?? [];
  const relatedPosts = posts.filter((item) => item.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 4);

  return (
    <main className="mn-editorial">
      <section className="mn-container mn-editorial-hero mn-panel" data-u216-hero>
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
                  data-u216="badge"
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-2 text-xs font-black uppercase text-primary"
                >
                  <CalendarDays className="h-4 w-4" />
                  {category.name}
                </Link>
              ) : null}
              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-[1.08] tracking-normal sm:text-5xl" aria-label={post.title}>
                <HeroWords text={post.title} />
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700" data-u216="description">{post.excerpt}</p>
            </div>
            <div className="relative aspect-[16/11] min-h-[210px] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200" data-u216="art">
              <LoadingImage loading="eager"
                src={postImage}
                alt={post.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 420px, 100vw"
              />
              <PageHeroAtmosphere mode="aurora-ribbons" />
            </div>
          </div>
        </div>
      </section>

      <section className="mn-container mn-editorial-layout mn-tone-section mn-tone-light">
        <aside className="mn-editorial-toc text-sm text-slate-600" data-reveal="">
          <p className="font-black text-slate-950">Mục lục</p>
          {sections.map(section => (
            <a key={section.id} className="mt-3 block transition hover:text-primary" href={`#${section.id}`}>{section.title}</a>
          ))}
        </aside>

        <article className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-8" data-reveal="" style={{ '--d': '0.08s' } as React.CSSProperties}>
          <p className="text-sm text-slate-600">Thông tin từ <Link href="/about" className="underline">Điện Lạnh Minh Nhật</Link>. Hướng dẫn nhận biết ban đầu; kết luận sửa chữa cần kiểm tra thiết bị thực tế và đối chiếu tài liệu đúng model.</p>
          {sections.map(section => (
            <section key={section.id}>
              <h2 id={section.id} className="mt-10 scroll-mt-36 text-2xl font-black">{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-3 leading-8 text-slate-700">{paragraph}</p>)}
            </section>
          ))}
          <nav aria-label="Dịch vụ liên quan đến bài viết" className="mt-8 grid gap-3">
            <h2 className="text-xl font-bold">Cần hỗ trợ tại Cần Thơ?</h2>
            {relatedServices.map(slug => {
              const service = services.find(item => item.slug === slug);
              return service ? <Link key={slug} href={`/services/${slug}`} className="mn-text-link">{service.title} tại Cần Thơ →</Link> : null;
            })}
          </nav>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl(`/blog/${slug}`))}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ Facebook
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              href={`https://zalo.me/share?u=${encodeURIComponent(absoluteUrl(`/blog/${slug}`))}`}
              target="_blank"
              rel="noreferrer"
            >
              <Share2 className="h-4 w-4" />
              Chia sẻ Zalo
            </a>
          </div>
        </article>

        <aside className="min-w-0" data-reveal="" style={{ '--d': '0.16s' } as React.CSSProperties}>
          <p className="font-black">Bài liên quan</p>
          <div className="mt-3 grid gap-3">
            {relatedPosts.map((item, index) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                data-reveal=""
                style={{ '--d': `${(index % 4) * 0.08}s` } as React.CSSProperties}
                className="group grid grid-cols-[82px_1fr] gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm shadow-sm transition hover:border-primary/40"
              >
                <span className="relative h-20 overflow-hidden rounded-md bg-slate-100">
                  <LoadingImage loading="eager"
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
        data={articleJsonLd(post.title, post.excerpt, postImage, `/blog/${post.slug}`)}
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
