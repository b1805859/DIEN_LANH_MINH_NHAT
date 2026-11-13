import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { WebsiteService } from '@/lib/content/website-content';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import { equipmentGroups } from '@/lib/content/equipment-groups';
import { EquipmentPicker } from './equipment-picker';
import styles from './home.module.css';
import { ReferenceArt } from './reference-art';
import { CursorGlowGrid } from './cursor-glow-grid';
import { StaggeredServiceCards } from './staggered-service-cards';
import { ScrollRevealCopy } from './scroll-reveal-copy';

const featured = ['sua-may-lanh', 've-sinh-may-lanh', 'lap-dat-may-lanh'];
// Short home teasers; the full descriptions remain on the catalogue/detail pages.
const featuredSummaries: Record<string, string> = {
  'sua-may-lanh': 'Xử lý nhanh các lỗi máy lạnh không lạnh, chảy nước, kêu ồn...',
  've-sinh-may-lanh': 'Làm sạch dàn lạnh, dàn nóng, giúp máy hoạt động hiệu quả.',
  'lap-dat-may-lanh': 'Tư vấn vị trí, lắp đặt đúng kỹ thuật, thẩm mỹ cao.',
};
const featuredArt = new Map([['sua-may-lanh', 32], ['ve-sinh-may-lanh', 389], ['lap-dat-may-lanh', 743]]);
const deviceRegions = [
  [336, 660, 102, 91], [460, 638, 102, 113], [567, 638, 101, 113],
  [689, 638, 102, 113], [817, 638, 102, 108], [940, 638, 102, 113],
];
function Illustration({ index }: { index: number }) {
  const [x, y, width, height] = deviceRegions[index];
  return <span className={styles.deviceBox} aria-hidden="true"><ReferenceArt x={x} y={y} width={width} height={height} className={styles.deviceIllustration} /></span>;
}

export function IceBlueHome({ services }: { services: WebsiteService[] }) {
  return <div className={styles.home}>
    <div className={`${styles.frame} approved-home-frame`}>
      <EquipmentPicker
        phoneHref={siteContent.phoneHref}
        art={<ReferenceArt x={430} y={40} width={692} height={574} className={styles.heroSource} priority />}
        groups={equipmentGroups.map((group, index) => {
          const all = group.slugs.flatMap(slug => services.find(service => service.slug === slug) ?? []);
          const primary = group.id === 'air-conditioner' ? featured.flatMap(slug => all.find(service => service.slug === slug) ?? []) : all;
          return {
            id: group.id, label: group.label, icon: group.icon, image: <Illustration index={index} />,
            content: <StaggeredServiceCards className={`${styles.services} ${group.id === 'air-conditioner' ? styles.acServices : ''}`} labelledBy={`heading-${group.id}`}>
              <div className={styles.sectionHeading}>
                <div>
                  <ScrollRevealCopy id={`heading-${group.id}`} title={group.heading} underline>
                    {group.id === 'air-conditioner'
                      ? <>Giải pháp trọn gói cho máy lạnh tại nhà.<br />Nhanh gọn, đúng kỹ thuật, sạch sẽ.</>
                      : 'Chọn dịch vụ bạn cần. Minh Nhật kiểm tra và báo giá trước khi làm.'}
                  </ScrollRevealCopy>
                </div>
                <Link href="/services" className={styles.allServices}>Xem tất cả dịch vụ<ArrowRight size={18} aria-hidden="true" /></Link>
              </div>
              <CursorGlowGrid className={styles.serviceGrid}>
                {primary.map((service, cardIndex) => {
                  const original = serviceCards.find((card) => card.slug === service.slug);
                  const art = original?.imagery.src === service.imagery.src ? featuredArt.get(service.slug) : undefined;
                  return <article key={service.slug} className={`${styles.card} ${group.id === 'air-conditioner' ? styles.featuredCard : ''}`} data-tone={cardIndex % 3} data-u228-card data-u251-card data-reveal="" style={{ '--d': `${cardIndex * 0.08}s` } as React.CSSProperties}>
                  <div className={styles.cardCopy}>
                    <h3>{service.title}</h3><p>{(original?.description === service.description ? featuredSummaries[service.slug] : undefined) ?? service.description}</p>
                    <Link href={`/services/${service.slug}`} aria-label={`Xem chi tiết: ${service.title}`}>Xem chi tiết<ArrowRight size={16} aria-hidden="true" /></Link>
                  </div>
                  {art !== undefined ? (
                    <ReferenceArt x={art} y={962} width={347} height={200} className={styles.featuredBackdrop} />
                  ) : <span className={styles.cardBackdrop} aria-hidden="true">
                    <Image
                      src={service.imagery.src}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 600px) 55vw, 280px"
                      style={{ objectPosition: service.imagery.cardPosition }}
                    />
                  </span>}
                </article>;
                })}
              </CursorGlowGrid>

            </StaggeredServiceCards>,
          };
        })}
      />
    </div>
  </div>;
}
