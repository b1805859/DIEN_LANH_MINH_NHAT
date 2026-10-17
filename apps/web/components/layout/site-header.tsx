'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { surfaceMotion } from '@/components/ui/motion-tokens';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { serviceCards, siteContent } from '@/lib/content/site-content';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/lib/auth/tokens';
import styles from './site-header.module.css';
const links = [
  ['Trang chủ', '/'],
  ['Giới thiệu', '/about'],
  ['Dịch vụ', '/services'],
  ['Tin tức', '/blog'],
  ['Liên hệ', '/contact'],
];
export function SiteHeader({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenu = useRef<HTMLDetailsElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    const sync = () => setAdmin(Boolean(getStoredAccessToken()));
    sync();
    window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 180);
    const dismiss = (event: PointerEvent) => {
      if (servicesMenu.current && !servicesMenu.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    syncScroll();
    window.addEventListener('scroll', syncScroll, { passive: true });
    document.addEventListener('pointerdown', dismiss);
    return () => {
      window.removeEventListener('scroll', syncScroll);
      document.removeEventListener('pointerdown', dismiss);
    };
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (open) {
      element?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = old;
      };
    }
  }, [open]);
  async function logout() {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();
    if (accessToken && refreshToken) {
      try {
        const { apiClient } = await import('@/lib/api/client');
        await apiClient.post(
          '/auth/logout',
          { refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } catch {
        /* Always clear the local session. */
      }
    }
    clearStoredAuthTokens();
    setAdmin(false);
    setOpen(false);
    router.refresh();
  }
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <header
      className={`mn-header ${styles.header} ${scrolled ? 'mn-header-scrolled' : ''} ${className}`}
    >
      <div className="mn-nav-shell">
        <Link href="/" className="mn-brand" aria-label="Điện Lạnh Minh Nhật – Trang chủ">
          <MinhNhatLogoMark idPrefix="header" />
          <span>
            ĐIỆN LẠNH<strong>MINH NHẬT</strong>
            <small>CẦN THƠ</small>
          </span>
        </Link>
        <nav className="mn-desktop-nav" aria-label="Điều hướng chính">
          {links.map(([label, href]) =>
            href === '/services' ? (
              <div className="mn-nav-services" key={href}>
                <Link href={href} aria-current={active(href) ? 'page' : undefined}>
                  {label}
                </Link>
                <details
                  ref={servicesMenu}
                  className="mn-services-menu"
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setServicesOpen(false);
                      event.currentTarget.querySelector('summary')?.focus();
                    }
                  }}
                >
                  <summary
                    aria-label="Mở danh sách dịch vụ"
                    aria-expanded={servicesOpen}
                    onClick={(event) => {
                      event.preventDefault();
                      if (!servicesOpen && servicesMenu.current) servicesMenu.current.open = true;
                      setServicesOpen(!servicesOpen);
                    }}
                  >
                    <ChevronDown size={13} />
                  </summary>
                  <AnimatePresence onExitComplete={() => {
                    if (!servicesOpen && servicesMenu.current) servicesMenu.current.open = false;
                  }}>
                  {servicesOpen && <motion.div {...surfaceMotion} className="mn-services-dropdown">
                    {serviceCards.map((service) => (
                      <Link key={service.slug} href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
                    ))}
                  </motion.div>}
                  </AnimatePresence>
                </details>
              </div>
            ) : (
              <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="mn-header-actions">
          <a className="mn-hotline" href={siteContent.phoneHref}>
            <span>
              <Phone size={20} />
            </span>
            <div>
              <small>Hotline tư vấn</small>
              <strong>{siteContent.phoneDisplay}</strong>
            </div>
          </a>
          <Link className="mn-button mn-nav-book" href="/booking">
            <CalendarDays size={17} />
            Đặt lịch ngay
          </Link>
          {admin && (
            <Link href="/admin/dashboard" className="mn-admin-link">
              Quản trị
            </Link>
          )}
          <button
            ref={trigger}
            className="mn-menu-button"
            aria-label="Mở menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        id={menuId}
        aria-label="Điều hướng di động"
        className="mn-mobile-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target instanceof Element && e.target.closest('a')))
            setOpen(false);
        }}
      >
        <AnimatePresence onExitComplete={() => {
          if (!open) dialog.current?.close();
        }}>
        {open && <motion.div {...surfaceMotion} className="mn-mobile-menu">
          <button
            className="mn-menu-close"
            aria-label="Đóng menu"
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            <X />
          </button>
          <p className="mn-kicker">ĐIỆN LẠNH MINH NHẬT</p>
          <nav aria-label="Điều hướng di động">
            {links.map(([label, href]) => (
              <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>
                {label}
                <span>›</span>
              </Link>
            ))}
          </nav>
          <Link className="mn-button" href="/booking">
            Đặt lịch dịch vụ <CalendarDays size={18} />
          </Link>
          {admin && (
            <>
              <Link href="/admin/dashboard">Quản trị</Link>
              <button onClick={logout}>Đăng xuất</button>
            </>
          )}
        </motion.div>}
        </AnimatePresence>
      </dialog>
      {admin && (
        <button className="mn-session-logout" onClick={logout}>
          Đăng xuất
        </button>
      )}
    </header>
  );
}
