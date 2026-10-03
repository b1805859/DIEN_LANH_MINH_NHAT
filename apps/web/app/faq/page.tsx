import Link from 'next/link';
import { ArrowRight, ChevronRight, CircleHelp } from 'lucide-react';
import { FAQS, SERVICES } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { Reveal } from '@/components/ui/reveal';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Hỏi đáp dịch vụ điện lạnh Cần Thơ',
  description:
    'Giải đáp cách đặt lịch, chuẩn bị thông tin và xử lý an toàn khi máy lạnh, máy giặt, tủ lạnh hoặc điện nước gặp sự cố.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <main className="public-page bg-[#f4f8fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
        <div className="container">
          <nav aria-label="Điều hướng">
            <ol className="flex items-center gap-1 text-sm text-slate-500">
              <li>
                <Link className="transition hover:text-primary" href="/">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-slate-950" aria-current="page">
                Hỏi đáp
              </li>
            </ol>
          </nav>
          <span className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-primary">
            <CircleHelp className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-normal sm:text-5xl">
            Câu hỏi thường gặp
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Thông tin giúp khách hàng tại Cần Thơ chuẩn bị trước khi đặt lịch, nhận biết tình huống
            cần dừng thiết bị và hiểu rõ hơn bước kiểm tra ban đầu.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <h2 className="text-2xl font-black">Đặt lịch và xử lý ban đầu</h2>
          <div className="mt-5 grid gap-4">
            {FAQS.map((faq, index) => (
              <Reveal key={faq.question} asChild delay={Math.min(index, 4) * 55}>
                <details className="faq-disclosure group rounded-xl border border-slate-200 bg-white p-4 shadow-sm open:border-primary/30 open:bg-cyan-50/40 sm:p-5">
                  <summary className="cursor-pointer list-none pr-8 font-black marker:content-none">
                    {faq.question}
                  </summary>
                  <p className="mt-3 leading-7 text-slate-700">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
          <h2 className="text-xl font-black">Tra cứu theo thiết bị</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mỗi trang có phần hỏi đáp riêng, dấu hiệu cần kiểm tra và lưu ý an toàn theo dịch vụ.
          </p>
          <div className="mt-4 grid gap-2">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold transition hover:bg-cyan-50 hover:text-primary"
              >
                {service.name}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            Gửi câu hỏi cụ thể
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
      <JsonLdScript data={faqJsonLd()} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Hỏi đáp', path: '/faq' },
        ])}
      />
    </main>
  );
}
