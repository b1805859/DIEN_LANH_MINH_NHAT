import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { FAQS, PRIORITY_DISTRICTS, SERVICES, findService } from '@minhnhat/shared';
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
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white">
        <Image
          src="/images/service-tools.png"
          alt="Dụng cụ sửa chữa điện lạnh"
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
              <CheckCircle2 className="h-4 w-4" />
              Dịch vụ tận nơi tại Cần Thơ
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold sm:text-6xl">
              {service.name} tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Quy trình rõ ràng, báo giá trước khi thực hiện và hỗ trợ nhanh tại các quận trọng điểm.
            </p>
          </div>
          <aside className="glass-panel rounded-md p-5 text-slate-950">
            <h2 className="text-xl font-semibold">Đặt lịch dịch vụ</h2>
            <p className="mt-1 text-sm text-slate-600">Chọn thời gian phù hợp, đội kỹ thuật sẽ xác nhận.</p>
            <div className="mt-4">
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </section>

      <section className="container grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <article>
          <h2 className="text-2xl font-semibold">Khu vực hỗ trợ</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PRIORITY_DISTRICTS.map((district) => (
              <Link
                className="group rounded-md border p-4 transition hover:border-primary hover:shadow-md"
                key={district.slug}
                href={`/areas/${district.slug}/${service.slug}`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {service.name} {district.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-semibold">Lợi ích</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {['Kiểm tra kỹ', 'Báo giá rõ', 'Hỗ trợ nhanh'].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">{item}</h3>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 grid gap-4">
            {FAQS.map((faq) => (
              <section key={faq.question} className="rounded-md border p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </section>
            ))}
          </div>
        </article>
        <aside className="h-fit rounded-md border bg-slate-50 p-5">
          <h2 className="text-xl font-semibold">Tư vấn nhanh</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mô tả tình trạng thiết bị để được tư vấn hướng xử lý và chi phí tham khảo.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
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

