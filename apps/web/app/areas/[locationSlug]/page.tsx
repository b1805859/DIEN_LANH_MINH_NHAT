import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, MapPin } from 'lucide-react';
import { PRIORITY_DISTRICTS, SERVICES, findDistrict } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { LoadingImage } from '@/components/ui/loading-image';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return PRIORITY_DISTRICTS.map((ward) => ({ locationSlug: ward.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) return {};

  return buildMetadata({
    title: `Dịch vụ điện lạnh ${ward.name}, Cần Thơ`,
    description: `Dịch vụ điện lạnh và sửa chữa tận nơi tại ${ward.name}, Cần Thơ.`,
    path: `/areas/${locationSlug}`,
  });
}

export default async function WardPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) notFound();

  return (
    <main className="bg-[#f4f8fb]">
      <section className="relative overflow-hidden bg-[#0b172a] py-16 text-white lg:py-20">
        <LoadingImage
          src={ward.image}
          alt={`Dịch vụ điện lạnh tại ${ward.name}, Cần Thơ`}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
          reveal="filter"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_23_42)_0%,rgb(11_23_42_/_0.82)_45%,rgb(11_23_42_/_0.32)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              <MapPin className="h-4 w-4" />
              Khu vực phục vụ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal sm:text-6xl">
              Dịch vụ điện lạnh tại {ward.name}
            </h1>
            <p className="mt-4 inline-flex rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100 backdrop-blur">
              Khu vực nhận lịch: {ward.highlight}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Minh Nhật hỗ trợ sửa chữa, vệ sinh, tháo lắp và nạp gas máy lạnh tại {ward.name}, Cần
              Thơ.
            </p>
          </div>

          <aside className="rounded-md border border-white/20 bg-white/95 p-5 text-slate-950 shadow-2xl shadow-slate-950/30">
            <div className="flex items-start gap-3">
              <span className="rounded-md bg-cyan-100 p-3 text-primary">
                <CalendarCheck className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-black">Đặt lịch tại {ward.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Gửi thông tin, đội kỹ thuật sẽ gọi lại xác nhận.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <BookingForm />
            </div>
          </aside>
        </div>
      </section>

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              Dịch vụ tại {ward.name}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
              Chọn hạng mục cần hỗ trợ
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-black text-primary"
          >
            Xem tất cả dịch vụ
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/areas/${ward.slug}/${service.slug}`}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <h3 className="text-lg font-black">{service.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Hỗ trợ tận nơi tại {ward.name}, báo giá trước khi làm.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                Xem chi tiết
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
