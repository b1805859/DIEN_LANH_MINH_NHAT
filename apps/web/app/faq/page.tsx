import { FAQS } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { faqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Hỏi đáp dịch vụ điện lạnh Cần Thơ',
  description: 'Câu hỏi thường gặp về dịch vụ điện lạnh, máy lạnh, máy giặt, tủ lạnh và điện nước.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <main className="mn-reference-page">
      <PageHero title="Câu hỏi thường gặp" showEyebrow={false} />
      <div className="mn-container mn-reading-content mn-faq-cards mn-tone-section mn-tone-light">
        {FAQS.map((faq) => (
          <section key={faq.question} className="mn-panel mn-faq-card">
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
      </div>
      <JsonLdScript data={faqJsonLd()} />
    </main>
  );
}
