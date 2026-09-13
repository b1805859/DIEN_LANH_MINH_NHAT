import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarCheck, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import {
  PRIORITY_DISTRICTS,
  SERVICES,
  findAreaContent,
  findDistrict,
  findServiceContent,
} from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { LoadingImage } from '@/components/ui/loading-image';
import { Reveal } from '@/components/ui/reveal';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return PRIORITY_DISTRICTS.map((ward) => ({ locationSlug: ward.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  const areaContent = findAreaContent(locationSlug);
  if (!ward || !areaContent) return {};

  return buildMetadata({
    title: `Dịch vụ điện lạnh ${ward.name}, Cần Thơ`,
    description: areaContent.metaDescription,
    path: `/areas/${locationSlug}`,
    image: ward.image,
  });
}

export default async function WardPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  const areaContent = findAreaContent(locationSlug);
  if (!ward || !areaContent) notFound();

  const otherAreas = PRIORITY_DISTRICTS.filter((item) => item.slug !== ward.slug);

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
                    Khu vực phục vụ
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li className="text-white" aria-current="page">
                  {ward.name}
                </li>
              </ol>
            </nav>
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
              {areaContent.overview[0]}
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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <article>
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              Phục vụ theo địa chỉ cụ thể
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
              Đặt lịch điện lạnh tại {ward.name}
            </h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-700">
              {areaContent.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
          <aside className="rounded-md border border-cyan-200 bg-cyan-50 p-5">
            <h2 className="text-xl font-black">Thông tin giúp xác nhận lịch</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {areaContent.bookingTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
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
          {SERVICES.map((service, index) => {
            const serviceContent = findServiceContent(service.slug);

            return (
              <Reveal key={service.slug} asChild delay={Math.min(index, 4) * 55}>
                <Link
                  href={`/areas/${ward.slug}/${service.slug}`}
                  className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <h3 className="text-lg font-black">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {serviceContent?.shortDescription ??
                      `Kiểm tra hiện trạng và tư vấn phương án tại ${ward.name}.`}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                    Xem tại {ward.shortName}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-xl font-black">Xem khu vực khác tại Cần Thơ</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherAreas.map((item) => (
              <Link
                key={item.slug}
                href={`/areas/${item.slug}`}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold transition hover:border-primary/40 hover:text-primary"
              >
                <MapPin className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      </section>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Khu vực phục vụ', path: '/services' },
          { name: ward.name, path: `/areas/${ward.slug}` },
        ])}
      />
    </main>
  );
}
