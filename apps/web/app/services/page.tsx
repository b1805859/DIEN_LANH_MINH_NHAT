import { PageHero, Process, ServiceGrid, SupportBanner } from '@/components/redesign/ui';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
export const metadata = buildMetadata({
  title: 'Dịch vụ điện lạnh tại Cần Thơ',
  description:
    'Sửa chữa, vệ sinh và lắp đặt máy lạnh, máy giặt, tủ lạnh và điện nước tận nơi tại Cần Thơ.',
  path: '/services',
});
export default function ServicesPage() {
  return (
    <main>
      <PageHero
        title="Dịch vụ điện lạnh"
        accent="toàn diện tại Cần Thơ"
        description="Từ sửa chữa, vệ sinh đến lắp đặt – Minh Nhật đồng hành cùng bạn với giải pháp phù hợp cho từng thiết bị."
      />
      <div className="mn-container mn-services-content">
        <ServiceGrid />
        <Process />
        <SupportBanner />
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
        ])}
      />
    </main>
  );
}
