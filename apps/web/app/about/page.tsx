import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  MapPin,
  SearchCheck,
} from 'lucide-react';
import { APP_NAME, PRIORITY_DISTRICTS, SERVICES, TARGET_CITY } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `Giới thiệu ${APP_NAME}`,
  description: `Tìm hiểu ${APP_NAME}, cách tiếp nhận, kiểm tra và tư vấn dịch vụ điện lạnh tận nơi cho khách hàng tại ${TARGET_CITY}.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
        <div className="container">
          <nav aria-label="Điều hướng">
            <ol className="flex items-center gap-1 text-sm text-slate-500">
              <li>
                <Link className="transition hover:text-primary" href="/">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="text-slate-950" aria-current="page">
                Giới thiệu
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-sm font-black uppercase tracking-wide text-primary">
            Dịch vụ điện lạnh tại {TARGET_CITY}
          </p>
          <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">
            Giới thiệu {APP_NAME}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {APP_NAME} tiếp nhận nhu cầu kiểm tra, vệ sinh, sửa chữa và lắp đặt thiết bị gia đình
            tại {TARGET_CITY}. Website được xây dựng để khách hàng hiểu rõ phạm vi từng dịch vụ,
            chuẩn bị đúng thông tin và chủ động xác nhận phương án trước khi thực hiện.
          </p>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: SearchCheck,
              title: 'Kiểm tra trước khi kết luận',
              description:
                'Cùng một biểu hiện có thể có nhiều nguyên nhân; việc kiểm tra hiện trạng giúp tránh xử lý theo phỏng đoán.',
            },
            {
              icon: ClipboardCheck,
              title: 'Giải thích phương án',
              description:
                'Khách hàng cần được biết phần nào cần xử lý, lựa chọn có thể cân nhắc và chi phí dự kiến.',
            },
            {
              icon: CheckCircle2,
              title: 'Xác nhận trước khi làm',
              description:
                'Chỉ tiến hành hạng mục đã được trao đổi và khách hàng đồng ý sau bước kiểm tra.',
            },
          ].map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              Hạng mục tiếp nhận
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Thông tin rõ cho từng nhu cầu</h2>
            <p className="mt-4 max-w-3xl leading-8 text-slate-700">
              Mỗi trang dịch vụ trình bày dấu hiệu thường gặp, phạm vi cần kiểm tra, nội dung khách
              nên chuẩn bị và các lưu ý an toàn. Đây là thông tin định hướng ban đầu; phương án cuối
              cùng phụ thuộc vào hiện trạng thiết bị.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold transition hover:border-primary/40 hover:text-primary"
                >
                  {service.name}
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-md bg-[#0b172a] p-5 text-white">
            <MapPin className="h-7 w-7 text-cyan-300" />
            <h2 className="mt-4 text-xl font-black">Khu vực ưu tiên tại Cần Thơ</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Chọn địa bàn để xem lưu ý đặt lịch và từng dịch vụ theo khu vực.
            </p>
            <div className="mt-5 grid gap-2">
              {PRIORITY_DISTRICTS.map((area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="flex items-center justify-between gap-3 rounded-md bg-white/10 px-3 py-3 text-sm font-bold transition hover:bg-white/15"
                >
                  {area.name}
                  <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-14 rounded-md border border-slate-200 bg-white p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black">Bạn chưa chắc nên chọn dịch vụ nào?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Hãy mô tả loại thiết bị, biểu hiện, mã lỗi và địa chỉ. Không cần tự đoán linh kiện
                hỏng trước khi gửi yêu cầu.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-white"
              >
                Gửi yêu cầu
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-primary/40 hover:text-primary"
              >
                Xem câu hỏi thường gặp
              </Link>
            </div>
          </div>
        </section>
      </section>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Giới thiệu', path: '/about' },
        ])}
      />
    </main>
  );
}
