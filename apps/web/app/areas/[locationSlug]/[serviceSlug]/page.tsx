import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ClipboardList, LucideIcon, MapPin, Wallet } from 'lucide-react';
import { BLOG_POSTS, FAQS, PRIORITY_DISTRICTS, SERVICES, findDistrict, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
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
  const highlights: Array<{ icon: LucideIcon; title: string; desc: string }> = [
    { icon: CheckCircle2, title: 'Tiếp nhận nhanh', desc: 'Gọi lại xác nhận nhu cầu, địa chỉ và khung giờ trước khi đến.' },
    { icon: ClipboardList, title: 'Kiểm tra rõ', desc: 'Đánh giá tình trạng thiết bị rồi báo phương án xử lý phù hợp.' },
    { icon: Wallet, title: 'Báo giá trước', desc: 'Khách hàng đồng ý chi phí rồi kỹ thuật viên mới tiến hành thi công.' },
  ];

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white">
        <Image
          src={ward.image}
          alt={`${service.name} tại ${ward.name}`}
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(2_6_23)_0%,rgb(2_6_23_/_0.9)_42%,rgb(2_6_23_/_0.38)_100%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[1fr_390px] lg:items-center">
          <div className="animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-black text-sky-100">
              <MapPin className="h-4 w-4" />
              Phục vụ tại {ward.name}, Cần Thơ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black sm:text-6xl">
              {service.name} tại {ward.name}
            </h1>
            <p className="mt-4 inline-flex rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-cyan-100 backdrop-blur">
              Khu vực nhận lịch: {ward.highlight}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Minh Nhật tiếp nhận lịch {service.name.toLowerCase()} tại {ward.name}. Kỹ thuật viên
              kiểm tra tận nơi, tư vấn rõ nguyên nhân, báo giá trước và bàn giao gọn gàng sau khi
              hoàn tất.
            </p>
          </div>
          <aside className="glass-panel rounded-md p-5 text-slate-950">
            <h2 className="text-xl font-black">Đặt lịch tại {ward.name}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Gửi thông tin để được xác nhận lịch nhanh.
            </p>
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
              <div key={title} className="rounded-md border border-slate-200 p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black">Quy trình thực hiện</h2>
          <ol className="mt-4 grid gap-3 text-slate-700">
            <li>1. Tiếp nhận yêu cầu qua đường dây nóng, Zalo, hộp thư Facebook hoặc biểu mẫu.</li>
            <li>2. Xác nhận địa chỉ, thời gian và tình trạng thiết bị.</li>
            <li>3. Kiểm tra, báo giá và thực hiện khi khách hàng đồng ý.</li>
            <li>4. Nghiệm thu, tư vấn bảo trì và ghi nhận phản hồi.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-black">Bảng giá tham khảo</h2>
          <p className="mt-4 leading-7 text-slate-700">
            Giá phụ thuộc tình trạng thực tế, vị trí lắp đặt và linh kiện cần thay thế. Khách hàng
            luôn được báo giá trước khi thực hiện.
          </p>

          <h2 className="mt-10 text-2xl font-black">Câu hỏi thường gặp</h2>
          <div className="mt-4 grid gap-4">
            {FAQS.map((faq) => (
              <section key={faq.question} className="rounded-md border border-slate-200 p-4">
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </section>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-black">Bài viết liên quan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BLOG_POSTS.slice(0, 4).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-md border border-slate-200 p-4 transition hover:border-primary hover:shadow-md"
              >
                <span className="flex items-center justify-between gap-4">
                  {post.title}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-md border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-xl font-black">Dịch vụ liên quan</h2>
          <div className="mt-4 grid gap-3">
            {SERVICES.filter((item) => item.slug !== service.slug)
              .slice(0, 5)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/areas/${ward.slug}/${item.slug}`}
                  className="rounded-md bg-white p-3 text-sm font-semibold transition hover:text-primary"
                >
                  {item.name} tại {ward.name}
                </Link>
              ))}
          </div>
        </aside>
      </section>
      <JsonLdScript data={serviceJsonLd(service.name, `/areas/${ward.slug}/${service.slug}`)} />
      <JsonLdScript data={faqJsonLd()} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: ward.name, path: `/areas/${ward.slug}` },
          { name: service.name, path: `/areas/${ward.slug}/${service.slug}` },
        ])}
      />
    </main>
  );
}
