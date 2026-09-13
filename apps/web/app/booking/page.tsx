import Link from 'next/link';
import { CheckCircle2, Phone } from 'lucide-react';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Đặt lịch dịch vụ điện lạnh Cần Thơ',
  description:
    'Đặt lịch sửa chữa, vệ sinh, nạp gas, lắp đặt máy lạnh và điện nước tại Cần Thơ. Chọn dịch vụ, khu vực và thời gian để Minh Nhật gọi lại xác nhận.',
  path: '/booking',
});

export default function BookingPage() {
  const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;

  return (
    <main className="bg-[#f4f8fb] py-10 sm:py-12 lg:py-16">
      <div className="container">
        <nav aria-label="Đường dẫn" className="text-sm font-semibold text-slate-600">
          <Link className="transition hover:text-primary" href="/">
            Trang chủ
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span aria-current="page">Đặt lịch</span>
        </nav>

        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <section>
            <p className="text-sm font-black uppercase tracking-wide text-primary">
              Hẹn thời gian phù hợp
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
              Đặt lịch dịch vụ điện lạnh tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl leading-8 text-slate-700">
              Chọn dịch vụ, khu vực và ngày mong muốn. Minh Nhật sẽ gọi lại để hỏi tình trạng thiết
              bị, xác nhận địa chỉ và thống nhất khung giờ trước khi kỹ thuật viên đến.
            </p>
            <div className="mt-7 grid gap-3">
              {[
                'Kiểm tra thông tin và xác nhận lịch qua điện thoại',
                'Trao đổi tình trạng trước khi đề xuất phương án',
                'Báo chi phí sau khi kiểm tra thực tế và trước khi thi công',
              ].map((item) => (
                <p key={item} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-7 rounded-md border border-amber-200 bg-amber-50 p-4">
              <p className="font-black text-slate-950">Thiết bị cần kiểm tra sớm?</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Gọi trực tiếp sẽ phù hợp hơn nếu thiết bị có mùi khét, rò điện hoặc rò nước nhiều.
              </p>
              <a
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                href={phoneHref}
              >
                <Phone className="h-4 w-4" />
                Gọi {integrationSettings.phone}
              </a>
            </div>
          </section>

          <section
            aria-labelledby="booking-form-title"
            className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-6"
          >
            <h2 id="booking-form-title" className="text-2xl font-black">
              Thông tin lịch hẹn
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Các trường có yêu cầu sẽ được kiểm tra trước khi gửi.
            </p>
            <div className="mt-5">
              <BookingForm />
            </div>
          </section>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Đặt lịch', path: '/booking' },
        ])}
      />
    </main>
  );
}
