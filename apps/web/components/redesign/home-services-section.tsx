'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ServiceGrid } from './ui';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function HomeServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 801px) and (prefers-reduced-motion: no-preference)',
        isMobile: '(max-width: 800px) and (prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const { isDesktop } = context.conditions!;

        const kicker = section.querySelector<HTMLElement>('.mn-kicker');
        const titleSpan = section.querySelector<HTMLElement>('.mn-heading-title');
        const accent = section.querySelector<HTMLElement>('.mn-section-heading h2 em');
        const link = section.querySelector<HTMLElement>('.mn-section-heading .mn-text-link');
        const cards = Array.from(section.querySelectorAll<HTMLElement>('.mn-service-card'));

        // Master Scroll-Scrub Timeline:
        // - Generous scroll range (start: 88%, end: bottom 35%) ensures calm, gradual progress without rushing.
        // - scrub: 1.6s gives luxurious, silky inertial damping that glides slowly and gracefully.
        // - Scroll down: Wide cards glide slowly from outer edges, tall cards float up from below.
        // - Scroll up: Bottom-most cards slowly sink and dissolve first, wide cards softly glide back to edges.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: isDesktop ? 'top 88%' : 'top 90%',
            end: isDesktop ? 'bottom 35%' : 'bottom 40%',
            scrub: 1.6,
          },
        });

        // 1. Heading Elements: Slow, serene reveal (0.0s -> 1.1s)
        if (kicker) {
          tl.fromTo(
            kicker,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 0.8 },
            0,
          );
        }

        if (titleSpan) {
          tl.fromTo(
            titleSpan,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 0.95 },
            0.12,
          );
        }

        if (accent) {
          tl.fromTo(
            accent,
            {
              autoAlpha: 0,
              y: 18,
              clipPath: 'inset(0 0 100% 0)',
            },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
              ease: 'sine.out',
              duration: 1.05,
            },
            0.2,
          );
        }

        if (link) {
          tl.fromTo(
            link,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 0.8 },
            0.3,
          );
        }

        // 2. Service Cards Choreography (0.6s -> 3.0s)
        // Calibrated travel distances and gentle sine curves for velvety slow motion
        if (cards.length >= 5) {
          const card0 = cards[0]; // Featured Left (Wide)
          const card1 = cards[1]; // Featured Right (Wide)
          const card2 = cards[2]; // Bottom Left (Tall)
          const card3 = cards[3]; // Bottom Center (Tall)
          const card4 = cards[4]; // Bottom Right (Tall on Desktop, Full-width on Mobile)

          if (isDesktop) {
            // DESKTOP:
            // - Wide cards (Card 0 & 1): Glide in softly from left/right edges (0.6s -> 1.7s)
            // - Tall cards (Card 2, 3, 4): Rise slowly from the bottom (1.2s -> 2.9s)
            // - On scroll up: Card 4, 3, 2 sink down gently first, then Card 1 & 0 slide back out to edges
            tl.fromTo(
              card0,
              { autoAlpha: 0, x: -38, y: 6 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 1.0 },
              0.6,
            );

            tl.fromTo(
              card1,
              { autoAlpha: 0, x: 38, y: 6 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 1.0 },
              0.76,
            );

            tl.fromTo(
              card2,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 1.0 },
              1.2,
            );

            tl.fromTo(
              card3,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 1.0 },
              1.42,
            );

            tl.fromTo(
              card4,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 1.0 },
              1.64,
            );
          } else {
            // MOBILE:
            // - 2 columns on top: Left cards slide gently from left, Right cards from right
            // - 5th card spans full width at the bottom: Floats slowly up from below
            // - On scroll up: 5th card slowly dissolves down first, then middle row, then top row
            tl.fromTo(
              card0,
              { autoAlpha: 0, x: -24, y: 8 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 0.9 },
              0.5,
            );

            tl.fromTo(
              card1,
              { autoAlpha: 0, x: 24, y: 8 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 0.9 },
              0.66,
            );

            tl.fromTo(
              card2,
              { autoAlpha: 0, x: -20, y: 12 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 0.9 },
              1.05,
            );

            tl.fromTo(
              card3,
              { autoAlpha: 0, x: 20, y: 12 },
              { autoAlpha: 1, x: 0, y: 0, ease: 'sine.out', duration: 0.9 },
              1.22,
            );

            tl.fromTo(
              card4,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, ease: 'sine.out', duration: 0.95 },
              1.55,
            );
          }
        }
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="mn-section mn-home-services" data-custom-motion="true" ref={sectionRef}>
      <div className="mn-section-heading">
        <div>
          <p className="mn-kicker">DỊCH VỤ ĐIỆN LẠNH MINH NHẬT</p>
          <h2>
            <span className="mn-heading-title">Dịch vụ điện lạnh</span>{' '}
            <em>toàn diện tại Cần Thơ</em>
          </h2>
        </div>
        <Link href="/services" className="mn-text-link">
          Xem tất cả <ArrowRight size={17} />
        </Link>
      </div>
      <ServiceGrid limit={5} home />
    </section>
  );
}
