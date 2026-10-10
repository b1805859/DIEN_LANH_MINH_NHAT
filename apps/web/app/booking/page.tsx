import { ContactPageContent } from '@/components/redesign/contact-page';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Đặt lịch dịch vụ điện lạnh Cần Thơ',
  description: 'Gửi yêu cầu sửa chữa, vệ sinh, lắp đặt điện lạnh tại Cần Thơ.',
  path: '/booking',
});
export default function BookingPage() {
  return <ContactPageContent />;
}
