import { ExternalLink, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';
import { integrationSettings } from '@/lib/integrations/settings';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Liên hệ ĐIỆN LẠNH MINH NHẬT',
  description: 'Liên hệ hotline, Zalo, Messenger và gửi yêu cầu báo giá dịch vụ tại Cần Thơ.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className="container grid gap-10 py-12 lg:grid-cols-2">
      <section>
        <h1 className="text-4xl font-bold">Liên hệ</h1>
        <div className="mt-6 grid gap-3 text-slate-700">
          <p>Hotline: {integrationSettings.phone}</p>
          <p>Địa chỉ: {integrationSettings.address}</p>
          <a className="text-primary" href={integrationSettings.zaloUrl}>
            Zalo Official Account
          </a>
          <a className="text-primary" href={integrationSettings.messengerUrl}>
            Facebook Messenger
          </a>
          {integrationSettings.googleMapsUrl ? (
            <a
              className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              href={integrationSettings.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin className="h-4 w-4" />
              Xem trên Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
        {integrationSettings.googleMapsEmbedUrl ? (
          <iframe
            className="mt-6 aspect-video w-full rounded-md border"
            src={integrationSettings.googleMapsEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        ) : (
          <div className="mt-6 flex aspect-video items-center justify-center rounded-md border bg-slate-100 p-5 text-sm text-slate-600">
            {integrationSettings.googleMapsUrl ? (
              <a
                className="inline-flex items-center gap-2 font-semibold text-primary"
                href={integrationSettings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="h-4 w-4" />
                Mở vị trí trên Google Maps
              </a>
            ) : (
              'Google Maps embed placeholder'
            )}
          </div>
        )}
      </section>
      <section className="rounded-md border p-5">
        <h2 className="text-2xl font-semibold">Gửi yêu cầu</h2>
        <div className="mt-4">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
