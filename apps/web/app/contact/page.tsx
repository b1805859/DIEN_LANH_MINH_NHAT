import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { integrationSettings } from '@/lib/integrations/settings';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Liên hệ ĐIỆN LẠNH MINH NHẬT',
  description: 'Liên hệ đường dây nóng, Zalo và gửi yêu cầu báo giá dịch vụ tại Cần Thơ.',
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
  return (
    <main className="bg-[#f5f8fb] py-10 sm:py-12 lg:py-16">
      <div className="container grid min-w-0 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="min-w-0">
          <p className="text-sm font-black uppercase tracking-wide text-primary">Liên hệ</p>
          <h1 className="mt-2 text-[1.75rem] font-black leading-[1.1] tracking-normal sm:text-5xl">
            Gửi tình trạng thiết bị, Minh Nhật sẽ tư vấn lại
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-slate-700">
            Bạn có thể gọi trực tiếp khi cần xử lý gấp, hoặc gửi biểu mẫu để đội kỹ thuật nắm trước
            dịch vụ, địa chỉ và nhu cầu báo giá.
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
                      <Image src={image} alt="" width={48} height={48} className="h-12 w-12 max-w-none shrink-0" />
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
                <p className="mt-1 text-sm leading-6 text-slate-600">{integrationSettings.address}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Ưu tiên hỗ trợ các khu vực trung tâm và lân cận tại Cần Thơ.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-5">
          <p className="text-sm font-black uppercase text-primary">Gửi yêu cầu</p>
          <h2 className="mt-1 text-2xl font-black">Mô tả nhu cầu của bạn</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Càng rõ tình trạng, kỹ thuật viên càng dễ chuẩn bị phương án và dụng cụ phù hợp.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
}
