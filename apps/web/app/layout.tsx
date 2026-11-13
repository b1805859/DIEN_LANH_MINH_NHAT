import type { Metadata, Viewport } from 'next';
import { getWebsiteContent } from '@/lib/content/website-content';
import { Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import { SiteChrome } from '@/components/layout/site-chrome';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { ToastProvider } from '@/components/ui/toast';
import { MotionProvider } from '@/components/ui/motion-provider';
import { RevealRoot } from '@/components/ui/reveal-root';
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
import './desktop-wide.css';
import './safe-area.css';
import './home-menu-approved.css';
import './home-harmony-approved.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ecfafe',
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
    icon: { url: '/favicon.ico?v=mn-mark', type: 'image/svg+xml', sizes: 'any' },
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: integrationSettings.googleSearchConsoleVerification || undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { services } = await getWebsiteContent();
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body className={`${beVietnamPro.variable} flex min-h-dvh flex-col`}>
        <RevealRoot />
        <MotionProvider>
          <ToastProvider>
            <SiteChrome services={services}>{children}</SiteChrome>
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
