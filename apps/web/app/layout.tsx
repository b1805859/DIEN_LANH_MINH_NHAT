import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteChrome } from '@/components/layout/site-chrome';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ToastProvider } from '@/components/ui/toast';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl } from '@/lib/seo/metadata';
import { integrationSettings } from '@/lib/integrations/settings';
import './globals.css';
import './mockup-fonts.css';
import './mockup.css';
import './public-theme.css';
import './motion.css';
import './kage-theme.css';

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
      <body className="flex min-h-dvh flex-col">
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
