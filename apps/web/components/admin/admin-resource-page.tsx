'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { getStoredAccessToken } from '@/lib/auth/tokens';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/layout/query-boundary';

type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'datetime-local' | 'image';

type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

type ResourceConfig = {
  fields: AdminField[];
  primaryLabel: (record: AdminRecord, index: number) => string;
};

type AdminRecord = {
  id?: string;
  [key: string]: unknown;
  featuredImage?: { url?: string; altText?: string };
};

type FormState = Record<string, string | number | boolean>;
type AdminScreenMode = 'list' | 'create' | 'edit' | 'view';

const resourceConfigs: Record<string, ResourceConfig> = {
  services: {
    fields: [
      { name: 'name', label: 'Tên dịch vụ', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, placeholder: 'sua-may-lanh' },
      { name: 'summary', label: 'Tóm tắt', type: 'textarea' },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
      { name: 'displayOrder', label: 'Thứ tự hiển thị', type: 'number' },
      { name: 'isActive', label: 'Đang hiển thị', type: 'checkbox' },
    ],
    primaryLabel: (record, index) => textValue(record.name) || textValue(record.slug) || `Dịch vụ ${index + 1}`,
  },
  locations: {
    fields: [
      { name: 'name', label: 'Tên khu vực', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, placeholder: 'ninh-kieu' },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
      { name: 'isPriority', label: 'Khu vực ưu tiên', type: 'checkbox' },
      { name: 'isActive', label: 'Đang hiển thị', type: 'checkbox' },
    ],
    primaryLabel: (record, index) => textValue(record.name) || textValue(record.slug) || `Khu vực ${index + 1}`,
  },
  categories: {
    fields: [
      { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
    ],
    primaryLabel: (record, index) => textValue(record.name) || textValue(record.slug) || `Danh mục ${index + 1}`,
  },
  tags: {
    fields: [
      { name: 'name', label: 'Tên thẻ', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
    ],
    primaryLabel: (record, index) => textValue(record.name) || textValue(record.slug) || `Thẻ ${index + 1}`,
  },
  faqs: {
    fields: [
      { name: 'question', label: 'Câu hỏi', type: 'textarea', required: true },
      { name: 'answer', label: 'Câu trả lời', type: 'textarea', required: true },
      { name: 'serviceId', label: 'ID dịch vụ liên quan', type: 'text' },
      { name: 'locationId', label: 'ID khu vực liên quan', type: 'text' },
      { name: 'blogPostId', label: 'ID bài viết liên quan', type: 'text' },
      { name: 'isActive', label: 'Đang hiển thị', type: 'checkbox' },
    ],
    primaryLabel: (record, index) => textValue(record.question) || `Hỏi đáp ${index + 1}`,
  },
  blog: {
    fields: [
      { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
      { name: 'excerpt', label: 'Tóm tắt', type: 'textarea' },
      { name: 'content', label: 'Nội dung', type: 'textarea', required: true },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
          { label: 'Nháp', value: 'DRAFT' },
          { label: 'Đã xuất bản', value: 'PUBLISHED' },
          { label: 'Lưu trữ', value: 'ARCHIVED' },
        ],
      },
      { name: 'publishedAt', label: 'Ngày xuất bản', type: 'datetime-local' },
      { name: 'categoryId', label: 'ID danh mục', type: 'text' },
      { name: 'featuredImageUrl', label: 'Ảnh đại diện', type: 'image' },
      { name: 'featuredImageAlt', label: 'Mô tả ảnh', type: 'text' },
    ],
    primaryLabel: (record, index) => textValue(record.title) || textValue(record.slug) || `Bài viết ${index + 1}`,
  },
  bookings: {
    fields: [
      { name: 'customerName', label: 'Tên khách hàng', type: 'text', required: true },
      { name: 'customerPhone', label: 'Số điện thoại', type: 'text', required: true },
      { name: 'customerEmail', label: 'Email', type: 'text' },
      { name: 'serviceId', label: 'ID dịch vụ', type: 'text', required: true },
      { name: 'locationId', label: 'ID khu vực', type: 'text', required: true },
      { name: 'scheduledAt', label: 'Thời gian hẹn', type: 'datetime-local', required: true },
      { name: 'address', label: 'Địa chỉ', type: 'textarea', required: true },
      { name: 'notes', label: 'Ghi chú', type: 'textarea' },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        options: [
          { label: 'Chờ xử lý', value: 'PENDING' },
          { label: 'Đã xác nhận', value: 'CONFIRMED' },
          { label: 'Đang xử lý', value: 'IN_PROGRESS' },
          { label: 'Hoàn tất', value: 'COMPLETED' },
          { label: 'Đã hủy', value: 'CANCELLED' },
        ],
      },
    ],
    primaryLabel: (record, index) => textValue(record.customerName) || textValue(record.customerPhone) || `Lịch hẹn ${index + 1}`,
  },
  contacts: {
    fields: [
      { name: 'name', label: 'Tên khách hàng', type: 'text', required: true },
      { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'subject', label: 'Chủ đề', type: 'text' },
      { name: 'message', label: 'Nội dung', type: 'textarea' },
      { name: 'source', label: 'Nguồn', type: 'text' },
      { name: 'isResolved', label: 'Đã xử lý', type: 'checkbox' },
    ],
    primaryLabel: (record, index) => textValue(record.name) || textValue(record.phone) || `Liên hệ ${index + 1}`,
  },
  media: {
    fields: [
      { name: 'fileName', label: 'Tên file', type: 'text', required: true },
      { name: 'originalName', label: 'Tên gốc', type: 'text', required: true },
      { name: 'mimeType', label: 'Loại file', type: 'text', required: true, placeholder: 'image/jpeg' },
      { name: 'size', label: 'Dung lượng', type: 'number' },
      { name: 'url', label: 'Ảnh', type: 'image', required: true },
      { name: 'altText', label: 'Mô tả ảnh', type: 'text' },
      {
        name: 'visibility',
        label: 'Hiển thị',
        type: 'select',
        options: [
          { label: 'Công khai', value: 'PUBLIC' },
          { label: 'Riêng tư', value: 'PRIVATE' },
        ],
      },
    ],
    primaryLabel: (record, index) => textValue(record.originalName) || textValue(record.fileName) || `Ảnh ${index + 1}`,
  },
  seo: {
    fields: [
      { name: 'pageType', label: 'Loại trang', type: 'text', required: true },
      { name: 'pageKey', label: 'Khóa trang', type: 'text', required: true },
      { name: 'title', label: 'Tiêu đề SEO', type: 'text', required: true },
      { name: 'description', label: 'Mô tả SEO', type: 'textarea' },
      { name: 'canonicalUrl', label: 'Canonical URL', type: 'text' },
      { name: 'openGraphImage', label: 'Ảnh chia sẻ', type: 'image' },
      { name: 'noIndex', label: 'Không index', type: 'checkbox' },
      { name: 'serviceId', label: 'ID dịch vụ', type: 'text' },
      { name: 'locationId', label: 'ID khu vực', type: 'text' },
      { name: 'blogPostId', label: 'ID bài viết', type: 'text' },
    ],
    primaryLabel: (record, index) => textValue(record.title) || textValue(record.pageKey) || `SEO ${index + 1}`,
  },
  users: {
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'name', label: 'Tên người dùng', type: 'text', required: true },
      { name: 'password', label: 'Mật khẩu mới', type: 'text', placeholder: 'Để trống nếu không đổi khi sửa' },
      { name: 'roleId', label: 'ID vai trò', type: 'text', required: true },
      { name: 'isActive', label: 'Đang hoạt động', type: 'checkbox' },
    ],
    primaryLabel: (record, index) => textValue(record.email) || textValue(record.name) || `Người dùng ${index + 1}`,
  },
  roles: {
    fields: [
      { name: 'name', label: 'Tên vai trò', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
    ],
    primaryLabel: (record, index) => textValue(record.name) || `Vai trò ${index + 1}`,
  },
};

function textValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function createInitialForm(config: ResourceConfig) {
  return config.fields.reduce<FormState>((form, field) => {
    if (field.type === 'checkbox') {
      form[field.name] = field.name === 'isActive';
    } else if (field.type === 'number') {
      form[field.name] = '';
    } else if (field.type === 'select') {
      form[field.name] = field.options?.[0]?.value ?? '';
    } else {
      form[field.name] = '';
    }
    return form;
  }, {});
}

function formatDateTimeInput(value: unknown) {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

function createEditForm(config: ResourceConfig, record: AdminRecord) {
  const initialForm = createInitialForm(config);
  for (const field of config.fields) {
    if (field.name === 'featuredImageUrl') {
      initialForm[field.name] = record.featuredImage?.url ?? '';
      continue;
    }

    if (field.name === 'featuredImageAlt') {
      initialForm[field.name] = record.featuredImage?.altText ?? '';
      continue;
    }

    const value = record[field.name];
    if (field.type === 'checkbox') {
      initialForm[field.name] = Boolean(value);
    } else if (field.type === 'datetime-local') {
      initialForm[field.name] = formatDateTimeInput(value);
    } else if (typeof value === 'number' || typeof value === 'string') {
      initialForm[field.name] = value;
    } else if (value === null || value === undefined) {
      initialForm[field.name] = '';
    }
  }
  return initialForm;
}

function buildPayload(config: ResourceConfig, form: FormState) {
  return config.fields.reduce<Record<string, unknown>>((payload, field) => {
    const value = form[field.name];

    if (field.type === 'checkbox') {
      payload[field.name] = Boolean(value);
      return payload;
    }

    if (field.type === 'number') {
      payload[field.name] = value === '' ? null : Number(value);
      return payload;
    }

    if (field.type === 'datetime-local') {
      payload[field.name] = value ? new Date(String(value)).toISOString() : null;
      return payload;
    }

    const stringValue = String(value ?? '').trim();
    payload[field.name] = stringValue || (field.required ? '' : null);
    return payload;
  }, {});
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatAdminValue(value: unknown) {
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const date = new Date(value);
    if (/^\d{4}-\d{2}-\d{2}T/.test(value) && !Number.isNaN(date.getTime())) {
      return date.toLocaleString('vi-VN');
    }
    return value;
  }
  if (value === null || value === undefined) return 'Chưa có';
  return JSON.stringify(value);
}

function getRecordImageUrl(record: AdminRecord) {
  return record.featuredImage?.url ?? textValue(record.url);
}

function AdminResourcePageContent({ title, resource }: { title: string; resource: string }) {
  const config = useMemo(() => resourceConfigs[resource] ?? resourceConfigs.services, [resource]);
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => createInitialForm(config));
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(null);
  const [screenMode, setScreenMode] = useState<AdminScreenMode>('list');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

  useEffect(() => {
    setForm(createInitialForm(config));
    setEditingRecord(null);
    setSelectedRecord(null);
    setScreenMode('list');
  }, [config]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', resource],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/${resource}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as { items: AdminRecord[]; total: number };
    },
    enabled: Boolean(token),
  });

  const updateField = (name: string, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(createInitialForm(config));
    setEditingRecord(null);
    setSelectedRecord(null);
    setScreenMode('list');
  };

  const handleCreateRecord = () => {
    setForm(createInitialForm(config));
    setEditingRecord(null);
    setSelectedRecord(null);
    setScreenMode('create');
  };

  const handleViewRecord = (record: AdminRecord) => {
    setSelectedRecord(record);
    setEditingRecord(null);
    setScreenMode('view');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setIsSaving(true);
    try {
      const payload = buildPayload(config, form);
      if (editingRecord?.id) {
        await apiClient.patch(`/admin/${resource}/${editingRecord.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await apiClient.post(`/admin/${resource}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      await refetch();
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, field: AdminField) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateField(field.name, await readImageFile(file));

    if (resource === 'media' && field.name === 'url') {
      setForm((current) => ({
        ...current,
        fileName: current.fileName || file.name,
        originalName: current.originalName || file.name,
        mimeType: file.type || current.mimeType || 'image/jpeg',
        size: file.size,
      }));
    }
  };

  const handleEditRecord = (record: AdminRecord) => {
    setEditingRecord(record);
    setSelectedRecord(record);
    setForm(createEditForm(config, record));
    setScreenMode('edit');
  };

  const handleDeleteRecord = async (record: AdminRecord) => {
    if (!token || !record.id || !window.confirm('Xóa dữ liệu này?')) return;
    await apiClient.delete(`/admin/${resource}/${record.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (editingRecord?.id === record.id) resetForm();
    await refetch();
  };

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {screenMode === 'list' ? (
          <Button type="button" onClick={handleCreateRecord} disabled={!token}>
            Thêm mới
          </Button>
        ) : null}
      </div>
      <div className="mt-6">
        {screenMode === 'create' || screenMode === 'edit' ? (
        <form className="max-w-3xl rounded-md border bg-white p-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">{editingRecord ? 'Chỉnh sửa dữ liệu' : 'Tạo dữ liệu'}</h2>
            <button type="button" className="text-sm font-semibold text-slate-500" onClick={resetForm}>
              Quay lại danh sách
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            {config.fields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm font-semibold text-slate-700">
                <span>
                  {field.label}
                  {field.required ? <span className="text-red-600"> *</span> : null}
                </span>
                <FormField
                  field={field}
                  value={form[field.name]}
                  onChange={(value) => updateField(field.name, value)}
                  onImageChange={(event) => handleImageChange(event, field)}
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <Button type="submit" disabled={!token || isSaving}>
              {editingRecord ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Hủy
            </Button>
          </div>
        </form>
        ) : null}

        {screenMode === 'view' && selectedRecord ? (
          <div className="rounded-md border bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-slate-500">View</p>
                <h2 className="text-xl font-black">{config.primaryLabel(selectedRecord, 0)}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Quay lại
                </Button>
                <Button type="button" onClick={() => handleEditRecord(selectedRecord)}>
                  Update
                </Button>
              </div>
            </div>

            {getRecordImageUrl(selectedRecord) ? (
              <div className="relative mt-5 aspect-[16/9] max-w-xl overflow-hidden rounded-md border bg-slate-100">
                <Image
                  src={getRecordImageUrl(selectedRecord)}
                  alt={selectedRecord.featuredImage?.altText ?? textValue(selectedRecord.altText) ?? config.primaryLabel(selectedRecord, 0)}
                  fill
                  className="object-cover"
                  sizes="640px"
                  unoptimized={getRecordImageUrl(selectedRecord).startsWith('data:')}
                />
              </div>
            ) : null}

            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border bg-slate-50 p-3">
                <dt className="text-xs font-black uppercase text-slate-500">ID</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{selectedRecord.id ?? 'Chưa có'}</dd>
              </div>
              {config.fields.map((field) => (
                <div key={field.name} className="rounded-md border bg-slate-50 p-3">
                  <dt className="text-xs font-black uppercase text-slate-500">{field.label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {field.name === 'featuredImageUrl'
                      ? getRecordImageUrl(selectedRecord) || 'Chưa có'
                      : field.name === 'featuredImageAlt'
                        ? selectedRecord.featuredImage?.altText || textValue(selectedRecord.altText) || 'Chưa có'
                        : formatAdminValue(selectedRecord[field.name])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div className={screenMode === 'list' ? 'rounded-md border bg-white p-4' : 'hidden'}>
          {!token ? <p className="text-sm text-slate-600">Vui lòng đăng nhập để quản trị.</p> : null}
          {isLoading ? <p className="text-sm text-slate-600">Đang tải...</p> : null}
          {data ? (
            <div>
              <p className="text-sm text-slate-600">Tổng số: {data.total}</p>
              <div className="mt-4 grid gap-3">
                {data.items.map((record, index) => (
                  <div
                    key={record.id ?? index}
                    className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      {record.featuredImage?.url || textValue(record.url) ? (
                        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                          {(() => {
                            const imageUrl = record.featuredImage?.url ?? textValue(record.url);

                            return (
                              <Image
                                src={imageUrl}
                                alt={record.featuredImage?.altText ?? textValue(record.altText) ?? config.primaryLabel(record, index)}
                                fill
                                className="object-cover"
                                sizes="64px"
                                unoptimized={imageUrl.startsWith('data:')}
                              />
                            );
                          })()}
                        </span>
                      ) : null}
                      <span className="truncate">{config.primaryLabel(record, index)}</span>
                    </span>
                    {record.id ? (
                      <span className="flex shrink-0 items-center gap-3">
                        <button className="font-semibold text-slate-700" onClick={() => handleViewRecord(record)}>
                          View
                        </button>
                        <button className="font-semibold text-primary" onClick={() => handleEditRecord(record)}>
                          Update
                        </button>
                        <button
                          className="font-semibold text-red-600"
                          onClick={() => handleDeleteRecord(record)}
                        >
                          Xóa
                        </button>
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function FormField({
  field,
  value,
  onChange,
  onImageChange,
}: {
  field: AdminField;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputClass = 'min-h-11 rounded-md border px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';

  if (field.type === 'textarea') {
    return (
      <textarea
        className={`${inputClass} min-h-28`}
        value={String(value ?? '')}
        required={field.required}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          className="h-4 w-4 rounded border-slate-300"
          onChange={(event) => onChange(event.target.checked)}
        />
        Có
      </span>
    );
  }

  if (field.type === 'select') {
    return (
      <select className={inputClass} value={String(value ?? '')} required={field.required} onChange={(event) => onChange(event.target.value)}>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'image') {
    const imageUrl = String(value ?? '');
    return (
      <span className="grid gap-3">
        {imageUrl ? (
          <span className="relative block aspect-[16/9] overflow-hidden rounded-md border bg-slate-100">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="420px"
              unoptimized={imageUrl.startsWith('data:')}
            />
          </span>
        ) : null}
        <input
          className={inputClass}
          value={imageUrl}
          placeholder="Dán URL ảnh hoặc chọn file bên dưới"
          onChange={(event) => onChange(event.target.value)}
        />
        <input type="file" accept="image/*" className="text-sm font-medium" onChange={onImageChange} />
      </span>
    );
  }

  return (
    <input
      type={field.type}
      className={inputClass}
      value={String(value ?? '')}
      required={field.required}
      placeholder={field.placeholder}
      onChange={(event) => onChange(field.type === 'number' ? event.target.value : event.target.value)}
    />
  );
}

export function AdminResourcePage(props: { title: string; resource: string }) {
  return (
    <QueryBoundary>
      <AdminResourcePageContent {...props} />
    </QueryBoundary>
  );
}
