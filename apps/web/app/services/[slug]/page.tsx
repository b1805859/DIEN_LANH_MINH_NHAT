import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { FAQS, SERVICES, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata, localTitle } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return buildMetadata({
    title: localTitle(service.name),
    description: `${service.name} chuyên nghiệp tại Cần Thơ, đặt lịch nhanh và báo giá rõ ràng.`,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#0b172a] py-12 text-white sm:py-16">
        <Image
          src="/images/service-tools.png"
          alt="Dụng cụ sửa chữa điện lạnh"
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0b172a]/55" />
        <div className="container relative grid min-w-0 gap-8 lg:grid-cols-[1fr_390px] lg:items-center lg:gap-10">
          <div className="min-w-0 animate-in-soft">
            <p className="inline-flex max-w-full items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-black text-sky-100 sm:px-4 sm:text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span className="min-w-0 break-words">Dịch vụ tận nơi tại Cần Thơ</span>
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.08] sm:text-5xl lg:text-6xl">
              {service.name} tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Quy trình rõ ràng, báo giá trước khi thực hiện và hỗ trợ nhanh cho khách tại Cần Thơ.
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
          <h2 className="text-2xl font-black">Lợi ích</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {['Kiểm tra kỹ', 'Báo giá rõ', 'Hỗ trợ nhanh'].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 p-4 sm:p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-black">{item}</h3>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black">Hỏi đáp</h2>
          <div className="mt-4 grid gap-4">
            {FAQS.map((faq) => (
              <section key={faq.question} className="rounded-md border border-slate-200 p-4">
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </section>
            ))}
          </div>
        </article>
        <aside className="h-fit min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <h2 className="text-xl font-black">Tư vấn nhanh</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mô tả tình trạng thiết bị để được tư vấn hướng xử lý và chi phí tham khảo.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white sm:w-auto"
          >
            Nhận báo giá
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
      <JsonLdScript data={serviceJsonLd(service.name, `/services/${service.slug}`)} />
      <JsonLdScript data={faqJsonLd()} />
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
