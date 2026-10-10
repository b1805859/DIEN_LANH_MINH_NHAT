import { ContactPageContent } from '@/components/redesign/contact-page';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Liên hệ Điện Lạnh Minh Nhật',
  description: 'Liên hệ hotline, Zalo hoặc gửi yêu cầu dịch vụ điện lạnh tại Cần Thơ.',
  path: '/contact',
});
export default function ContactPage() {
  return <ContactPageContent contact />;
}
