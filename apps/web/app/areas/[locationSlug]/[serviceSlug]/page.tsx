import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRIORITY_DISTRICTS, SERVICES, findDistrict, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { PageHero, Process, Reasons, SectionHeading } from '@/components/redesign/ui';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
export function generateStaticParams() {
  return SERVICES.flatMap((service) =>
    PRIORITY_DISTRICTS.map((ward) => ({ serviceSlug: service.slug, locationSlug: ward.slug })),
  );
}
type Params = Promise<{ locationSlug: string; serviceSlug: string }>;
export async function generateMetadata({ params }: { params: Params }) {
  const { locationSlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) return {};
  return buildMetadata({
    title: `${service.name} tại ${ward.name}, Cần Thơ`,
    description: `${service.name} tại ${ward.name}, Cần Thơ. Báo giá rõ ràng, đặt lịch nhanh, hỗ trợ tận nơi.`,
    path: `/areas/${locationSlug}/${serviceSlug}`,
    image: ward.image,
  });
}
export default async function ServiceWardPage({ params }: { params: Params }) {
  const { locationSlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) notFound();
  return (
    <main>
      <PageHero
        title={service.name}
        accent={`tại ${ward.name}`}
        description={`Kiểm tra, tư vấn và thi công tận nơi tại ${ward.highlight}. Gửi lịch hẹn để kỹ thuật viên xác nhận trước khi đến.`}
        image={`/images/redesign/${service.slug}.webp`}
      />
      <div className="mn-container">
        <div className="mn-detail-layout">
          <article>
            <Link href={`/areas/${ward.slug}`} className="mn-text-link">
              ← Dịch vụ tại {ward.shortName}
            </Link>
            <SectionHeading title="Tư vấn rõ ràng," accent="thi công cẩn thận" />
            <Reasons />
          </article>
          <aside className="mn-detail-booking mn-panel">
            <h2>Đặt lịch tại {ward.shortName}</h2>
            <p>Dịch vụ và khu vực đã được chọn sẵn cho bạn.</p>
            <div className="mn-form-panel">
              <BookingForm serviceSlug={service.slug} locationSlug={ward.slug} />
            </div>
          </aside>
        </div>
        <Process />
      </div>
      <JsonLdScript
        data={serviceJsonLd(
          `${service.name} tại ${ward.name}`,
          `/areas/${ward.slug}/${service.slug}`,
          ward.image,
        )}
      />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
          { name: ward.name, path: `/areas/${ward.slug}` },
          { name: service.name, path: `/areas/${ward.slug}/${service.slug}` },
        ])}
      />
    </main>
  );
}
