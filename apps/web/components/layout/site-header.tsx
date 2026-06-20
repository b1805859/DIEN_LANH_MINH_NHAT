'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu, X } from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { cn } from '@/lib/utils';

const navItems = [
  ['Trang chủ', '/'],
  ['Dịch vụ', '/services'],
  ['Bài viết', '/blog'],
  ['Đặt lịch', '/booking'],
  ['Liên hệ', '/contact'],
];

const mobileNavItems = navItems;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (drawerRef.current?.contains(target) || menuButtonRef.current?.contains(target)) {
        return;
      }

      setMobileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0b172a] text-white shadow-lg shadow-slate-950/20">
        <div className="container">
          <div className="flex min-h-16 items-center justify-between gap-3 sm:gap-5">
            <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
              <MinhNhatLogoMark
                className="h-9 w-9 shadow-lg shadow-cyan-400/20 transition group-hover:scale-[1.03] sm:h-10 sm:w-10"
                idPrefix="site-header-logo"
              />
              <span className="min-w-0">
                <span className="block max-w-[calc(100vw-10rem)] truncate text-sm font-black leading-tight sm:max-w-none sm:text-base">
                  {APP_NAME}
                </span>
                <span className="hidden text-xs font-semibold leading-tight text-cyan-100/75 sm:block">
                  Điện lạnh tận nơi tại Cần Thơ
                </span>
              </span>
            </Link>

            <nav
              className="ml-auto hidden items-center justify-center gap-7 text-sm font-bold text-slate-200 xl:flex"
              aria-label="Điều hướng chính"
            >
              {navItems.map(([label, href]) => {
                const active = isActive(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'transition hover:text-cyan-200',
                      active ? 'text-cyan-200' : 'text-slate-200',
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-2">
              <button
                ref={menuButtonRef}
                type="button"
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-md border transition xl:hidden',
                  'border-white/15 bg-white/10 text-white shadow-sm hover:border-cyan-200/50 hover:text-cyan-100',
                )}
                aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((current) => !current)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'fixed inset-0 z-50 xl:hidden',
              mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
            )}
          >
            <button
              type="button"
              className={cn(
                'absolute inset-0 bg-[#0b172a]/55 backdrop-blur-[2px] transition-opacity duration-300',
                mobileOpen ? 'opacity-100' : 'opacity-0',
              )}
              aria-label="Đóng menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              ref={drawerRef}
              className={cn(
                'absolute right-0 top-0 flex h-svh w-[min(22rem,86vw)] flex-col bg-white text-slate-950 shadow-2xl shadow-slate-950/30 transition-transform duration-300',
                mobileOpen ? 'translate-x-0' : 'translate-x-full',
              )}
              aria-label="Menu di động"
            >
              <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 px-4">
                <Link href="/" className="flex min-w-0 items-center gap-3">
                  <MinhNhatLogoMark
                    className="h-10 w-10 shadow-lg shadow-primary/20"
                    idPrefix="site-mobile-logo"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black">{APP_NAME}</span>
                    <span className="block text-xs font-semibold text-slate-500">
                      Điện lạnh Cần Thơ
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 transition hover:border-primary/40 hover:text-primary"
                  aria-label="Đóng menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Liên kết di động">
                {mobileNavItems.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex min-h-12 items-center justify-between rounded-md px-3 text-base font-black transition hover:bg-slate-100 hover:text-primary',
                      isActive(href) && 'bg-primary/10 text-primary',
                    )}
                  >
                    <span>{label}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ))}
              </nav>

              <div className="border-t border-slate-200 p-4">
                <Link
                  href="/booking"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-4 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                >
                  Đặt lịch kiểm tra
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </header>
      <div className="h-16 bg-[#0b172a]" aria-hidden="true" />
    </>
  );
}
