import Link from 'next/link';
import { getWebsiteContent } from '@/lib/content/website-content';
import { notFound } from 'next/navigation';
import { PRIORITY_DISTRICTS, findDistrict } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { Actions, PageHero, Reasons, SectionHeading, ServiceGrid } from '@/components/redesign/ui';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
export function generateStaticParams() {
  return PRIORITY_DISTRICTS.map((ward) => ({ locationSlug: ward.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) return {};
  return buildMetadata({
    title: `Dịch vụ điện lạnh ${ward.name}, Cần Thơ`,
    description: `Dịch vụ điện lạnh và sửa chữa tận nơi tại ${ward.name}, Cần Thơ.`,
    path: `/areas/${locationSlug}`,
    image: ward.image,
  });
}
export default async function WardPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const ward = findDistrict(locationSlug);
  if (!ward) notFound();
  const { services } = await getWebsiteContent();
  return (
    <main>
      <PageHero
        title="Dịch vụ điện lạnh"
        accent={`tại ${ward.name}`}
        description={`Minh Nhật hỗ trợ sửa chữa, vệ sinh và lắp đặt tận nơi tại ${ward.highlight}. Gửi địa chỉ để Minh Nhật xác nhận lịch đến.`}
        image={ward.image}
        label="Khu vực phục vụ Cần Thơ"
      />
      <div className="mn-container">
        <nav
          aria-label="Chuyển nhanh quận huyện Cần Thơ"
          className="mt-6 flex flex-wrap items-center gap-2.5 rounded-2xl border border-[#cce4f7] bg-white p-3 shadow-sm"
          data-reveal=""
        >
          <span className="px-2 text-xs font-extrabold uppercase tracking-wider text-[#05447c]">
            Khu vực Cần Thơ:
          </span>
          {PRIORITY_DISTRICTS.map((area) => {
            const active = area.slug === ward.slug;
            return (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-[44px] min-w-[60px] items-center justify-center rounded-full border px-4 py-2 text-[13.5px] font-bold transition-colors ${
                  active
                    ? 'border-[#0277bd] bg-[#0277bd] text-white shadow-sm'
                    : 'border-[#c8e3f8] bg-[#f4faff] text-[#061c3d] hover:border-[#0284c7] hover:bg-[#e5f4ff]'
                }`}
              >
                {area.shortName}
              </Link>
            );
          })}
        </nav>
        <section className="mn-section mn-tone-section mn-tone-light">
          <SectionHeading title="Chọn dịch vụ" accent="cần hỗ trợ" />
          <ServiceGrid areaSlug={ward.slug} services={services} />
        </section>
        <div className="mn-detail-layout mn-area-booking mn-tone-section mn-tone-deep">
          <article>
            <SectionHeading title="Tư vấn" accent="dịch vụ tại nhà" />
            <Reasons />
          </article>
          <aside className="mn-detail-booking mn-panel" data-reveal="" style={{ '--d': '0.12s' } as React.CSSProperties}>
            <h2>Cần tư vấn?</h2>
            <p>Để lại số điện thoại hoặc nhắn Zalo để Minh Nhật hỗ trợ.</p>
            <Actions booking />
          </aside>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Khu vực phục vụ', path: '/services' },
          { name: ward.name, path: `/areas/${ward.slug}` },
        ])}
      />
    </main>
  );
}
