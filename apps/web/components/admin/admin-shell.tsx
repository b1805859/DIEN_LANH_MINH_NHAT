'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarClock,
  ExternalLink,
  FolderTree,
  Globe,
  HelpCircle,
  History,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Users,
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
import { useModalFocus } from '@/components/ui/use-modal-focus';

type AdminShellProps = {
  children: ReactNode;
};

const adminNavGroups = [
  {
    title: 'Điều phối & Tổng quan',
    items: [
      { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard, badge: 'Live' },
      { href: '/admin/bookings', label: 'Lịch hẹn khách', icon: CalendarClock, badge: 'Ưu tiên' },
    ],
  },
  {
    title: 'Quản trị nội dung',
    items: [
      { href: '/admin/services', label: 'Dịch vụ điện lạnh', icon: Wrench },
      { href: '/admin/blog', label: 'Bài viết & Cẩm nang', icon: BookOpen },
      { href: '/admin/categories', label: 'Danh mục', icon: FolderTree },
      { href: '/admin/faqs', label: 'Hỏi đáp (FAQ)', icon: HelpCircle },
      { href: '/admin/media', label: 'Thư viện Media', icon: ImageIcon },
      { href: '/admin/seo', label: 'Cấu hình SEO', icon: Globe },
    ],
  },
  {
    title: 'Hệ thống & Bảo mật',
    items: [
      { href: '/admin/history', label: 'Lịch sử thao tác', icon: History },
      { href: '/admin/users', label: 'Tài khoản & Quyền', icon: Users },
      { href: '/admin/change-password', label: 'Đổi mật khẩu', icon: KeyRound },
    ],
  },
];

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': {
    title: 'Tổng quan vận hành',
    subtitle: 'Tổng quan dịch vụ, điều phối lịch hẹn và hiệu suất vận hành tại Cần Thơ',
  },
  '/admin/bookings': {
    title: 'Điều phối lịch hẹn tận nơi',
    subtitle: 'Xử lý yêu cầu gọi tư vấn và theo dõi lịch thợ theo tháng',
  },
  '/admin/services': {
    title: 'Danh mục dịch vụ kỹ thuật',
    subtitle: 'Cập nhật thông tin, hình ảnh minh họa và thứ tự hiển thị dịch vụ',
  },
  '/admin/blog': {
    title: 'Cẩm nang & Tin tức điện lạnh',
    subtitle: 'Biên tập bài viết chia sẻ kinh nghiệm sử dụng, vệ sinh và nhận biết lỗi máy',
  },
  '/admin/categories': {
    title: 'Phân loại chuyên mục',
    subtitle: 'Quản lý cấu trúc danh mục dịch vụ và chuyên mục bài viết',
  },
  '/admin/faqs': {
    title: 'Câu hỏi thường gặp (FAQ)',
    subtitle: 'Giải đáp nhanh thắc mắc của khách hàng về quy trình và bảo hành',
  },
  '/admin/media': {
    title: 'Thư viện hình ảnh & Media',
    subtitle: 'Quản lý tài nguyên hình ảnh đồng bộ thương hiệu Điện Lạnh Minh Nhật',
  },
  '/admin/seo': {
    title: 'Tối ưu công cụ tìm kiếm (SEO)',
    subtitle: 'Quản lý thẻ tiêu đề, mô tả meta và OpenGraph cho từng trang',
  },
  '/admin/history': {
    title: 'Nhật ký & Lịch sử thay đổi',
    subtitle: 'Đối chiếu dữ liệu trước/sau khi chỉnh sửa và khôi phục phiên bản tức thì',
  },
  '/admin/users': {
    title: 'Quản trị viên & Phân quyền',
    subtitle: 'Quản lý tài khoản nhân sự vận hành hệ thống CMS',
  },
  '/admin/change-password': {
    title: 'Bảo mật & Đổi mật khẩu',
    subtitle: 'Cập nhật thông tin xác thực bảo vệ tài khoản quản trị viên',
  },
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  useModalFocus(menuOpen && drawerMode, sidebarRef);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px), (hover: none) and (pointer: coarse)');
    const sync = () => {
      setDrawerMode(media.matches);
      setMenuOpen(false);
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  const [authChecked, setAuthChecked] = useState(false);
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const hasSession = Boolean(getStoredAccessToken() || getStoredRefreshToken());
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
        // Ignore network errors when clearing local session.
      }
    }

    clearStoredAuthTokens();
    setHasAdminSession(false);
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <div className="mn-admin-aurora-login-wrap min-h-dvh">{children}</div>;
  }

  if (!authChecked || !hasAdminSession) {
    return <div className="mn-admin-aurora-shell mn-admin-glass-theme min-h-dvh" />;
  }

  const mobileTitles: Record<string, string> = {
    '/admin/dashboard': 'Quản trị Minh Nhật',
    '/admin/bookings': 'Lịch hẹn',
    '/admin/services': 'Dịch vụ',
    '/admin/blog': 'Bài viết',
  };
  const contentActive = [
    '/admin/services',
    '/admin/blog',
    '/admin/categories',
    '/admin/faqs',
    '/admin/media',
    '/admin/seo',
  ].some((href) => pathname.startsWith(href));
  const currentMeta = routeTitles[pathname] ?? {
    title: 'Quản trị hệ thống Minh Nhật',
    subtitle: 'Quản lý nội dung và vận hành Điện Lạnh Minh Nhật',
  };

  return (
    <div className="mn-admin-aurora-shell mn-admin-glass-theme min-h-dvh text-slate-900 lg:grid lg:h-dvh lg:grid-cols-[296px_minmax(0,1fr)] lg:overflow-hidden">
      {/* Ambient Aurora Mesh Plumes */}
      <div className="mn-admin-aurora-bg" aria-hidden="true">
        <span className="mn-aurora-orb mn-aurora-orb-1" />
        <span className="mn-aurora-orb mn-aurora-orb-2" />
        <span className="mn-aurora-orb mn-aurora-orb-3" />
      </div>

      {drawerMode && menuOpen && (
        <button
          className="mn-admin-drawer-backdrop"
          aria-label="Đóng menu quản trị"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        ref={sidebarRef}
        id="admin-sidebar"
        role={drawerMode ? 'dialog' : 'complementary'}
        aria-label="Menu quản trị"
        aria-modal={drawerMode && menuOpen ? true : undefined}
        inert={drawerMode && !menuOpen}
        onClick={(event) => {
          if ((event.target as Element).closest('a')) setMenuOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setMenuOpen(false);
        }}
        className={cn(
          'mn-admin-sidebar relative z-20 flex flex-col justify-between lg:h-dvh lg:overflow-y-auto',
          menuOpen && 'is-open',
        )}
      >
        <button
          type="button"
          className="mn-admin-drawer-close"
          aria-label="Đóng menu quản trị"
          onClick={() => setMenuOpen(false)}
        >
          <X size={22} />
        </button>
        <div>
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:pt-5 lg:pb-4">
            <Link href="/admin/dashboard" className="group flex min-w-0 items-center gap-3.5">
              <span className="mn-admin-logo-orb">
                <MinhNhatLogoMark className="h-10 w-10 shrink-0" idPrefix="admin-logo" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black tracking-wide text-white uppercase">
                  {APP_NAME}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-200/90">
                  <Sparkles className="h-3 w-3 text-cyan-300" />
                  Không gian quản trị
                </span>
              </span>
            </Link>

            <Link href="/" className="mn-admin-site-pill lg:hidden" title="Xem trang chủ">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
            </Link>
          </div>

          {/* Mobile Horizontal Nav */}
          <nav
            className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden"
            aria-label="Menu quản trị di động"
          >
            {adminNavGroups
              .flatMap((g) => g.items)
              .map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'mn-admin-nav-link shrink-0',
                      active && 'mn-admin-nav-link-active',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* Desktop Categorized Nav */}
          <div className="mn-admin-grouped-nav hidden lg:block lg:px-3.5 lg:pb-4">
            {adminNavGroups.map((group) => (
              <div key={group.title} className="mt-4 first:mt-1">
                <p className="px-3 text-[10px] font-black tracking-[0.14em] text-cyan-200/60 uppercase">
                  {group.title}
                </p>
                <nav className="mt-1.5 grid gap-1" aria-label={group.title}>
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn('mn-admin-nav-link', active && 'mn-admin-nav-link-active')}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {'badge' in item && item.badge ? (
                          <span
                            className={cn(
                              'mn-admin-nav-badge',
                              active && 'mn-admin-nav-badge-active',
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="mn-admin-sidebar-bottom hidden lg:block lg:p-3.5">
          <div className="mn-admin-sidebar-card">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-200">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-white">Điều phối Cần Thơ</p>
                <p className="truncate text-[11px] font-semibold text-cyan-100/75">
                  Đồng bộ thời gian thực
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/" className="mn-admin-sidebar-action">
                <ExternalLink className="h-3.5 w-3.5" />
                Website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mn-admin-sidebar-action mn-admin-sidebar-logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div
        inert={drawerMode && menuOpen}
        className="relative z-10 min-w-0 lg:flex lg:h-dvh lg:min-h-0 lg:flex-col"
      >
        <header className="mn-admin-topbar sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 px-4 py-3 lg:mx-6 lg:mt-3 lg:rounded-2xl lg:px-6">
          <button
            type="button"
            className="mn-admin-menu-toggle"
            aria-label="Mở menu quản trị"
            aria-controls="admin-sidebar"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="mn-admin-live-pill">
                <span className="mn-admin-live-dot" />
                Minh Nhật Workspace
              </span>
              <span className="hidden text-xs font-bold text-slate-500 sm:inline">
                • Điện Lạnh Minh Nhật
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
              <span className="mn-admin-desktop-only">{currentMeta.title}</span>
              <span className="mn-admin-mobile-only">
                {mobileTitles[pathname] ?? currentMeta.title}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="mn-admin-account-toggle"
              aria-label="Mở menu tài khoản"
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              MN
            </button>
            <Link href="/admin/bookings" className="mn-admin-quick-btn hidden sm:inline-flex">
              <CalendarClock className="h-4 w-4" />
              <span>Lịch hẹn hôm nay</span>
            </Link>
            <div className="mn-admin-user-pill hidden md:flex">
              <span className="mn-admin-avatar">MN</span>
              <div className="text-left leading-tight">
                <p className="text-xs font-black text-slate-900">Admin Minh Nhật</p>
                <p className="text-[10px] font-bold text-cyan-700">Quản trị viên</p>
              </div>
            </div>
            <button
              type="button"
              className="mn-admin-mobile-logout lg:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Đăng xuất</span>
            </button>
          </div>
        </header>

        <div className="mn-admin-main-scroll min-w-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {children}
        </div>
        <nav className="mn-admin-mobile-nav" aria-label="Điều hướng quản trị">
          <Link
            href="/admin/dashboard"
            aria-current={pathname === '/admin/dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard size={21} />
            <span>Tổng quan</span>
          </Link>
          <Link
            href="/admin/bookings"
            aria-current={pathname === '/admin/bookings' ? 'page' : undefined}
          >
            <CalendarClock size={21} />
            <span>Lịch hẹn</span>
          </Link>
          <Link href="/admin/services" aria-current={contentActive ? 'page' : undefined}>
            <BookOpen size={21} />
            <span>Nội dung</span>
          </Link>
          <button
            type="button"
            aria-controls="admin-sidebar"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} />
            <span>Thêm</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
