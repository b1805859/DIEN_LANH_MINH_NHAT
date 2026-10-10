import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MapPin,
  Wallet,
  Wrench,
} from 'lucide-react';
import {
  PRIORITY_DISTRICTS,
  SERVICES,
  findAreaContent,
  findDistrict,
  findService,
  findServiceContent,
} from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { LoadingImage } from '@/components/ui/loading-image';
import { Reveal } from '@/components/ui/reveal';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
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
  const serviceContent = findServiceContent(serviceSlug);
  const areaContent = findAreaContent(locationSlug);
  if (!service || !ward || !serviceContent || !areaContent) return {};

  const shortWardName = ward.name.replace(/^Phường\s+/u, '');
  const metadataServiceName =
    service.slug === 'sua-lap-may-nuoc-uong-nong-lanh'
      ? 'Sửa Lắp Máy Nước Uống'
      : service.slug === 'sua-lap-may-nuoc-nong-lanh-tam'
        ? 'Sửa Lắp Máy Nước Nóng'
        : service.name;

  return buildMetadata({
    title: `${metadataServiceName} tại ${shortWardName}, Cần Thơ`,
    description: areaContent.serviceNotes[service.slug] ?? serviceContent.heroDescription,
    path: `/areas/${locationSlug}/${serviceSlug}`,
    image: ward.image || `/images/services/${service.slug}.jpg`,
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
  const serviceContent = findServiceContent(serviceSlug);
  const areaContent = findAreaContent(locationSlug);
  if (!service || !ward || !serviceContent || !areaContent) notFound();

  const localServiceNote = areaContent.serviceNotes[service.slug] ?? serviceContent.heroDescription;
  const sameAreaServices = SERVICES.filter((item) => item.slug !== service.slug).slice(0, 4);
  const sameServiceAreas = PRIORITY_DISTRICTS.filter((item) => item.slug !== ward.slug);
  const localFaqs = [
    {
      question: `Khi đặt ${service.name.toLocaleLowerCase('vi-VN')} tại ${ward.name} cần gửi gì?`,
      answer: `${areaContent.bookingTips[0]} ${serviceContent.beforeVisit[0]}`,
    },
    ...serviceContent.faqs.slice(0, 2),
  ];

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
        {ward.image ? (
          <LoadingImage
            src={ward.image}
            alt={`${service.name} tại ${ward.name}`}
            fill
            priority
            className="object-cover opacity-55"
            sizes="100vw"
            reveal="filter"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_23_42)_0%,rgb(11_23_42_/_0.8)_45%,rgb(11_23_42_/_0.32)_100%)]" />
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
                  <Link className="transition hover:text-white" href={`/areas/${ward.slug}`}>
                    {ward.name}
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
            <p className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              <MapPin className="h-4 w-4" />
              {ward.name}, Cần Thơ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal sm:text-6xl">
              {service.name} tại {ward.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{localServiceNote}</p>
          </div>

          <aside className="rounded-xl border border-white/20 bg-white/95 p-5 text-slate-950 shadow-sm shadow-slate-950/30">
            <h2 className="text-xl font-black">Đặt lịch tại {ward.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Gửi thông tin để kỹ thuật viên xác nhận thời gian phù hợp.
            </p>
            <div className="mt-5">
              <BookingForm
                compact
                hideNotes
                serviceSlug={serviceSlug}
                locationSlug={locationSlug}
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              Kiểm tra theo hiện trạng
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Nội dung {service.name.toLocaleLowerCase('vi-VN')} tại {ward.shortName}
            </h2>
            <div className="mt-5 space-y-4 leading-8 text-slate-700">
              {serviceContent.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-black">Khi nào nên đặt kiểm tra?</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {serviceContent.requestSigns.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black">Phạm vi cần xem xét</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {serviceContent.workItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <aside className="h-fit rounded-xl border border-cyan-200 bg-cyan-50 p-5 lg:sticky lg:top-24">
            <h2 className="text-xl font-black">Lưu ý cho địa chỉ tại {ward.shortName}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{areaContent.overview[1]}</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {areaContent.bookingTips.map((tip) => (
                <li key={tip} className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/areas/${ward.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary"
            >
              Xem mọi dịch vụ tại {ward.shortName}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        <h2 className="mt-12 text-2xl font-black">Ba bước trước khi thực hiện</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc }, index) => (
            <Reveal key={title} asChild delay={Math.min(index, 4) * 55}>
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-black">
            Hỏi đáp về {service.name.toLocaleLowerCase('vi-VN')} tại {ward.shortName}
          </h2>
          <div className="mt-4 grid gap-3">
            {localFaqs.map((faq) => (
              <details
                key={faq.question}
                className="faq-disclosure rounded-xl border border-slate-200 bg-white p-4 open:border-primary/30 open:bg-cyan-50/40"
              >
                <summary className="cursor-pointer list-none pr-8 font-black marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 grid gap-6 border-t border-slate-200 pt-8 lg:grid-cols-2">
          <section>
            <h2 className="text-xl font-black">Cùng dịch vụ ở khu vực khác</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {sameServiceAreas.map((item) => (
                <Link
                  key={item.slug}
                  href={`/areas/${item.slug}/${service.slug}`}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold transition hover:border-primary/40 hover:text-primary"
                >
                  {item.shortName}
                </Link>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-black">Dịch vụ khác tại {ward.shortName}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {sameAreaServices.map((item) => (
                <Link
                  key={item.slug}
                  href={`/areas/${ward.slug}/${item.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold transition hover:bg-cyan-50 hover:text-primary"
                >
                  {item.name}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <JsonLdScript
        data={serviceJsonLd(
          `${service.name} tại ${ward.name}`,
          `/areas/${ward.slug}/${service.slug}`,
          ward.image || `/images/services/${service.slug}.jpg`,
        )}
      />
      <JsonLdScript data={faqJsonLd(localFaqs)} />
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
