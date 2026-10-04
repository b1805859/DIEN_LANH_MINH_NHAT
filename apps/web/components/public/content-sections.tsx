import Image from 'next/image';

export const areaGallery: Record<string, string[]> = {
  'ninh-kieu': [
    '/images/wards/ninh-kieu-dai-lo-hoa-binh.jpg',
    '/images/wards/ninh-kieu-duong-30-4.jpg',
    '/images/wards/ninh-kieu-ngo-duc-ke.jpg',
  ],
  'cai-rang': ['/images/wards/cai-rang-cong-chao.jpg', '/images/wards/cai-rang-cho-le-binh.jpg'],
  'binh-thuy': [
    '/images/wards/binh-thuy-stella-mega-city.jpg',
    '/images/wards/binh-thuy-long-tuyen-road.jpg',
  ],
  'o-mon': ['/images/wards/o-mon-do-thi.jpg', '/images/wards/o-mon-tran-hung-dao.jpg'],
};

export function ImageGallery({ items }: { items: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-motion-stagger="60">
      {items.map((src, index) => (
        <div
          key={`${src}-${index}`}
          data-motion-hover="image"
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
        >
          <Image
            src={src}
            alt={`Hình ảnh khu vực ${index + 1}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}
