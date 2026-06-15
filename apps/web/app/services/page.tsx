import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Droplets,
  Fan,
  Gauge,
  LucideIcon,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { SERVICES, TARGET_CITY } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `Dịch vụ điện lạnh tại ${TARGET_CITY}`,
  description:
    'Dịch vụ sửa chữa, vệ sinh, lắp đặt máy lạnh, máy giặt, tủ lạnh và điện nước tại Cần Thơ. Đặt lịch nhanh, báo giá rõ trước khi thi công.',
  path: '/services',
});

const serviceDetails: Record<
  string,
  {
    desc: string;
    tag: string;
    icon: LucideIcon;
    checks: string[];
  }
> = {
  'thao-lap-may-lanh': {
    desc: 'Tháo lắp, di dời máy lạnh đúng kỹ thuật, kiểm tra lại ống đồng, dây điện và đường thoát nước trước khi bàn giao.',
    tag: 'Lắp đặt',
    icon: Wrench,
    checks: ['Khảo sát vị trí', 'Đi ống gọn', 'Chạy thử tải lạnh'],
  },
  've-sinh-may-lanh': {
    desc: 'Vệ sinh dàn lạnh, dàn nóng, lưới lọc và máng nước để máy làm lạnh đều hơn, giảm mùi và hạn chế chảy nước.',
    tag: 'Bảo trì',
    icon: Snowflake,
    checks: ['Xịt rửa dàn lạnh', 'Vệ sinh dàn nóng', 'Kiểm tra thoát nước'],
  },
  'sua-may-lanh': {
    desc: 'Kiểm tra máy lạnh không lạnh, báo lỗi, chảy nước, kêu lớn hoặc tự ngắt để đề xuất phương án xử lý phù hợp.',
    tag: 'Sửa chữa',
    icon: Fan,
    checks: ['Đo thông số', 'Tìm nguyên nhân', 'Báo giá trước'],
  },
  'nap-gas-may-lanh': {
    desc: 'Đo áp suất, kiểm tra rò rỉ và nạp gas theo đúng tình trạng máy, tránh nạp dư hoặc thiếu gây hao điện.',
    tag: 'Hiệu suất',
    icon: Gauge,
    checks: ['Đo áp suất gas', 'Kiểm tra rò rỉ', 'Chạy thử sau nạp'],
  },
  'sua-tu-lanh': {
    desc: 'Xử lý tủ lạnh yếu lạnh, không đông đá, đóng tuyết, rò nước, kêu lớn hoặc ngắt chạy bất thường.',
    tag: 'Gia dụng',
    icon: Snowflake,
    checks: ['Kiểm tra block', 'Kiểm tra ron cửa', 'Tư vấn sử dụng'],
  },
  'sua-may-giat': {
    desc: 'Sửa máy giặt không vắt, không cấp nước, không xả nước, rung mạnh, kêu lớn hoặc hiển thị mã lỗi.',
    tag: 'Gia dụng',
    icon: Droplets,
    checks: ['Đọc mã lỗi', 'Kiểm tra motor', 'Chạy thử chu trình'],
  },
  've-sinh-may-giat': {
    desc: 'Vệ sinh lồng giặt, lọc cặn và các vị trí dễ bám bẩn để giảm mùi, hạn chế cặn bám lên quần áo.',
    tag: 'Bảo trì',
    icon: Droplets,
    checks: ['Vệ sinh lồng', 'Xả cặn', 'Khử mùi'],
  },
  'sua-dien-nuoc': {
    desc: 'Hỗ trợ sửa chữa điện nước gia đình, kiểm tra rò rỉ, thay thiết bị hư hỏng và xử lý các lỗi thường gặp.',
    tag: 'Điện nước',
    icon: Zap,
    checks: ['Kiểm tra an toàn', 'Xử lý rò rỉ', 'Thay linh kiện phù hợp'],
  },
  'sua-lap-may-nuoc-uong-nong-lanh': {
    desc: 'Sửa lắp máy nước uống nóng lạnh, kiểm tra đường nước, khả năng làm nóng/lạnh và tình trạng rò rỉ.',
    tag: 'Nước uống',
    icon: Droplets,
    checks: ['Kiểm tra nguồn nước', 'Test nóng lạnh', 'Bàn giao hướng dẫn'],
  },
  'sua-lap-may-nuoc-nong-lanh-tam': {
    desc: 'Sửa lắp máy nước nóng lạnh tắm, kiểm tra nguồn điện, áp lực nước và các điểm an toàn trước khi sử dụng.',
    tag: 'Phòng tắm',
    icon: ShieldCheck,
    checks: ['Kiểm tra chống giật', 'Test áp lực nước', 'Lắp đặt chắc chắn'],
  },
};

const promiseItems: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: Clock,
    title: 'Tiếp nhận nhanh',
    desc: 'Gọi điện, Zalo hoặc gửi form để được xác nhận lịch và tư vấn hướng xử lý ban đầu.',
  },
  {
    icon: ShieldCheck,
    title: 'Báo giá rõ',
    desc: 'Kỹ thuật viên kiểm tra thực tế, nói rõ nguyên nhân và chi phí trước khi bắt đầu thi công.',
  },
  {
    icon: BadgeCheck,
    title: 'Bàn giao gọn',
    desc: 'Chạy thử thiết bị, vệ sinh khu vực làm việc và nhắc các lưu ý bảo trì sau dịch vụ.',
  },
];

const processSteps = [
  ['01', 'Chọn dịch vụ', 'Chọn đúng nhóm nhu cầu hoặc mô tả nhanh tình trạng thiết bị đang gặp.'],
  ['02', 'Xác nhận lịch', 'Minh Nhật gọi lại để hỏi thêm thông tin, địa chỉ và khung giờ phù hợp.'],
  ['03', 'Kiểm tra tận nơi', 'Kỹ thuật viên đo kiểm, xác định nguyên nhân và tư vấn phương án xử lý.'],
  ['04', 'Thi công & bàn giao', 'Thực hiện sau khi khách đồng ý, chạy thử và bàn giao gọn gàng.'],
];

const quickStats = [
  ['10+', 'nhóm dịch vụ'],
  ['Nhanh', 'đặt lịch'],
  ['30p', 'phản hồi nhanh'],
];

export default function ServicesPage() {
  return (
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-[#0b172a] text-white">
        <Image
          src="/images/service-tools.png"
          alt="Dụng cụ sửa chữa điện lạnh Minh Nhật"
          fill
          priority
          className="object-cover opacity-[0.42]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_23_42_/_0.88)_0%,rgb(11_23_42_/_0.72)_48%,rgb(11_23_42_/_0.28)_100%)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgb(255_255_255_/_0.12)_1px,transparent_1px),linear-gradient(0deg,rgb(255_255_255_/_0.1)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="container relative grid min-w-0 gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-10 lg:py-20">
          <div className="min-w-0 max-w-4xl animate-in-soft">
            <p className="inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-white/10 px-4 py-2 text-sm font-black text-cyan-50 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Dịch vụ điện lạnh tận nơi tại {TARGET_CITY}
            </p>
            <h1 className="mt-6 text-3xl font-black leading-[1.08] tracking-normal sm:text-5xl lg:text-6xl">
              Sửa chữa, vệ sinh và lắp đặt điện lạnh tại Cần Thơ
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-200 sm:text-lg">
              Chọn đúng dịch vụ cần xử lý, xem nhanh quy trình hỗ trợ và gửi lịch hẹn. Minh Nhật ưu tiên kiểm tra tận nơi,
              báo giá rõ ràng rồi mới thi công.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-2 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:bg-amber-300 sm:w-auto"
              >
                Đặt lịch kiểm tra
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={integrationSettings.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
              >
                <Image src="/icons/zalo.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
                Liên hệ qua Zalo
              </a>
            </div>
          </div>

          <aside className="min-w-0 rounded-md border border-white/15 bg-white/95 p-4 text-slate-950 shadow-2xl shadow-slate-950/35 backdrop-blur-xl sm:p-5">
            <p className="text-sm font-black uppercase text-primary">Tổng quan dịch vụ</p>
            <div className="mt-4 grid gap-3">
              {quickStats.map(([value, label]) => (
                <div key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <span className="min-w-0 text-2xl font-black text-primary sm:text-3xl">{value}</span>
                  <span className="text-right text-sm font-bold text-slate-600">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-md bg-cyan-50 p-4">
              <p className="font-black">Không chắc chọn dịch vụ nào?</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Mô tả triệu chứng qua điện thoại hoặc form, đội kỹ thuật sẽ gợi ý nhóm xử lý phù hợp.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 -mt-8">
        <div className="container grid gap-3 md:grid-cols-3">
          {promiseItems.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-primary">Danh sách dịch vụ</p>
              <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
              Chọn đúng hạng mục để được tư vấn nhanh hơn
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Mỗi dịch vụ có trang chi tiết riêng với lợi ích, quy trình và form đặt lịch để khách gửi yêu cầu
              trong vài thao tác.
            </p>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-2 text-sm font-black text-primary">
            Gửi lịch hẹn
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const detail = serviceDetails[service.slug];

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-slate-200 bg-slate-100 sm:aspect-[16/10]">
                  <Image
                    src={`/images/services/${service.slug}.jpg`}
                    alt={`${service.name} tại ${TARGET_CITY}`}
                    fill
                    className="object-contain transition duration-700 sm:scale-[1.03] sm:object-cover sm:group-hover:scale-[1.1]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(11_23_42_/_0.56)_0%,rgb(11_23_42_/_0.04)_68%)]" />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-black leading-6">{service.name}</h3>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:min-h-[6rem]">{detail.desc}</p>
                  <div className="mt-4 grid gap-2">
                    {detail.checks.map((item) => (
                      <span key={item} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Quy trình</p>
            <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
              Từ lúc gửi yêu cầu đến khi bàn giao đều rõ bước
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Minh Nhật tập trung vào thông tin khách cần biết trước: tình trạng thiết bị, chi phí dự kiến, thời gian
              đến nơi và cách nghiệm thu sau khi hoàn tất.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {processSteps.map(([number, title, desc]) => (
              <article key={number} className="rounded-md border border-slate-200 bg-[#f4f8fb] p-5">
                <p className="text-3xl font-black text-primary">{number}</p>
                <h3 className="mt-3 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Đặt lịch</p>
            <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-4xl">
              Gửi thông tin để Minh Nhật xác nhận lịch kiểm tra
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Nếu thiết bị đang gặp lỗi gấp, gọi trực tiếp sẽ nhanh hơn. Nếu cần hẹn giờ, form đặt lịch giúp đội kỹ thuật
              chuẩn bị đúng thông tin trước khi liên hệ lại.
            </p>
            <div className="mt-6 grid gap-3">
              {['Chọn dịch vụ và địa chỉ', 'Ghi rõ địa chỉ tại Cần Thơ', 'Kỹ thuật viên gọi lại trước khi đến'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <aside className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-5">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-black uppercase text-primary">Đặt lịch nhanh</p>
                <h3 className="mt-1 text-2xl font-black">Chọn dịch vụ cần hỗ trợ</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Điền thông tin cơ bản, Minh Nhật sẽ liên hệ xác nhận tình trạng và khung giờ.
                </p>
              </div>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-cyan-100 text-primary">
                <CalendarCheck className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-5">
              <BookingForm />
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white sm:h-12 sm:w-12">
              <Wrench className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Cần kỹ thuật viên kiểm tra hôm nay?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Gọi trực tiếp hoặc gửi lịch hẹn, đội kỹ thuật sẽ xác nhận lại trước khi đến.
              </p>
            </div>
          </div>
          <Link
            href="/booking"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-300 sm:w-auto"
          >
            Đặt lịch kiểm tra
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
        ])}
      />
    </main>
  );
}
