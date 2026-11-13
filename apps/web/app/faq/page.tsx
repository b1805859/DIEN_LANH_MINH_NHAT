import { getWebsiteContent } from '@/lib/content/website-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { faqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Hỏi đáp dịch vụ điện lạnh Cần Thơ',
  description: 'Câu hỏi thường gặp về dịch vụ điện lạnh, máy lạnh, máy giặt, tủ lạnh và điện nước.',
  path: '/faq',
});

export default async function FaqPage() {
  const { faqs } = await getWebsiteContent();
  return (
    <main className="mn-reference-page">
      <PageHero title="Câu hỏi thường gặp" showEyebrow={false} />
      <div className="mn-container mn-reading-content mn-faq-cards mn-tone-section mn-tone-light">
        {faqs.map((faq, index) => (
          <section
            key={faq.question}
            className="mn-panel mn-faq-card"
            data-reveal=""
            style={{ '--d': `${(index % 4) * 0.08}s` } as React.CSSProperties}
          >
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
      </div>
      <JsonLdScript data={faqJsonLd(faqs)} />
    </main>
  );
}
