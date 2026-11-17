import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { Actions, PageHero, Process, Reasons, SectionHeading } from '@/components/redesign/ui';
import { serviceDetails } from '@/lib/content/service-details';
import { getWebsiteContent } from '@/lib/content/website-content';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata, localTitle } from '@/lib/seo/metadata';
import { ServiceExpectations } from '@/components/redesign/service-expectations';
import { ServiceDetailPhoto } from '@/components/redesign/service-detail-photo';
import { MobileDisclosure } from '@/components/redesign/mobile-disclosure';
import { ServiceSymptomChecker } from '@/components/services/service-symptom-checker';
import { AnimatedFaqAccordion } from '@/components/ui/animated-faq-accordion';
import { serviceSearchContent } from '@/lib/content/service-search-content';
import { blogContent } from '@/lib/content/blog-content';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { services } = await getWebsiteContent();
  const card = services.find((item) => item.slug === slug);
  if (!card) return {};
  return buildMetadata({
    title: localTitle(card.title),
    description: `${card.title} tại Cần Thơ. ${card.description} Liên hệ Minh Nhật để xác nhận lịch và báo giá.`,
    path: `/services/${slug}`,
    image: card.imagery.src,
    imageAlt: card.imagery.alt,
  });
}
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { services, posts } = await getWebsiteContent();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const detail = serviceDetails[slug];
  const searchContent = serviceSearchContent[slug];
  const relatedPosts = posts.filter((post) => Object.entries(blogContent).some(([key, article]) => key === post.slug && article.services.includes(slug)));
  return (
    <main className="mn-service-detail-page">
      <PageHero
        title={service.title}
        accent="tận nơi tại Cần Thơ"
        description={service.description}
        image={service.imagery.src}
        imageAlt={service.imagery.alt}
        imagePosition={service.imagery.heroPosition}
        insetImage={service.imagery.heroInset}
      />
      <div className="mn-container">
        <div className="mn-detail-layout mn-tone-section mn-tone-light">
          <article>
            <Link className="mn-text-link" href="/services">
              ← Tất cả dịch vụ
            </Link>
            <SectionHeading title="Khảo sát nhu cầu," accent="báo giá trước khi làm" />
            <p className="mn-detail-description">
              {service.introduction ?? service.description}
            </p>
            {detail && (
              <ServiceSymptomChecker
                serviceSlug={slug}
                serviceTitle={service.title}
                symptoms={detail.symptoms}
              />
            )}
            {detail && <MobileDisclosure title={detail.needsTitle || 'Các tình trạng thường gặp'} defaultOpen>
              <h2 className="mn-faq-heading">{detail.needsTitle || 'Các tình trạng thường gặp'}</h2>
              <ul className="mn-service-symptoms">
                {detail.symptoms.map((symptom) => (
                  <li key={symptom}>{symptom}</li>
                ))}
              </ul>
              <h2 className="mn-faq-heading">{detail.procedureTitle || 'Quy trình kiểm tra'}</h2>
              <p className="mn-detail-description">{detail.inspection}</p>
              {service.imagery.detail && <ServiceDetailPhoto photo={service.imagery.detail} />}
            </MobileDisclosure>}
            {searchContent && <MobileDisclosure title="Cách tính chi phí">
              <h2 className="mn-faq-heading">Chi phí {service.title.toLocaleLowerCase('vi')} được xác định thế nào?</h2>
              <p className="mn-detail-description">{searchContent.costFactors}</p>
            </MobileDisclosure>}
            {searchContent && <MobileDisclosure title="Chuẩn bị trước khi hẹn">
              <h2 className="mn-faq-heading">Chuẩn bị trước khi hẹn thợ</h2>
              <p className="mn-detail-description">{searchContent.preparation}</p>
            </MobileDisclosure>}
            <MobileDisclosure title="Thông tin trước khi đặt lịch">
              <Reasons />
              <ServiceExpectations />
            </MobileDisclosure>
            {service.faqs.length > 0 && <MobileDisclosure title="Câu hỏi thường gặp">
              <h2 className="mn-faq-heading">Câu hỏi thường gặp</h2>
              <div className="mt-3" data-reveal="">
                <AnimatedFaqAccordion items={service.faqs} defaultOpenIndex={0} />
              </div>
            </MobileDisclosure>}
            <Actions />
            <nav aria-label="Khu vực nhận yêu cầu" className="mt-8">
              <h2 className="mn-faq-heading">Hẹn dịch vụ tại khu vực của bạn</h2>
              <p className="mn-detail-description">Gửi địa chỉ cụ thể để Minh Nhật xác nhận phạm vi phục vụ và lịch đến; các liên kết dưới đây giúp bạn chọn khu vực.</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {PRIORITY_DISTRICTS.map(area => (
                  <li key={area.slug}>
                    <Link
                      className="inline-flex min-h-[44px] min-w-[60px] items-center justify-center rounded-full border border-[#c6e2f7] bg-white px-4 py-2 text-sm font-bold text-[#05447c] transition-colors hover:border-[#0284c7] hover:bg-[#edf7ff]"
                      href={`/areas/${area.slug}`}
                    >
                      {area.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Dịch vụ và hướng dẫn liên quan" className="mt-8 grid gap-2">
              <h2 className="mn-faq-heading">Dịch vụ và hướng dẫn liên quan</h2>
              {searchContent?.related.map(relatedSlug => {
                const related = services.find(item => item.slug === relatedSlug);
                return related ? <Link className="mn-text-link inline-flex min-h-[44px] items-center" key={relatedSlug} href={`/services/${relatedSlug}`}>{related.title} tại Cần Thơ →</Link> : null;
              })}
              {relatedPosts.map(post => <Link className="mn-text-link inline-flex min-h-[44px] items-center" key={post.slug} href={`/blog/${post.slug}`}>{post.title} →</Link>)}
            </nav>
          </article>
          <aside className="mn-detail-booking mn-panel" data-reveal="" style={{ '--d': '0.12s' } as React.CSSProperties}>
            <h2>Cần tư vấn?</h2>
            <p>Để lại số điện thoại hoặc nhắn Zalo để Minh Nhật hỗ trợ.</p>
            <Actions booking />
          </aside>
        </div>
        <Process />
      </div>
      <JsonLdScript data={serviceJsonLd(service.title, `/services/${slug}`, service.imagery.src)} />
      {service.faqs.length > 0 && <JsonLdScript data={faqJsonLd(service.faqs)} />}
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
