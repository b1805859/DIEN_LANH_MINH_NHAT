'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
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
import { integrationSettings } from '@/lib/integrations/settings';
import { isNavigationItemActive, navigationItems } from '@/components/layout/navigation';
import { homeServices } from './data';
import styles from './home.module.css';

const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className={`${styles.brand} motion-brand`}
      aria-label="Điện Lạnh Minh Nhật — Trang chủ"
      onClick={onNavigate}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
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
  const [locationHash, setLocationHash] = useState('');
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
  }, [pathname]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const results = homeServices.filter((service) =>
    normalizeSearch(service.title).includes(normalizeSearch(query)),
  );
  return (
    <header
      data-motion="header"
      className={`motion-header ${styles.header} ${scrolled ? styles.headerScrolled : ''} ${className}`}
      data-scrolled={scrolled ? 'true' : undefined}
    >
      <div className={styles.headerInner}>
        <Brand onNavigate={() => setLocationHash('')} />
        <nav
          className={`${styles.desktopNav} motion-nav`}
          data-motion-stagger="35"
          data-motion-group-variant="fade"
          aria-label="Điều hướng chính"
        >
          {navigationItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              onClick={() => setLocationHash(new URL(href, window.location.href).hash)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.searchButton}
            data-motion-hover="icon"
            onClick={() => {
              search.current?.showModal();
              searchInput.current?.focus();
            }}
            aria-label="Tìm kiếm dịch vụ"
          >
            <Search />
          </button>
          <Link href="/booking" className={`${styles.primaryButton} motion-button`}>
            Đặt lịch ngay <ArrowRight />
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            data-motion-hover="icon"
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
        className={`${styles.dialog} ${styles.menuDialog}`}
        onClose={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) menu.current?.close();
        }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => menu.current?.close()}
          aria-label="Đóng menu"
        >
          <X />
        </button>
        <Brand
          onNavigate={() => {
            setLocationHash('');
            menu.current?.close();
          }}
        />
        <nav aria-label="Điều hướng di động">
          {navigationItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              onClick={() => {
                setLocationHash(new URL(href, window.location.href).hash);
                menu.current?.close();
              }}
            >
              {label}
              <ArrowRight />
            </Link>
          ))}
        </nav>
        <Link
          className={`${styles.primaryButton} motion-button`}
          href="/booking"
          onClick={() => menu.current?.close()}
        >
          Đặt lịch ngay <ArrowRight />
        </Link>
      </dialog>
      <dialog
        ref={search}
        className={`${styles.dialog} ${styles.searchDialog}`}
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) search.current?.close();
        }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => search.current?.close()}
          aria-label="Đóng tìm kiếm"
        >
          <X />
        </button>
        <h2 id="search-title">Tìm kiếm dịch vụ</h2>
        <label className={styles.searchInput}>
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
        <div className={styles.searchResults}>
          {results.length ? (
            results.map((service) => (
              <Link href={service.href} key={service.href} onClick={() => search.current?.close()}>
                {service.title}
                <ArrowRight />
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
  const phone = integrationSettings.phone.replace(/\s/g, '');
  const displayPhone = phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3');
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain} data-motion-stagger="50" data-motion-group-variant="fade">
        <div className={styles.footerIntro}>
          <Brand />
          <p>
            Chuyên cung cấp dịch vụ sửa chữa, lắp đặt, vệ sinh, bảo trì
            <br className={styles.desktopBreak} /> máy lạnh, máy giặt, tủ lạnh tại Cần Thơ và các
            quận huyện lân cận.
            <br className={styles.desktopBreak} /> Nhanh chóng – Uy tín – Chuyên nghiệp – Tận tâm.
          </p>
        </div>
        <div>
          <h2>Dịch vụ</h2>
          <nav aria-label="Dịch vụ cuối trang">
            {homeServices.map((service) => (
              <Link key={service.href} href={service.href}>
                {service.title}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>Về chúng tôi</h2>
          <nav aria-label="Về chúng tôi">
            <Link href="/about">Giới thiệu</Link>
            <Link href="/blog">Tin tức</Link>
            <Link href="/contact">Liên hệ</Link>
          </nav>
        </div>
        <div className={styles.footerContact}>
          <h2>Thông tin liên hệ</h2>
          <a href={`tel:${phone}`}>
            <Phone />
            {displayPhone}
          </a>
          <a href="mailto:dienlanhminhnhat@gmail.com">
            <Mail />
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
            <MapPin />
            Ninh Kiều, Cần Thơ
          </a>
          <p>
            <Clock3 />
            T2 - CN: 8:00 – 20:00
          </p>
        </div>
        <div className={styles.footerSocial}>
          <h2>Kết nối với chúng tôi</h2>
          <div>
            <a
              href={
                integrationSettings.facebookUrl ||
                'https://www.facebook.com/profile.php?id=100063792110691'
              }
              aria-label="Facebook"
              data-motion-hover="icon"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook fill="currentColor" />
            </a>
            <a
              href={integrationSettings.zaloUrl}
              aria-label="Zalo"
              data-motion-hover="icon"
              target="_blank"
              rel="noreferrer"
            >
              <Image src="/icons/zalo.svg" alt="" width={19} height={19} />
            </a>
            {integrationSettings.youtubeUrl ? (
              <a
                href={integrationSettings.youtubeUrl}
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <Youtube fill="currentColor" />
              </a>
            ) : (
              <span
                aria-label="YouTube — chưa có kênh được công bố"
                title="Chưa có kênh YouTube được công bố"
              >
                <Youtube fill="currentColor" />
              </span>
            )}
            {integrationSettings.tiktokUrl ? (
              <a
                href={integrationSettings.tiktokUrl}
                aria-label="TikTok"
                target="_blank"
                rel="noreferrer"
              >
                <Music2 fill="currentColor" />
              </a>
            ) : (
              <span
                aria-label="TikTok — chưa có kênh được công bố"
                title="Chưa có kênh TikTok được công bố"
              >
                <Music2 fill="currentColor" />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footerBottom} data-motion="fade">
        <span>© 2024 Điện Lạnh Minh Nhật. Tất cả quyền được bảo lưu.</span>
        <nav aria-label="Chính sách">
          <Link href="/privacy-policy">Chính sách bảo mật</Link>
          <span>|</span>
          <Link href="/terms-of-service">Điều khoản sử dụng</Link>
        </nav>
      </div>
    </footer>
  );
}
