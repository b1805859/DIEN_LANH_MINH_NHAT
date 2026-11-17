import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { PageHero } from '@/components/redesign/ui';

export const metadata = buildMetadata({
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản sử dụng dịch vụ sửa chữa và bảo trì điện lạnh của Điện Lạnh Minh Nhật.',
  path: '/terms-of-service',
});

const TERMS_ITEMS = [
  {
    title: '1. Kiểm tra & báo giá trước',
    body: 'Kỹ thuật viên kiểm tra thực tế và thống nhất chi phí với khách hàng trước khi tiến hành sửa chữa hoặc thay thế linh kiện.',
  },
  {
    title: '2. Nghiệm thu tại chỗ',
    body: 'Sau khi hoàn thành, thiết bị được chạy thử ổn định để khách hàng kiểm tra trực tiếp trước khi bàn giao.',
  },
  {
    title: '3. Bảo hành rõ ràng',
    body: 'Các hạng mục sửa chữa và linh kiện thay thế được áp dụng chế độ bảo hành minh bạch theo từng nhóm thiết bị.',
  },
];

export default function TermsPage() {
  return (
    <main className="mn-reference-page">
      <PageHero
        title="Điều khoản dịch vụ"
        description="Nguyên tắc làm việc minh bạch từ khâu tiếp nhận yêu cầu, báo giá đến nghiệm thu và bảo hành."
        showEyebrow={false}
      />
      <div className="mn-container mn-reading-content mn-tone-section mn-tone-light">
        <article className="mn-article mn-panel space-y-5" data-reveal="">
          <p className="m-0 text-base leading-relaxed text-[#143052]">
            Khách hàng được báo giá trước khi thực hiện. Chi phí thực tế phụ thuộc tình trạng thiết bị và phạm vi công việc.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {TERMS_ITEMS.map((item) => (
              <section key={item.title} className="rounded-xl border border-[#cce4f7] bg-[#f5faff] p-4">
                <h2 className="m-0 text-[15px] font-extrabold text-[#061c3d]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#2c4a6b]">{item.body}</p>
              </section>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center rounded-full bg-[#0277bd] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#015f98]"
            >
              Xem tất cả dịch vụ
            </Link>
            <Link
              href="/contact#tu-van"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[#bde0f8] bg-white px-5 py-2 text-sm font-bold text-[#05447c] transition-colors hover:bg-[#eef7ff]"
            >
              Đặt lịch tư vấn
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
