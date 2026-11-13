// Lucian UX/UI Prompt #216 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#216
'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Headset, Phone } from 'lucide-react';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import homeStyles from './home.module.css';
import styles from './staggered-hero.module.css';
import { observeHeroEntrance } from './hero-entrance';
import { HeroWords } from './hero-words';

const headingLines = ['Điện lạnh Cần Thơ.', 'Chăm sóc ngôi nhà bạn.'];

export function StaggeredHero({ art, phoneHref, shortcuts }: {
  art: ReactNode;
  phoneHref: string;
  shortcuts: ReactNode;
}) {
  const hero = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = hero.current;
    const site = section?.closest<HTMLElement>(`.${styles.u216}`);
    if (section && site) return observeHeroEntrance(site, section);
  }, []);

  return (
    <section ref={hero} className={`${homeStyles.hero} approved-home-hero`} aria-labelledby="ice-home-title">
      <div className={homeStyles.heroCopy}>
        <p className={`${homeStyles.eyebrow} ${styles.badge}`} data-u216="badge">ĐIỆN LẠNH MINH NHẬT · CẦN THƠ</p>
        <h1 id="ice-home-title" aria-label={headingLines.join(' ')}>
          <HeroWords text={headingLines[0]} />
          <br />
          <span><HeroWords text={headingLines[1]} start={headingLines[0].split(' ').length} /></span>
        </h1>
        <p className={homeStyles.subtitle} data-u216="description">Sửa chữa · Vệ sinh · Lắp đặt tại nhà</p>
        <ul className={homeStyles.promises} data-u216="description">
          <li><CalendarDays aria-hidden="true" /> Hẹn giờ trước</li>
          <li><ClipboardList aria-hidden="true" /> Báo giá trước</li>
          <li><CheckCircle2 aria-hidden="true" /> Chạy thử sau sửa</li>
        </ul>
        <div className={homeStyles.actions} data-u216="actions">
          <Link href="/contact#tu-van" className={homeStyles.book}><Headset size={20} aria-hidden="true" />Nhận tư vấn<ArrowRight size={18} aria-hidden="true" /></Link>
          <a href={phoneHref} className={homeStyles.call}><Phone size={19} aria-hidden="true" />Gọi tư vấn</a>
        </div>
        {shortcuts}
      </div>
      <div className={homeStyles.heroArt} data-u216="art">
        {art}
      </div>
    </section>
  );
}
