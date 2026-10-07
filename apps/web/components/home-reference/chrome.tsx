'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Facebook,
  Mail,
  MapPin,
  Menu,
  Music2,
  Phone,
  Search,
  X,
  Youtube,
} from 'lucide-react';
import { PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { integrationSettings } from '@/lib/integrations/settings';
import { isNavigationItemActive, navigationItems } from '@/components/layout/navigation';
import k from '@/components/kage/kage.module.css';
import { homeServices } from './data';

const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

const serviceAreas = ['ninh-kieu', 'binh-thuy', 'cai-rang', 'o-mon', 'thot-not']
  .map((slug) => PRIORITY_DISTRICTS.find((area) => area.slug === slug))
  .filter((area): area is NonNullable<typeof area> => Boolean(area));

const pad = (value: number) => String(value).padStart(2, '0');

function usePhone() {
  const phone = integrationSettings.phone.replace(/\s/g, '');
  const displayPhone = phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  return { phone, displayPhone };
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className={k.brand}
      aria-label="Điện Lạnh Minh Nhật — Trang chủ"
      onClick={onNavigate}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {[0, 60, 120].map((angle) => (
          <path
            key={angle}
            transform={`rotate(${angle} 24 24)`}
            d="M24 3v42M17 7l7 5 7-5M17 41l7-5 7 5"
          />
        ))}
      </svg>
      <span>
        ĐIỆN LẠNH<strong>MINH NHẬT</strong>
      </span>
    </Link>
  );
}

export function HomeHeader({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [locationHash, setLocationHash] = useState('');
  const { phone, displayPhone } = usePhone();
  const isActive = (href: string) => isNavigationItemActive(href, pathname, locationHash);

  useEffect(() => {
    const syncHash = () => setLocationHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, [pathname]);

  useEffect(() => {
    menu.current?.close();
    search.current?.close();
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide while travelling down through content, reveal on any upward scroll.
      setHidden(y > 480 && y > last + 2);
      if (y < last - 2 || y <= 480) setHidden(false);
      last = y;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const results = homeServices.filter((service) =>
    normalizeSearch(service.title).includes(normalizeSearch(query)),
  );

  return (
    <header
      className={`${k.root} ${k.header} ${scrolled ? k.headerScrolled : ''} ${
        hidden && !menuOpen ? k.headerHidden : ''
      } ${className}`}
      data-scrolled={scrolled ? 'true' : undefined}
    >
      <div className={k.headerInner}>
        <Brand onNavigate={() => setLocationHash('')} />
        <nav className={k.nav} aria-label="Điều hướng chính">
          {navigationItems.map(({ label, href }, index) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              onClick={() => setLocationHash(new URL(href, window.location.href).hash)}
            >
              <small>{pad(index + 1)}</small>
              {label}
            </Link>
          ))}
        </nav>
        <div className={k.actions}>
          <a className={k.headerPhone} href={`tel:${phone}`}>
            <Phone aria-hidden="true" />
            {displayPhone}
          </a>
          <button
            type="button"
            className={k.iconBtn}
            onClick={() => {
              search.current?.showModal();
              searchInput.current?.focus();
            }}
            aria-label="Tìm kiếm dịch vụ"
          >
            <Search />
          </button>
          <Link href="/booking" className={`${k.btn} ${k.headerCta}`}>
            Đặt lịch ngay <ArrowRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className={`${k.iconBtn} ${k.menuToggle}`}
            onClick={() => {
              menu.current?.showModal();
              setMenuOpen(true);
            }}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="public-site-menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      <dialog
        id="public-site-menu"
        ref={menu}
        aria-label="Menu điều hướng"
        className={`${k.root} ${k.menu}`}
        onClose={() => setMenuOpen(false)}
      >
        <div className={k.menuTop}>
          <Brand
            onNavigate={() => {
              setLocationHash('');
              menu.current?.close();
            }}
          />
          <button
            type="button"
            className={k.iconBtn}
            onClick={() => menu.current?.close()}
            aria-label="Đóng menu"
          >
            <X />
          </button>
        </div>
        {menuOpen ? (
          <nav className={k.menuNav} aria-label="Điều hướng di động">
            {navigationItems.map(({ label, href }, index) => (
              <Link
                key={href}
                href={href}
                style={{ ['--i' as string]: index }}
                aria-current={isActive(href) ? 'page' : undefined}
                onClick={() => {
                  setLocationHash(new URL(href, window.location.href).hash);
                  menu.current?.close();
                }}
              >
                <small>{pad(index + 1)}</small>
                {label}
              </Link>
            ))}
          </nav>
        ) : (
          <div className={k.menuNav} />
        )}
        <div className={k.menuFoot}>
          <a href={`tel:${phone}`}>{displayPhone}</a>
          <a href="mailto:dienlanhminhnhat@gmail.com">dienlanhminhnhat@gmail.com</a>
          <span>Ninh Kiều, Cần Thơ · T2 - CN: 8:00 – 20:00</span>
          <Link className={k.btn} href="/booking" onClick={() => menu.current?.close()}>
            Đặt lịch ngay <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </dialog>

      <dialog
        ref={search}
        className={`${k.root} ${k.search}`}
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const isOutside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;
          if (isOutside) search.current?.close();
        }}
      >
        <button
          type="button"
          className={`${k.iconBtn} ${k.closeBtn}`}
          onClick={() => search.current?.close()}
          aria-label="Đóng tìm kiếm"
        >
          <X />
        </button>
        <h2 id="search-title">Tìm kiếm dịch vụ</h2>
        <label className={k.searchField}>
          <Search />
          <input
            ref={searchInput}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                search.current?.close();
              }
            }}
            autoComplete="off"
            type="search"
            aria-label="Tên dịch vụ"
            placeholder="Nhập tên dịch vụ cần tìm…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className={k.searchResults}>
          {results.length ? (
            results.map((service) => (
              <Link href={service.href} key={service.href} onClick={() => search.current?.close()}>
                {service.title}
                <ArrowUpRight />
              </Link>
            ))
          ) : (
            <p>
              Chưa tìm thấy dịch vụ.{' '}
              <Link href="/contact" onClick={() => search.current?.close()}>
                Liên hệ để được tư vấn
              </Link>
              .
            </p>
          )}
        </div>
      </dialog>
    </header>
  );
}

export function HomeFooter() {
  const { phone, displayPhone } = usePhone();
  return (
    <footer className={`${k.root} ${k.footer}`}>
      <div className={k.footerStatement}>
        <h2 className={k.reveal} data-k-reveal>
          Nhanh chóng – Uy tín
          <br />
          <span>Chuyên nghiệp – Tận tâm.</span>
        </h2>
        <div className={k.footerPhone}>
          <small>Gọi kỹ thuật viên</small>
          <a href={`tel:${phone}`}>{displayPhone}</a>
          <Link href="/booking" className={k.textLink}>
            Đặt lịch ngay <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className={k.footerGrid}>
        <div className={k.footerIntro}>
          <Brand />
          <p>
            Chuyên cung cấp dịch vụ sửa chữa, lắp đặt, vệ sinh, bảo trì máy lạnh, máy giặt, tủ lạnh
            tại Cần Thơ và các quận huyện lân cận.
          </p>
          <div className={k.social}>
            <a
              href={
                integrationSettings.facebookUrl ||
                'https://www.facebook.com/profile.php?id=100063792110691'
              }
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook fill="currentColor" />
            </a>
            <a href={integrationSettings.zaloUrl} aria-label="Zalo" target="_blank" rel="noreferrer">
              <Image src="/icons/zalo.svg" alt="" width={16} height={16} />
            </a>
            {integrationSettings.youtubeUrl ? (
              <a
                href={integrationSettings.youtubeUrl}
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <Youtube />
              </a>
            ) : (
              <span
                aria-label="YouTube — chưa có kênh được công bố"
                title="Chưa có kênh YouTube được công bố"
              >
                <Youtube />
              </span>
            )}
            {integrationSettings.tiktokUrl ? (
              <a
                href={integrationSettings.tiktokUrl}
                aria-label="TikTok"
                target="_blank"
                rel="noreferrer"
              >
                <Music2 />
              </a>
            ) : (
              <span
                aria-label="TikTok — chưa có kênh được công bố"
                title="Chưa có kênh TikTok được công bố"
              >
                <Music2 />
              </span>
            )}
          </div>
        </div>
        <div>
          <h3>Dịch vụ</h3>
          <nav aria-label="Dịch vụ cuối trang">
            {homeServices.map((service) => (
              <Link key={service.href} href={service.href}>
                {service.title}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3>Khám phá</h3>
          <nav aria-label="Về chúng tôi">
            <Link href="/about">Giới thiệu</Link>
            <Link href="/areas">Khu vực</Link>
            <Link href="/blog">Tin tức</Link>
            <Link href="/faq">Câu hỏi thường gặp</Link>
            <Link href="/contact">Liên hệ</Link>
          </nav>
        </div>
        <div>
          <h3>Liên hệ</h3>
          <div className={k.footerContact}>
            <a href={`tel:${phone}`}>
              <Phone aria-hidden="true" />
              {displayPhone}
            </a>
            <a href="mailto:dienlanhminhnhat@gmail.com">
              <Mail aria-hidden="true" />
              dienlanhminhnhat@gmail.com
            </a>
            <a
              href={
                integrationSettings.googleMapsUrl ||
                'https://www.google.com/maps/search/?api=1&query=Ninh+Kieu+Can+Tho'
              }
              target="_blank"
              rel="noreferrer"
            >
              <MapPin aria-hidden="true" />
              Ninh Kiều, Cần Thơ
            </a>
            <p>
              <Clock3 aria-hidden="true" />
              T2 - CN: 8:00 – 20:00
            </p>
          </div>
          {serviceAreas.length ? (
            <>
              <h3 style={{ marginTop: 32 }}>Khu vực phục vụ</h3>
              <nav aria-label="Khu vực phục vụ">
                {serviceAreas.map((area) => (
                  <Link key={area.slug} href={`/areas/${area.slug}`}>
                    {area.shortName}
                  </Link>
                ))}
              </nav>
            </>
          ) : null}
        </div>
      </div>

      <p className={k.footerWord} aria-hidden="true">
        MINH NHẬT
      </p>

      <div className={k.footerBottom}>
        <span>© 2024 Điện Lạnh Minh Nhật. Tất cả quyền được bảo lưu.</span>
        <nav aria-label="Chính sách">
          <Link href="/privacy-policy">Chính sách bảo mật</Link>
          <Link href="/terms-of-service">Điều khoản sử dụng</Link>
        </nav>
      </div>
    </footer>
  );
}
