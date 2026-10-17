import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Chính sách bảo mật',
  description: 'Chính sách thu thập, sử dụng và bảo vệ thông tin khách hàng của Điện Lạnh Minh Nhật.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="mn-reference-page">
      <PageHero title="Chính sách bảo mật" showEyebrow={false} />
      <div className="mn-container mn-reading-content">
        <article className="mn-article mn-panel">
          <p>
            Thông tin khách hàng được sử dụng để tư vấn, đặt lịch, báo giá và chăm sóc dịch vụ.
          </p>
        </article>
      </div>
    </main>
  );
}
