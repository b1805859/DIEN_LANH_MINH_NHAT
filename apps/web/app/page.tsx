import { buildMetadata } from '@/lib/seo/metadata';
import { CoolFixHeader } from '@/components/coolfix/coolfix-header';
import { CoolFixHero } from '@/components/coolfix/coolfix-hero';
import { CoolFixAdvantages } from '@/components/coolfix/coolfix-advantages';
import { CoolFixVideo } from '@/components/coolfix/coolfix-video';
import { CoolFixServices } from '@/components/coolfix/coolfix-services';
import { CoolFixSteps } from '@/components/coolfix/coolfix-steps';
import { CoolFixTestimonials } from '@/components/coolfix/coolfix-testimonials';
import { CoolFixFAQ } from '@/components/coolfix/coolfix-faq';
import { CoolFixCta } from '@/components/coolfix/coolfix-cta';
import { CoolFixFooter } from '@/components/coolfix/coolfix-footer';
import styles from '@/components/coolfix/coolfix.module.css';

export const metadata = buildMetadata({
  title: 'Sửa Chữa Điện Lạnh Tại Cần Thơ — Chuyên Nghiệp & Uy Tín',
  description:
    'Dịch vụ sửa chữa, vệ sinh, lắp đặt máy lạnh, máy giặt, tủ lạnh tận nơi tại Cần Thơ. Có mặt nhanh trong 30 phút, kỹ thuật viên chính quy, bảo hành dài hạn.',
  path: '/',
});

export default function HomePage() {
  return (
    <main className={styles.root}>
      {/* 0. Adaptive Floating Header */}
      <CoolFixHeader />

      {/* 1. Hero: Atmospheric Cool Frost */}
      <CoolFixHero />

      {/* 2. Our Advantages & Rolling Stats Counter */}
      <CoolFixAdvantages />

      {/* 3. Technician Showcase with Round "Play Video" Button */}
      <CoolFixVideo />

      {/* 4. Our Services (Split Product & Interactive Tabs) */}
      <CoolFixServices />

      {/* 5. How It Works (5 Steps from Call to Cool) */}
      <CoolFixSteps />

      {/* 6 - 9. Dark Mode Sections: Testimonials, FAQ, Pre-Footer CTA & Footer */}
      <div id="dark-section" className={styles.darkSection}>
        <CoolFixTestimonials />
        <CoolFixFAQ />
        <CoolFixCta />
        <CoolFixFooter />
      </div>
    </main>
  );
}
