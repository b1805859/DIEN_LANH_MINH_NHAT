import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Chính sách bảo mật',
  description: 'Chính sách thu thập, sử dụng và bảo vệ thông tin khách hàng của Điện Lạnh Minh Nhật.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="container py-10 sm:py-12">
      <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Chính sách bảo mật</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-700">
        Thông tin khách hàng được sử dụng để tư vấn, đặt lịch, báo giá và chăm sóc dịch vụ.
      </p>
    </main>
  );
}
