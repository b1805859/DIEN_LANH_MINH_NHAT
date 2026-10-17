'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Icon } from './ui';
import { useHeroCarousel } from './use-hero-carousel';
import { HeroAirflow } from './hero-airflow';
import { useMotionBudget } from '@/components/ui/use-motion-budget';
import styles from './hero.module.css';

const revisedAssets = new Set([
  'cleaning-main',
  'cleaning-coil',
  'cleaning-angle',
  'support-plumbing',
]);
const asset = (name: string) =>
  name.startsWith('/')
    ? name
    : `/images/redesign/home-carousel/${name}.webp${revisedAssets.has(name) ? '?v=20261015-realism' : ''}`;
const quick = [
  ['snowflake', 'Sửa chữa', 'máy lạnh', '/services/sua-may-lanh'],
  ['washer', 'Sửa chữa', 'máy giặt', '/services/sua-may-giat'],
  ['fridge', 'Sửa chữa', 'tủ lạnh', '/services/sua-tu-lanh'],
  ['plug', 'Điện nước', 'dân dụng', '/services/sua-dien-nuoc'],
  ['clock', 'Hẹn lịch nhanh', 'tại Cần Thơ', '/booking'],
  ['wrench', 'Bảo dưỡng', 'định kỳ', '/services'],
  ['shield', 'Hỗ trợ bảo hành', 'theo hạng mục', '/about'],
  ['pin', 'Phục vụ khắp', 'các khu vực', '/#khu-vuc'],
];
const slides = [
  {
    id: 'family',
    label: 'Đời sống',
    title: 'Không gian sống',
    accent: 'thoải mái hơn',
    description:
      'Giải pháp điện lạnh toàn diện giúp gia đình bạn tận hưởng không gian mát mẻ, trong lành và tiết kiệm điện năng tại Cần Thơ.',
    image: 'family-main',
    alt: 'Gia đình Việt Nam gồm cha mẹ và hai con thư giãn trên sofa dưới máy lạnh trong phòng khách – ảnh minh họa',
    gallery: [
      ['family-living', 'Mẹ và các con sinh hoạt trong phòng khách mát mẻ'],
      ['family-fridge', 'Khách hàng mở tủ lạnh và sắp xếp thực phẩm'],
    ],
  },
  {
    id: 'cleaning',
    label: 'Dịch vụ',
    title: 'Vệ sinh máy lạnh',
    accent: 'Sạch sâu – Mát bền',
    description:
      'Vệ sinh định kỳ giúp máy lạnh hoạt động hiệu quả, tiết kiệm điện và bảo vệ sức khỏe gia đình bạn. Đội ngũ kỹ thuật tại Cần Thơ, thao tác chuyên nghiệp, thiết bị hiện đại.',
    image: 'cleaning-main',
    alt: 'Kỹ thuật viên Việt Nam phun rửa dàn trao đổi nhiệt máy lạnh với túi hứng nước màu xanh lắp dưới dàn lạnh – ảnh minh họa',
    gallery: [
      ['cleaning-coil', 'Cận cảnh vòi nước phun rửa dàn trao đổi nhiệt, nước chảy vào túi hứng'],
      ['cleaning-filter', 'Vệ sinh lưới lọc máy lạnh dưới vòi nước'],
    ],
  },
  {
    id: 'support',
    label: 'Hỗ trợ tận nhà',
    title: 'Đồng hành cùng',
    accent: 'gia đình bạn mỗi ngày',
    description:
      'Từ máy lạnh, máy giặt, tủ lạnh đến điện nước dân dụng, Điện Lạnh Minh Nhật luôn sẵn sàng hỗ trợ nhanh chóng tại Cần Thơ và khu vực lân cận.',
    image: 'washer-main',
    alt: 'Kỹ thuật viên kiểm tra máy giặt cửa trước tại nhà, khách hàng nữ theo dõi và trao đổi – ảnh minh họa',
    gallery: [
      [
        '/images/redesign/carousel-home-visit-apartment.webp',
        'Kỹ thuật viên trao đổi nhu cầu hỗ trợ với khách hàng tại nhà',
      ],
      [
        '/images/redesign/carousel-home-visit-porch.webp',
        'Kỹ thuật viên đến hỗ trợ khách hàng tại nhà',
      ],
    ],
  },
];

export function HomeHero() {
  const motionBudget = useMotionBudget();
  const [heroReady, setHeroReady] = useState(false);
  const [preloadSlides, setPreloadSlides] = useState(false);
  const [visitedSlides, setVisitedSlides] = useState(() => new Set([0]));
  const carousel = useHeroCarousel(slides.length);
  useEffect(() => {
    setVisitedSlides((visited) =>
      visited.has(carousel.active) ? visited : new Set([...visited, carousel.active]),
    );
  }, [carousel.active]);
  useEffect(() => {
    if (!heroReady || motionBudget !== 'full') return;
    const preload = () => setPreloadSlides(true);
    if ('requestIdleCallback' in window) {
      const task = window.requestIdleCallback(preload, { timeout: 2000 });
      return () => window.cancelIdleCallback(task);
    }
    const task = setTimeout(preload, 300);
    return () => clearTimeout(task);
  }, [heroReady, motionBudget]);
  return (
    <section
      ref={carousel.root}
      className={`mn-container mn-home-hero ${styles.carousel}`}
      data-motion-budget={motionBudget}
      role="region"
      aria-label="Điện Lạnh Minh Nhật – đời sống và dịch vụ"
      aria-roledescription="carousel"
      aria-describedby="hero-gesture-help"
      tabIndex={0}
      onKeyDown={carousel.onKeyDown}
    >
      <p id="hero-gesture-help" className={styles.srOnly}>
        Kéo hoặc vuốt sang trái hay phải để chuyển slide theo cả hai chiều. Dùng phím mũi tên khi
        vùng này được chọn.
      </p>
      <div ref={carousel.viewport} className={styles.viewport} {...carousel.handlers}>
        <div className={styles.track}>
          {slides.map((slide, index) => {
            const active = carousel.active === index;
            // CSS-hidden slides still occupy the viewport, so native lazy loading
            // alone would download them. Retain visited slides for the outgoing fade.
            const loadImages = active || preloadSlides || visitedSlides.has(index);
            return (
              <article
                key={slide.id}
                className={`${styles.slide} ${styles[slide.id]} ${active ? styles.active : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={slide.label}
                aria-hidden={!active}
                inert={!active}
              >
                <div className={styles.media}>
                  <div className={styles.stage}>
                    {loadImages && (
                      <Image
                        src={asset(slide.image)}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        fetchPriority={index === 0 ? 'high' : active ? 'auto' : 'low'}
                        loading={
                          index === 0 ? undefined : active || preloadSlides ? 'eager' : 'lazy'
                        }
                        onLoad={index === 0 ? () => setHeroReady(true) : undefined}
                        onError={index === 0 ? () => setHeroReady(true) : undefined}
                        sizes="(max-width: 480px) calc(100vw - 34px), (max-width: 800px) calc(100vw - 50px), (max-width: 1380px) 47vw, 666px"
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.shade} />
                {slide.id === 'family' && <HeroAirflow />}
                <div className={styles.copy}>
                  <h1 className={styles.headline}>
                    {slide.title}
                    <br />
                    <em>{slide.accent}</em>
                  </h1>
                  <p className={styles.description}>{slide.description}</p>
                  <Link className={`mn-button ${styles.booking}`} href="/booking">
                    <CalendarDays size={20} aria-hidden="true" />
                    Đặt lịch ngay
                    <ArrowRight size={20} aria-hidden="true" />
                  </Link>
                  <ul className={styles.benefits} aria-label="Tinh thần phục vụ">
                    {['Tận tâm', 'Nhanh chóng', 'Chuyên nghiệp'].map((benefit) => (
                      <li key={benefit}>
                        <CheckCircle2 size={17} aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={styles.gallery}
                  role="group"
                  aria-label={`Hình ảnh ${slide.label.toLowerCase()}`}
                >
                  {slide.gallery.map(([name, alt]) => (
                    <div className={styles.thumbnail} key={name}>
                      {loadImages && (
                        <Image
                          src={asset(name)}
                          alt={`${alt} – ảnh minh họa`}
                          fill
                          loading={index === 0 || active || preloadSlides ? 'eager' : 'lazy'}
                          fetchPriority={active ? 'auto' : 'low'}
                          sizes="(max-width: 800px) 42vw, (max-width: 1380px) 21vw, 270px"
                          draggable={false}
                          style={
                            name.startsWith('/') ? { objectPosition: 'right center' } : undefined
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <nav className={styles.services} aria-label="Dịch vụ và cam kết">
        {quick.map(([icon, line1, line2, href]) => (
          <Link href={href} key={icon}>
            <span className={styles.serviceIcon}>
              <Icon name={icon} />
            </span>
            <span>
              {line1}
              <br />
              {line2}
            </span>
          </Link>
        ))}
      </nav>
      <span className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {slides[carousel.active].label}
      </span>
    </section>
  );
}
