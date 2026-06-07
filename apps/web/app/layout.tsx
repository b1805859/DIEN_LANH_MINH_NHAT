import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { localBusinessJsonLd } from '@/lib/seo/json-ld';
import { integrationSettings } from '@/lib/integrations/settings';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ĐIỆN LẠNH MINH NHẬT',
    template: '%s | ĐIỆN LẠNH MINH NHẬT',
  },
  description: 'Dịch vụ điện lạnh và sửa chữa tận nơi tại Cần Thơ.',
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
      <body className={beVietnamPro.variable}>
        <SiteHeader />
        {children}
        <FloatingActions />
        <JsonLdScript data={localBusinessJsonLd()} />
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
