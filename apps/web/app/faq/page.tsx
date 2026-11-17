import { getWebsiteContent } from '@/lib/content/website-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { faqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';
import { InteractiveFaqHub } from '@/components/faq/interactive-faq-hub';

export const metadata = buildMetadata({
  title: 'Hỏi đáp dịch vụ điện lạnh Cần Thơ',
  description: 'Câu hỏi thường gặp về dịch vụ điện lạnh, máy lạnh, máy giặt, tủ lạnh và điện nước.',
  path: '/faq',
});

export default async function FaqPage() {
  const { faqs } = await getWebsiteContent();
  return (
    <main className="mn-reference-page">
      <PageHero
        title="Câu hỏi thường gặp"
        description="Tìm nhanh giải đáp về quy trình kiểm tra, báo giá minh bạch, thời gian bảo hành và phạm vi phục vụ tại Cần Thơ."
        showEyebrow={false}
      />
      <div className="mn-container mn-reading-content mn-tone-section mn-tone-light">
        <InteractiveFaqHub faqs={faqs} />
      </div>
      <JsonLdScript data={faqJsonLd(faqs)} />
    </main>
  );
}
