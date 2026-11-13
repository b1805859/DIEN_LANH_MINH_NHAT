import { ContactPageContent } from '@/components/redesign/contact-page';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Liên hệ và tư vấn | Điện Lạnh Minh Nhật',
  description: 'Liên hệ hotline, Zalo hoặc để lại thông tin tư vấn điện lạnh tại Cần Thơ.',
  path: '/contact',
});
export default function ContactPage() {
  return <ContactPageContent />;
}
