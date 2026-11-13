import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import { SiteChrome } from '@/components/layout/site-chrome';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ToastProvider } from '@/components/ui/toast';
import { MotionProvider } from '@/components/ui/motion-provider';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { absoluteUrl } from '@/lib/seo/metadata';
import { integrationSettings } from '@/lib/integrations/settings';
import './globals.css';
import './redesign.css';
import './motion.css';
import './ui-interactions.css';
import './inner-pages.css';
import './home-refinement.css';
import './home-approved.css';
import './shared-home-components.css';
import './mobile.css';
import './palette-preview.css';
import './service-static.css';
import './elevation.css';
import './mobile-density.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0b1727',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: 'ĐIỆN LẠNH MINH NHẬT',
    template: '%s | ĐIỆN LẠNH MINH NHẬT',
  },
  description: 'Dịch vụ điện lạnh và sửa chữa tận nơi tại Cần Thơ.',
  applicationName: 'ĐIỆN LẠNH MINH NHẬT',
  category: 'Dịch vụ điện lạnh',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Minh Nhật Admin',
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
      <body className={`${beVietnamPro.variable} flex min-h-dvh flex-col`}>
        <MotionProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
        </MotionProvider>
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
