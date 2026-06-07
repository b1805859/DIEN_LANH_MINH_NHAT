import Link from 'next/link';
import { SERVICES, TARGET_CITY } from '@minhnhat/shared';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: `Dịch vụ điện lạnh tại ${TARGET_CITY}`,
  description: 'Danh sách dịch vụ điện lạnh, máy giặt, tủ lạnh và điện nước tại Cần Thơ.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold">Dịch vụ điện lạnh tại {TARGET_CITY}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className="rounded-md border p-5">
            <h2 className="font-semibold">{service.name}</h2>
            <p className="mt-2 text-sm text-slate-600">Trang dịch vụ tối ưu SEO và chuyển đổi.</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

