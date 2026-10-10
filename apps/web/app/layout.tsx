import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Roboto, Dancing_Script } from 'next/font/google';
import Script from 'next/script';
import { SiteChrome } from '@/components/layout/site-chrome';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ToastProvider } from '@/components/ui/toast';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl } from '@/lib/seo/metadata';
import { integrationSettings } from '@/lib/integrations/settings';
import './globals.css';
import './mockup.css';

const mockupFont = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  variable: '--font-mockup',
  display: 'swap',
});
const handwriting = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  weight: '700',
  variable: '--font-handwriting',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: 'Điện Lạnh Minh Nhật',
    template: '%s | Minh Nhật',
  },
  description: 'Dịch vụ điện lạnh và sửa chữa tận nơi tại Cần Thơ.',
  applicationName: 'Điện Lạnh Minh Nhật',
  category: 'Dịch vụ điện lạnh',
  other: {
    'geo.region': 'VN-CT',
    'geo.placename': 'Cần Thơ',
  },
  verification: {
    google: integrationSettings.googleSearchConsoleVerification || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${mockupFont.variable} ${handwriting.variable} flex min-h-dvh flex-col`}
      >
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
        </ToastProvider>
        <JsonLdScript data={localBusinessJsonLd()} />
        <JsonLdScript data={websiteJsonLd()} />
        {integrationSettings.googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrationSettings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${integrationSettings.googleAnalyticsId}');
                `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
