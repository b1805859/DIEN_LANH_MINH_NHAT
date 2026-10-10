import { notFound } from 'next/navigation';
import { PRIORITY_DISTRICTS, findDistrict } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { PageHero, Reasons, SectionHeading, ServiceGrid } from '@/components/redesign/ui';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
export function generateStaticParams() {
  return PRIORITY_DISTRICTS.map((ward) => ({ locationSlug: ward.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) return {};
  return buildMetadata({
    title: `Dịch vụ điện lạnh ${ward.name}, Cần Thơ`,
    description: `Dịch vụ điện lạnh và sửa chữa tận nơi tại ${ward.name}, Cần Thơ.`,
    path: `/areas/${locationSlug}`,
    image: ward.image,
  });
}
export default async function WardPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) notFound();
  return (
    <main>
      <PageHero
        title="Dịch vụ điện lạnh"
        accent={`tại ${ward.name}`}
        description={`Minh Nhật hỗ trợ sửa chữa, vệ sinh và lắp đặt tận nơi tại ${ward.highlight}. Liên hệ để được xác nhận lịch phù hợp.`}
        image={ward.image}
        label="Khu vực phục vụ Cần Thơ"
      />
      <div className="mn-container">
        <section className="mn-section">
          <SectionHeading title="Chọn dịch vụ" accent="cần hỗ trợ" />
          <ServiceGrid areaSlug={ward.slug} />
        </section>
        <div className="mn-detail-layout mn-area-booking">
          <article>
            <SectionHeading title="Tận nơi," accent="tận tâm" />
            <Reasons />
          </article>
          <aside className="mn-detail-booking mn-panel">
            <h2>Đặt lịch tại {ward.shortName}</h2>
            <p>Minh Nhật sẽ liên hệ xác nhận trước khi đến.</p>
            <div className="mn-form-panel">
              <BookingForm locationSlug={ward.slug} />
            </div>
          </aside>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Khu vực phục vụ', path: '/services' },
          { name: ward.name, path: `/areas/${ward.slug}` },
        ])}
      />
    </main>
  );
}
