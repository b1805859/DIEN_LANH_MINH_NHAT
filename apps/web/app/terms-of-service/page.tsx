import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Điều khoản dịch vụ',
  description: 'Điều khoản sử dụng dịch vụ sửa chữa và bảo trì điện lạnh của Điện Lạnh Minh Nhật.',
  path: '/terms-of-service',
});

export default function TermsPage() {
  return (
    <main className="container py-10 sm:py-12">
      <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Điều khoản dịch vụ</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-700">
        Khách hàng được báo giá trước khi thực hiện. Chi phí thực tế phụ thuộc tình trạng thiết bị
        và phạm vi công việc.
      </p>
    </main>
  );
}
