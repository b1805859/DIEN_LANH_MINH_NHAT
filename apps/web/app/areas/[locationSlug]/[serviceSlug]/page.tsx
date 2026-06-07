import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ClipboardList, LucideIcon, MapPin, Wallet } from 'lucide-react';
import { BLOG_POSTS, FAQS, SERVICES, findDistrict, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return SERVICES.flatMap((service) =>
    ['ninh-kieu', 'cai-rang', 'binh-thuy', 'o-mon'].map((locationSlug) => ({
      serviceSlug: service.slug,
      locationSlug,
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
  const district = findDistrict(locationSlug);
  if (!service || !district) return {};
  return buildMetadata({
    title: `${service.name} tại ${district.name}, Cần Thơ`,
    description: `${service.name} tại ${district.name}, Cần Thơ. Báo giá rõ ràng, đặt lịch nhanh, hỗ trợ tận nơi.`,
    path: `/areas/${locationSlug}/${serviceSlug}`,
  });
}

export default async function ServiceDistrictPage({
  params,
}: {
  params: Promise<{ locationSlug: string; serviceSlug: string }>;
}) {
  const { locationSlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  const district = findDistrict(locationSlug);
  if (!service || !district) notFound();
  const highlights: Array<{ icon: LucideIcon; title: string; desc: string }> = [
    { icon: CheckCircle2, title: 'Lợi ích', desc: 'Tiếp nhận nhanh và hẹn lịch rõ ràng.' },
    { icon: ClipboardList, title: 'Quy trình', desc: 'Kiểm tra tình trạng trước khi báo giá.' },
    { icon: Wallet, title: 'Chi phí', desc: 'Báo giá trước khi thực hiện dịch vụ.' },
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white">
        <Image
          src="/images/hvac-hero.png"
          alt={`${service.name} tại ${district.name}`}
          fill
          priority
          className="object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(2_6_23)_0%,rgb(2_6_23_/_0.92)_42%,rgb(2_6_23_/_0.45)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
              <MapPin className="h-4 w-4" />
              Phục vụ tại {district.name}, Cần Thơ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold sm:text-6xl">
              {service.name} tại {district.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Landing page Local SEO được tạo tự động theo cặp dịch vụ và khu vực, có CTA đặt lịch,
              FAQ, breadcrumb, schema và liên kết nội bộ.
            </p>
          </div>
          <aside className="glass-panel rounded-md p-5 text-slate-950">
            <h2 className="text-xl font-semibold">Đặt lịch tại {district.name}</h2>
            <p className="mt-1 text-sm text-slate-600">Gửi thông tin để được xác nhận lịch nhanh.</p>
            <div className="mt-4">
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </section>

      <section className="container grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-md border p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-semibold">Quy trình thực hiện</h2>
          <ol className="mt-4 grid gap-3 text-slate-700">
            <li>1. Tiếp nhận yêu cầu qua hotline, Zalo, Messenger hoặc form.</li>
            <li>2. Xác nhận địa chỉ, thời gian và tình trạng thiết bị.</li>
            <li>3. Kiểm tra, báo giá và thực hiện khi khách hàng đồng ý.</li>
            <li>4. Nghiệm thu, tư vấn bảo trì và ghi nhận phản hồi.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-semibold">Bảng giá tham khảo</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Giá phụ thuộc tình trạng thực tế, vị trí lắp đặt và linh kiện cần thay thế. Khách hàng
            luôn được báo giá trước khi thực hiện.
          </p>

          <h2 className="mt-10 text-2xl font-semibold">Câu hỏi thường gặp</h2>
          <div className="mt-4 grid gap-4">
            {FAQS.map((faq) => (
              <section key={faq.question} className="rounded-md border p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </section>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-semibold">Bài viết liên quan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BLOG_POSTS.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-md border p-4 transition hover:border-primary hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-4">
                  {post.title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-md border bg-slate-50 p-5">
          <h2 className="text-xl font-semibold">Dịch vụ liên quan</h2>
          <div className="mt-4 grid gap-3">
            {SERVICES.filter((item) => item.slug !== service.slug)
              .slice(0, 5)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/areas/${district.slug}/${item.slug}`}
                  className="rounded-md bg-white p-3 text-sm font-semibold transition hover:text-primary"
                >
                  {item.name} {district.name}
                </Link>
              ))}
          </div>
        </aside>
      </section>
      <JsonLdScript data={serviceJsonLd(service.name, `/areas/${district.slug}/${service.slug}`)} />
      <JsonLdScript data={faqJsonLd()} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: district.name, path: `/areas/${district.slug}` },
          { name: service.name, path: `/areas/${district.slug}/${service.slug}` },
        ])}
      />
    </main>
  );
}
