'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BadgeDollarSign,
  ChevronRight,
  ChevronUp,
  Grid2X2,
  House,
  Info,
  LogOut,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';
import { integrationSettings } from '@/lib/integrations/settings';
import { cn } from '@/lib/utils';

const navItems = [
  ['Trang chủ', '/'],
  ['Dịch vụ', '/services'],
  ['Khu vực', '/areas'],
  ['Giới thiệu', '/about'],
  ['Liên hệ', '/contact'],
];

const mobileNavItems = [...navItems.slice(0, 4), ['Báo giá', '/booking'], navItems[4]] as const;
const desktopNavItems = navItems;
const mobileNavIcons = {
  '/': House,
  '/services': Grid2X2,
  '/areas': MapPin,
  '/about': Info,
  '/booking': BadgeDollarSign,
  '/contact': Phone,
} as const;
const focusableElementSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [isScrolled, setIsScrolled] = useState(pathname !== '/');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const syncAdminSession = () => {
      setHasAdminSession(Boolean(getStoredAccessToken()));
    };

    syncAdminSession();
    window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAdminSession);
    window.addEventListener('focus', syncAdminSession);
    window.addEventListener('storage', syncAdminSession);

    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAdminSession);
      window.removeEventListener('focus', syncAdminSession);
      window.removeEventListener('storage', syncAdminSession);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncHeader = () => setIsScrolled(pathname !== '/' || window.scrollY > 50);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
    return () => window.removeEventListener('scroll', syncHeader);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const handleDrawerKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(focusableElementSelector),
      ).filter((element) => element.getClientRects().length > 0);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        drawerRef.current.focus();
        return;
      }

      if (!drawerRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleDrawerKeyDown);
    drawerCloseButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleDrawerKeyDown);
      if (menuButton?.isConnected) {
        menuButton.focus();
      }
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
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
        // Local logout should still complete even if the token is already invalid.
      }
    }

    clearStoredAuthTokens();
    setHasAdminSession(false);
    setMobileOpen(false);

    if (pathname.startsWith('/admin')) {
      router.replace('/admin/login');
    }
  };

  return (
    <>
      <header
        className={cn(
          'mock-site-header fixed inset-x-0 top-0 z-40 border-b text-[#081f60] transition-all duration-200',
          isScrolled ? 'border-slate-200/80 bg-white shadow-sm' : 'border-slate-200 bg-white',
        )}
      >
        <div className="container">
          <div className="mock-header-row flex min-h-16 items-center justify-between gap-3 sm:gap-4 xl:min-h-[70px]">
            <Link
              href="/"
              className="mock-site-brand group flex min-w-0 items-center gap-2 sm:gap-3 xl:shrink-0"
            >
              <MinhNhatLogoMark
                className="h-9 w-9 transition group-hover:scale-[1.03] sm:h-10 sm:w-10"
                idPrefix="site-header-logo"
              />
              <span className="min-w-0 xl:min-w-max">
                <span className="mock-site-brand-title block text-sm font-black leading-tight sm:max-w-none xl:text-[15px] xl:whitespace-nowrap">
                  <span className="mock-brand-first">Điện Lạnh</span> <span>Minh Nhật</span>
                </span>
                <span className="mock-brand-tagline hidden text-xs font-semibold leading-tight text-slate-500 sm:block">
                  Đồng hành cùng ngôi nhà bạn
                </span>
              </span>
            </Link>

            <nav
              className="mock-desktop-nav hidden shrink-0 items-center justify-center gap-3 text-[13px] font-bold xl:flex"
              aria-label="Điều hướng chính"
            >
              {desktopNavItems.map(([label, href]) => {
                const active = isActive(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'group relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm transition hover:text-[#0877c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9] focus-visible:ring-offset-2',
                      active ? 'text-[#0877c9]' : 'text-slate-600',
                    )}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 bottom-1 h-0.5 origin-left rounded-full bg-[#0877c9] transition-transform duration-200',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mock-header-actions flex shrink-0 items-center justify-end gap-2">
              {hasAdminSession ? (
                <Link
                  href="/admin/dashboard"
                  className="hidden h-11 items-center justify-center rounded-md border border-cyan-200/40 bg-cyan-300/10 px-3 text-sm font-black text-primary transition hover:border-primary hover:bg-cyan-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
                >
                  Quản trị
                </Link>
              ) : null}
              {hasAdminSession ? (
                <button
                  type="button"
                  className="hidden h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 text-sm font-black text-slate-700 transition hover:border-red-200/60 hover:bg-red-400/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              ) : null}
              <a
                href={`tel:${integrationSettings.phone.replace(/\s/g, '')}`}
                className="mock-header-phone hidden min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-2 text-[13px] font-black text-[#0b5fa5] transition hover:bg-[#eef8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9] lg:inline-flex"
              >
                <Phone className="h-4 w-4" />
                <span className="grid">
                  <strong>0939 370 109</strong>
                  <small className="text-[10px] font-normal">08:00–17:00 Thứ 2–CN</small>
                </span>
              </a>
              <a
                href={integrationSettings.zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="mock-header-zalo hidden min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#0877e7] px-4 text-[13px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0765aa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9] focus-visible:ring-offset-2 sm:inline-flex"
              >
                <Image src="/icons/zalo.svg" width={16} height={16} alt="" /> Nhắn Zalo
              </a>
              <a
                href={`tel:${integrationSettings.phone.replace(/\s/g, '')}`}
                aria-label={`Gọi ${integrationSettings.phone}`}
                className="mock-mobile-phone inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/75 text-[#0877c9] transition hover:border-[#9ddaff] hover:bg-[#eef8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9] lg:hidden"
              >
                <Phone className="h-4 w-4" />
              </a>
              <button
                ref={menuButtonRef}
                type="button"
                className={cn(
                  'mock-menu-toggle inline-flex h-11 w-11 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0877c9] xl:hidden',
                  'border-slate-200 bg-white/75 text-[#0868d2] shadow-sm hover:border-[#9ddaff] hover:text-[#0877c9]',
                )}
                aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-site-menu"
                onClick={() => setMobileOpen(true)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mock-menu-overlay fixed inset-0 z-50 xl:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-[#0b172a]/55 backdrop-blur-[2px]"
                aria-label="Đóng menu"
                tabIndex={-1}
                onClick={() => setMobileOpen(false)}
              />
              <aside
                ref={drawerRef}
                id="mobile-site-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-site-menu-title"
                tabIndex={-1}
                className="absolute right-0 top-0 flex h-svh w-full animate-in flex-col bg-white text-slate-950 shadow-2xl shadow-slate-950/30 slide-in-from-right duration-300 motion-reduce:animate-none sm:w-[min(22rem,86vw)]"
              >
                <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 px-4">
                  <Link href="/" className="flex min-w-0 items-center gap-3">
                    <MinhNhatLogoMark
                      className="h-10 w-10 shadow-lg shadow-primary/20"
                      idPrefix="site-mobile-logo"
                    />
                    <span className="min-w-0">
                      <span
                        id="mobile-site-menu-title"
                        className="block truncate text-sm font-black"
                      >
                        <span className="mock-brand-first">Điện Lạnh</span> <span>Minh Nhật</span>
                      </span>
                      <span className="block text-xs font-semibold text-slate-500">
                        Điện lạnh Cần Thơ
                      </span>
                    </span>
                  </Link>
                  <button
                    ref={drawerCloseButtonRef}
                    type="button"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Đóng menu"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Liên kết di động">
                  {mobileNavItems.map(([label, href]) => {
                    const Icon = mobileNavIcons[href as keyof typeof mobileNavIcons];

                    return (
                      <div key={href}>
                        <Link
                          onClick={() => setMobileOpen(false)}
                          href={href}
                          className={cn(
                            'mock-mobile-nav-link flex min-h-11 items-center justify-between border-b border-slate-100 px-3 text-sm font-bold transition hover:bg-slate-100 hover:text-primary',
                            isActive(href) && 'text-primary',
                          )}
                          aria-current={pathname === href ? 'page' : undefined}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {label}
                          </span>
                          {href === '/services' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Link>
                        {href === '/services' ? (
                          <div className="grid border-b border-slate-100 pb-2 pl-7 text-xs text-[#315eae]">
                            {[
                              ['Máy lạnh', '/services/sua-may-lanh'],
                              ['Máy giặt', '/services/sua-may-giat'],
                              ['Tủ lạnh', '/services/sua-tu-lanh'],
                              ['Máy nước nóng', '/services/sua-lap-may-nuoc-nong-lanh-tam'],
                              ['Điện nước', '/services/sua-dien-nuoc'],
                              ['Nạp gas', '/services/nap-gas-may-lanh'],
                              [
                                'Máy nước uống nóng/lạnh',
                                '/services/sua-lap-may-nuoc-uong-nong-lanh',
                              ],
                            ].map(([name, serviceHref]) => (
                              <Link
                                key={`${name}-${serviceHref}`}
                                href={serviceHref}
                                onClick={() => setMobileOpen(false)}
                                className="py-1.5 hover:text-primary"
                              >
                                {name}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  {hasAdminSession ? (
                    <Link
                      href="/admin/dashboard"
                      className="mt-2 flex min-h-12 items-center justify-between rounded-md bg-primary/10 px-3 text-base font-black text-primary transition hover:bg-primary/15"
                    >
                      <span>Quản trị</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                  {hasAdminSession ? (
                    <button
                      type="button"
                      className="mt-2 flex min-h-12 w-full items-center justify-between rounded-md px-3 text-left text-base font-black text-red-600 transition hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <span>Đăng xuất</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  ) : null}
                </nav>

                <div className="mock-menu-ctas border-t border-slate-200 p-4">
                  <div className="grid gap-2">
                    <a
                      href={`tel:${integrationSettings.phone}`}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-white"
                    >
                      <Phone className="h-4 w-4" />{' '}
                      <span>
                        Gọi ngay<strong>0939 370 109</strong>
                      </span>
                    </a>
                    <a
                      href={integrationSettings.zaloUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center rounded-md border border-primary text-sm font-black text-primary"
                    >
                      <Image src="/icons/zalo.svg" width={24} height={24} alt="" /> Nhắn Zalo
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </header>
      <div className="mock-site-header-spacer h-16 xl:h-[72px]" aria-hidden="true" />
    </>
  );
}
