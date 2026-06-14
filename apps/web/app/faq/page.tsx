import { FAQS } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { faqJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Hỏi đáp dịch vụ điện lạnh Cần Thơ',
  description: 'Câu hỏi thường gặp về dịch vụ điện lạnh, máy lạnh, máy giặt, tủ lạnh và điện nước.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <main className="container py-10 sm:py-12">
      <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Câu hỏi thường gặp</h1>
      <div className="mt-8 grid gap-4">
        {FAQS.map((faq) => (
          <section key={faq.question} className="rounded-md border p-4 sm:p-5">
            <h2 className="font-semibold">{faq.question}</h2>
            <p className="mt-2 leading-7 text-slate-700">{faq.answer}</p>
          </section>
        ))}
      </div>
      <JsonLdScript data={faqJsonLd()} />
    </main>
  );
}
