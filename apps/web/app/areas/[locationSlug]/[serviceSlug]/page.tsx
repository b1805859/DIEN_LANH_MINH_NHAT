import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findDistrict } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { Actions, PageHero, Process, Reasons, SectionHeading } from '@/components/redesign/ui';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getWebsiteContent } from '@/lib/content/website-content';
import { serviceDetails } from '@/lib/content/service-details';
import { ServiceDetailPhoto } from '@/components/redesign/service-detail-photo';
import { ServiceSymptomChecker } from '@/components/services/service-symptom-checker';
type Params = Promise<{ locationSlug: string; serviceSlug: string }>;
export async function generateMetadata({ params }: { params: Params }) {
  const { locationSlug, serviceSlug } = await params;
  const { services } = await getWebsiteContent();
  const service = services.find((item) => item.slug === serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) return {};
  return buildMetadata({
    index: false,
    title: `${service.name} tại ${ward.name}, Cần Thơ`,
    description: `${service.name} tại ${ward.name}, Cần Thơ. Báo giá rõ ràng, đặt lịch nhanh, hỗ trợ tận nơi.`,
    path: `/areas/${locationSlug}/${serviceSlug}`,
    image: service.imagery.src,
    imageAlt: service.imagery.alt,
  });
}
export default async function ServiceWardPage({ params }: { params: Params }) {
  const { locationSlug, serviceSlug } = await params;
  const { services } = await getWebsiteContent();
  const service = services.find((item) => item.slug === serviceSlug);
  const ward = findDistrict(locationSlug);
  if (!service || !ward) notFound();
  const detail = serviceDetails[serviceSlug];
  return (
    <main>
      <PageHero
        title={service.name}
        accent={`tại ${ward.name}`}
        description={`${service.description} Hỗ trợ tại ${ward.highlight}. Bạn gửi địa chỉ và giờ muốn hẹn, Minh Nhật sẽ liên hệ xác nhận.`}
        image={service.imagery.src}
        imageAlt={service.imagery.alt}
        imagePosition={service.imagery.heroPosition}
        insetImage={service.imagery.heroInset}
      />
      <div className="mn-container">
        <div className="mn-detail-layout mn-tone-section mn-tone-light">
          <article>
            <Link href={`/areas/${ward.slug}`} className="mn-text-link inline-flex min-h-[44px] items-center">
              ← Dịch vụ tại {ward.shortName}
            </Link>
            <SectionHeading title="Khảo sát nhu cầu," accent="báo giá trước khi làm" />
            {detail && (
              <ServiceSymptomChecker
                serviceSlug={service.slug}
                serviceTitle={`${service.name} (${ward.shortName})`}
                symptoms={detail.symptoms}
              />
            )}
            {detail && service.imagery.detail && (
              <>
                <h2 className="mn-faq-heading">{detail.procedureTitle || 'Công đoạn thực hiện'}</h2>
                <p className="mn-detail-description">{detail.inspection}</p>
                <ServiceDetailPhoto photo={service.imagery.detail} />
              </>
            )}
            <Reasons />
          </article>
          <aside className="mn-detail-booking mn-panel" data-reveal="" style={{ '--d': '0.12s' } as React.CSSProperties}>
            <h2>Cần tư vấn?</h2>
            <p>Để lại số điện thoại hoặc nhắn Zalo để Minh Nhật hỗ trợ.</p>
            <Actions booking />
          </aside>
        </div>
        <Process />
      </div>
      <JsonLdScript
        data={serviceJsonLd(
          `${service.name} tại ${ward.name}`,
          `/areas/${ward.slug}/${service.slug}`,
          service.imagery.src,
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
