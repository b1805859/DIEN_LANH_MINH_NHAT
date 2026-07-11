'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarClock,
  FolderTree,
  HelpCircle,
  History,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Wrench,
} from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { apiClient } from '@/lib/api/client';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/lib/auth/tokens';
import { cn } from '@/lib/utils';

type AdminShellProps = {
  children: ReactNode;
};

const adminNavItems = [
  { href: '/admin/history', label: 'Lịch sử', icon: History },
  { href: '/admin/change-password', label: 'Đổi mật khẩu', icon: KeyRound },
  { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Dịch vụ', icon: Wrench },
  { href: '/admin/categories', label: 'Danh mục', icon: FolderTree },
  { href: '/admin/faqs', label: 'Hỏi đáp', icon: HelpCircle },
  { href: '/admin/blog', label: 'Bài viết', icon: BookOpen },
  { href: '/admin/bookings', label: 'Lịch hẹn', icon: CalendarClock },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [authChecked, setAuthChecked] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const hasSession = Boolean(getStoredAccessToken());
      setHasAdminSession(hasSession);
      setAuthChecked(true);

      if (!isLoginPage && !hasSession) {
        router.replace('/admin/login');
      }

      if (isLoginPage && hasSession) {
        router.replace('/admin/dashboard');
      }
    };

    syncAuthState();
    window.addEventListener('pageshow', syncAuthState);
    window.addEventListener('focus', syncAuthState);
    window.addEventListener('storage', syncAuthState);
    window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAuthState);

    return () => {
      window.removeEventListener('pageshow', syncAuthState);
      window.removeEventListener('focus', syncAuthState);
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAuthState);
    };
  }, [isLoginPage, router]);

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
        // Still clear the local session when the server token has already expired.
      }
    }

    clearStoredAuthTokens();
    setHasAdminSession(false);
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-dvh bg-slate-100">{children}</div>;
  }

  if (!authChecked || !hasAdminSession) {
    return <div className="min-h-dvh bg-slate-100" />;
  }

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-950 lg:grid lg:h-dvh lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="relative border-b border-slate-200 bg-[#0b172a] text-white lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:min-h-0 lg:flex-col lg:items-stretch lg:justify-start lg:p-5">
          <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
            <MinhNhatLogoMark
              className="h-10 w-10 shrink-0 shadow-lg shadow-cyan-400/20"
              idPrefix="admin-logo"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-black uppercase">{APP_NAME}</span>
              <span className="mt-1 hidden text-xs font-semibold text-cyan-100/70 sm:block">
                Quản trị hệ thống
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 text-sm font-black text-cyan-50 transition hover:border-cyan-200/50 hover:bg-white/15 lg:mt-6 lg:w-full lg:justify-center"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Xem website</span>
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-2 lg:grid lg:gap-1 lg:overflow-visible lg:px-3 lg:pb-0">
          {adminNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-black transition lg:w-full',
                  active
                    ? 'bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/20'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-3 pt-3 lg:block">
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-red-200/20 bg-red-400/10 px-3 text-sm font-black text-red-100 transition hover:border-red-100/50 hover:bg-red-400/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-col">
        <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:min-h-16 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Admin CMS</p>
            <p className="truncate text-sm font-semibold text-slate-700">
              Quản lý nội dung và yêu cầu khách hàng
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:border-red-200 hover:text-red-600 lg:hidden"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </header>

        <div className="min-w-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
