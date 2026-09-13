import Image from 'next/image';
import Link from 'next/link';
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Fan,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  ThermometerSnowflake,
  Wrench,
} from 'lucide-react';
import { TARGET_CITY } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { ReviewCarousel, type Review } from '@/components/public/review-carousel';
import { TrustMetrics } from '@/components/public/trust-metrics';
import { Reveal } from '@/components/ui/reveal';
import { integrationSettings } from '@/lib/integrations/settings';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Sửa chữa - Lắp đặt máy lạnh tại Cần Thơ',
  description:
    'Điện Lạnh Minh Nhật sửa chữa, lắp đặt, vệ sinh và di dời máy lạnh tận nơi tại Cần Thơ. Có mặt nhanh, báo giá rõ ràng, bảo hành uy tín.',
  path: '/',
  image: '/images/home-hero.jpg',
});

const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;

const serviceCards = [
  {
    slug: 'sua-may-lanh',
    title: 'Sửa chữa máy lạnh',
    description: 'Xử lý nhanh lỗi không lạnh, chảy nước, báo lỗi hoặc kêu lớn.',
    image: '/images/services/sua-may-lanh-branded.png',
    icon: Wrench,
  },
  {
    slug: 'thao-lap-may-lanh',
    title: 'Lắp đặt máy lạnh',
    description: 'Lắp mới đúng kỹ thuật, đi ống gọn và kiểm tra vận hành đầy đủ.',
    image: '/images/services/thao-lap-may-lanh-branded.png',
    icon: AirVent,
  },
  {
    slug: 've-sinh-may-lanh',
    title: 'Vệ sinh / Bảo trì',
    description: 'Làm sạch dàn lạnh, dàn nóng, khử mùi và kiểm tra thoát nước.',
    image: '/images/services/ve-sinh-may-lanh-branded.png',
    icon: Sparkles,
  },
  {
    slug: 'thao-lap-may-lanh',
    title: 'Di dời máy lạnh',
    description: 'Tháo lắp, di dời an toàn, kiểm tra ống đồng và nạp gas khi cần.',
    image: '/images/services/thao-lap-may-lanh-branded.png',
    icon: Fan,
  },
];

const reviews: Review[] = [
  {
    name: 'Chị Minh Anh',
    area: 'Ninh Kiều, Cần Thơ',
    service: 'Vệ sinh máy lạnh',
    content:
      'Gọi buổi sáng, kỹ thuật viên đến đúng hẹn. Làm gọn, tư vấn rõ và báo giá trước khi vệ sinh.',
    initials: 'MA',
  },
  {
    name: 'Anh Hoàng Nam',
    area: 'Cái Răng, Cần Thơ',
    service: 'Sửa máy lạnh',
    content:
      'Máy lạnh chảy nước được kiểm tra khá kỹ, xử lý xong chạy êm. Mình thích nhất là giải thích dễ hiểu.',
    initials: 'HN',
  },
  {
    name: 'Chị Ngọc Hân',
    area: 'Bình Thủy, Cần Thơ',
    service: 'Lắp đặt máy lạnh',
    content:
      'Đội thợ làm nhanh nhưng rất sạch sẽ. Đi ống gọn, chạy thử kỹ và có hướng dẫn bảo hành đầy đủ.',
    initials: 'NH',
  },
];

const processSteps = [
  { number: '01', title: 'Đặt lịch', desc: 'Qua form hoặc gọi hotline' },
  { number: '02', title: 'Xác nhận', desc: 'Nhân viên liên hệ ngay' },
  { number: '03', title: 'Kỹ thuật đến', desc: 'Có mặt tận nơi' },
  { number: '04', title: 'Hoàn thành', desc: 'Nghiệm thu & bảo hành' },
];

const benefits = [
  { icon: ThermometerSnowflake, title: 'Có mặt nhanh', desc: 'Trong 30 phút' },
  { icon: BadgeCheck, title: 'Báo giá rõ ràng', desc: 'Không phát sinh' },
  { icon: ShieldCheck, title: 'Bảo hành uy tín', desc: 'An tâm sử dụng' },
];

const reasons = [
  { icon: Clock3, title: 'Có mặt nhanh', desc: 'Ưu tiên lịch cần xử lý trong ngày.' },
  { icon: BadgeCheck, title: 'Báo giá rõ ràng', desc: 'Chốt chi phí trước khi thi công.' },
  {
    icon: Wrench,
    title: 'Kỹ thuật viên chuyên nghiệp',
    desc: 'Kiểm tra đúng lỗi, làm gọn tại nhà.',
  },
  { icon: ShieldCheck, title: 'Bảo hành dài hạn', desc: 'Bàn giao rõ ràng, an tâm sử dụng.' },
];

export default function HomePage() {
  return (
    <main className="bg-[#f5faff] text-[#0b172a]">
      <section className="relative bg-[radial-gradient(circle_at_78%_18%,rgba(191,236,255,0.7),transparent_28%),linear-gradient(135deg,#f7fcff_0%,#edf7fc_55%,#ffffff_100%)] pb-8 pt-5 sm:pb-12 lg:pb-8 lg:pt-7">
        <div className="container relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.86fr)] lg:items-start lg:gap-14 xl:gap-20">
          <div className="min-w-0 pt-4 sm:pt-8 lg:pt-9">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#b7e5fa] bg-white/75 px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#0877c9] shadow-sm backdrop-blur sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#16a7e8] shadow-[0_0_0_5px_rgba(22,167,232,0.12)]" />
                Dịch vụ điện lạnh tại Cần Thơ
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-3xl text-[2.55rem] font-black leading-[1.08] tracking-[-0.045em] text-[#0b172a] sm:text-6xl lg:text-[4.35rem]">
                Sửa chữa - Lắp đặt
                <span className="block text-[#0877c9]">Máy lạnh tại Cần Thơ</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-lg font-bold text-[#15527a] sm:text-xl">
                Có mặt nhanh – Làm tận tâm – Mát lạnh mỗi ngày
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Điện Lạnh Minh Nhật – giải pháp tối ưu cho không gian sống thoải mái của bạn.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-6 grid max-w-2xl grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
                {benefits.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/90 bg-white/70 px-2 py-3 text-center shadow-sm backdrop-blur sm:flex-row sm:items-start sm:p-3.5 sm:text-left"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e4f5ff] text-[#0877c9] sm:h-9 sm:w-9">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-black leading-4 sm:text-sm sm:leading-5">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-slate-500 sm:text-[13px]">
                        {desc}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <Link
                  href="#booking"
                  className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#0877c9] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(8,119,201,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0765aa] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9ddaff]"
                >
                  Đặt lịch ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={phoneHref}
                  className="hidden min-h-14 items-center justify-center gap-3 rounded-xl border border-[#b7dff5] bg-white/80 px-5 text-sm font-black text-[#0b5fa5] transition duration-200 hover:-translate-y-0.5 hover:border-[#0877c9] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9ddaff] sm:inline-flex"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f5ff] text-[#0877c9]">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="text-left">
                    <span className="block text-base leading-5">{integrationSettings.phone}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                      Tư vấn miễn phí 24/7
                    </span>
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-slate-500 sm:mt-8 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0877c9]" />
                  Phục vụ tận nơi tại Cần Thơ
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Kiểm tra trước – báo giá rõ
                </span>
              </div>
            </Reveal>
          </div>

          <div className="relative min-w-0 lg:pt-2">
            <div className="hero-visual relative isolate mx-auto max-w-[560px]">
              <Reveal variant="fade" delay={100}>
                <div className="hero-photo relative z-10 h-[300px] overflow-hidden rounded-[2rem] border-8 border-white bg-[#dff3ff] shadow-[0_25px_70px_rgba(8,80,130,0.16)] sm:h-[360px] lg:h-[320px]">
                  <div className="hero-photo-image-frame absolute inset-0">
                    <Image
                      src="/images/hvac-hero-branded.png"
                      alt="Kỹ thuật viên Điện Lạnh Minh Nhật đang sửa máy lạnh"
                      fill
                      priority
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      className="hero-photo-image object-cover object-[67%_center] transition duration-700 hover:scale-[1.02]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_36%,rgba(8,119,201,0.12))]" />
                  <div className="hero-cooling-badge pointer-events-none absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-2 text-xs font-black text-[#0b5fa5] shadow-lg backdrop-blur">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0877c9] text-white">
                      <SnowflakeGlyph />
                    </span>
                    Mát lạnh đúng chuẩn
                  </div>
                </div>
              </Reveal>
              <AirflowDecoration />

              <Reveal variant="up" delay={280}>
                <aside
                  id="booking"
                  className="hero-booking-panel mx-auto mt-3 w-full max-w-[560px] scroll-mt-24 rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.11)] sm:mt-4 sm:p-5"
                >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0877c9]">
                      Đặt lịch dịch vụ
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-[#0b172a] sm:text-2xl">
                      Kỹ thuật viên liên hệ ngay
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      Chỉ mất 30 giây, thông tin được bảo mật.
                    </p>
                  </div>
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f6ff] text-[#0877c9] sm:inline-flex">
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                </div>
                <div className="mt-4">
                  <BookingForm compact hideNotes />
                </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Chỉ số tin cậy">
        <div className="container">
          <Reveal variant="up">
            <TrustMetrics
              metrics={[
                { target: 10000, suffix: '+', label: 'Khách hàng tin tưởng', icon: 'users' },
                { target: 49, display: '4.9/5', label: 'Đánh giá từ khách hàng', icon: 'award' },
                { target: 5, suffix: '+ năm', label: 'Kinh nghiệm', icon: 'experience' },
                { target: 0, display: 'Cần Thơ', label: 'Phục vụ tại', icon: 'location' },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section id="services" className="py-12 sm:py-16 lg:py-20" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0877c9] sm:text-sm">
                  Dịch vụ của chúng tôi
                </p>
                <h2
                  id="services-title"
                  className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#0b172a] sm:text-4xl lg:text-5xl"
                >
                  Giải pháp toàn diện cho máy lạnh
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Từ sửa chữa, lắp đặt đến bảo trì định kỳ – Minh Nhật luôn sẵn sàng phục vụ.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-[#0877c9] transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9]"
              >
                Xem tất cả dịch vụ <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map(({ slug, title, description, image, icon: Icon }, index) => (
              <Reveal key={`${slug}-${title}`} delay={index * 90} asChild>
                <Link
                  href={`/services/${slug}`}
                  className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_12px_38px_rgba(15,23,42,0.05)] transition [transition-duration:260ms] hover:-translate-y-1 hover:border-[#91d4f7] hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]"
                >
                  <div className="relative aspect-[1.35] overflow-hidden bg-[#e6f6ff]">
                    <Image
                      src={image}
                      alt={`${title} tại ${TARGET_CITY}`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition [transition-duration:260ms] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b172a]/35 to-transparent" />
                    <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0877c9] shadow-lg transition duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black tracking-tight">{title}</h3>
                    <p className="mt-2 min-h-[3.5rem] text-[15px] leading-6 text-slate-600">
                      {description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#0877c9]">
                      Xem chi tiết{' '}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-12 sm:pb-16 lg:pb-20" aria-labelledby="why-title">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0b2038] px-5 py-8 text-white shadow-[0_24px_70px_rgba(11,32,56,0.18)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full border border-cyan-200/10 bg-cyan-300/10 blur-2xl" />
            <div className="relative grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Vì sao chọn Minh Nhật
                </p>
                <h2
                  id="why-title"
                  className="mt-3 max-w-md text-3xl font-black leading-tight tracking-[-0.035em] sm:text-4xl"
                >
                  Dịch vụ uy tín, khách hàng luôn tin chọn
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {reasons.map(({ icon: Icon, title, desc }, index) => (
                  <div
                    key={title}
                    className={`group flex gap-4 border-b border-white/10 pb-4 transition duration-300 sm:pb-5 ${index === reasons.length - 1 ? 'border-b-0' : ''} ${index >= reasons.length - 2 ? 'sm:border-b-0' : ''}`}
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-300/10 text-cyan-300 transition group-hover:scale-105 group-hover:bg-cyan-300/15">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="pt-0.5">
                      <span className="block text-[15px] font-black">{title}</span>
                      <span className="mt-1 block text-sm leading-5 text-slate-300">{desc}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section
        id="process"
        className="bg-white py-12 sm:py-16 lg:py-20"
        aria-labelledby="process-title"
      >
        <div className="container">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0877c9] sm:text-sm">
                Quy trình đặt lịch
              </p>
              <h2
                id="process-title"
                className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl"
              >
                Chỉ 4 bước đơn giản
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base">
                Gửi thông tin cần thiết, Minh Nhật sẽ xác nhận lịch phù hợp trước khi kỹ thuật viên đến.
              </p>
            </div>
          </Reveal>
          <div className="relative mt-9 grid gap-8 md:grid-cols-4 md:gap-5">
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-6 top-6 w-0.5 bg-[linear-gradient(180deg,transparent,#9bdcf7_10%,#0877c9_50%,#9bdcf7_90%,transparent)] md:hidden"
            />
            <Reveal
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-6 hidden md:block"
              delay={180}
              variant="right"
            >
              <div className="process-line h-0.5 w-full bg-[linear-gradient(90deg,transparent,#9bdcf7_12%,#0877c9_50%,#9bdcf7_88%,transparent)]" />
            </Reveal>
            {processSteps.map(({ number, title, desc }, index) => (
              <Reveal key={number} delay={260 + index * 100} asChild>
                <div className="relative flex gap-4 md:block md:text-center">
                  <span className="process-step-marker relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#0877c9] text-sm font-black text-white shadow-[0_0_0_1px_#b9e5fa,0_10px_22px_rgba(8,119,201,0.2)]">
                    {number}
                  </span>
                  <div className="pt-1 md:pt-5">
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="mt-1.5 text-[15px] leading-6 text-slate-500">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="reviews-title">
        <div className="container">
          <Reveal>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0877c9] sm:text-sm">
                Khách hàng nói gì
              </p>
              <h2
                id="reviews-title"
                className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl"
              >
                Hơn 10.000+ khách hàng đã tin tưởng
              </h2>
              <div
                className="mt-4 flex flex-wrap items-center gap-3 text-sm font-black text-[#0b5fa5]"
                aria-label="Đánh giá trung bình 4.9 trên 5, hơn 1.200 đánh giá"
              >
                <span className="inline-flex items-center gap-2">
                  <Star className="h-5 w-5 fill-[#e2a400] text-[#e2a400]" />
                  4.9/5
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
                <span className="text-slate-500">1.200+ đánh giá</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-9">
              <ReviewCarousel reviews={reviews} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container pb-12 sm:pb-16 lg:pb-20" aria-labelledby="final-cta-title">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(105deg,#075a9e_0%,#0877c9_52%,#20a9df_100%)] px-6 py-8 text-white shadow-[0_24px_70px_rgba(8,119,201,0.24)] sm:px-10 sm:py-10 lg:min-h-[168px] lg:px-14 lg:py-10">
            <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/15 bg-white/10 blur-2xl" />
            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100">
                  Sẵn sàng hỗ trợ
                </p>
                <h2
                  id="final-cta-title"
                  className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-[2.35rem]"
                >
                  Đặt lịch ngay – Tận hưởng không gian mát lạnh!
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-cyan-50 sm:text-base">
                  Liên hệ với Điện Lạnh Minh Nhật để được tư vấn và hỗ trợ nhanh nhất.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 text-[15px] font-black whitespace-nowrap backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
                >
                  <Phone className="h-4 w-4" />
                  {integrationSettings.phone}
                </a>
                <Link
                  href="#booking"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-black text-[#075a9e] shadow-[0_12px_26px_rgba(3,53,92,0.2)] whitespace-nowrap transition hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
                >
                  Đặt lịch ngay <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function SnowflakeGlyph() {
  return (
    <span aria-hidden="true" className="text-sm leading-none">
      ✦
    </span>
  );
}

function AirflowDecoration() {
  return (
    <div
      aria-hidden="true"
      className="airflow-decoration pointer-events-none absolute -right-2 -top-7 z-20 hidden h-48 w-64 sm:block"
    >
      <div className="absolute inset-8 rounded-full bg-cyan-200/35 blur-3xl" />
      <svg className="relative h-full w-full" viewBox="0 0 260 190" fill="none">
        <path
          className="airflow-path airflow-path-one"
          d="M26 116C70 62 128 52 205 94"
          pathLength="1"
          stroke="#8ed8f8"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          className="airflow-path airflow-path-two"
          d="M54 150C100 104 151 104 230 132"
          pathLength="1"
          stroke="#c3edff"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <circle className="airflow-particle" cx="206" cy="94" r="3" fill="#0877c9" />
        <circle
          className="airflow-particle airflow-particle-two"
          cx="229"
          cy="132"
          r="2"
          fill="#8ed8f8"
        />
      </svg>
    </div>
  );
}
