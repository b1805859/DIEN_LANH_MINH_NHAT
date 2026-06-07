import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, findDistrict } from '@minhnhat/shared';
import { BookingForm } from '@/components/forms/booking-form';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const district = findDistrict(locationSlug);
  if (!district) return {};
  return buildMetadata({
    title: `Dịch vụ điện lạnh ${district.name}, Cần Thơ`,
    description: `Dịch vụ điện lạnh và sửa chữa tận nơi tại ${district.name}, Cần Thơ.`,
    path: `/areas/${locationSlug}`,
  });
}

export default async function DistrictPage({ params }: { params: Promise<{ locationSlug: string }> }) {
  const { locationSlug } = await params;
  const district = findDistrict(locationSlug);
  if (!district) notFound();

  return (
    <main className="container grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
      <article>
        <h1 className="text-4xl font-bold">Dịch vụ điện lạnh tại {district.name}</h1>
        <p className="mt-4 text-slate-700">
          Hỗ trợ nhanh các dịch vụ máy lạnh, máy giặt, tủ lạnh và điện nước tại {district.name}.
        </p>
        <h2 className="mt-8 text-2xl font-semibold">Dịch vụ có sẵn</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/areas/${district.slug}/${service.slug}`}
              className="rounded-md border p-4"
            >
              {service.name} {district.name}
            </Link>
          ))}
        </div>
      </article>
      <aside className="rounded-md border p-5">
        <h2 className="text-xl font-semibold">Đặt lịch tại {district.name}</h2>
        <div className="mt-4">
          <BookingForm compact />
        </div>
      </aside>
    </main>
  );
}

