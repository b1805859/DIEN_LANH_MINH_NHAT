import Image from 'next/image';
import type { ServiceImage } from '@/lib/content/site-content';

export function ServiceDetailPhoto({ photo }: { photo: NonNullable<ServiceImage['detail']> }) {
  return (
    <figure className="my-5 max-w-[640px] overflow-hidden rounded-xl border border-sky-100 bg-white">
      <Image
        src={photo.src}
        alt=""
        width={1440}
        height={960}
        sizes="(max-width: 680px) calc(100vw - 48px), (max-width: 1100px) 55vw, 640px"
        loading="lazy"
        className="block h-auto w-full"
      />
      <figcaption className="px-4 py-3 text-sm leading-relaxed text-slate-700">
        {photo.caption} <span className="whitespace-nowrap">(Ảnh minh họa)</span>
      </figcaption>
    </figure>
  );
}
