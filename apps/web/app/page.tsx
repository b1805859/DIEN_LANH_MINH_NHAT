import { getWebsiteContent } from '@/lib/content/website-content';
import { IceBlueHome } from '@/components/home-ice-blue/home';
import { Process } from '@/components/redesign/ui';
import { VerifiedServiceArea } from '@/components/redesign/verified-service-area';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Điện lạnh Cần Thơ – Sửa chữa, vệ sinh, lắp đặt | Minh Nhật',
  description:
    'Điện Lạnh Minh Nhật – sửa chữa, vệ sinh, lắp đặt máy lạnh, máy giặt, tủ lạnh và điện nước tại Cần Thơ.',
  path: '/',
});
export default async function HomePage() {
  const { services } = await getWebsiteContent();
  return (
    <main className="mn-home">
      <IceBlueHome services={services} />
      <div className="mn-home-content">
        <div className="mn-container">
          <Process />
        </div>
        <div className="mn-home-coverage-band">
          <VerifiedServiceArea revealIntro />
        </div>
      </div>
    </main>
  );
}
