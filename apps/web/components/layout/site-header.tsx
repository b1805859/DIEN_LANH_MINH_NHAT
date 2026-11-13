'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Headset, ChevronDown, LayoutDashboard, LogOut, Menu, Phone, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { surfaceMotion } from '@/components/ui/motion-tokens';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { siteContent } from '@/lib/content/site-content';
import type { WebsiteService } from '@/lib/content/website-content';
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
export function SiteHeader({ className = '', services }: { className?: string; services: WebsiteService[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenu = useRef<HTMLDetailsElement>(null);
  const accountMenu = useRef<HTMLDetailsElement>(null);
  const closeDropdownTimer = useRef<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const clearCloseTimer = () => {
    if (closeDropdownTimer.current !== null) {
      window.clearTimeout(closeDropdownTimer.current);
      closeDropdownTimer.current = null;
    }
  };
  const openServicesDropdown = () => {
    clearCloseTimer();
    if (servicesMenu.current) servicesMenu.current.open = true;
    setServicesOpen(true);
  };
  const scheduleCloseServicesDropdown = () => {
    clearCloseTimer();
    closeDropdownTimer.current = window.setTimeout(() => {
      setServicesOpen(false);
    }, 150);
  };
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
    if (accountMenu.current) accountMenu.current.open = false;
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [pathname]);
  useEffect(() => {
    const syncScroll = () => setScrolled(window.scrollY > 32);
    const dismiss = (event: PointerEvent) => {
      if (servicesMenu.current && !servicesMenu.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
      if (accountMenu.current && !accountMenu.current.contains(event.target as Node)) {
        accountMenu.current.open = false;
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
      if (!element?.open) element?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = old;
      };
    } else {
      if (element?.open) {
        element.close();
      }
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
      data-scrolled={scrolled ? 'true' : undefined}
      className={`mn-header ${styles.header} ${scrolled && pathname !== '/' ? 'mn-header-scrolled' : ''} ${className}`}
    >
      <div className="mn-nav-shell" data-admin-session={admin || undefined}>
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
              <div
                className="mn-nav-services"
                key={href}
                data-open={servicesOpen ? 'true' : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') openServicesDropdown();
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === 'mouse') scheduleCloseServicesDropdown();
                }}
              >
                <Link href={href} aria-current={active(href) ? 'page' : undefined}>
                  {label}
                </Link>
                <details
                  ref={servicesMenu}
                  className="mn-services-menu"
                  data-open={servicesOpen ? 'true' : undefined}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      clearCloseTimer();
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
                      clearCloseTimer();
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
                    {services.map((service) => {
                      const serviceHref = `/services/${service.slug}`;
                      return (
                        <Link
                          key={service.slug}
                          href={serviceHref}
                          aria-current={pathname === serviceHref ? 'page' : undefined}
                        >
                          {service.title}
                        </Link>
                      );
                    })}
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
          <a className="mn-hotline" href={siteContent.phoneHref} aria-label={`Gọi tư vấn ${siteContent.phoneDisplay}`}>
            <span>
              <Phone size={20} aria-hidden="true" />
            </span>
            <div>
              <small>Hotline tư vấn</small>
              <strong>{siteContent.phoneDisplay}</strong>
            </div>
          </a>
          <Link className="mn-button mn-nav-book" href="/contact#tu-van">
            <Headset size={17} />
            Nhận tư vấn
          </Link>
          {admin && (
            <details ref={accountMenu} className={styles.accountMenu} onKeyDown={(event) => {
              if (event.key !== 'Escape' || !event.currentTarget.open) return;
              event.currentTarget.open = false;
              event.currentTarget.querySelector('summary')?.focus();
            }}>
              <summary aria-label="Tài khoản quản trị" title="Tài khoản quản trị">
                <UserRound size={20} aria-hidden="true" />
              </summary>
              <div className={styles.accountDropdown}>
                <Link href="/admin/dashboard"><LayoutDashboard size={18} aria-hidden="true" /> Quản trị</Link>
                <button type="button" onClick={logout}><LogOut size={18} aria-hidden="true" /> Đăng xuất</button>
              </div>
            </details>
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
          <Link className="mn-button" href="/contact#tu-van">
            Nhận tư vấn <Headset size={18} />
          </Link>
          {admin && (
            <div className={styles.mobileAccount}>
              <Link href="/admin/dashboard"><LayoutDashboard size={18} aria-hidden="true" /> Quản trị</Link>
              <button type="button" onClick={logout}><LogOut size={18} aria-hidden="true" /> Đăng xuất</button>
            </div>
          )}
        </motion.div>}
        </AnimatePresence>
      </dialog>
    </header>
  );
}
