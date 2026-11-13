import { getWebsiteContent } from '@/lib/content/website-content';
import { ServicesPageView } from '@/components/services/services-page-view';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';

export const metadata = buildMetadata({
  title: 'Dịch vụ điện lạnh chuyên nghiệp tại Cần Thơ',
  description:
    'Sửa chữa, vệ sinh và lắp đặt máy lạnh, máy giặt, tủ lạnh và điện nước tận nơi tại Cần Thơ.',
  path: '/services',
});

export default async function ServicesPage() {
  const { services } = await getWebsiteContent();
  return (
    <main className="mn-services-modern-page">
      <ServicesPageView services={services} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
        ])}
      />
    </main>
  );
}
