import { getWebsiteContent } from '@/lib/content/website-content';
import { HomeMockupTop, HomePreFooterCta } from '@/components/home-mockup/home-mockup';
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
      <HomeMockupTop services={services} />
      <div className="mn-home-content">
        <div className="mn-home-coverage-band">
          <VerifiedServiceArea revealIntro />
        </div>
      </div>
      <HomePreFooterCta />
    </main>
  );
}
