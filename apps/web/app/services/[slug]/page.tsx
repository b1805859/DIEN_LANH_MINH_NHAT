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
            <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-black text-sky-100">
              <CheckCircle2 className="h-4 w-4" />
              Dịch vụ tận nơi tại Cần Thơ
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black sm:text-6xl">
              {service.name} tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Quy trình rõ ràng, báo giá trước khi thực hiện và hỗ trợ nhanh tại các phường ưu
              tiên: Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn.
            </p>
          </div>
          <aside className="glass-panel rounded-md p-5 text-slate-950">
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

      <section className="container grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <article>
          <h2 className="text-2xl font-black">Phường hỗ trợ ưu tiên</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Dữ liệu khu vực đã được cập nhật theo cách gọi mới sau sắp xếp hành chính: các khu vực
            trọng tâm hiện hiển thị là phường.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {PRIORITY_DISTRICTS.map((ward) => (
              <Link
                className="group relative min-h-[190px] overflow-hidden rounded-md border border-slate-200 bg-slate-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                key={ward.slug}
                href={`/areas/${ward.slug}/${service.slug}`}
              >
                <Image
                  src={ward.image}
                  alt={`${service.name} tại ${ward.name}`}
                  fill
                  className="object-cover opacity-70 transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute inset-0 bg-[linear-gradient(0deg,rgb(2_6_23_/_0.82)_0%,rgb(2_6_23_/_0.3)_100%)]" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 font-black">
                      <MapPin className="h-4 w-4 text-cyan-200" />
                      {ward.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-cyan-200 transition group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-sm text-slate-200">
                    {service.name} tại {ward.name}
                  </span>
                  <span className="mt-1 block text-xs font-bold uppercase text-cyan-100">
                    {ward.highlight}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black">Lợi ích</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {['Kiểm tra kỹ', 'Báo giá rõ', 'Hỗ trợ nhanh'].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 p-5">
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
        <aside className="h-fit rounded-md border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-black">Tư vấn nhanh</h2>
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
