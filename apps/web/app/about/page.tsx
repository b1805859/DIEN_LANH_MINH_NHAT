import { APP_NAME, TARGET_CITY } from '@minhnhat/shared';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `Giới thiệu ${APP_NAME}`,
  description: `Thông tin về ${APP_NAME}, đơn vị điện lạnh và sửa chữa tại ${TARGET_CITY}.`,
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="container py-10 sm:py-12">
      <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Giới thiệu {APP_NAME}</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-700">
        {APP_NAME} tập trung cung cấp dịch vụ điện lạnh và sửa chữa gia đình tại {TARGET_CITY},
        xây dựng trải nghiệm đặt lịch nhanh, báo giá rõ ràng và hỗ trợ khách hàng qua đường dây
        nóng, Zalo và biểu mẫu liên hệ.
      </p>
    </main>
  );
}
