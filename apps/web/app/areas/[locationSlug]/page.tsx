import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, MapPin } from 'lucide-react';
import { PRIORITY_DISTRICTS, SERVICES, findDistrict } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
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
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white lg:py-20">
        <Image
          src={ward.image}
          alt={`Dịch vụ điện lạnh tại ${ward.name}, Cần Thơ`}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(2_6_23)_0%,rgb(2_6_23_/_0.88)_45%,rgb(2_6_23_/_0.38)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              <MapPin className="h-4 w-4" />
              Phường mới sau sắp xếp hành chính 2025
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal sm:text-6xl">
              Dịch vụ điện lạnh tại {ward.name}
            </h1>
            <p className="mt-4 inline-flex rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100 backdrop-blur">
              Khu vực nhận lịch: {ward.highlight}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Minh Nhật hỗ trợ sửa chữa, vệ sinh, tháo lắp và nạp gas máy lạnh tại {ward.name},
              Cần Thơ. Khách hàng chọn dịch vụ, gửi lịch hẹn và được gọi xác nhận trước khi kỹ
              thuật viên đến.
            </p>
          </div>
          <aside className="rounded-md border border-white/20 bg-white/95 p-5 text-slate-950 shadow-2xl shadow-slate-950/30">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-black">Đặt lịch tại {ward.name}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Gửi thông tin cơ bản để đội kỹ thuật liên hệ xác nhận lịch.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </section>

      <section className="container grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-primary">Khu vực phục vụ</p>
            <h2 className="mt-2 text-2xl font-black">Ưu tiên tiếp nhận lịch tại {ward.name}</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Ninh Kiều, Cái Răng, Bình Thủy và Ô Môn hiện được trình bày theo cấp phường để phù
              hợp với dữ liệu hành chính mới. URL cũ vẫn được giữ ổn định để khách hàng và công cụ
              tìm kiếm không bị gián đoạn.
            </p>
          </div>

          <h2 className="mt-8 text-2xl font-black">Dịch vụ có sẵn</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/areas/${ward.slug}/${service.slug}`}
                className="group rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="font-black">
                    {service.name} tại {ward.name}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Các phường ưu tiên</h2>
          <div className="mt-4 grid gap-3">
            {PRIORITY_DISTRICTS.map((item) => (
              <Link
                key={item.slug}
                href={`/areas/${item.slug}/sua-may-lanh`}
                className="group relative min-h-24 overflow-hidden rounded-md border border-slate-200 bg-slate-900 p-4 text-white"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover opacity-55 transition group-hover:scale-105" sizes="320px" />
                <span className="absolute inset-0 bg-slate-950/45" />
                <span className="relative block">
                  <span className="flex items-center justify-between gap-3 font-black">
                    {item.name}
                    <ArrowRight className="h-4 w-4 text-cyan-200" />
                  </span>
                  <span className="mt-1 block text-xs font-bold text-cyan-100">{item.highlight}</span>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
