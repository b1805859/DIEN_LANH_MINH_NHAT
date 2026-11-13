'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderTree,
  HelpCircle,
  History,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardTrends } from '@/components/admin/dashboard-trends';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { AUTH_TOKEN_CHANGE_EVENT, getStoredAccessToken } from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';

type BookingOverview = {
  todayActive: number;
  upcoming7DaysActive: number;
  pendingActive: number;
  nextBookingDate: string | null;
  nextBookingCount: number;
};

type DashboardData = {
  services?: number;
  categories?: number;
  faqs?: number;
  blog?: number;
  bookings?: number;
  bookingOverview?: BookingOverview;
  [key: string]: number | BookingOverview | undefined;
};

const resources = [
  {
    key: 'services',
    mobileLabel: 'Dịch vụ',
    label: 'Dịch vụ kỹ thuật',
    desc: 'Quản lý bảng dịch vụ máy lạnh, máy giặt, tủ lạnh & điện nước',
    icon: Wrench,
    accent: 'from-cyan-400 to-sky-500',
  },
  {
    key: 'bookings',
    mobileLabel: 'Lịch hẹn',
    label: 'Lịch hẹn khách hàng',
    desc: 'Điều phối thợ đến tận nhà và cập nhật trạng thái xử lý',
    icon: CalendarClock,
    accent: 'from-sky-400 to-blue-600',
  },
  {
    key: 'blog',
    mobileLabel: 'Bài viết',
    label: 'Bài viết & Cẩm nang',
    desc: 'Chia sẻ mẹo tiết kiệm điện, vệ sinh máy và nhận biết lỗi',
    icon: BookOpen,
    accent: 'from-teal-400 to-cyan-600',
  },
  {
    key: 'categories',
    mobileLabel: 'Danh mục',
    label: 'Danh mục chuyên môn',
    desc: 'Phân nhóm nội dung bài viết và nhóm thiết bị điện lạnh',
    icon: FolderTree,
    accent: 'from-indigo-400 to-sky-500',
  },
  {
    key: 'faqs',
    mobileLabel: 'Hỏi đáp',
    label: 'Hỏi đáp (FAQ)',
    desc: 'Giải đáp các câu hỏi thường gặp về bảo hành và báo giá',
    icon: HelpCircle,
    accent: 'from-cyan-500 to-teal-500',
  },
  {
    key: 'history',
    mobileLabel: 'Lịch sử',
    label: 'Nhật ký hệ thống',
    desc: 'Theo dõi lịch sử chỉnh sửa dữ liệu và hoàn tác phiên bản',
    icon: History,
    accent: 'from-blue-500 to-indigo-600',
  },
];

function getNumberValue(data: DashboardData | undefined, key: string) {
  if (key === 'history') return '—';
  const value = data?.[key];
  return typeof value === 'number' ? value : 0;
}

function formatDateKey(dateKey: string | null | undefined) {
  if (!dateKey) {
    return 'Chưa có lịch sắp tới';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00.000Z`));
}

function AdminDashboardPageContent() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = () => setToken(getStoredAccessToken());
    syncToken();
    window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, syncToken);
    return () => window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, syncToken);
  }, []);

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as DashboardData;
    },
    enabled: Boolean(token),
  });

  const refreshDashboard = () => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ['admin-trends'] });
  };
  const bookingOverview = data?.bookingOverview;

  return (
    <main className="mn-admin-dashboard w-full px-4 py-6 sm:px-6 lg:px-6 lg:py-6">
      <div className="mn-admin-mobile-page-heading">
        <div>
          <h1>Tổng quan</h1>
          <p>
            {new Intl.DateTimeFormat('vi-VN', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh',
            }).format(new Date())}
          </p>
        </div>
        <button
          type="button"
          aria-label="Làm mới tổng quan"
          disabled={isFetching}
          onClick={refreshDashboard}
        >
          <RefreshCw size={20} />
        </button>
      </div>
      {/* Aurora Command Hero Banner */}
      <section className="mn-admin-hero-banner relative overflow-hidden rounded-3xl p-6 text-white shadow-xl sm:p-8">
        <div className="mn-admin-hero-aurora" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/15 px-3.5 py-1 text-xs font-extrabold tracking-wider text-cyan-100 uppercase backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Điện Lạnh Minh Nhật • Quản trị
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Tổng quan vận hành
            </h1>
            <p className="mt-2.5 text-sm font-medium leading-6 text-cyan-50/85 sm:text-base">
              Quản lý đồng bộ lịch hẹn sửa chữa tận nơi tại Cần Thơ, danh mục dịch vụ kỹ thuật và
              nội dung cẩm nang khách hàng trong cùng một không gian làm việc.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5 text-xs font-bold text-cyan-100">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />8 Khu vực Cần Thơ đang mở
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <Clock3 className="h-3.5 w-3.5 text-cyan-300" />
                Phản hồi kỹ thuật 30 phút
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/bookings"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-400 px-5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <CalendarClock className="h-4 w-4" />
              Điều phối lịch hẹn
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/bookings#yeu-cau-tu-van"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-black text-white hover:bg-white/20"
            >
              Yêu cầu tư vấn
            </Link>
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 rounded-xl border-white/25 bg-white/10 px-4 font-black text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
              disabled={isFetching}
              onClick={refreshDashboard}
            >
              <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              Làm mới
            </Button>
          </div>
        </div>
      </section>

      {!token ? (
        <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm font-semibold text-amber-900 backdrop-blur-md">
          Vui lòng{' '}
          <Link href="/admin/login" className="font-bold text-primary underline">
            đăng nhập
          </Link>{' '}
          để quản trị.
        </p>
      ) : null}

      {isError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm font-semibold text-red-900 backdrop-blur-md">
          Không tải được số liệu tổng quan. Vui lòng kiểm tra kết nối API rồi thử lại.
        </div>
      ) : null}

      {token ? (
        <section className="mn-admin-booking-overview mn-admin-glass-panel mt-6 overflow-hidden rounded-3xl p-5 sm:p-6">
          <div className="mn-admin-overview-heading flex flex-col gap-3 border-b border-cyan-900/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 text-white shadow-lg shadow-cyan-500/25">
                <CalendarClock className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black tracking-wider text-sky-600 uppercase">
                  Trạng thái điều phối thời gian thực
                </p>
                <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                  Tóm tắt lịch hẹn hôm nay & 7 ngày tới
                </h2>
              </div>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 text-xs font-black text-sky-800 transition hover:bg-cyan-500/20 sm:self-auto"
            >
              Mở lịch điều phối chi tiết
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mn-admin-kpi-grid mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardMetric
              label="Lịch hẹn hôm nay"
              mobileLabel="Hôm nay"
              value={bookingOverview?.todayActive ?? 0}
              helper="Đang hoạt động trong ngày"
              tone="cyan"
            />
            <DashboardMetric
              label="7 ngày tiếp theo"
              mobileLabel="7 ngày tới"
              value={bookingOverview?.upcoming7DaysActive ?? 0}
              helper="Lịch hẹn đã lên kế hoạch"
              tone="sky"
            />
            <DashboardMetric
              label="Đang chờ xác nhận"
              mobileLabel="Chờ xác nhận"
              value={bookingOverview?.pendingActive ?? 0}
              helper="Cần gọi xác nhận với khách"
              tone="amber"
            />
            <DashboardMetric
              label="Ngày gần nhất có lịch"
              mobileLabel="Lịch gần nhất"
              mobileValue={
                bookingOverview?.nextBookingDate ? bookingOverview.nextBookingCount : '—'
              }
              value={bookingOverview?.nextBookingCount ?? 0}
              helper={formatDateKey(bookingOverview?.nextBookingDate)}
              tone="emerald"
            />
          </div>
        </section>
      ) : null}

      {bookingOverview && !isError && (
        <div className="mn-admin-mobile-schedule-summary">
          <CalendarClock size={22} aria-hidden="true" />
          <span>
            {bookingOverview.todayActive
              ? `${bookingOverview.todayActive} lịch hẹn trong ngày`
              : 'Hôm nay chưa có lịch hẹn'}
          </span>
          <Link href="/admin/bookings">
            Xem lịch <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
      {token && <DashboardTrends token={token} />}
      {/* Bento Grid for Content & Operations */}
      <div className="mn-admin-resources mt-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
            Phân hệ quản trị dữ liệu
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Truy cập nhanh 1 chạm
          </span>
        </div>

        <div className="mn-admin-resources-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <Link
                key={resource.key}
                href={`/admin/${resource.key}`}
                className="mn-admin-bento-card group relative overflow-hidden rounded-2xl p-5 transition duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${resource.accent} text-white shadow-md shadow-cyan-500/20`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-400 transition group-hover:translate-x-0.5 group-hover:border-cyan-400 group-hover:bg-cyan-50 group-hover:text-sky-600">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-4">
                  <span className="block text-xs font-black tracking-wider text-sky-700 uppercase">
                    <span className="mn-admin-desktop-only">{resource.label}</span>
                    <span className="mn-admin-mobile-only">{resource.mobileLabel}</span>
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tight text-slate-950">
                      {isLoading ? '...' : getNumberValue(data, resource.key)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">bản ghi</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
                    {resource.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <nav className="mn-admin-mobile-shortcuts" aria-label="Tiện ích quản trị">
        <Link href="/admin/media">
          Media <ArrowRight size={16} />
        </Link>
        <Link href="/admin/seo">
          SEO <ArrowRight size={16} />
        </Link>
        <Link href="/admin/users">
          Tài khoản <ArrowRight size={16} />
        </Link>
      </nav>
    </main>
  );
}

function DashboardMetric({
  label,
  value,
  helper,
  tone,
  mobileLabel,
  mobileValue,
}: {
  mobileLabel?: string;
  mobileValue?: string | number;
  label: string;
  value: number;
  helper: string;
  tone: 'cyan' | 'sky' | 'amber' | 'emerald';
}) {
  const toneClasses = {
    cyan: 'border-cyan-400/35 bg-gradient-to-br from-cyan-50/90 via-white/95 to-sky-50/80 text-sky-950',
    sky: 'border-sky-400/35 bg-gradient-to-br from-sky-50/90 via-white/95 to-indigo-50/70 text-sky-950',
    amber:
      'border-amber-300/50 bg-gradient-to-br from-amber-50/90 via-white/95 to-orange-50/70 text-amber-950',
    emerald:
      'border-emerald-300/50 bg-gradient-to-br from-emerald-50/90 via-white/95 to-teal-50/70 text-emerald-950',
  };

  const badgeColors = {
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div
      className={`mn-admin-overview-metric relative overflow-hidden rounded-2xl border p-4 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black tracking-wider text-slate-600 uppercase">
          <span className="mn-admin-desktop-only">{label}</span>
          <span className="mn-admin-mobile-only">{mobileLabel ?? label}</span>
        </p>
        <span className={`h-2 w-2 rounded-full ${badgeColors[tone]}`} />
      </div>
      <p className="mt-2.5 text-3xl font-black tracking-tight">
        <span className="mn-admin-desktop-only">{value}</span>
        <span className="mn-admin-mobile-only">{mobileValue ?? value}</span>
      </p>
      <p className="mt-1 truncate text-xs font-bold text-slate-500">{helper}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <QueryBoundary>
      <AdminDashboardPageContent />
    </QueryBoundary>
  );
}
