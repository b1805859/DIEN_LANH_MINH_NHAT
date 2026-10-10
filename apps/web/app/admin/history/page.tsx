'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Filter, RotateCcw } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { getStoredAccessToken } from '@/lib/auth/tokens';

type HistoryAction = 'UPDATE' | 'DELETE';

type Snapshot = Record<string, unknown>;

type AdminHistoryItem = {
  id: string;
  action: HistoryAction;
  resource: string;
  recordId: string;
  actorEmail?: string;
  beforeSnapshot?: Snapshot | null;
  afterSnapshot?: Snapshot | null;
  revertedAt?: string | null;
  revertedByEmail?: string | null;
  createdAt: string;
};

type HistoryResponse = {
  items: AdminHistoryItem[];
  total: number;
};

type ChangedField = {
  field: string;
  label: string;
  beforeValue: unknown;
  afterValue: unknown;
  isSystemField: boolean;
};

const actionLabels: Record<HistoryAction, string> = {
  UPDATE: 'Cập nhật',
  DELETE: 'Xóa',
};

const actionOptions = [
  { value: 'all', label: 'Tất cả thao tác' },
  { value: 'UPDATE', label: 'Cập nhật' },
  { value: 'DELETE', label: 'Xóa' },
];

const resourceOptions = [
  { value: 'all', label: 'Tất cả phân hệ' },
  { value: 'services', label: 'Dịch vụ' },
  { value: 'locations', label: 'Khu vực' },
  { value: 'categories', label: 'Danh mục' },
  { value: 'tags', label: 'Thẻ' },
  { value: 'faqs', label: 'FAQ' },
  { value: 'media', label: 'Media' },
  { value: 'seo', label: 'SEO' },
  { value: 'blog', label: 'Blog' },
  { value: 'bookings', label: 'Lịch hẹn' },
  { value: 'users', label: 'Người dùng' },
  { value: 'roles', label: 'Vai trò' },
];

const resourceLabels = Object.fromEntries(resourceOptions.map((option) => [option.value, option.label]));

const fieldLabels: Record<string, string> = {
  name: 'Tên',
  title: 'Tiêu đề',
  slug: 'Đường dẫn',
  summary: 'Tóm tắt',
  description: 'Mô tả',
  content: 'Nội dung',
  excerpt: 'Tóm tắt bài viết',
  status: 'Trạng thái',
  publishedAt: 'Ngày xuất bản',
  categoryId: 'ID danh mục',
  featuredImageId: 'ID ảnh đại diện',
  featuredImage: 'Ảnh đại diện',
  imageUrl: 'Ảnh',
  imageAlt: 'Mô tả ảnh',
  fileName: 'Tên file',
  originalName: 'Tên gốc',
  mimeType: 'Loại file',
  size: 'Dung lượng',
  url: 'URL',
  altText: 'Mô tả ảnh',
  visibility: 'Hiển thị',
  pageType: 'Loại trang',
  pageKey: 'Khóa trang',
  canonicalUrl: 'Canonical URL',
  openGraphImage: 'Ảnh chia sẻ',
  noIndex: 'Không index',
  question: 'Câu hỏi',
  answer: 'Câu trả lời',
  serviceId: 'ID dịch vụ',
  locationId: 'ID khu vực',
  blogPostId: 'ID bài viết',
  customerName: 'Tên khách hàng',
  customerPhone: 'Số điện thoại',
  customerEmail: 'Email khách hàng',
  address: 'Địa chỉ',
  scheduledDate: 'Ngày hẹn',
  notes: 'Ghi chú',
  phone: 'Số điện thoại',
  email: 'Email',
  subject: 'Chủ đề',
  message: 'Nội dung',
  source: 'Nguồn',
  isResolved: 'Đã xử lý',
  roleId: 'ID vai trò',
  isActive: 'Đang hoạt động',
  displayOrder: 'Thứ tự hiển thị',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',
};

const hiddenFields = new Set(['id']);
const systemFields = new Set(['createdAt', 'updatedAt']);

function formatDate(value?: string | null) {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
}

function stableStringify(value: unknown) {
  if (value === undefined) return '__undefined__';
  return JSON.stringify(value, (_key, currentValue) => {
    if (!currentValue || typeof currentValue !== 'object' || Array.isArray(currentValue)) {
      return currentValue;
    }

    return Object.keys(currentValue as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((output, key) => {
        output[key] = (currentValue as Record<string, unknown>)[key];
        return output;
      }, {});
  });
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Chưa có';
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDate(value);
    return value;
  }
  return JSON.stringify(value, null, 2);
}

function getChangedFields(beforeSnapshot?: Snapshot | null, afterSnapshot?: Snapshot | null) {
  const before = beforeSnapshot ?? {};
  const after = afterSnapshot ?? {};
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));

  return keys
    .filter((key) => !hiddenFields.has(key))
    .filter((key) => stableStringify(before[key]) !== stableStringify(after[key]))
    .map<ChangedField>((key) => ({
      field: key,
      label: fieldLabels[key] ?? key,
      beforeValue: before[key],
      afterValue: after[key],
      isSystemField: systemFields.has(key),
    }))
    .sort((a, b) => Number(a.isSystemField) - Number(b.isSystemField) || a.label.localeCompare(b.label));
}

function getRecordLabel(item: AdminHistoryItem) {
  const snapshot = item.afterSnapshot ?? item.beforeSnapshot;
  const candidates = [
    snapshot?.title,
    snapshot?.name,
    snapshot?.fileName,
    snapshot?.question,
    snapshot?.customerName,
    snapshot?.email,
    snapshot?.pageKey,
  ];
  const label = candidates.find((value) => typeof value === 'string' && value.trim());
  return typeof label === 'string' ? label : 'Bản ghi đã cập nhật';
}

function ValueBlock({ value, tone }: { value: unknown; tone: 'before' | 'after' }) {
  const formattedValue = formatValue(value);
  const toneClass =
    tone === 'before'
      ? 'border-rose-100 bg-rose-50 text-rose-950'
      : 'border-emerald-100 bg-emerald-50 text-emerald-950';

  return (
    <pre className={`max-h-40 whitespace-pre-wrap break-words rounded-md border p-3 text-xs font-semibold ${toneClass}`}>
      {formattedValue}
    </pre>
  );
}

function ChangedFieldsTable({ item }: { item: AdminHistoryItem }) {
  const changes = getChangedFields(item.beforeSnapshot, item.afterSnapshot);
  const contentChanges = changes.filter((change) => !change.isSystemField);
  const systemChanges = changes.filter((change) => change.isSystemField);
  const visibleChanges = contentChanges;

  if (item.action === 'DELETE') {
    return (
      <div className="rounded-md border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-900">
        Bản ghi này đã bị xóa.
      </div>
    );
  }

  if (visibleChanges.length === 0) {
    return (
      <div className="rounded-md border bg-white p-4 text-sm font-semibold text-slate-600">
        Không có nội dung hiển thị trên form bị thay đổi.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <div className="border-b bg-slate-50 px-4 py-3">
        <p className="text-sm font-black uppercase text-slate-600">
          Nội dung đã thay đổi ({contentChanges.length})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="w-48 px-4 py-3">Field</th>
              <th className="px-4 py-3">Trước</th>
              <th className="px-4 py-3">Sau</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {visibleChanges.map((change) => (
              <tr key={change.field} className="align-top">
                <td className="px-4 py-3">
                  <p className="font-black text-slate-900">{change.label}</p>
                  <p className="mt-1 font-mono text-xs font-semibold text-slate-500">{change.field}</p>
                </td>
                <td className="px-4 py-3">
                  <ValueBlock value={change.beforeValue} tone="before" />
                </td>
                <td className="px-4 py-3">
                  <ValueBlock value={change.afterValue} tone="after" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contentChanges.length > 0 && systemChanges.length > 0 ? (
        <details className="border-t px-4 py-3">
          <summary className="cursor-pointer text-sm font-bold text-slate-600">
            Xem {systemChanges.length} thay đổi hệ thống
          </summary>
          <div className="mt-3 grid gap-2">
            {systemChanges.map((change) => (
              <div key={change.field} className="rounded-md bg-slate-50 p-3 text-xs font-semibold text-slate-600">
                {change.label}: {formatValue(change.beforeValue)} {'->'} {formatValue(change.afterValue)}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function AdminHistoryPageContent() {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [pendingRevert, setPendingRevert] = useState<AdminHistoryItem | null>(null);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

  const queryParams = useMemo(
    () => ({
      ...(actionFilter !== 'all' ? { action: actionFilter } : {}),
      ...(resourceFilter !== 'all' ? { resource: resourceFilter } : {}),
      pageSize: 100,
    }),
    [actionFilter, resourceFilter],
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-history', queryParams],
    queryFn: async () => {
      const response = await apiClient.get('/admin/history', {
        params: queryParams,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as HistoryResponse;
    },
    enabled: Boolean(token),
  });

  const revertMutation = useMutation({
    mutationFn: (historyId: string) =>
      apiClient.post(
        `/admin/history/${historyId}/revert`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      ),
    onSuccess: async () => {
      setPendingRevert(null);
      toast({
        title: 'Đã hoàn tác lịch sử',
        description: 'Dữ liệu đã được khôi phục.',
        variant: 'success',
      });
      await refetch();
    },
    onError: () => {
      toast({
        title: 'Không hoàn tác được',
        description: 'Dữ liệu có thể đã được hoàn tác hoặc không còn phù hợp để khôi phục.',
        variant: 'error',
      });
    },
  });

  const resetFilters = () => {
    setActionFilter('all');
    setResourceFilter('all');
    setExpandedId(null);
  };

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch sử quản trị</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Tổng số: {data?.total ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-md border bg-white p-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-slate-700">
            Loại thao tác
            <select
              value={actionFilter}
              onChange={(event) => {
                setActionFilter(event.target.value);
                setExpandedId(null);
              }}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-bold text-slate-700">
            Phân hệ
            <select
              value={resourceFilter}
              onChange={(event) => {
                setResourceFilter(event.target.value);
                setExpandedId(null);
              }}
              className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {resourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Button type="button" variant="outline" onClick={resetFilters}>
          <Filter className="mr-2 h-4 w-4" />
          Xóa lọc
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-md border bg-white">
        {!token ? <p className="p-4 text-sm text-slate-600">Vui lòng đăng nhập.</p> : null}
        {isLoading ? <p className="p-4 text-sm text-slate-600">Đang tải...</p> : null}

        {!isLoading && token && data?.items.length === 0 ? (
          <p className="p-4 text-sm text-slate-600">Không có lịch sử phù hợp.</p>
        ) : null}

        {data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Thao tác</th>
                  <th className="px-4 py-3">Phân hệ</th>
                  <th className="px-4 py-3">Record</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const isReverted = Boolean(item.revertedAt);

                  return (
                    <Fragment key={item.id}>
                      <tr className="align-top">
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-900 px-2 py-1 text-xs font-black uppercase text-white">
                            {actionLabels[item.action]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {resourceLabels[item.resource] ?? item.resource}
                        </td>
                        <td className="px-4 py-3">
                          <p className="max-w-[260px] truncate font-bold text-slate-900">{getRecordLabel(item)}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{item.actorEmail ?? 'Không rõ'}</td>
                        <td className="px-4 py-3">
                          {isReverted ? (
                            <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700">
                              Đã hoàn tác
                            </span>
                          ) : (
                            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-black uppercase text-slate-600">
                              Chưa hoàn tác
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            >
                              {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={isReverted || revertMutation.isPending}
                              onClick={() => setPendingRevert(item)}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Hoàn tác
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded ? (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-4 py-4">
                            {isReverted ? (
                              <p className="mb-3 text-sm font-semibold text-slate-600">
                                Hoàn tác lúc {formatDate(item.revertedAt)} bởi{' '}
                                {item.revertedByEmail ?? 'Không rõ'}
                              </p>
                            ) : null}
                            <ChangedFieldsTable item={item} />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
      <ConfirmDialog
        open={Boolean(pendingRevert)}
        title="Hoàn tác lịch sử?"
        description={
          pendingRevert
            ? `Bạn có chắc muốn hoàn tác lần ${actionLabels[pendingRevert.action].toLowerCase()} này? Dữ liệu sẽ được khôi phục về phiên bản trước đó.`
            : ''
        }
        confirmLabel="Hoàn tác"
        isLoading={revertMutation.isPending}
        onCancel={() => setPendingRevert(null)}
        onConfirm={() => {
          if (pendingRevert) revertMutation.mutate(pendingRevert.id);
        }}
      />
    </main>
  );
}

export default function AdminHistoryPage() {
  return (
    <QueryBoundary>
      <AdminHistoryPageContent />
    </QueryBoundary>
  );
}
