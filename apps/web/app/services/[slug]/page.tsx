import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FAQS, SERVICES, findService } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { Actions, PageHero, Process, Reasons, SectionHeading } from '@/components/redesign/ui';
import { serviceCards } from '@/lib/content/site-content';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata, localTitle } from '@/lib/seo/metadata';
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return buildMetadata({
    title: localTitle(service.name),
    description: `${service.name} tại Cần Thơ, đặt lịch nhanh và báo giá rõ ràng.`,
    path: `/services/${slug}`,
    image: `/images/redesign/${slug}.webp`,
  });
}
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceCards.find((s) => s.slug === slug);
  if (!service) notFound();
  return (
    <main>
      <PageHero
        title={service.title}
        accent="tận nơi tại Cần Thơ"
        description={service.description}
        image={service.image}
      />
      <div className="mn-container">
        <div className="mn-detail-layout">
          <article>
            <Link className="mn-text-link" href="/services">
              ← Tất cả dịch vụ
            </Link>
            <SectionHeading title="Kiểm tra kỹ lưỡng," accent="tư vấn rõ ràng" />
            <p className="mn-detail-description">
              {service.description} Minh Nhật tiếp nhận thông tin, xác nhận địa chỉ và khung giờ phù
              hợp trước khi cử kỹ thuật viên đến kiểm tra. Mọi công việc được trao đổi và thống nhất
              với bạn trước khi thực hiện.
            </p>
            <Reasons />
            <h2 className="mn-faq-heading">Câu hỏi thường gặp</h2>
            <div className="mn-faq-list">
              {FAQS.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
            <Actions />
          </article>
          <aside className="mn-detail-booking mn-panel">
            <h2>Đặt lịch dịch vụ</h2>
            <p>Gửi thông tin để Minh Nhật liên hệ xác nhận.</p>
            <div className="mn-form-panel">
              <BookingForm serviceSlug={slug} />
            </div>
          </aside>
        </div>
        <Process />
      </div>
      <JsonLdScript data={serviceJsonLd(service.title, `/services/${slug}`, service.image)} />
      <JsonLdScript data={faqJsonLd()} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
          { name: service.title, path: `/services/${slug}` },
        ])}
      />
    </main>
  );
}
