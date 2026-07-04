import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ClipboardList, MapPin, Wallet } from 'lucide-react';
import { PRIORITY_DISTRICTS, SERVICES, findDistrict, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return SERVICES.flatMap((service) =>
    PRIORITY_DISTRICTS.map((ward) => ({
      serviceSlug: service.slug,
      locationSlug: ward.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string; serviceSlug: string }>;
}) {
  const { locationSlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) return {};

  return buildMetadata({
    title: `${service.name} tại ${ward.name}, Cần Thơ`,
    description: `${service.name} tại ${ward.name}, Cần Thơ. Báo giá rõ ràng, đặt lịch nhanh, hỗ trợ tận nơi.`,
    path: `/areas/${locationSlug}/${serviceSlug}`,
  });
}

export default async function ServiceWardPage({
  params,
}: {
  params: Promise<{ locationSlug: string; serviceSlug: string }>;
}) {
  const { locationSlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) notFound();

  const highlights = [
    {
      icon: CheckCircle2,
      title: 'Tiếp nhận nhanh',
      desc: 'Gọi lại xác nhận nhu cầu, địa chỉ và khung giờ trước khi đến.',
    },
    {
      icon: ClipboardList,
      title: 'Kiểm tra rõ',
      desc: 'Đánh giá tình trạng thiết bị rồi báo phương án xử lý phù hợp.',
    },
    {
      icon: Wallet,
      title: 'Báo giá trước',
      desc: 'Khách đồng ý chi phí rồi kỹ thuật viên mới tiến hành thi công.',
    },
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-[#0b172a] py-16 text-white lg:py-20">
        <LoadingImage
          src={ward.image}
          alt={`${service.name} tại ${ward.name}`}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
          reveal="filter"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_23_42)_0%,rgb(11_23_42_/_0.8)_45%,rgb(11_23_42_/_0.32)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              <MapPin className="h-4 w-4" />
              {ward.name}, Cần Thơ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal sm:text-6xl">
              {service.name} tại {ward.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Minh Nhật hỗ trợ kiểm tra, tư vấn và thi công tận nơi tại {ward.highlight}. Khách hàng
              gửi lịch hẹn để đội kỹ thuật xác nhận trước khi đến.
            </p>
          </div>

          <aside className="rounded-md border border-white/20 bg-white/95 p-5 text-slate-950 shadow-2xl shadow-slate-950/30">
            <h2 className="text-xl font-black">Đặt lịch tại {ward.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Gửi thông tin để kỹ thuật viên xác nhận thời gian phù hợp.
            </p>
            <div className="mt-5">
              <BookingForm />
            </div>
          </aside>
        </div>
      </section>

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>

        <Link
          href="/services"
          className="mt-8 inline-flex items-center gap-2 text-sm font-black text-primary"
        >
          Xem tất cả dịch vụ
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <JsonLdScript
        data={serviceJsonLd(
          `${service.name} tại ${ward.name}`,
          `/areas/${ward.slug}/${service.slug}`,
        )}
      />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
          { name: ward.name, path: `/areas/${ward.slug}` },
          { name: service.name, path: `/areas/${ward.slug}/${service.slug}` },
        ])}
      />
    </main>
  );
}
