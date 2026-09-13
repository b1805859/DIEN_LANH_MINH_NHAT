import type { LucideIcon } from 'lucide-react';
import { ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import { APP_NAME, TARGET_CITY } from '@minhnhat/shared';
import { LoadingImage } from '@/components/ui/loading-image';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Liên hệ ĐIỆN LẠNH MINH NHẬT',
  description:
    'Liên hệ Điện Lạnh Minh Nhật qua hotline hoặc Zalo để mô tả sự cố và đặt lịch kiểm tra thiết bị tận nơi tại Cần Thơ.',
  path: '/contact',
});

const contactMethods: Array<{
  icon?: LucideIcon;
  image?: string;
  label: string;
  value?: string;
  href: string;
}> = [
  {
    icon: Phone,
    label: 'Đường dây nóng',
    value: integrationSettings.phone,
    href: `tel:${integrationSettings.phone.replace(/\s/g, '')}`,
  },
  {
    image: '/icons/zalo.svg',
    label: 'Liên hệ qua Zalo',
    href: integrationSettings.zaloUrl,
  },
];

export default function ContactPage() {
  const hasMapEmbed = Boolean(integrationSettings.googleMapsEmbedUrl);

  return (
    <main className="bg-[#f5f8fb] py-10 sm:py-12 lg:py-16">
      <div className="container grid min-w-0 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <section className="flex min-w-0 flex-col">
          <p className="text-sm font-black uppercase tracking-wide text-primary">Liên hệ</p>
          <h1 className="mt-2 text-[1.75rem] font-black leading-[1.1] tracking-normal sm:text-5xl">
            Gọi hoặc nhắn Zalo, Minh Nhật sẽ tư vấn trực tiếp
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-slate-700">
            Khách hàng chỉ cần mô tả nhanh tình trạng thiết bị qua điện thoại hoặc Zalo. Đội kỹ
            thuật sẽ hỏi thêm thông tin cần thiết và hẹn lịch phù hợp.
          </p>

          <div className="mt-8 grid gap-3">
            {contactMethods.map(({ icon: Icon, image, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="group min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 sm:gap-4">
                  <span
                    className={
                      image
                        ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center'
                        : 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white'
                    }
                  >
                    {image ? (
                      <LoadingImage
                        src={image}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 max-w-none shrink-0"
                      />
                    ) : Icon ? (
                      <Icon className="h-5 w-5" />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-normal break-words font-bold leading-6 text-slate-900 group-hover:text-primary">
                      {value ?? label}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] items-start gap-3 sm:gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan-100 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-black">Địa chỉ phục vụ</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {integrationSettings.address}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Ưu tiên hỗ trợ các khu vực trung tâm và lân cận tại Cần Thơ.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col">
          <p className="text-sm font-black uppercase tracking-wide text-primary">Vị trí</p>
          <h2 className="mt-1 text-2xl font-black">Khu vực phục vụ tại {TARGET_CITY}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Xem vị trí để thuận tiện trao đổi khu vực phục vụ và sắp xếp lịch kỹ thuật viên.
          </p>
          {integrationSettings.googleMapsUrl ? (
            <a
              className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-primary/25 bg-white px-4 py-2 text-sm font-black text-primary transition hover:border-primary hover:bg-cyan-50"
              href={integrationSettings.googleMapsUrl}
              rel="noreferrer"
              target="_blank"
            >
              Mở chỉ đường trên Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}

          {hasMapEmbed ? (
            <div className="mt-5 flex-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              <iframe
                className="block h-[360px] w-full bg-slate-100 sm:h-[420px] lg:h-full lg:min-h-[500px]"
                src={integrationSettings.googleMapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Bản đồ ${APP_NAME}`}
              />
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
              <p className="flex gap-3 font-semibold text-slate-900">
                <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Thông tin vị trí tại {TARGET_CITY}</span>
              </p>
              <p className="mt-3 pl-8 text-sm leading-6 text-slate-600">
                {integrationSettings.address}
              </p>
            </div>
          )}
        </section>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Liên hệ', path: '/contact' },
        ])}
      />
    </main>
  );
}
