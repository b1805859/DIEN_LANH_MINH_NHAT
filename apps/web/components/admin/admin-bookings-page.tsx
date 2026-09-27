'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { getStoredAccessToken } from '@/lib/auth/tokens';
import { cn } from '@/lib/utils';

const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
type BookingStatus = (typeof BOOKING_STATUSES)[number];
type ScheduleView = 'calendar' | 'list';

type Booking = {
  id: string;
  scheduledDate: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  address: string;
  notes?: string | null;
  status: BookingStatus;
  createdAt: string;
  service?: { name?: string };
  location?: { name?: string };
};

type ScheduleDay = {
  date: string;
  activeCount: number;
  cancelledCount: number;
  statusCounts: Record<BookingStatus, number>;
};

type ScheduleResponse = {
  from: string;
  to: string;
  days: ScheduleDay[];
  bookings: Booking[];
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang xử lý',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-800',
  CONFIRMED: 'border-sky-200 bg-sky-50 text-sky-800',
  IN_PROGRESS: 'border-violet-200 bg-violet-50 text-violet-800',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  CANCELLED: 'border-slate-200 bg-slate-100 text-slate-600',
};

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function dateFromKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getTime() + amount * 24 * 60 * 60 * 1000);
}

function getTodayKey() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftMonth(monthKey: string, offset: number) {
  const [year, month] = monthKey.split('-').map(Number);
  return dateKey(new Date(Date.UTC(year, month - 1 + offset, 1))).slice(0, 7);
}

function getCalendarRange(monthKey: string) {
  const firstDay = dateFromKey(`${monthKey}-01`);
  const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
  const fromDate = addDays(firstDay, -mondayOffset);
  const dates = Array.from({ length: 42 }, (_, index) => dateKey(addDays(fromDate, index)));
  return { from: dates[0], to: dates[dates.length - 1], dates };
}

function formatMonth(monthKey: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dateFromKey(`${monthKey}-01`));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dateFromKey(value.slice(0, 10)));
}

function bookingDate(booking: Booking) {
  return booking.scheduledDate?.slice(0, 10) ?? '';
}

function AdminBookingsPageContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const today = getTodayKey();
  const [token, setToken] = useState<string | null>(null);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<ScheduleView>('calendar');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const range = useMemo(() => getCalendarRange(month), [month]);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

  const scheduleQuery = useQuery({
    queryKey: ['booking-schedule', range.from, range.to],
    queryFn: async () => {
      const response = await apiClient.get('/bookings/schedule', {
        params: { from: range.from, to: range.to },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as ScheduleResponse;
    },
    enabled: Boolean(token),
  });
  const requestsQuery = useQuery({
    queryKey: ['booking-requests'],
    queryFn: async () => {
      const response = await apiClient.get('/bookings', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as Booking[];
    },
    enabled: Boolean(token),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      apiClient.patch(
        `/admin/bookings/${id}`,
        { status },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
      ),
    onSuccess: async () => {
      toast({
        title: 'Đã cập nhật trạng thái',
        description: 'Lịch hẹn đã được cập nhật thành công.',
        variant: 'success',
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['booking-schedule'] }),
        queryClient.invalidateQueries({ queryKey: ['booking-requests'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }),
      ]);
    },
    onError: () => {
      toast({
        title: 'Không cập nhật được lịch hẹn',
        description: 'Vui lòng tải lại dữ liệu và thử lại.',
        variant: 'error',
      });
    },
  });

  const dayMap = useMemo(
    () => new Map((scheduleQuery.data?.days ?? []).map((day) => [day.date, day])),
    [scheduleQuery.data?.days],
  );

  const filteredBookings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (scheduleQuery.data?.bookings ?? []).filter((booking) => {
      const matchesMonth = bookingDate(booking).startsWith(month);
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        booking.customerName.toLowerCase().includes(normalizedSearch) ||
        booking.customerPhone.toLowerCase().includes(normalizedSearch);
      return matchesMonth && matchesStatus && matchesSearch;
    });
  }, [month, scheduleQuery.data?.bookings, search, statusFilter]);

  const selectedBookings = filteredBookings.filter(
    (booking) => bookingDate(booking) === selectedDate,
  );

  const groupedBookings = useMemo(() => {
    const groups = new Map<string, Booking[]>();
    for (const booking of filteredBookings) {
      const date = bookingDate(booking);
      groups.set(date, [...(groups.get(date) ?? []), booking]);
    }
    return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [filteredBookings]);

  const monthDays = [...dayMap.values()].filter((day) => day.date.startsWith(month));
  const unscheduledRequests = (requestsQuery.data ?? []).filter(
    (booking) => !booking.scheduledDate,
  );
  const monthActiveCount = monthDays.reduce((total, day) => total + day.activeCount, 0);
  const monthCancelledCount = monthDays.reduce((total, day) => total + day.cancelledCount, 0);
  const monthPendingCount = monthDays.reduce(
    (total, day) => total + (day.statusCounts.PENDING ?? 0),
    0,
  );
  const activeDayCount = monthDays.filter((day) => day.activeCount > 0).length;

  const goToMonth = (nextMonth: string) => {
    setMonth(nextMonth);
    setSelectedDate(nextMonth === today.slice(0, 7) ? today : `${nextMonth}-01`);
  };

  return (
    <main className="w-full px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">
            Điều phối công việc
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Quản lý lịch hẹn
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Theo dõi số lịch từng ngày và cập nhật trạng thái xử lý khách hàng.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-11 gap-2 self-start font-black"
          disabled={scheduleQuery.isFetching}
          onClick={() => {
            scheduleQuery.refetch();
            requestsQuery.refetch();
          }}
        >
          <RefreshCw
            className={cn('h-4 w-4', scheduleQuery.isFetching && 'motion-safe:animate-spin')}
          />
          Tải lại
        </Button>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Lịch trong tháng" value={monthActiveCount} tone="primary" />
        <SummaryCard label="Ngày có lịch" value={activeDayCount} tone="sky" />
        <SummaryCard label="Đang chờ xử lý" value={monthPendingCount} tone="amber" />
        <SummaryCard label="Đã hủy" value={monthCancelledCount} tone="slate" />
      </section>

      <section className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4 sm:p-5">
        <h2 className="text-xl font-black text-slate-950">
          Yêu cầu chưa có ngày hẹn ({unscheduledRequests.length})
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Khách đã gửi thông tin dịch vụ. Liên hệ khách để thống nhất thời gian.
        </p>
        {requestsQuery.isError ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            Không tải được yêu cầu mới.
          </p>
        ) : null}
        {unscheduledRequests.length ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {unscheduledRequests.map((booking, index) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                animationIndex={index}
                isUpdating={updateStatus.isPending}
                onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section
        className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        aria-busy={scheduleQuery.isLoading || scheduleQuery.isFetching}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Tháng trước"
              onClick={() => goToMonth(shiftMonth(month, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="min-w-40 text-center text-lg font-black capitalize text-slate-950">
              {formatMonth(month)}
            </h2>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Tháng sau"
              onClick={() => goToMonth(shiftMonth(month, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="ml-1 font-bold"
              onClick={() => goToMonth(today.slice(0, 7))}
            >
              Hôm nay
            </Button>
          </div>
          <div className="inline-flex self-start rounded-lg bg-slate-100 p-1">
            <ViewButton
              active={view === 'calendar'}
              icon={CalendarDays}
              label="Lịch tháng"
              onClick={() => setView('calendar')}
            />
            <ViewButton
              active={view === 'list'}
              icon={List}
              label="Theo ngày"
              onClick={() => setView('list')}
            />
          </div>
        </div>

        <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              value={search}
              placeholder="Tìm tên hoặc số điện thoại"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <select
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'ALL' | BookingStatus)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        {scheduleQuery.isLoading ? (
          <div className="grid min-h-72 place-items-center text-sm font-semibold text-slate-500">
            Đang tải lịch hẹn...
          </div>
        ) : null}

        {scheduleQuery.isError ? (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-black text-red-900">Không tải được lịch hẹn</p>
            <p className="mt-1 text-sm font-semibold text-red-700">
              Vui lòng kiểm tra kết nối và thử tải lại.
            </p>
          </div>
        ) : null}

        {scheduleQuery.data && view === 'calendar' ? (
          <>
            <CalendarGrid
              dates={range.dates}
              month={month}
              today={today}
              selectedDate={selectedDate}
              dayMap={dayMap}
              onSelectDate={setSelectedDate}
            />
            <DaySection
              date={selectedDate}
              bookings={selectedBookings}
              day={dayMap.get(selectedDate)}
              isUpdating={updateStatus.isPending}
              onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            />
          </>
        ) : null}

        {scheduleQuery.data && view === 'list' ? (
          <div className="grid gap-5 p-4 sm:p-5">
            {groupedBookings.length ? (
              groupedBookings.map(([date, bookings]) => (
                <DaySection
                  key={date}
                  date={date}
                  bookings={bookings}
                  day={dayMap.get(date)}
                  isUpdating={updateStatus.isPending}
                  onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                />
              ))
            ) : (
              <EmptyBookings filtered={Boolean(search.trim() || statusFilter !== 'ALL')} />
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'primary' | 'sky' | 'amber' | 'slate';
}) {
  const tones = {
    primary: 'border-primary/20 bg-primary/5 text-primary',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    slate: 'border-slate-200 bg-white text-slate-700',
  };
  return (
    <div className={cn('rounded-xl border p-4 shadow-sm', tones[tone])}>
      <p className="text-xs font-black uppercase tracking-wide opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function ViewButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof CalendarDays;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition',
        active ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900',
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function CalendarGrid({
  dates,
  month,
  today,
  selectedDate,
  dayMap,
  onSelectDate,
}: {
  dates: string[];
  month: string;
  today: string;
  selectedDate: string;
  dayMap: Map<string, ScheduleDay>;
  onSelectDate: (date: string) => void;
}) {
  return (
    <div className="border-b border-slate-200 p-2 sm:p-4">
      <div className="grid grid-cols-7 overflow-hidden rounded-lg border border-slate-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-b border-slate-200 bg-slate-100 px-1 py-2 text-center text-[11px] font-black uppercase text-slate-500 sm:text-xs"
          >
            {day}
          </div>
        ))}
        {dates.map((date) => {
          const day = dayMap.get(date);
          const isCurrentMonth = date.startsWith(month);
          const isSelected = date === selectedDate;
          const isToday = date === today;
          return (
            <button
              key={date}
              type="button"
              className={cn(
                'min-h-20 border-b border-r border-slate-200 p-1 text-left transition last:border-r-0 sm:min-h-28 sm:p-2',
                isCurrentMonth ? 'bg-white' : 'bg-slate-50 text-slate-400',
                isSelected && 'relative z-10 bg-primary/5 ring-2 ring-inset ring-primary',
                !isSelected && 'hover:bg-sky-50',
              )}
              onClick={() => onSelectDate(date)}
            >
              <span
                className={cn(
                  'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-black sm:text-sm',
                  isToday && 'bg-primary text-white',
                )}
              >
                {Number(date.slice(-2))}
              </span>
              {day?.activeCount ? (
                <span className="mt-1 block rounded bg-emerald-100 px-1 py-1 text-center text-[10px] font-black text-emerald-800 sm:px-2 sm:text-xs">
                  {day.activeCount}
                  <span className="hidden sm:inline"> lịch</span>
                </span>
              ) : null}
              {day?.cancelledCount ? (
                <span className="mt-1 block truncate text-center text-[9px] font-bold text-slate-400 sm:text-[11px]">
                  {day.cancelledCount} hủy
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DaySection({
  date,
  bookings,
  day,
  isUpdating,
  onStatusChange,
}: {
  date: string;
  bookings: Booking[];
  day?: ScheduleDay;
  isUpdating: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  return (
    <section className="p-4 sm:p-5">
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-black capitalize text-slate-950">{formatFullDate(date)}</h3>
        <p className="text-sm font-bold text-slate-500">
          <span className="text-emerald-700">{day?.activeCount ?? 0} lịch</span>
          {day?.cancelledCount ? ` · ${day.cancelledCount} đã hủy` : ''}
        </p>
      </div>
      {bookings.length ? (
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              animationIndex={index}
              isUpdating={isUpdating}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyBookings filtered />
      )}
    </section>
  );
}

function BookingCard({
  booking,
  animationIndex,
  isUpdating,
  onStatusChange,
}: {
  booking: Booking;
  animationIndex: number;
  isUpdating: boolean;
  onStatusChange: (id: string, status: BookingStatus) => void;
}) {
  return (
    <article
      className="animate-in fade-in slide-in-from-bottom-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm duration-300 motion-reduce:animate-none"
      style={{ animationDelay: `${Math.min(animationIndex * 40, 200)}ms` }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="truncate text-base font-black text-slate-950">{booking.customerName}</h4>
          <a
            href={`tel:${booking.customerPhone.replace(/\D/g, '')}`}
            className="mt-1 inline-flex items-center gap-1.5 text-sm font-black text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {booking.customerPhone}
          </a>
        </div>
        <span
          className={cn(
            'inline-flex self-start rounded-full border px-2.5 py-1 text-xs font-black',
            statusStyles[booking.status],
          )}
        >
          {statusLabels[booking.status]}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm font-semibold leading-5 text-slate-600">
        <p className="flex items-start gap-2">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          {booking.service?.name ?? 'Chưa xác định dịch vụ'}
        </p>
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {booking.address}
            {booking.location?.name ? ` · ${booking.location.name}` : ''}
          </span>
        </p>
        {booking.notes ? (
          <p className="rounded-md bg-slate-50 p-2.5 text-slate-700">{booking.notes}</p>
        ) : null}
      </div>
      <label className="mt-4 grid gap-1.5 border-t border-slate-100 pt-3 text-xs font-black uppercase text-slate-500">
        Cập nhật trạng thái
        <select
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold normal-case text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          value={booking.status}
          disabled={isUpdating}
          onChange={(event) => onStatusChange(booking.id, event.target.value as BookingStatus)}
        >
          {BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}

function EmptyBookings({ filtered }: { filtered: boolean }) {
  return (
    <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
      <p className="text-sm font-semibold text-slate-500">
        {filtered ? 'Không có lịch hẹn phù hợp.' : 'Chưa có lịch hẹn trong tháng này.'}
      </p>
    </div>
  );
}

export function AdminBookingsPage() {
  return (
    <QueryBoundary>
      <AdminBookingsPageContent />
    </QueryBoundary>
  );
}
