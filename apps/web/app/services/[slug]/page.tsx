import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronRight, ClipboardCheck, Wrench } from 'lucide-react';
import { BLOG_POSTS, SERVICES, findService, findServiceContent } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata, localTitle } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  const content = findServiceContent(slug);
  if (!service || !content) return {};
  return buildMetadata({
    title: localTitle(service.name),
    description: content.heroDescription,
    path: `/services/${slug}`,
    image: `/images/services/${slug}.jpg`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  const content = findServiceContent(slug);
  if (!service || !content) notFound();

  const relatedServices = SERVICES.filter((item) => item.slug !== slug).slice(0, 3);
  const relatedPosts = content.relatedBlogSlugs
    .map((postSlug) => BLOG_POSTS.find((post) => post.slug === postSlug))
    .filter((post): post is (typeof BLOG_POSTS)[number] => Boolean(post));

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#0b172a] py-12 text-white sm:py-16">
        <LoadingImage
          src="/images/service-tools.png"
          alt="Dụng cụ sửa chữa điện lạnh"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
          reveal="filter"
        />
        <div className="absolute inset-0 bg-[#0b172a]/55" />
        <div className="container relative grid min-w-0 gap-8 lg:grid-cols-[1fr_390px] lg:items-center lg:gap-10">
          <div className="min-w-0 animate-in-soft">
            <nav aria-label="Điều hướng" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-300">
                <li>
                  <Link className="transition hover:text-white" href="/">
                    Trang chủ
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li>
                  <Link className="transition hover:text-white" href="/services">
                    Dịch vụ
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li className="text-white" aria-current="page">
                  {service.name}
                </li>
              </ol>
            </nav>
            <p className="inline-flex max-w-full items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-black text-sky-100 sm:px-4 sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span className="min-w-0 break-words">Dịch vụ tận nơi tại Cần Thơ</span>
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.08] sm:text-5xl lg:text-6xl">
              {service.name} tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              {content.heroDescription}
            </p>
          </div>
          <aside className="glass-panel min-w-0 rounded-md p-4 text-slate-950 sm:p-5">
            <h2 className="text-xl font-black">Đặt lịch dịch vụ</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Chọn thời gian phù hợp, đội kỹ thuật sẽ xác nhận.
            </p>
            <div className="mt-4">
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </section>

      <section className="container grid min-w-0 gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_360px] lg:gap-10">
        <article className="min-w-0">
          <p className="text-sm font-black uppercase tracking-wide text-primary">
            Thông tin dịch vụ
          </p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Khi nào cần {service.name.toLocaleLowerCase('vi-VN')}?
          </h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
            {content.overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <section className="rounded-md border border-slate-200 bg-slate-50 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cyan-100 text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-black">Dấu hiệu và nhu cầu thường gặp</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {content.requestSigns.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <Wrench className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-black">Hạng mục kiểm tra và xử lý</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {content.workItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <h2 className="mt-10 text-2xl font-black">Quy trình tiếp nhận minh bạch</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Ghi nhận hiện trạng',
                description: 'Tiếp nhận model, biểu hiện, địa chỉ và hình ảnh nếu có.',
              },
              {
                title: 'Kiểm tra và giải thích',
                description: 'Khoanh vùng nguyên nhân, nêu phần cần xử lý và lựa chọn phù hợp.',
              },
              {
                title: 'Xác nhận trước khi làm',
                description: 'Thông báo phương án cùng chi phí dự kiến để khách quyết định.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-md bg-slate-50 p-4 sm:p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black">
            Hỏi đáp về {service.name.toLocaleLowerCase('vi-VN')}
          </h2>
          <div className="mt-4 grid gap-4">
            {content.faqs.map((faq) => (
              <details
                key={faq.question}
                className="faq-disclosure group rounded-md border border-slate-200 bg-white p-4 open:border-primary/30 open:bg-cyan-50/40"
              >
                <summary className="cursor-pointer list-none pr-8 font-black marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>

          {relatedPosts.length ? (
            <section className="mt-10">
              <h2 className="text-2xl font-black">Hướng dẫn liên quan</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-md border border-slate-200 p-4 transition hover:border-primary/40 hover:shadow-sm"
                  >
                    <h3 className="font-black leading-6 group-hover:text-primary">{post.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-primary">
                      Đọc hướng dẫn
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
        <aside className="h-fit min-w-0 space-y-5 lg:sticky lg:top-24">
          <section className="rounded-md border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h2 className="text-xl font-black">Chuẩn bị trước khi đặt lịch</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {content.beforeVisit.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Gửi yêu cầu kiểm tra
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="text-lg font-black">Dịch vụ khác</h2>
            <div className="mt-3 grid gap-2">
              {relatedServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-3 text-sm font-bold transition hover:bg-cyan-50 hover:text-primary"
                >
                  {item.name}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary"
            >
              Xem toàn bộ dịch vụ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </section>
      <JsonLdScript
        data={serviceJsonLd(
          service.name,
          `/services/${service.slug}`,
          `/images/services/${service.slug}.jpg`,
        )}
      />
      <JsonLdScript data={faqJsonLd(content.faqs)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
    </main>
  );
}
