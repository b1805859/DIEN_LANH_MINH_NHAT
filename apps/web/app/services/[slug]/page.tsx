import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronRight, Phone } from 'lucide-react';
import { SERVICES, findService, findServiceContent } from '@minhnhat/shared';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo/json-ld';
import { integrationSettings } from '@/lib/integrations/settings';
import { buildMetadata, localTitle } from '@/lib/seo/metadata';

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  const content = findServiceContent(slug);
  if (!service || !content) return {};
  return buildMetadata({
    title: localTitle(service.name),
    description: content.heroDescription,
    path: `/services/${slug}`,
    image: `/images/services/${slug}.jpg`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  const content = findServiceContent(slug);
  if (!service || !content) notFound();

  const serviceImage = `/images/services/${service.slug}.jpg`;
  const displayServiceName = slug === 'sua-tu-lanh' ? 'Sửa tủ lạnh' : service.name;
  const displayHeroDescription =
    slug === 'sua-tu-lanh'
      ? 'Khắc phục nhanh các sự cố tủ lạnh, giúp thiết bị hoạt động ổn định trở lại.'
      : content.heroDescription;
  const process = [
    { title: 'Tiếp nhận yêu cầu', detail: 'Gọi, nhắn Zalo, xác nhận thông tin nhanh.' },
    {
      title: 'Kiểm tra & báo tình trạng',
      detail: 'Kỹ thuật viên kiểm tra, tư vấn phương án sửa chữa.',
    },
    { title: 'Tiến hành sửa chữa', detail: 'Sửa chữa sau khi thống nhất phương án.' },
    { title: 'Hoàn tất & bàn giao', detail: 'Kiểm tra vận hành và hướng dẫn sử dụng.' },
  ];
  const gallery =
    slug === 'sua-tu-lanh'
      ? [serviceImage, serviceImage, serviceImage, '/images/service-tools.png']
      : [
          serviceImage,
          '/images/services/sua-tu-lanh.jpg',
          '/images/services/nap-gas-may-lanh.jpg',
          '/images/services/ve-sinh-may-giat.jpg',
        ];
  const requestSigns =
    slug === 'sua-tu-lanh'
      ? [
          'Tủ không lạnh hoặc lạnh yếu',
          'Tủ bị đóng tuyết',
          'Tủ chạy liên tục không ngắt',
          'Tủ phát ra tiếng ồn',
          'Tủ bị rỉ nước',
          'Các lỗi khác...',
        ]
      : content.requestSigns;

  return (
    <main
      className={`mock-page mock-inner-page mock-detail ${slug === 'sua-tu-lanh' ? 'mock-detail-fridge' : ''}`}
    >
      <div className="mock-shell">
        <nav className="mock-breadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={15} />
          <Link href="/services">Dịch vụ</Link>
          <ChevronRight size={15} />
          {slug === 'sua-tu-lanh' ? (
            <>
              <span>Tủ lạnh</span>
              <ChevronRight size={15} />
            </>
          ) : null}
          <span>{displayServiceName}</span>
        </nav>
        <div className="mock-detail-hero">
          <div>
            <h1>{displayServiceName} tại Cần Thơ</h1>
            <p>{displayHeroDescription}</p>
            <div className="mock-hero-actions">
              <a
                className="mock-button mock-button-primary"
                href={`tel:${integrationSettings.phone}`}
              >
                <Phone size={20} />
                <span>
                  Gọi ngay<strong>0939 370 109</strong>
                </span>
              </a>
              <a
                className="mock-button mock-button-outline"
                href={integrationSettings.zaloUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/icons/zalo.svg" width={20} height={20} alt="" /> Nhắn Zalo
              </a>
            </div>
          </div>
          <div className="mock-detail-photo">
            <Image
              src={serviceImage}
              alt={`Kỹ thuật viên kiểm tra cho dịch vụ ${service.name}`}
              fill
              priority
              sizes="(min-width: 768px) 48vw, 100vw"
            />
          </div>
        </div>
        <div className="mock-detail-middle">
          <section className="mock-detail-signs">
            <h2>{slug === 'sua-tu-lanh' ? 'Các lỗi tủ lạnh thường gặp' : 'Các lỗi thường gặp'}</h2>
            <ul>
              {requestSigns.slice(0, 6).map((item) => (
                <li key={item}>
                  <Check size={21} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="mock-detail-steps">
            <h2>Quy trình thực hiện</h2>
            <div>
              {process.map((step, i) => (
                <article key={step.title}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <section className="mock-detail-gallery">
          <h2>Hình ảnh dịch vụ</h2>
          <div>
            {gallery.map((src, i) => (
              <div
                className={`mock-detail-gallery-image mock-detail-gallery-image-${i + 1}`}
                key={`${src}-${i}`}
              >
                <Image src={src} alt={`Minh họa hạng mục điện lạnh ${i + 1}`} fill sizes="1448px" />
              </div>
            ))}
          </div>
        </section>
      </div>
      <JsonLdScript data={serviceJsonLd(service.name, `/services/${service.slug}`, serviceImage)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Dịch vụ', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
    </main>
  );
}
