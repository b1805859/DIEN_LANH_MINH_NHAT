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
      <div className="mn-container mn-reading-content mn-tone-section mn-tone-light">
        <article className="mn-article mn-panel" data-reveal="">
          <p>
            Khi bạn gửi yêu cầu tư vấn, Minh Nhật dùng họ tên và số điện thoại để gọi lại và hỗ trợ. Thông tin từ biểu mẫu hẹn thợ được dùng để xác nhận lịch, báo giá và chăm sóc dịch vụ.
          </p>
        </article>
      </div>
    </main>
  );
}
