import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản sử dụng dịch vụ sửa chữa và bảo trì điện lạnh của Điện Lạnh Minh Nhật.',
  path: '/terms-of-service',
});

export default function TermsPage() {
  return (
    <main className="mn-reference-page">
      <PageHero title="Điều khoản dịch vụ" showEyebrow={false} />
      <div className="mn-container mn-reading-content">
        <article className="mn-article mn-panel">
          <p>
            Khách hàng được báo giá trước khi thực hiện. Chi phí thực tế phụ thuộc tình trạng thiết bị
            và phạm vi công việc.
          </p>
        </article>
      </div>
    </main>
  );
}
