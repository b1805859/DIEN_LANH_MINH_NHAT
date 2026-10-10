'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { siteContent } from '@/lib/content/site-content';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';
const links = [
  ['Trang chủ', '/'],
  ['Giới thiệu', '/about'],
  ['Dịch vụ', '/services'],
  ['Dự án', '/projects'],
  ['Tin tức', '/blog'],
  ['Liên hệ', '/contact'],
];
export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
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
  }, [pathname]);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = old;
        dialog.current?.close();
      };
    } else {
      dialog.current?.close();
    }
  }, [open]);
  async function logout() {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();
    if (accessToken && refreshToken) {
      try {
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
    <header className={`mn-header ${pathname === '/' ? 'mn-header-home' : ''}`}>
      <div className="mn-nav-shell">
        <Link href="/" className="mn-brand" aria-label="Điện Lạnh Minh Nhật – Trang chủ">
          <MinhNhatLogoMark idPrefix="header" />
          <span>
            ĐIỆN LẠNH<strong>MINH NHẬT</strong>
            <small>CẦN THƠ</small>
          </span>
        </Link>
        <nav className="mn-desktop-nav" aria-label="Điều hướng chính">
          {links.map(([label, href]) => (
            <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>
              {label}
              {href === '/services' && <ChevronDown size={12} />}
            </Link>
          ))}
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
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="mn-mobile-dialog"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="mn-mobile-menu">
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
        </div>
      </dialog>
      {admin && (
        <button className="mn-session-logout" onClick={logout}>
          Đăng xuất
        </button>
      )}
    </header>
  );
}
