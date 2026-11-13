import { PageHero, Process, SupportBanner } from '@/components/redesign/ui';
import { ServiceCatalog } from '@/components/redesign/service-catalog';
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
    <main className="mn-reference-page mn-services-page">
      <PageHero
        showEyebrow={false}
        title="Dịch vụ điện lạnh"
        accent="tại Cần Thơ"
        description="Chọn dịch vụ bạn cần bên dưới. Thợ sẽ kiểm tra máy và báo giá trước khi sửa."
      />
      <div className="mn-container mn-services-content">
        <section className="mn-tone-section mn-tone-light" aria-label="Danh mục dịch vụ">
          <ServiceCatalog />
        </section>
        <Process />
        <div className="mn-tone-section mn-tone-light">
          <SupportBanner />
        </div>
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
