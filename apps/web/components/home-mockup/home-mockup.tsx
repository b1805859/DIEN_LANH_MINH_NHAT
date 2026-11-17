'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircleMore,
  Snowflake,
  Sparkles,
} from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { CursorGlowGrid } from '@/components/home-ice-blue/cursor-glow-grid';
import { observeHeroEntrance } from '@/components/home-ice-blue/hero-entrance';
import { HeroWords } from '@/components/home-ice-blue/hero-words';
import u216Styles from '@/components/home-ice-blue/staggered-hero.module.css';
import { StaggeredServiceCards } from '@/components/home-ice-blue/staggered-service-cards';
import type { WebsiteService } from '@/lib/content/website-content';
import { siteContent } from '@/lib/content/site-content';
import {
  AboutDiamondIcon,
  AboutPriceTagIcon,
  AboutSupportIcon,
  AboutTeamIcon,
  AcUnitIcon,
  CrossedToolsIcon,
  FridgeIcon,
  HeroAwardIcon,
  HeroBoltIcon,
  HeroShieldIcon,
  PlumbingIcon,
  PreFooterChatIcon,
  ReviewBadgeChatStarsIcon,
  ReviewPinIcon,
  ReviewQuoteCloseIcon,
  ReviewQuoteOpenIcon,
  ReviewSparklesIcon,
  ReviewStarIcon,
  ReviewUserCircleIcon,
  SolidPhoneIcon,
  StepHeadsetIcon,
  StepSearchIcon,
  StepShieldIcon,
  WasherIcon,
  WaterDispenserIcon,
  WaterHeaterIcon,
} from './appliance-icons';
import styles from './home-mockup.module.css';

const revealBottomInset = 48;

function MockupRevealHeading({
  id,
  firstLine,
  secondLine,
  className,
}: {
  id?: string;
  firstLine: string;
  secondLine?: string;
  className?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scrollState, setScrollState] = useState<'in' | 'pending'>('in');

  useEffect(() => {
    const element = headingRef.current;
    if (!element || typeof IntersectionObserver !== 'function') return;

    const isBelowRevealZone = () =>
      element.getBoundingClientRect().top >= window.innerHeight - revealBottomInset;

    if (!element.getClientRects().length || !isBelowRevealZone()) {
      setScrollState('in');
      return;
    }

    setScrollState('pending');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          setScrollState('in');
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px -${revealBottomInset}px 0px`, threshold: 0.04 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const firstWordCount = firstLine.trim().split(/\s+/).length;

  return (
    <h2
      ref={headingRef}
      id={id}
      className={className}
      aria-label={secondLine ? `${firstLine} ${secondLine}` : firstLine}
      data-scroll-copy={scrollState}
    >
      <HeroWords text={firstLine} />
      {secondLine ? (
        <>
          {' '}
          <br />
          <HeroWords text={secondLine} start={firstWordCount} />
        </>
      ) : null}
    </h2>
  );
}

type EquipmentOption = {
  id: string;
  labelLines: [string] | [string, string];
  Icon: typeof AcUnitIcon;
  primarySlug: string;
  relatedSlugs: string[];
  actionLabel: string;
  symptoms: string[];
};

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'may-lanh',
    labelLines: ['Máy lạnh'],
    Icon: AcUnitIcon,
    primarySlug: 'sua-may-lanh',
    relatedSlugs: ['sua-may-lanh', 've-sinh-may-lanh', 'lap-dat-may-lanh'],
    actionLabel: 'Xem dịch vụ Máy lạnh',
    symptoms: ['Máy lạnh không mát / yếu lạnh', 'Chảy nước dàn lạnh', 'Kêu to, báo lỗi chớp đèn'],
  },
  {
    id: 'may-giat',
    labelLines: ['Máy giặt'],
    Icon: WasherIcon,
    primarySlug: 'sua-may-giat',
    relatedSlugs: ['sua-may-giat'],
    actionLabel: 'Xem dịch vụ Máy giặt',
    symptoms: ['Không vắt / không xả nước', 'Rung lắc mạnh khi vắt', 'Máy báo lỗi bo mạch'],
  },
  {
    id: 'tu-lanh',
    labelLines: ['Tủ lạnh'],
    Icon: FridgeIcon,
    primarySlug: 'sua-tu-lanh',
    relatedSlugs: ['sua-tu-lanh'],
    actionLabel: 'Xem dịch vụ Tủ lạnh',
    symptoms: ['Ngăn mát không lạnh', 'Đóng tuyết dày / rò nước', 'Block chạy liên tục không ngắt'],
  },
  {
    id: 'dien-nuoc',
    labelLines: ['Điện nước'],
    Icon: PlumbingIcon,
    primarySlug: 'sua-dien-nuoc',
    relatedSlugs: ['sua-dien-nuoc'],
    actionLabel: 'Xem dịch vụ Điện nước',
    symptoms: ['Rò rỉ ống nước âm tường', 'Chập CB / mất điện cục bộ', 'Thay vòi, bồn rửa, máy bơm'],
  },
  {
    id: 'may-nuoc-uong',
    labelLines: ['Máy nước uống', 'nóng lạnh'],
    Icon: WaterDispenserIcon,
    primarySlug: 'sua-lap-may-nuoc-uong-nong-lanh',
    relatedSlugs: [],
    actionLabel: 'Sửa, lắp máy nước uống nóng lạnh',
    symptoms: ['Nước không nóng / không lạnh', 'Rò rỉ nước dưới đáy máy', 'Vệ sinh khử khuẩn bình chứa'],
  },
  {
    id: 'may-nuoc-nong',
    labelLines: ['Máy nước nóng'],
    Icon: WaterHeaterIcon,
    primarySlug: 'sua-lap-may-nuoc-nong-lanh-tam',
    relatedSlugs: [],
    actionLabel: 'Sửa, lắp máy nước nóng tắm',
    symptoms: ['Nước không nóng / yếu nhiệt', 'Nhảy chống giật ELCB', 'Lắp đặt máy mới an toàn'],
  },
];

type MockupServiceCard = {
  slug: string;
  titleLines: [string, string];
  alt: string;
  image: string;
  objectPosition: string;
};

const MOCKUP_SERVICES: MockupServiceCard[] = [
  {
    slug: 'sua-may-lanh',
    titleLines: ['Sửa chữa', 'máy lạnh'],
    alt: 'Mở mặt nạ dàn lạnh kiểm tra bo mạch máy lạnh bằng đồng hồ đo điện',
    image: '/images/home-mockup/card-1-ac-pcb-repair.webp',
    objectPosition: 'center center',
  },
  {
    slug: 've-sinh-may-lanh',
    titleLines: ['Vệ sinh', 'máy lạnh'],
    alt: 'Xịt rửa dàn lạnh máy lạnh bằng súng phun nước áp suất cao có bạt hứng',
    image: '/images/home-mockup/card-2-ac-pressure-spray.webp',
    objectPosition: 'center center',
  },
  {
    slug: 'lap-dat-may-lanh',
    titleLines: ['Lắp đặt', 'máy lạnh'],
    alt: 'Cận cảnh đôi tay đo thước thủy và bắt ke giá đỡ máy lạnh lên tường',
    image: '/images/home-mockup/card-3-bracket-hands.webp',
    objectPosition: 'center center',
  },
  {
    slug: 'sua-may-giat',
    titleLines: ['Sửa chữa', 'máy giặt'],
    alt: 'Mở nắp sau máy giặt kiểm tra puly lồng giặt, dây curoa và mô tơ truyền động',
    image: '/images/home-mockup/card-4-washer-motor-belt.webp',
    objectPosition: 'center center',
  },
  {
    slug: 'sua-tu-lanh',
    titleLines: ['Sửa chữa', 'tủ lạnh'],
    alt: 'Mở khoang máy sau tủ lạnh đo kiểm tra rơ le khởi động và lốc nén bằng đồng hồ điện tử',
    image: '/images/home-mockup/card-5-fridge-relay-probe.webp',
    objectPosition: 'center center',
  },
  {
    slug: 'sua-dien-nuoc',
    titleLines: ['Sửa chữa', 'điện nước'],
    alt: 'Sửa chữa đường ống nước và thiết bị điện nước dân dụng',
    image: '/images/home-mockup/card-6-v8.jpg',
    objectPosition: 'center center',
  },
];

const PROCESS_STEPS = [
  {
    number: 1,
    title: 'Tiếp nhận yêu cầu',
    descLines: ['Tư vấn, lấy thông tin', 'nhu cầu'] as const,
    detail: 'Ghi nhận model thiết bị, dấu hiệu hư hỏng và quận/huyện tại Cần Thơ để điều phối kỹ thuật viên phù hợp nhất.',
    Icon: StepHeadsetIcon,
  },
  {
    number: 2,
    title: 'Kiểm tra & chẩn đoán',
    descLines: ['Xác định tình trạng', 'thiết bị'] as const,
    detail: 'Đo kiểm thông số trực tiếp tại nhà, chỉ rõ nguyên nhân gốc rễ và báo giá minh bạch trước khi thao tác.',
    Icon: StepSearchIcon,
  },
  {
    number: 3,
    title: 'Thực hiện dịch vụ',
    descLines: ['Sửa chữa, vệ sinh', 'hoặc lắp đặt'] as const,
    detail: 'Che chắn khu vực thi công sạch sẽ, thao tác chuẩn kỹ thuật, đảm bảo an toàn điện và độ bền thiết bị.',
    Icon: CrossedToolsIcon,
  },
  {
    number: 4,
    title: 'Bàn giao & hỗ trợ',
    descLines: ['Hướng dẫn sử dụng', 'và bảo hành'] as const,
    detail: 'Cho máy chạy kiểm tra tải ổn định cùng gia chủ, bàn giao gọn gàng và kích hoạt bảo hành 3–6 tháng.',
    Icon: StepShieldIcon,
  },
];

type CustomerReviewItem = {
  id: string;
  name: string;
  district: string;
  avatar: string;
  spotlightImage: string;
  rating: string;
  quote: string;
  serviceLabel: string;
  serviceSlug: string;
  ServiceIcon: typeof AcUnitIcon;
};

const FEATURED_DEFAULT_REVIEW: CustomerReviewItem = {
  id: 'nguyen-van-hung',
  name: 'Anh Nguyễn Văn Hưng',
  district: 'Quận Ninh Kiều, Cần Thơ',
  avatar: '/images/home-mockup/review-featured-living.webp',
  spotlightImage: '/images/home-mockup/review-featured-living.webp',
  rating: '5.0/5',
  quote:
    'Dịch vụ rất chuyên nghiệp, kỹ thuật viên đến đúng giờ, kiểm tra kỹ và sửa nhanh. Máy lạnh hoạt động lại ổn định, mát sâu như mới. Tôi rất hài lòng và sẽ tiếp tục ủng hộ Điện Lạnh Minh Nhật!',
  serviceLabel: 'Sửa chữa máy lạnh',
  serviceSlug: 'sua-may-lanh',
  ServiceIcon: CrossedToolsIcon,
};

const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'tran-thi-mai',
    name: 'Chị Trần Thị Mai',
    district: 'Quận Cái Răng',
    avatar: '/images/home-mockup/review-avatar-1.jpg',
    spotlightImage: '/images/home-mockup/review-spotlight-mai.webp',
    rating: '5.0/5',
    quote:
      'Lắp đặt máy lạnh rất nhanh, gọn gàng, tư vấn nhiệt tình. Máy chạy êm và làm mát tốt.”',
    serviceLabel: 'Lắp đặt máy lạnh',
    serviceSlug: 'lap-dat-may-lanh',
    ServiceIcon: AcUnitIcon,
  },
  {
    id: 'le-quoc-bao',
    name: 'Anh Lê Quốc Bảo',
    district: 'Quận Bình Thủy',
    avatar: '/images/home-mockup/review-avatar-2.jpg',
    spotlightImage: '/images/home-mockup/review-spotlight-bao.webp',
    rating: '5.0/5',
    quote:
      'Vệ sinh máy lạnh kỹ, sạch sẽ, máy mát hơn hẳn và tiết kiệm điện rõ rệt.”',
    serviceLabel: 'Vệ sinh máy lạnh',
    serviceSlug: 've-sinh-may-lanh',
    ServiceIcon: ReviewSparklesIcon,
  },
  {
    id: 'pham-ngoc-anh',
    name: 'Chị Phạm Ngọc Anh',
    district: 'Quận Ô Môn',
    avatar: '/images/home-mockup/review-avatar-3.jpg',
    spotlightImage: '/images/home-mockup/review-spotlight-ngocanh.webp',
    rating: '5.0/5',
    quote:
      'Gọi hỗ trợ rất nhanh, tác phong chuyên nghiệp, giá cả minh bạch, rất đáng tin cậy!”',
    serviceLabel: 'Sửa chữa máy giặt',
    serviceSlug: 'sua-may-giat',
    ServiceIcon: CrossedToolsIcon,
  },
];

const ALL_REVIEWS: CustomerReviewItem[] = [FEATURED_DEFAULT_REVIEW, ...CUSTOMER_REVIEWS];

export function HomeMockupTop({ services }: { services: WebsiteService[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [selectedEquipment, setSelectedEquipment] = useState<string>('may-lanh');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [featuredReviewIdx, setFeaturedReviewIdx] = useState<number>(0);

  useLayoutEffect(() => {
    const section = heroRef.current;
    const site = section?.closest<HTMLElement>(`.${u216Styles.u216}`);
    if (section && site) return observeHeroEntrance(site, section);
  }, []);

  const activeOption =
    EQUIPMENT_OPTIONS.find((item) => item.id === selectedEquipment) || EQUIPMENT_OPTIONS[0];
  const validSlugs = new Set(services.map((s) => s.slug));
  const currentStep = PROCESS_STEPS[activeStep] ?? PROCESS_STEPS[0];
  const activeReview = ALL_REVIEWS[featuredReviewIdx] ?? FEATURED_DEFAULT_REVIEW;
  const ActiveFeaturedServiceIcon = activeReview.ServiceIcon;

  const handleSelectEquipment = (id: string) => {
    setSelectedEquipment(id);
    setHasInteracted(true);
  };

  return (
    <div className={styles.pageWrap}>
      {/* Hero Banner with Staggered Word & Art Entrance (u216) */}
      <section
        ref={heroRef}
        className={styles.heroBand}
        aria-label="Giới thiệu Điện lạnh Minh Nhật"
      >
        <div className={styles.heroBackdropMedia} aria-hidden="true">
          <div className={styles.heroSceneWrap} data-u216="backdrop">
            <Image
              src="/images/home-mockup/hero-mockup-v4.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1580px"
              className={styles.heroBgImg}
            />
          </div>
          <div className={styles.heroLeftReadabilityVeil} />
        </div>

        {/* Mockup bottom-right two-tone curved blue wave */}
        <svg
          className={styles.heroWaveSvg}
          viewBox="0 0 620 260"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M140 260C315 224 468 158 620 42V260H140Z"
            fill="url(#mnHeroWaveOuter)"
          />
          <path
            d="M235 260C382 228 504 176 620 96V260H235Z"
            fill="url(#mnHeroWaveInner)"
          />
          <defs>
            <linearGradient
              id="mnHeroWaveOuter"
              x1="160"
              y1="256"
              x2="620"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5cc5f6" />
              <stop offset="0.55" stopColor="#2ca6ec" />
              <stop offset="1" stopColor="#0e84d6" />
            </linearGradient>
            <linearGradient
              id="mnHeroWaveInner"
              x1="250"
              y1="260"
              x2="620"
              y2="104"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0979c6" />
              <stop offset="1" stopColor="#0060ac" />
            </linearGradient>
          </defs>
        </svg>

        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrowPill} data-u216="badge">
              <Snowflake size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>Dịch vụ điện lạnh tại Cần Thơ</span>
            </div>

            <h1 className={styles.heroTitle} aria-label="Điện lạnh Minh Nhật">
              <HeroWords text="Điện lạnh Minh Nhật" />
            </h1>
            <p className={styles.heroTagline} data-u216="description">
              <HeroWords text="Sửa chữa – Vệ sinh – Lắp đặt – Bảo trì" start={4} />
            </p>
            <p className={styles.heroDesc} data-u216="description">
              Chăm sóc toàn diện các thiết bị điện lạnh trong gia đình,
              <br className={styles.desktopBr} />
              văn phòng và cửa hàng. Nhanh chóng – Tận tâm – Đúng hẹn.
            </p>

            <div className={styles.heroActions} data-u216="actions">
              <Link className={styles.ctaPrimary} href="/contact#tu-van">
                <MessageCircleMore size={19} strokeWidth={2.1} aria-hidden="true" />
                <span>Nhận tư vấn ngay</span>
                <ArrowRight size={17} strokeWidth={2.3} aria-hidden="true" />
              </Link>
              <a
                className={styles.ctaPhone}
                href={siteContent.phoneHref}
                aria-label={`Gọi ngay ${siteContent.phoneDisplay}`}
              >
                <SolidPhoneIcon className={styles.ctaPhoneIcon} />
                <span>{siteContent.phoneDisplay}</span>
              </a>
            </div>

            <ul className={styles.heroPromises} data-u216="description">
              <li>
                <HeroBoltIcon className={styles.promiseIcon} />
                <div className={styles.promiseText}>
                  <strong>Phản hồi nhanh</strong>
                  <span>Tư vấn kịp thời</span>
                </div>
              </li>
              <li>
                <HeroShieldIcon className={styles.promiseIcon} />
                <div className={styles.promiseText}>
                  <strong>Kỹ thuật</strong>
                  <span>kinh nghiệm</span>
                </div>
              </li>
              <li>
                <HeroAwardIcon className={styles.promiseIcon} />
                <div className={styles.promiseText}>
                  <strong>Bảo hành</strong>
                  <span>rõ ràng</span>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.mobileHeroCard} data-u216="art">
            <Image
              src="/images/home-mockup/hero-mockup-v4.jpg"
              alt="Kỹ thuật viên Điện lạnh Minh Nhật kiểm tra và bảo dưỡng máy lạnh tại nhà"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 480px"
              className={styles.mobileHeroImg}
            />
          </div>
        </div>
      </section>

      {/* Floating Equipment Chooser with Staggered Cards (u251) & Cursor Glow (u228) */}
      <StaggeredServiceCards
        className={styles.chooserSection}
        labelledBy="home-chooser-heading"
        animateInitiallyVisible
      >
        <div className={styles.container}>
          <div className={styles.chooserCard}>
            <div className={styles.chooserIntro}>
              <MockupRevealHeading
                id="home-chooser-heading"
                firstLine="Bạn cần hỗ trợ"
                secondLine="thiết bị nào?"
              />
              <span className={styles.chooserBar} aria-hidden="true" />
            </div>

            <CursorGlowGrid className={styles.deviceGrid}>
              {EQUIPMENT_OPTIONS.map((item, index) => {
                const Icon = item.Icon;
                const isSelected = selectedEquipment === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    data-u251-card
                    data-u228-card
                    style={{ '--u251-delay': `${index * 45}ms` } as CSSProperties}
                    aria-pressed={isSelected}
                    className={styles.deviceTile}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    onClick={() => handleSelectEquipment(item.id)}
                  >
                    {isSelected && !prefersReducedMotion && (
                      <motion.span
                        layoutId="home-device-active-ring"
                        className={styles.deviceActiveRing}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className={styles.deviceIconWrap} aria-hidden="true">
                      <Icon className={styles.deviceIcon} />
                    </span>
                    <span className={styles.deviceLabel}>
                      {item.labelLines.length === 2 ? (
                        <>
                          {item.labelLines[0]}
                          <br />
                          {item.labelLines[1]}
                        </>
                      ) : (
                        item.labelLines[0]
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </CursorGlowGrid>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeOption.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={styles.chooserPreviewTray}
              >
                <div className={styles.chooserSymptomGroup}>
                  <span className={styles.chooserPreviewEyebrow}>
                    <Sparkles size={14} aria-hidden="true" />
                    Lỗi thường gặp:
                  </span>
                  <div className={styles.chooserSymptomsList}>
                    {activeOption.symptoms.map((symptom) => (
                      <Link
                        key={symptom}
                        href={`/contact?service=${activeOption.primarySlug}&note=${encodeURIComponent(symptom)}#tu-van`}
                        className={styles.chooserSymptomChip}
                      >
                        {symptom}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/services/${activeOption.primarySlug}`}
                  className={styles.chooserPreviewCta}
                >
                  <span>{activeOption.actionLabel}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </StaggeredServiceCards>

      {/* Services Section with Word-by-Word Scroll Reveal, Staggered Cards (u251) & Cursor Glow (u228) */}
      <StaggeredServiceCards
        className={styles.servicesSection}
        labelledBy="home-services-heading"
      >
        <div id="dich-vu-trang-chu" className={styles.container}>
          <header className={styles.sectionHeaderCentered}>
            <MockupRevealHeading
              id="home-services-heading"
              firstLine="Dịch vụ của chúng tôi"
            />
            <span className={styles.sectionHeaderBar} aria-hidden="true" />
            <p data-scroll-description>
              Cung cấp đa dạng dịch vụ sửa chữa, vệ sinh và lắp đặt thiết bị điện lạnh.
            </p>
          </header>

          {hasInteracted && (
            <div className={styles.filterContextBar} role="status" aria-live="polite">
              <span className={styles.filterContextText}>
                Đang chọn: <strong>{activeOption.labelLines.join(' ')}</strong>
              </span>
              <div className={styles.filterContextActions}>
                <Link
                  href={`/services/${activeOption.primarySlug}`}
                  className={styles.filterDirectLink}
                >
                  {activeOption.actionLabel}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className={styles.filterResetBtn}
                  onClick={() => {
                    setSelectedEquipment('may-lanh');
                    setHasInteracted(false);
                  }}
                >
                  Mặc định
                </button>
              </div>
            </div>
          )}

          <CursorGlowGrid className={styles.servicesGrid}>
            {MOCKUP_SERVICES.map((item, cardIndex) => {
              const targetHref = validSlugs.has(item.slug)
                ? `/services/${item.slug}`
                : '/services';
              const isHighlighted =
                hasInteracted && activeOption.relatedSlugs.includes(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={targetHref}
                  data-u228-card
                  data-u251-card
                  style={
                    {
                      '--u251-delay': `${(cardIndex % 3) * 90}ms`,
                    } as CSSProperties
                  }
                  className={`${styles.serviceCard} ${
                    isHighlighted ? styles.serviceCardHighlighted : ''
                  }`}
                >
                  <div className={styles.serviceMedia}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 600px) 92vw, (max-width: 900px) 48vw, 420px"
                      className={styles.serviceImg}
                      style={{ objectPosition: item.objectPosition }}
                    />
                  </div>
                  <div className={styles.serviceBody}>
                    <h3 className={styles.serviceTitle}>
                      {item.titleLines[0]}
                      <br />
                      {item.titleLines[1]}
                    </h3>
                    <span className={styles.serviceArrow} aria-hidden="true">
                      <ChevronRight size={19} strokeWidth={2.7} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </CursorGlowGrid>
        </div>
      </StaggeredServiceCards>

      {/* Service Process Section with Word Reveal & Staggered Step Pop-In */}
      <StaggeredServiceCards
        className={styles.processSection}
        labelledBy="home-process-heading"
      >
        <div className={styles.container}>
          <div className={styles.processPanel}>
            <div className={styles.processHeaderCol}>
              <MockupRevealHeading
                id="home-process-heading"
                firstLine="Quy trình"
                secondLine="phục vụ"
                className={styles.processHeading}
              />
              <span className={styles.processBar} aria-hidden="true" />
            </div>

            <div className={styles.processContentCol}>
              <div className={styles.processTrackWrap} aria-hidden="true">
                <div
                  className={styles.processTrackFill}
                  style={{ transform: `scaleX(${Math.max(0.12, (activeStep + 1) / PROCESS_STEPS.length)})` }}
                />
              </div>
              <ol className={styles.processSteps}>
                {PROCESS_STEPS.map((step, index) => {
                  const Icon = step.Icon;
                  const isStepActive = activeStep === index;
                  return (
                    <li key={step.number} style={{ display: 'contents' }}>
                      <button
                        type="button"
                        onClick={() => setActiveStep(index)}
                        onMouseEnter={() => setActiveStep(index)}
                        aria-pressed={isStepActive}
                        className={`${styles.processStep} ${styles.processStepBtn} ${isStepActive ? styles.processStepActive : ''}`}
                        data-u251-card
                        style={{ '--u251-delay': `${index * 90}ms` } as CSSProperties}
                      >
                        <div className={styles.stepCircleWrap} aria-hidden="true">
                          <Icon className={styles.stepIcon} />
                          <span className={styles.stepBadge}>{step.number}</span>
                        </div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDesc}>
                          {step.descLines[0]}
                          {' '}
                          <br />
                          {step.descLines[1]}
                        </p>
                      </button>
                      {index < PROCESS_STEPS.length - 1 && (
                        <div
                          className={`${styles.stepConnector} ${index < activeStep ? styles.stepConnectorDone : ''}`}
                          aria-hidden="true"
                        >
                          <ChevronRight size={20} strokeWidth={2.3} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.number}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={styles.processDetailBanner}
                >
                  <span className={styles.processDetailBadge}>Bước {currentStep.number}/4</span>
                  <p className={styles.processDetailCopy}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>{currentStep.detail}</span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </StaggeredServiceCards>

      {/* About Section with Photo Reveal, Word Reveal & Staggered Pillars */}
      <StaggeredServiceCards
        className={styles.aboutSection}
        labelledBy="home-about-heading"
      >
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutPhotoVisual} data-reveal="left">
              <div className={styles.aboutPhotoCard}>
                <Image
                  src="/images/home-mockup/about-mockup-v4.jpg"
                  alt="Kỹ thuật viên Điện lạnh Minh Nhật bên xe dịch vụ tại Cần Thơ"
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  className={styles.aboutImg}
                />
              </div>
              <svg
                className={styles.aboutSlantSvg}
                viewBox="0 0 540 330"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="mnAboutStripeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#009ae8" />
                    <stop offset="100%" stopColor="#006ec0" />
                  </linearGradient>
                </defs>
                <path
                  d="M495 23 L434 330 L453 330 L512 31 C514 21 509 14 503 14 C498 14 496 18 495 23 Z"
                  fill="url(#mnAboutStripeGrad)"
                />
              </svg>
            </div>

            <div className={styles.aboutCopy}>
              <MockupRevealHeading
                id="home-about-heading"
                firstLine="Về Điện Lạnh Minh Nhật"
              />
              <p data-scroll-description>
                Là đơn vị chuyên cung cấp dịch vụ sửa chữa, vệ sinh và lắp đặt các thiết bị điện
                lạnh, điện nước tại Cần Thơ. Với đội ngũ kỹ thuật viên giàu kinh nghiệm, chúng tôi
                luôn mang đến giải pháp nhanh chóng, an toàn và hiệu quả cho gia đình bạn.
              </p>

              <ul className={styles.aboutPillars}>
                {[
                  { Icon: AboutTeamIcon, lines: ['Đội ngũ', 'chuyên nghiệp'] },
                  { Icon: AboutDiamondIcon, lines: ['Dịch vụ', 'uy tín'] },
                  { Icon: AboutPriceTagIcon, lines: ['Chi phí', 'hợp lý'] },
                  { Icon: AboutSupportIcon, lines: ['Hỗ trợ', 'nhanh chóng'] },
                ].map((pillar, idx) => {
                  const Icon = pillar.Icon;
                  return (
                    <li
                      key={pillar.lines[0]}
                      data-u251-card
                      style={{ '--u251-delay': `${idx * 75}ms` } as CSSProperties}
                    >
                      <span className={styles.pillarIconWrap} aria-hidden="true">
                        <Icon className={styles.pillarIcon} />
                      </span>
                      <div className={styles.pillarLabel}>
                        <span>{pillar.lines[0]}</span>
                        <span>{pillar.lines[1]}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </StaggeredServiceCards>

      {/* Customer Reviews Section matching Mockup with Word Reveal, Staggered Cards & Cursor Glow */}
      <StaggeredServiceCards
        className={styles.reviewsSection}
        labelledBy="home-reviews-heading"
      >
        {/* Subtle decorative corner waves matching the reviews mockup backdrop */}
        <svg
          className={styles.reviewsBgWaveTopRight}
          viewBox="0 0 380 180"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M80 0C185 18 290 70 380 155V0H80Z"
            fill="url(#mnRevTopWave1)"
          />
          <path
            d="M165 0C248 16 322 54 380 118V0H165Z"
            fill="url(#mnRevTopWave2)"
          />
          <defs>
            <linearGradient id="mnRevTopWave1" x1="80" y1="0" x2="380" y2="155" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d7effd" stopOpacity="0.65" />
              <stop offset="1" stopColor="#b3e0fc" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mnRevTopWave2" x1="165" y1="0" x2="380" y2="118" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bae3fc" stopOpacity="0.75" />
              <stop offset="1" stopColor="#8fd0fa" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className={styles.reviewsBgWaveBottomRight}
          viewBox="0 0 420 120"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 120C148 114 288 76 420 0V120H0Z"
            fill="url(#mnRevBotWave1)"
          />
          <path
            d="M110 120C226 112 330 82 420 28V120H110Z"
            fill="url(#mnRevBotWave2)"
          />
          <defs>
            <linearGradient id="mnRevBotWave1" x1="0" y1="120" x2="420" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d2ecfd" stopOpacity="0.6" />
              <stop offset="1" stopColor="#9ed6fb" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="mnRevBotWave2" x1="110" y1="120" x2="420" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#b0dffb" stopOpacity="0.75" />
              <stop offset="1" stopColor="#6ebef6" stopOpacity="0.92" />
            </linearGradient>
          </defs>
        </svg>

        <div className={styles.container}>
          <header className={styles.reviewsHeader}>
            <div className={styles.reviewsEyebrowRow}>
              <span className={styles.reviewsEyebrowLineLeft} aria-hidden="true" />
              <div className={styles.reviewsEyebrowPill}>
                <ReviewBadgeChatStarsIcon className={styles.reviewsBadgeIcon} />
                <span>Đánh giá khách hàng</span>
              </div>
              <span className={styles.reviewsEyebrowLineRight} aria-hidden="true" />
            </div>

            <MockupRevealHeading
              id="home-reviews-heading"
              firstLine="Khách hàng nói gì sau khi sử dụng dịch vụ?"
            />
            <p data-scroll-description>
              Hàng nghìn khách hàng tại Cần Thơ đã tin tưởng và hài lòng với dịch vụ của Điện Lạnh
              Minh Nhật.
            </p>
            <span className={styles.reviewsHeaderBar} aria-hidden="true" />
          </header>

          <CursorGlowGrid className={styles.reviewsLayout}>
            {/* Left Interactive Featured Customer Spotlight */}
            <article
              className={styles.featuredReviewCard}
              data-u228-card
              data-u251-card
              style={{ '--u251-delay': '0ms' } as CSSProperties}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview.id}
                  initial={prefersReducedMotion ? false : { opacity: 0.45, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0.45, y: -4 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.featuredReviewMedia}>
                    <Image
                      src={activeReview.spotlightImage}
                      alt={`Không gian dịch vụ của khách hàng ${activeReview.name} – ${activeReview.serviceLabel}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 480px"
                      className={styles.featuredReviewImg}
                    />
                  </div>

                  <div className={styles.featuredReviewBody}>
                    <div className={styles.featuredMetaBar}>
                      <div className={styles.featuredAuthorBlock}>
                        <ReviewUserCircleIcon className={styles.featuredUserIcon} />
                        <div className={styles.featuredAuthorText}>
                          <strong>{activeReview.name}</strong>
                          <span className={styles.featuredLocation}>
                            <ReviewPinIcon className={styles.reviewPinSvg} />
                            <span>{activeReview.district}</span>
                          </span>
                        </div>
                      </div>

                      <div className={styles.featuredServiceBlock}>
                        <ActiveFeaturedServiceIcon className={styles.featuredToolsIcon} />
                        <div className={styles.featuredServiceText}>
                          <span>Dịch vụ đã sử dụng:</span>
                          <Link
                            href={validSlugs.has(activeReview.serviceSlug) ? `/services/${activeReview.serviceSlug}` : '/services'}
                            className={styles.featuredServiceLink}
                          >
                            {activeReview.serviceLabel}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className={styles.featuredQuoteBox}>
                      <ReviewQuoteOpenIcon className={styles.featuredQuoteOpen} />
                      <p className={styles.featuredQuoteText}>{activeReview.quote.replace(/”$/g, '')}</p>
                      <ReviewQuoteCloseIcon className={styles.featuredQuoteClose} />
                    </div>

                    <div className={styles.featuredFooterRow}>
                      <div className={styles.reviewStarsGroup} aria-label={`Đánh giá ${activeReview.rating} sao`}>
                        <div className={styles.reviewStarsRow} aria-hidden="true">
                          <ReviewStarIcon className={styles.featuredStarSvg} />
                          <ReviewStarIcon className={styles.featuredStarSvg} />
                          <ReviewStarIcon className={styles.featuredStarSvg} />
                          <ReviewStarIcon className={styles.featuredStarSvg} />
                          <ReviewStarIcon className={styles.featuredStarSvg} />
                        </div>
                        <strong className={styles.featuredScoreText}>{activeReview.rating}</strong>
                      </div>

                      <div className={styles.reviewSwitcherBar} role="group" aria-label="Chuyển đánh giá khách hàng">
                        <button
                          type="button"
                          className={styles.reviewNavBtn}
                          aria-label="Đánh giá trước"
                          onClick={() => setFeaturedReviewIdx((prev) => (prev - 1 + ALL_REVIEWS.length) % ALL_REVIEWS.length)}
                        >
                          <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <div className={styles.reviewDots}>
                          {ALL_REVIEWS.map((item, idx) => (
                            <button
                              key={item.id}
                              type="button"
                              aria-label={`Xem đánh giá của ${item.name}`}
                              aria-pressed={idx === featuredReviewIdx}
                              className={styles.reviewDotBtn}
                              onClick={() => setFeaturedReviewIdx(idx)}
                            >
                              <span
                                className={`${styles.reviewDotVisual} ${idx === featuredReviewIdx ? styles.reviewDotActive : ''}`}
                                aria-hidden="true"
                              />
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={styles.reviewNavBtn}
                          aria-label="Đánh giá tiếp theo"
                          onClick={() => setFeaturedReviewIdx((prev) => (prev + 1) % ALL_REVIEWS.length)}
                        >
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom-right two-tone blue corner wave inside Featured Card */}
                    <svg
                      className={styles.featuredCornerWave}
                      viewBox="0 0 240 68"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M0 68C82 65 162 42 240 0V68H0Z"
                        fill="url(#mnFeatWaveOuter)"
                      />
                      <path
                        d="M58 68C128 62 188 42 240 16V68H58Z"
                        fill="url(#mnFeatWaveInner)"
                      />
                      <defs>
                        <linearGradient id="mnFeatWaveOuter" x1="0" y1="68" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4cc0f6" />
                          <stop offset="1" stopColor="#0d82d6" />
                        </linearGradient>
                        <linearGradient id="mnFeatWaveInner" x1="58" y1="68" x2="240" y2="16" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0a78c8" />
                          <stop offset="1" stopColor="#005ca6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>
              </AnimatePresence>
            </article>

            {/* Right Column: 3 Customer Review Cards (click to promote) + Bottom Action Buttons */}
            <div className={styles.reviewsRightCol}>
              <div className={styles.smallReviewsGrid}>
                {CUSTOMER_REVIEWS.map((review, idx) => {
                  const ServiceIcon = review.ServiceIcon;
                  const targetHref = validSlugs.has(review.serviceSlug)
                    ? `/services/${review.serviceSlug}`
                    : '/services';
                  const reviewGlobalIdx = idx + 1;
                  const isSpotlit = featuredReviewIdx === reviewGlobalIdx;
                  return (
                    <article
                      key={review.id}
                      className={`${styles.smallReviewCard} ${isSpotlit ? styles.smallReviewCardActive : ''}`}
                      data-u228-card
                      data-u251-card
                      style={{ '--u251-delay': `${(idx + 1) * 85}ms` } as CSSProperties}
                    >
                      <button
                        type="button"
                        onClick={() => setFeaturedReviewIdx(reviewGlobalIdx)}
                        className={styles.smallReviewSelectBtn}
                        aria-pressed={isSpotlit}
                        aria-label={`Phóng to đánh giá của ${review.name}`}
                      >
                        <div className={styles.smallReviewTop}>
                          <div className={styles.smallReviewHeader}>
                            <div className={styles.smallAvatarWrap}>
                              <Image
                                src={review.avatar}
                                alt={review.name}
                                fill
                                sizes="56px"
                                className={styles.smallAvatarImg}
                              />
                            </div>
                            <div className={styles.smallAuthorMeta}>
                              <h3 className={styles.smallAuthorName}>{review.name}</h3>
                              <span className={styles.smallAuthorLocation}>
                                <ReviewPinIcon className={styles.reviewPinSvg} />
                                <span>{review.district}</span>
                              </span>
                            </div>
                          </div>

                          <div
                            className={styles.smallRatingRow}
                            aria-label={`Đánh giá ${review.rating} sao`}
                          >
                            <div className={styles.reviewStarsRow} aria-hidden="true">
                              <ReviewStarIcon className={styles.smallStarSvg} />
                              <ReviewStarIcon className={styles.smallStarSvg} />
                              <ReviewStarIcon className={styles.smallStarSvg} />
                              <ReviewStarIcon className={styles.smallStarSvg} />
                              <ReviewStarIcon className={styles.smallStarSvg} />
                            </div>
                            <strong className={styles.smallScoreText}>{review.rating}</strong>
                          </div>

                          <div className={styles.smallQuoteRow}>
                            <ReviewQuoteOpenIcon className={styles.smallQuoteOpen} />
                            <p className={styles.smallQuoteText}>{review.quote}</p>
                          </div>
                        </div>
                      </button>

                      <Link href={targetHref} className={styles.smallServicePill}>
                        <ServiceIcon className={styles.smallServicePillIcon} />
                        <span>{review.serviceLabel}</span>
                      </Link>
                    </article>
                  );
                })}
              </div>

              <div
                className={styles.reviewsCtaRow}
                data-u251-card
                style={{ '--u251-delay': '320ms' } as CSSProperties}
              >
                <Link className={styles.reviewsCtaPrimary} href="/contact#tu-van">
                  <MessageCircleMore size={21} strokeWidth={2.2} aria-hidden="true" />
                  <span>Nhận tư vấn ngay</span>
                  <ChevronRight size={19} strokeWidth={2.6} aria-hidden="true" />
                </Link>

                <a
                  className={styles.reviewsCtaPhone}
                  href={siteContent.phoneHref}
                  aria-label={`Gọi ngay ${siteContent.phoneDisplay}`}
                >
                  <SolidPhoneIcon className={styles.reviewsCtaPhoneIcon} />
                  <span>{siteContent.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </CursorGlowGrid>
        </div>
      </StaggeredServiceCards>
    </div>
  );
}

export function HomePreFooterCta() {
  return (
    <StaggeredServiceCards
      className={styles.preFooterBand}
      labelledBy="home-prefooter-heading"
    >
      <div className={styles.container}>
        <div className={styles.preFooterCard} data-u251-card>
          <div className={styles.preFooterLead}>
            <span className={styles.preFooterIconWrap} aria-hidden="true">
              <PreFooterChatIcon className={styles.preFooterChatIcon} />
            </span>
            <div>
              <MockupRevealHeading
                id="home-prefooter-heading"
                firstLine="Nhận tư vấn miễn phí"
              />
              <p data-scroll-description>
                Liên hệ ngay để được tư vấn giải pháp phù hợp và báo giá chi tiết.
              </p>
            </div>
          </div>

          <div className={styles.preFooterActions}>
            <Link className={styles.ctaPrimary} href="/contact#tu-van">
              <span>Nhận tư vấn ngay</span>
              <ArrowRight size={17} strokeWidth={2.3} aria-hidden="true" />
            </Link>
            <a
              className={styles.ctaPhonePreFooter}
              href={siteContent.phoneHref}
              aria-label={`Gọi tư vấn ${siteContent.phoneDisplay}`}
            >
              <SolidPhoneIcon className={styles.ctaPhoneIcon} />
              <span>{siteContent.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </StaggeredServiceCards>
  );
}
