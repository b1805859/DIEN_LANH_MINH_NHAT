import {
  AreasHero,
  AreaGrid,
  NearbyAreas,
  TrustBar,
  BookingSection,
} from '@/components/areas-reference/sections';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import styles from '@/components/areas-reference/areas.module.css';

export const metadata = buildMetadata({
  title: 'Khu vực phục vụ Điện Lạnh Minh Nhật Cần Thơ',
  description:
    'Dịch vụ điện lạnh tận nơi tại các quận huyện Cần Thơ và khu vực lân cận. Sửa chữa, vệ sinh, lắp đặt cùng Điện Lạnh Minh Nhật.',
  path: '/areas',
  image: '/images/areas/hero-can-tho.webp',
});

export default function AreasPage() {
  return (
    <main className={styles.page}>
      <AreasHero />
      <AreaGrid />
      <NearbyAreas />
      <TrustBar />
      <BookingSection />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Khu vực', path: '/areas' },
        ])}
      />
    </main>
  );
}
