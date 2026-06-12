import Image from 'next/image';
import Link from 'next/link';
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Fan,
  Gauge,
  Headphones,
  LucideIcon,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  ThermometerSun,
  Wrench,
  Zap,
} from 'lucide-react';
import { APP_NAME, FAQS, PRIORITY_DISTRICTS, SERVICES, TARGET_CITY } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { ContactForm } from '@/components/forms/contact-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { faqJsonLd } from '@/lib/seo/json-ld';

const stats = [
  { label: 'Phản hồi', value: '30p', desc: 'tiếp nhận nhanh trong giờ làm việc' },
  { label: 'Phường ưu tiên', value: '4+', desc: 'phục vụ các phường trung tâm Cần Thơ' },
  { label: 'Dịch vụ', value: `${SERVICES.length}+`, desc: 'máy lạnh, tủ lạnh, máy giặt, điện nước' },
];

const trustItems: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: ShieldCheck,
    title: 'Báo giá trước khi làm',
    desc: 'Kiểm tra thực tế, giải thích nguyên nhân và chốt chi phí rõ ràng.',
  },
  {
    icon: Clock,
    title: 'Ưu tiên lịch trong ngày',
    desc: 'Tiếp nhận qua đường dây nóng, Zalo, hộp thư Facebook và biểu mẫu đặt lịch trên trang web.',
  },
  {
    icon: BadgeCheck,
    title: 'Bàn giao gọn gàng',
    desc: 'Chạy thử thiết bị, vệ sinh khu vực thi công và nhắc lịch bảo trì.',
  },
];

const serviceDescriptions: Record<string, string> = {
  'thao-lap-may-lanh': 'Tháo lắp, di dời máy lạnh đúng kỹ thuật, kiểm tra ống đồng và thoát nước.',
  've-sinh-may-lanh': 'Vệ sinh dàn lạnh, dàn nóng, khử mùi và kiểm tra hiệu suất làm lạnh.',
  'sua-may-lanh': 'Xử lý máy không lạnh, chảy nước, báo lỗi, kêu lớn hoặc tự ngắt.',
  'nap-gas-may-lanh': 'Đo áp suất, kiểm tra rò rỉ và nạp gas theo đúng tình trạng máy.',
  'sua-tu-lanh': 'Kiểm tra tủ lạnh yếu lạnh, đóng tuyết, rò nước, kêu lớn hoặc không chạy.',
  'sua-may-giat': 'Xử lý máy giặt không vắt, không cấp nước, rung mạnh hoặc báo lỗi.',
};

const featureItems: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: ThermometerSun,
    title: 'Chẩn đoán đúng tình trạng',
    desc: 'Tập trung vào triệu chứng khách gặp: không lạnh, chảy nước, hao điện, tiếng ồn.',
  },
  {
    icon: Gauge,
    title: 'Kiểm tra bằng thông số',
    desc: 'Đo gas, kiểm tra tải, đường nước và nguồn điện trước khi đề xuất phương án.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quy trình dễ theo dõi',
    desc: 'Khách biết trước bước kiểm tra, hạng mục thi công và thời gian dự kiến.',
  },
  {
    icon: Headphones,
    title: 'Tư vấn sau dịch vụ',
    desc: 'Hướng dẫn sử dụng, vệ sinh định kỳ và cách nhận biết lỗi cần gọi kỹ thuật.',
  },
];

const processSteps = [
  ['01', 'Gửi nhu cầu', 'Chọn dịch vụ, khu vực, thời gian và mô tả nhanh tình trạng thiết bị.'],
  ['02', 'Xác nhận lịch', 'Minh Nhật gọi lại để hỏi thêm thông tin và hẹn khung giờ phù hợp.'],
  ['03', 'Kiểm tra tận nơi', 'Kỹ thuật viên đánh giá thực tế, báo nguyên nhân và chi phí trước khi làm.'],
  ['04', 'Thi công', 'Sửa chữa, vệ sinh hoặc lắp đặt theo phương án khách đã đồng ý.'],
  ['05', 'Nghiệm thu', 'Chạy thử, bàn giao, dọn khu vực và ghi nhận lưu ý bảo trì tiếp theo.'],
];

const quickNeeds = [
  'Máy lạnh không lạnh',
  'Máy lạnh chảy nước',
  'Cần vệ sinh định kỳ',
  'Cần tháo lắp di dời',
];

const heroImages = [
  {
    src: '/images/hvac-hero.png',
    alt: 'Kỹ thuật viên Minh Nhật kiểm tra máy lạnh tại nhà',
    objectPosition: 'object-[64%_center]',
  },
  {
    src: '/images/home-animated-cooling-hero.png',
    alt: 'Không gian gia đình mát mẻ với máy lạnh hoạt động ổn định',
    objectPosition: 'object-[62%_center]',
  },
  {
    src: '/images/service-tools.png',
    alt: 'Dụng cụ sửa chữa điện lạnh và thiết bị gia đình',
    objectPosition: 'object-center',
  },
  {
    src: '/images/services/ve-sinh-may-lanh.jpg',
    alt: 'Kỹ thuật vệ sinh máy lạnh tận nơi',
    objectPosition: 'object-center',
  },
  {
    src: '/images/services/sua-may-lanh.jpg',
    alt: 'Dịch vụ sửa máy lạnh tận nơi',
    objectPosition: 'object-center',
  },
  {
    src: '/images/wards/ninh-kieu.jpg',
    alt: 'Khu vực phục vụ tại phường Ninh Kiều, Cần Thơ',
    objectPosition: 'object-center',
  },
];

export default function HomePage() {
  const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;
  const featuredServices = SERVICES.slice(0, 6);

  return (
    <main className="bg-[#f4f8fb] text-slate-950">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-slate-950 text-white">
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority
            className={`hero-fade-image object-cover ${image.objectPosition}`}
            sizes="100vw"
            style={{ animationDelay: `${index * 7}s` }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(2_6_23_/_0.96)_0%,rgb(2_6_23_/_0.86)_38%,rgb(2_6_23_/_0.52)_68%,rgb(2_6_23_/_0.18)_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgb(255_255_255_/_0.09)_1px,transparent_1px),linear-gradient(0deg,rgb(255_255_255_/_0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,#f4f8fb_0%,rgb(244_248_251_/_0)_100%)]" />

        <div className="container relative grid min-h-[calc(100svh-4rem)] gap-10 pb-24 pt-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:py-16">
          <div className="max-w-4xl animate-in-soft">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200/20 bg-white/[0.1] px-4 py-2 text-sm font-black text-cyan-50 shadow-2xl shadow-slate-950/30 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Sửa chữa, vệ sinh, lắp đặt máy lạnh tại {TARGET_CITY}
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.03] tracking-normal sm:text-6xl lg:text-7xl">
              {APP_NAME}
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-100 sm:text-lg">
              Dịch vụ điện lạnh tận nơi cho gia đình và cửa hàng: máy lạnh, tủ lạnh, máy giặt,
              điện nước. Trang web được thiết kế để khách chọn đúng nhu cầu, đặt lịch nhanh và nắm
              rõ quy trình trước khi kỹ thuật viên đến.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-12 items-center gap-2 rounded-md bg-amber-400 px-5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:bg-amber-300"
                href="/booking"
              >
                Đặt lịch kiểm tra
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/25 bg-white/[0.12] px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                href={phoneHref}
              >
                <Phone className="h-4 w-4 text-cyan-200" />
                {integrationSettings.phone}
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-3xl font-black text-amber-300">{item.value}</p>
                  <p className="mt-2 text-sm font-black text-white">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="animate-in-soft rounded-md border border-white/20 bg-white/95 p-5 text-slate-950 shadow-2xl shadow-slate-950/35 backdrop-blur-xl">
            <p className="text-sm font-black uppercase text-primary">Chọn nhanh tình trạng</p>
            <h2 className="mt-1 text-2xl font-black">Cần kỹ thuật viên xử lý gì?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bắt đầu bằng nhóm nhu cầu gần nhất, đội kỹ thuật sẽ kiểm tra và báo giá trước khi
              thi công.
            </p>

            <div className="mt-5 grid gap-3">
              {quickNeeds.map((need, index) => {
                const service = SERVICES[index];

                return (
                  <Link
                    key={need}
                    href={`/services/${service.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-primary/40 hover:bg-white"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                        <Wrench className="h-4 w-4" />
                      </span>
                      <span className="truncate text-sm font-black">{need}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 rounded-md border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-sm font-black text-slate-900">Đang cần xử lý gấp?</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Gọi đường dây nóng để mô tả tình trạng trước, sau đó chốt lịch tận nơi.
              </p>
              <a
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-white transition hover:bg-primary/90"
                href={phoneHref}
              >
                <Phone className="h-4 w-4" />
                Gọi ngay
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 -mt-9">
        <div className="container grid gap-3 md:grid-cols-3">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-slate-200 bg-white py-4">
        <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-black uppercase text-slate-500">
          <span className="inline-flex items-center gap-2 text-primary">
            <Snowflake className="h-4 w-4" />
            Làm lạnh ổn định
          </span>
          <span>Kiểm tra tận nơi</span>
          <span className="text-amber-600">Báo giá rõ ràng</span>
          <span>Đặt lịch nhanh</span>
          <span className="inline-flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Nghiệm thu gọn
          </span>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home-animated-cooling-hero.png"
                alt="Không gian gia đình mát mẻ với máy lạnh hoạt động ổn định"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <div className="grid grid-cols-3 border-t border-slate-200 bg-white">
              <div className="p-4">
                <p className="text-2xl font-black text-primary">Rõ</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">tình trạng</p>
              </div>
              <div className="border-x border-slate-200 p-4">
                <p className="text-2xl font-black text-emerald-600">Gọn</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">thi công</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black text-amber-600">Nhanh</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">phản hồi</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Giới thiệu</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Trải nghiệm đặt lịch điện lạnh rõ ràng hơn cho khách tại {TARGET_CITY}
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-700">
              Giao diện mới lấy cảm hứng từ phong cách công nghệ của Innovate Tech: nền tối mạnh,
              typo lớn, CTA rõ và các khối nội dung quét nhanh. Nội dung được chuyển sang ngành
              điện lạnh để khách hiểu dịch vụ, chọn khu vực và gửi lịch hẹn ít thao tác hơn.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                'Đường dây nóng hiển thị nổi bật khi cần gấp',
                'Dịch vụ có ảnh thực tế và mô tả ngắn',
                'Khu vực phục vụ được đặt gần luồng đặt lịch',
                'Biểu mẫu chỉ hỏi thông tin cần thiết để xác nhận',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-wide text-primary">Dịch vụ</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
                Dịch vụ sửa chữa, vệ sinh và lắp đặt nổi bật
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Các hạng mục phổ biến được đưa lên trước để khách đang cần xử lý nhanh có thể chọn
                dịch vụ, xem chi tiết và gửi yêu cầu trong một luồng liền mạch.
              </p>
            </div>
            <Link className="inline-flex items-center gap-2 text-sm font-black text-primary" href="/services">
              Xem tất cả dịch vụ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-slate-200 bg-slate-100">
                  <Image
                    src={`/images/services/${service.slug}.jpg`}
                    alt={`${service.name} tại ${TARGET_CITY}`}
                    fill
                    className="scale-[1.04] object-cover transition duration-700 group-hover:scale-[1.1]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_23_42_/_0.54)_0%,rgb(15_23_42_/_0)_62%)]" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black leading-6">{service.name}</h3>
                  <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                    {serviceDescriptions[service.slug] ?? 'Tư vấn đúng tình trạng, báo giá trước và hỗ trợ tận nơi.'}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Điểm nổi bật</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Tập trung vào điều khách cần biết trước khi đặt lịch
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Trang chủ mới không chỉ giới thiệu dịch vụ, mà dẫn khách đi từ vấn đề đang gặp đến
              lựa chọn dịch vụ, khu vực phục vụ và biểu mẫu xác nhận lịch.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureItems.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-cyan-50 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cyan-300">Khu vực phục vụ</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Phủ sóng các khu vực cần thợ điện lạnh gần mình
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              Khách có thể chọn đúng phường, đúng dịch vụ và gửi thông tin mà không phải đọc quá
              nhiều. Đây là điểm quan trọng cho trang web đặt lịch dịch vụ địa phương.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/15"
                href={integrationSettings.zaloUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-cyan-200" />
                Nhắn Zalo
              </a>
              <a
                className="inline-flex h-11 items-center gap-2 rounded-md bg-amber-400 px-4 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                href={phoneHref}
              >
                <Phone className="h-4 w-4" />
                Gọi kỹ thuật
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRIORITY_DISTRICTS.map((ward) => (
              <Link
                key={ward.slug}
                href={`/areas/${ward.slug}/sua-may-lanh`}
                className="group relative min-h-[230px] overflow-hidden rounded-md border border-white/10 bg-white/[0.06] transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <Image
                  src={ward.image}
                  alt={`Khu vực ${ward.name}, Cần Thơ`}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(2_6_23_/_0.86)_0%,rgb(2_6_23_/_0.36)_72%,rgb(2_6_23_/_0.18)_100%)]" />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-3 text-lg font-black">
                      <MapPin className="h-5 w-5 text-cyan-300" />
                      {ward.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-cyan-300 transition group-hover:translate-x-1" />
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-slate-200">
                    Ưu tiên tiếp nhận lịch sửa máy lạnh, vệ sinh máy lạnh và kiểm tra thiết bị gia
                    đình tại {ward.name}.
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-wide text-primary">Quy trình</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Quy trình đặt lịch và thi công rõ từng bước
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-600">
            <Fan className="h-5 w-5 text-primary" />
            Minh bạch từ lúc nhận lịch đến nghiệm thu
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {processSteps.map(([number, title, desc]) => (
            <article key={number} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-primary">{number}</p>
              <p className="mt-2 text-xs font-black uppercase text-slate-400">Bước</p>
              <h3 className="mt-3 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary">Đặt lịch</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Gửi thông tin để kỹ thuật viên xác nhận lịch
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Khi đã chọn được nhóm dịch vụ phù hợp, hãy gửi thông tin để Minh Nhật chuẩn bị phương
              án kiểm tra. Nếu thiết bị đang cần xử lý gấp, gọi đường dây nóng sẽ nhanh hơn.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                'Chọn đúng nhóm dịch vụ cần xử lý',
                'Ghi rõ địa chỉ và khung giờ mong muốn',
                'Kỹ thuật viên gọi lại trước khi đến',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-md border border-slate-200 bg-[#f4f8fb] p-5 shadow-xl shadow-slate-200/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-primary">Đặt lịch nhanh</p>
                <h3 className="mt-1 text-2xl font-black">Minh Nhật sẽ liên hệ xác nhận</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Điền thông tin cơ bản, đội kỹ thuật sẽ gọi lại để chốt tình trạng và thời gian.
                </p>
              </div>
              <div className="rounded-md bg-cyan-100 p-3 text-primary">
                <CalendarCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5">
              <BookingForm />
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-cyan-300">Hỏi đáp</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Trả lời nhanh các băn khoăn trước khi đặt lịch
            </h2>
            <div className="mt-7 grid gap-4">
              {FAQS.map((faq) => (
                <article key={faq.question} className="rounded-md border border-white/10 bg-white/[0.06] p-4">
                  <h3 className="font-black">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white p-5 text-slate-950 shadow-2xl shadow-black/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-primary">Yêu cầu báo giá</p>
                <h2 className="mt-1 text-2xl font-black">Mô tả nhu cầu của bạn</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Chúng tôi sẽ liên hệ tư vấn phương án phù hợp trước khi thi công.
                </p>
              </div>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <Zap className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-5">
              <ContactForm quotation />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-cyan-50 lg:block" />
        <div className="container relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-white">
              <AirVent className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Cần kiểm tra thiết bị hôm nay?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Gọi trực tiếp hoặc gửi lịch hẹn, đội kỹ thuật sẽ xác nhận lại trước khi đến.
              </p>
              <div className="mt-3 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-xs font-black uppercase text-slate-500">
                  Tư vấn rõ, thi công gọn
                </span>
              </div>
            </div>
          </div>
          <Link
            className="inline-flex h-12 items-center gap-2 rounded-md bg-amber-400 px-5 text-sm font-black text-slate-950 transition hover:bg-amber-300"
            href="/booking"
          >
            Đặt lịch kiểm tra
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <JsonLdScript data={faqJsonLd()} />
    </main>
  );
}
