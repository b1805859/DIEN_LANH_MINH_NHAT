import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Droplets,
  Fan,
  LucideIcon,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
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
  { label: 'Quận ưu tiên', value: '4+', tone: 'bg-cyan-300 text-slate-950' },
  { label: 'Dịch vụ chính', value: String(SERVICES.length), tone: 'bg-amber-300 text-slate-950' },
  { label: 'Kênh hỗ trợ', value: '3', tone: 'bg-emerald-300 text-slate-950' },
];

const trustItems: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: ShieldCheck,
    title: 'Báo giá trước khi làm',
    desc: 'Tư vấn rõ ràng, xác nhận chi phí trước khi xử lý.',
  },
  {
    icon: Clock,
    title: 'Phản hồi nhanh',
    desc: 'Tiếp nhận qua hotline, Zalo, Messenger và form đặt lịch.',
  },
  {
    icon: BadgeCheck,
    title: 'Nghiệm thu gọn gàng',
    desc: 'Kiểm tra vận hành, dọn khu vực làm việc và hướng dẫn bảo trì.',
  },
];

const processSteps = [
  ['01', 'Tiếp nhận', 'Ghi nhận thiết bị, khu vực, thời gian và tình trạng cần xử lý.'],
  ['02', 'Kiểm tra', 'Kỹ thuật viên kiểm tra thực tế, giải thích nguyên nhân dễ hiểu.'],
  ['03', 'Báo giá', 'Đưa phương án và báo giá trước khi khách hàng xác nhận.'],
  ['04', 'Hoàn tất', 'Thi công, chạy thử, nghiệm thu và nhắc lịch bảo trì khi cần.'],
];

const serviceIcons = [Fan, Droplets, Wrench, Zap, ClipboardCheck, ShieldCheck, CalendarCheck, CheckCircle2];

export default function HomePage() {
  const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;

  return (
    <main className="bg-[#f7fbfd] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image
          src="/images/hvac-hero.png"
          alt="Kỹ thuật viên điện lạnh đang bảo trì máy lạnh tại nhà"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(3_7_18)_0%,rgb(3_7_18_/_0.88)_35%,rgb(3_7_18_/_0.56)_67%,rgb(3_7_18_/_0.32)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgb(247_251_253)_0%,rgb(247_251_253_/_0)_100%)]" />

        <div className="container relative grid min-h-[calc(100svh-7rem)] gap-8 pb-20 pt-28 lg:grid-cols-[minmax(0,1.05fr)_430px] lg:items-center lg:pt-24">
          <div className="max-w-3xl animate-in-soft">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-2xl shadow-cyan-950/20">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Điện lạnh Cần Thơ, ưu tiên xử lý trong ngày
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
              {APP_NAME}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-200">
              Dịch vụ sửa chữa, vệ sinh và lắp đặt điện lạnh tại {TARGET_CITY}. Tập trung vào phản hồi nhanh,
              báo giá rõ và trải nghiệm đặt lịch gọn cho khách hàng.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-12 items-center gap-2 rounded-md bg-amber-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:bg-amber-300"
                href="/booking"
              >
                Đặt lịch ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                href={phoneHref}
              >
                <Phone className="h-4 w-4 text-cyan-200" />
                {integrationSettings.phone}
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-md border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <span className={`inline-flex rounded px-2 py-1 text-xs font-bold ${item.tone}`}>
                    {item.value}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-100">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="animate-in-soft rounded-md border border-white/20 bg-white/90 p-5 text-slate-950 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-primary">Đặt lịch nhanh</p>
                <h2 className="mt-1 text-2xl font-black">Kỹ thuật liên hệ xác nhận</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Chọn dịch vụ, khu vực và thời gian mong muốn.
                </p>
              </div>
              <div className="rounded-md bg-cyan-100 p-3 text-primary">
                <CalendarCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5">
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </section>

      <section className="relative -mt-10 z-10">
        <div className="container grid gap-3 md:grid-cols-3">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Dịch vụ trọng tâm</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Nhìn là biết việc cần làm, bấm là đặt được lịch
            </h2>
            <p className="mt-3 text-slate-600">
              Các nhóm dịch vụ được tách rõ để khách hàng chọn nhanh, mỗi dịch vụ có trang riêng cho SEO địa phương.
            </p>
          </div>
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-primary" href="/services">
            Xem tất cả dịch vụ
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={`/images/services/${service.slug}.jpg`}
                    alt={`${service.name} tại Cần Thơ`}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_23_42_/_0.42)_0%,rgb(15_23_42_/_0)_55%)]" />
                  <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-white text-primary shadow-lg transition group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="min-h-12 text-lg font-black leading-6">{service.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Tư vấn đúng tình trạng, báo giá trước và hỗ trợ tận nơi tại Cần Thơ.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/service-tools.png"
                alt="Dụng cụ sửa chữa điện lạnh và thiết bị gia đình"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <div className="grid grid-cols-3 border-t border-slate-200 bg-white">
              <div className="p-4">
                <p className="text-2xl font-black text-primary">30p</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Tư vấn nhanh</p>
              </div>
              <div className="border-x border-slate-200 p-4">
                <p className="text-2xl font-black text-emerald-600">4+</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Khu vực ưu tiên</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-black text-amber-600">{SERVICES.length}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Dịch vụ chính</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Phủ sóng địa phương</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Tối ưu cho khách hàng đang cần thợ gần mình
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-700">
              Trang khu vực giúp người dùng đi thẳng đến dịch vụ tại quận đang sinh sống. Điều này làm website
              thực dụng hơn, dễ chuyển đổi hơn và hỗ trợ SEO địa phương tốt hơn.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {PRIORITY_DISTRICTS.map((district) => (
                <Link
                  key={district.slug}
                  href={`/areas/${district.slug}/sua-may-lanh`}
                  className="group rounded-md border border-slate-200 bg-[#f7fbfd] p-4 font-bold transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white hover:shadow-md"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {district.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Quy trình</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Rõ từng bước, dễ ra quyết định
            </h2>
            <p className="mt-4 leading-8 text-slate-700">
              Từ lúc khách gửi yêu cầu đến lúc nghiệm thu, quy trình được giữ ngắn gọn để tiết kiệm thời gian.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-primary/50"
                href={integrationSettings.zaloUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Nhắn Zalo
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {processSteps.map(([number, title, desc]) => (
              <article key={number} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-black text-primary">{number}</p>
                <h3 className="mt-3 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="container grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-300">FAQ và báo giá</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
              Trả lời nhanh các băn khoăn trước khi đặt lịch
            </h2>
            <div className="mt-7 grid gap-4">
              {FAQS.map((faq) => (
                <article key={faq.question} className="rounded-md border border-white/10 bg-white/[0.06] p-4">
                  <h3 className="font-bold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white p-5 text-slate-950 shadow-2xl shadow-black/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-primary">Yêu cầu báo giá</p>
                <h2 className="mt-1 text-2xl font-black">Mô tả nhu cầu của bạn</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Chúng tôi sẽ liên hệ tư vấn phương án phù hợp.
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
      <JsonLdScript data={faqJsonLd()} />
    </main>
  );
}
