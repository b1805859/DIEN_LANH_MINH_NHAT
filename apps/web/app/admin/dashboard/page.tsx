'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  FolderTree,
  HelpCircle,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { getStoredAccessToken } from '@/lib/auth/tokens';
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
  { key: 'services', label: 'Dịch vụ', icon: Wrench },
  { key: 'categories', label: 'Danh mục', icon: FolderTree },
  { key: 'faqs', label: 'Hỏi đáp', icon: HelpCircle },
  { key: 'blog', label: 'Bài viết', icon: BookOpen },
  { key: 'bookings', label: 'Lịch hẹn', icon: CalendarClock },
];

function getNumberValue(data: DashboardData | undefined, key: string) {
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getStoredAccessToken());
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

  const bookingOverview = data?.bookingOverview;

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">Admin CMS</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Bảng điều khiển quản trị
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Theo dõi nhanh các nhóm nội dung và yêu cầu khách hàng cần xử lý.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 font-black"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          Tải lại
        </Button>
      </div>

      {!token ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          Vui lòng{' '}
          <Link href="/admin/login" className="font-semibold text-primary">
            đăng nhập
          </Link>{' '}
          để quản trị.
        </p>
      ) : null}

      {isError ? (
        <div className="mt-6 rounded-md border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-900">
          Không tải được số liệu tổng quan. Vui lòng kiểm tra kết nối API rồi thử lại.
        </div>
      ) : null}

      {token ? (
        <section className="mt-6 overflow-hidden rounded-xl border border-primary/20 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-primary">
                  Điều phối lịch hẹn
                </p>
                <h2 className="text-lg font-black text-slate-950">
                  Tóm tắt lịch hôm nay và 7 ngày tới
                </h2>
              </div>
            </div>
            <Button asChild className="h-11 gap-2 self-start font-black sm:self-auto">
              <Link href="/admin/bookings">
                Xem lịch hẹn
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardMetric
              label="Lịch hôm nay"
              value={bookingOverview?.todayActive ?? 0}
              helper="Không tính lịch đã hủy"
            />
            <DashboardMetric
              label="7 ngày tiếp theo"
              value={bookingOverview?.upcoming7DaysActive ?? 0}
              helper="Từ ngày mai đến hết ngày thứ bảy"
            />
            <DashboardMetric
              label="Đang chờ xử lý"
              value={bookingOverview?.pendingActive ?? 0}
              helper="Cần admin xác nhận"
            />
            <DashboardMetric
              label="Ngày gần nhất có lịch"
              value={bookingOverview?.nextBookingCount ?? 0}
              helper={formatDateKey(bookingOverview?.nextBookingDate)}
            />
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <Link
              key={resource.key}
              href={`/admin/${resource.key}`}
              className="group rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-slate-200"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-primary" />
              </span>
              <span className="mt-5 block text-sm font-black uppercase text-slate-500">
                {resource.label}
              </span>
              <span className="mt-2 block text-3xl font-black tracking-tight text-slate-950">
                {isLoading ? '...' : getNumberValue(data, resource.key)}
              </span>
              <span className="mt-1 block text-sm font-semibold text-slate-500">
                mục đang được quản lý
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

function DashboardMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
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
