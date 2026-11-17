import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Chính sách bảo mật',
  description: 'Chính sách thu thập, sử dụng và bảo vệ thông tin khách hàng của Điện Lạnh Minh Nhật.',
  path: '/privacy-policy',
});

const PRIVACY_SECTIONS = [
  {
    title: '1. Phạm vi thông tin tiếp nhận',
    body: 'Minh Nhật chỉ tiếp nhận họ tên, số điện thoại và khu vực/tình trạng thiết bị khi bạn chủ động gửi biểu mẫu tư vấn hoặc liên hệ qua hotline, Zalo.',
  },
  {
    title: '2. Mục đích sử dụng thông tin',
    body: 'Thông tin được dùng để liên hệ xác nhận lịch hẹn, khảo sát thiết bị, báo giá minh bạch trước khi thực hiện và hỗ trợ bảo hành sau dịch vụ.',
  },
  {
    title: '3. Bảo vệ dữ liệu khách hàng',
    body: 'Dữ liệu liên hệ không được chia sẻ cho bên thứ ba ngoài phạm vi điều phối kỹ thuật viên phục vụ đúng yêu cầu của bạn.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="mn-reference-page">
      <PageHero
        title="Chính sách bảo mật"
        description="Cam kết thu thập tối thiểu và sử dụng đúng mục đích tư vấn, xác nhận lịch và bảo hành dịch vụ."
        showEyebrow={false}
      />
      <div className="mn-container mn-reading-content mn-tone-section mn-tone-light">
        <article className="mn-article mn-panel space-y-5" data-reveal="">
          <p className="m-0 text-base leading-relaxed text-[#143052]">
            Khi bạn gửi yêu cầu tư vấn, Minh Nhật dùng họ tên và số điện thoại để gọi lại và hỗ trợ. Thông tin từ biểu mẫu hẹn thợ được dùng để xác nhận lịch, báo giá và chăm sóc dịch vụ.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PRIVACY_SECTIONS.map((sec) => (
              <section key={sec.title} className="rounded-xl border border-[#cce4f7] bg-[#f5faff] p-4">
                <h2 className="m-0 text-[15px] font-extrabold text-[#061c3d]">{sec.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#2c4a6b]">{sec.body}</p>
              </section>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/contact#tu-van"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#0277bd] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#015f98]"
            >
              Liên hệ hỗ trợ
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[#bde0f8] bg-white px-5 py-2 text-sm font-bold text-[#05447c] transition-colors hover:bg-[#eef7ff]"
            >
              Xem câu hỏi thường gặp
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
