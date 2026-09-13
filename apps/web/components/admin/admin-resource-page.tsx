'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoadingImage } from '@/components/ui/loading-image';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { getStoredAccessToken } from '@/lib/auth/tokens';

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'datetime-local'
  | 'image';

type AdminField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

type AdminRecord = {
  id?: string;
  [key: string]: unknown;
  featuredImage?: { url?: string; altText?: string };
};

type ListColumn = {
  key: string;
  label: string;
  className?: string;
  render: (record: AdminRecord, index: number) => ReactNode;
};

type ResourceConfig = {
  fields: AdminField[];
  listColumns: ListColumn[];
  primaryLabel: (record: AdminRecord, index: number) => string;
  readOnly?: boolean;
  readOnlyMessage?: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
  updateFields?: string[];
};

type FormState = Record<string, string | number | boolean>;
type FormErrors = Record<string, string>;
type AdminScreenMode = 'list' | 'create' | 'edit' | 'view';
type CurrentImagePreview = {
  key: string;
  label: string;
  url: string;
  alt: string;
  note?: string;
};

const PAGE_SIZE = 12;

const resourceConfigs: Record<string, ResourceConfig> = {
  services: {
    fields: [
      { name: 'name', label: 'Tên dịch vụ', type: 'text', required: true },
      {
        name: 'slug',
        label: 'Đường dẫn',
        type: 'text',
        required: true,
        placeholder: 'sua-may-lanh',
      },
      { name: 'summary', label: 'Tóm tắt', type: 'textarea' },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
      { name: 'imageUrl', label: 'Ảnh dịch vụ', type: 'image' },
      { name: 'imageAlt', label: 'Mô tả ảnh', type: 'text' },
      { name: 'displayOrder', label: 'Thứ tự hiển thị', type: 'number' },
      { name: 'isActive', label: 'Đang hiển thị', type: 'checkbox' },
    ],
    listColumns: [
      imageColumn('services'),
      textColumn('name', 'Tên dịch vụ', { primary: true }),
      textColumn('slug', 'Đường dẫn', { monospace: true }),
      booleanColumn('isActive', 'Trạng thái', 'Đang hiển thị', 'Đang ẩn'),
      textColumn('displayOrder', 'Thứ tự'),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.name) || textValue(record.slug) || `Dịch vụ ${index + 1}`,
  },
  categories: {
    fields: [
      { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
    ],
    listColumns: [
      textColumn('name', 'Tên danh mục', { primary: true }),
      textColumn('slug', 'Đường dẫn', { monospace: true }),
      textColumn('description', 'Mô tả', { truncate: true }),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.name) || textValue(record.slug) || `Danh mục ${index + 1}`,
  },
  tags: {
    fields: [
      { name: 'name', label: 'Tên thẻ', type: 'text', required: true },
      { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
    ],
    listColumns: [
      textColumn('name', 'Tên thẻ', { primary: true }),
      textColumn('slug', 'Đường dẫn', { monospace: true }),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.name) || textValue(record.slug) || `Thẻ ${index + 1}`,
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
    listColumns: [
      textColumn('question', 'Câu hỏi', { primary: true, truncate: true }),
      booleanColumn('isActive', 'Trạng thái', 'Đang hiển thị', 'Đang ẩn'),
      textColumn('serviceId', 'Dịch vụ', { monospace: true }),
      textColumn('blogPostId', 'Bài viết', { monospace: true }),
      dateColumn('updatedAt', 'Cập nhật'),
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
    listColumns: [
      imageColumn('blog'),
      textColumn('title', 'Tiêu đề', { primary: true, truncate: true }),
      badgeColumn('status', 'Trạng thái'),
      {
        key: 'category',
        label: 'Danh mục',
        render: (record) => textCell(textValue(objectValue(record.category)?.name) || 'Chưa có'),
      },
      dateColumn('publishedAt', 'Xuất bản'),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.title) || textValue(record.slug) || `Bài viết ${index + 1}`,
  },
  bookings: {
    fields: [
      { name: 'customerName', label: 'Tên khách hàng', type: 'text', required: true },
      { name: 'customerPhone', label: 'Số điện thoại', type: 'text', required: true },
      { name: 'customerEmail', label: 'Email', type: 'text' },
      { name: 'serviceId', label: 'ID dịch vụ', type: 'text', required: true },
      { name: 'locationId', label: 'ID khu vực', type: 'text', required: true },
      { name: 'scheduledDate', label: 'Ngày hẹn', type: 'date', required: true },
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
    listColumns: [
      textColumn('customerName', 'Khách hàng', { primary: true }),
      textColumn('customerPhone', 'Số điện thoại'),
      badgeColumn('status', 'Trạng thái'),
      dateColumn('scheduledDate', 'Ngày hẹn'),
      textColumn('address', 'Địa chỉ', { truncate: true }),
      dateColumn('createdAt', 'Ngày tạo'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.customerName) || textValue(record.customerPhone) || `Lịch hẹn ${index + 1}`,
    allowCreate: false,
    allowDelete: false,
    updateFields: ['status'],
  },
  media: {
    fields: [
      { name: 'fileName', label: 'Tên file', type: 'text', required: true },
      { name: 'originalName', label: 'Tên gốc', type: 'text', required: true },
      {
        name: 'mimeType',
        label: 'Loại file',
        type: 'text',
        required: true,
        placeholder: 'image/jpeg',
      },
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
    listColumns: [
      imageColumn('media'),
      textColumn('originalName', 'Tên file', { primary: true, truncate: true }),
      textColumn('mimeType', 'Loại file'),
      {
        key: 'size',
        label: 'Dung lượng',
        render: (record) => textCell(formatFileSize(record.size)),
      },
      badgeColumn('visibility', 'Hiển thị'),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.originalName) || textValue(record.fileName) || `Ảnh ${index + 1}`,
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
    listColumns: [
      textColumn('title', 'Tiêu đề SEO', { primary: true, truncate: true }),
      textColumn('pageType', 'Loại trang'),
      textColumn('pageKey', 'Khóa trang', { monospace: true }),
      booleanColumn('noIndex', 'Index', 'Không index', 'Cho index'),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.title) || textValue(record.pageKey) || `SEO ${index + 1}`,
  },
  users: {
    fields: [
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'name', label: 'Tên người dùng', type: 'text', required: true },
      {
        name: 'password',
        label: 'Mật khẩu mới',
        type: 'text',
        placeholder: 'Để trống nếu không đổi khi sửa',
      },
      { name: 'roleId', label: 'ID vai trò', type: 'text', required: true },
      { name: 'isActive', label: 'Đang hoạt động', type: 'checkbox' },
    ],
    listColumns: [
      textColumn('email', 'Email', { primary: true }),
      textColumn('name', 'Tên người dùng'),
      textColumn('roleId', 'Vai trò', { monospace: true }),
      booleanColumn('isActive', 'Trạng thái', 'Đang hoạt động', 'Đã khóa'),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) =>
      textValue(record.email) || textValue(record.name) || `Người dùng ${index + 1}`,
  },
  roles: {
    fields: [
      { name: 'name', label: 'Tên vai trò', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
    ],
    listColumns: [
      textColumn('name', 'Tên vai trò', { primary: true }),
      textColumn('description', 'Mô tả', { truncate: true }),
      dateColumn('updatedAt', 'Cập nhật'),
    ],
    primaryLabel: (record, index) => textValue(record.name) || `Vai trò ${index + 1}`,
  },
};

const imageUpdateFields: Record<string, Set<string>> = {
  services: new Set(['imageUrl']),
  blog: new Set(['featuredImageUrl']),
  media: new Set(['url']),
  seo: new Set(['openGraphImage']),
};

const badgeLabels: Record<string, string> = {
  DRAFT: 'Nháp',
  PUBLISHED: 'Đã xuất bản',
  ARCHIVED: 'Lưu trữ',
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang xử lý',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
};

function textValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function objectValue(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
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

function getUpdateFields(config: ResourceConfig, resource: string) {
  const blockedFields = imageUpdateFields[resource] ?? new Set<string>();
  const editableFields = config.updateFields
    ? config.fields.filter((field) => config.updateFields?.includes(field.name))
    : config.fields;

  return editableFields.filter((field) => !blockedFields.has(field.name));
}

function formatDateTimeInput(value: unknown) {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

function formatDateInput(value: unknown) {
  if (typeof value !== 'string' || !value) return '';
  return value.slice(0, 10);
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
    } else if (field.type === 'date') {
      initialForm[field.name] = formatDateInput(value);
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

function buildPayload(fields: AdminField[], form: FormState) {
  return fields.reduce<Record<string, unknown>>((payload, field) => {
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

function getRequiredFieldErrors(fields: AdminField[], form: FormState) {
  return fields.reduce<FormErrors>((errors, field) => {
    if (!field.required || field.type === 'checkbox') {
      return errors;
    }

    const value = form[field.name];
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim().length === 0) ||
      value === '';

    if (isEmpty) {
      errors[field.name] = `Vui lòng nhập ${field.label.toLowerCase()}.`;
    }

    return errors;
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

function formatDate(value: unknown) {
  if (typeof value !== 'string' || !value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
}

function formatFileSize(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Chưa có';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function searchableValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (!value) return '';

  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

function recordMatchesSearch(
  record: AdminRecord,
  index: number,
  config: ResourceConfig,
  searchTerm: string,
) {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  if (!normalizedTerm) return true;

  const haystack = [
    config.primaryLabel(record, index),
    ...config.fields.map((field) => searchableValue(record[field.name])),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedTerm);
}

function getServiceImageUrl(record: AdminRecord) {
  const savedImageUrl = textValue(record.imageUrl);
  if (savedImageUrl) return savedImageUrl;

  const slug = textValue(record.slug);
  return slug ? `/images/services/${slug}.jpg` : '';
}

function getRecordImageUrls(record: AdminRecord, resource?: string) {
  if (resource === 'services') {
    const serviceImageUrl = getServiceImageUrl(record);
    return serviceImageUrl ? [serviceImageUrl] : [];
  }

  const imageUrl = record.featuredImage?.url ?? textValue(record.url);
  return imageUrl ? [imageUrl] : [];
}

function getRecordImageUrl(record: AdminRecord, resource?: string) {
  return getRecordImageUrls(record, resource)[0] ?? '';
}

function getRecordImageFieldUrl(record: AdminRecord, field: AdminField) {
  if (field.name === 'featuredImageUrl') {
    return record.featuredImage?.url ?? textValue(record[field.name]);
  }

  return textValue(record[field.name]);
}

function getCurrentImagePreviews(
  resource: string,
  config: ResourceConfig,
  record: AdminRecord,
): CurrentImagePreview[] {
  if (resource === 'services') {
    const serviceImageUrl = getServiceImageUrl(record);
    const serviceName = textValue(record.imageAlt) || config.primaryLabel(record, 0);

    return [
      {
        key: 'service-image',
        label: 'Ảnh dịch vụ',
        url: serviceImageUrl,
        alt: serviceName,
        note: serviceImageUrl
          ? textValue(record.imageUrl)
            ? 'Ảnh đang lưu trong dữ liệu dịch vụ.'
            : `Chưa có ảnh riêng, đang dùng ảnh mặc định theo slug: ${serviceImageUrl}`
          : 'Dịch vụ chưa có ảnh riêng hoặc slug ảnh mặc định.',
      },
    ];
  }

  return config.fields
    .filter((field) => field.type === 'image')
    .map((field) => {
      const imageUrl = getRecordImageFieldUrl(record, field);

      return {
        key: field.name,
        label: field.label,
        url: imageUrl,
        alt:
          record.featuredImage?.altText ||
          textValue(record.altText) ||
          config.primaryLabel(record, 0),
      };
    });
}

function imageColumn(resource: string): ListColumn {
  return {
    key: 'image',
    label: 'Ảnh',
    className: 'w-24',
    render: (record, index) => (
      <RecordThumbnail
        record={record}
        resource={resource}
        label={
          textValue(record.name) ||
          textValue(record.title) ||
          textValue(record.originalName) ||
          `Ảnh ${index + 1}`
        }
      />
    ),
  };
}

function textColumn(
  key: string,
  label: string,
  options: { primary?: boolean; truncate?: boolean; monospace?: boolean } = {},
): ListColumn {
  return {
    key,
    label,
    render: (record) => textCell(record[key], options),
  };
}

function dateColumn(key: string, label: string): ListColumn {
  return {
    key,
    label,
    render: (record) => textCell(formatDate(record[key])),
  };
}

function badgeColumn(key: string, label: string): ListColumn {
  return {
    key,
    label,
    render: (record) => <StatusBadge value={textValue(record[key])} />,
  };
}

function booleanColumn(
  key: string,
  label: string,
  trueLabel: string,
  falseLabel: string,
): ListColumn {
  return {
    key,
    label,
    render: (record) => (
      <span
        className={
          record[key]
            ? 'inline-flex rounded bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700'
            : 'inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-black uppercase text-slate-600'
        }
      >
        {record[key] ? trueLabel : falseLabel}
      </span>
    ),
  };
}

function textCell(
  value: unknown,
  options: { primary?: boolean; truncate?: boolean; monospace?: boolean } = {},
) {
  const displayValue =
    typeof value === 'number'
      ? String(value)
      : typeof value === 'string' && value
        ? value
        : 'Chưa có';
  const classes = [
    options.primary ? 'font-black text-slate-950' : 'font-semibold text-slate-700',
    options.truncate ? 'max-w-[320px] truncate' : 'max-w-[260px] break-words',
    options.monospace ? 'font-mono text-xs' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{displayValue}</span>;
}

function StatusBadge({ value }: { value: string }) {
  const label = badgeLabels[value] ?? (value || 'Chưa có');
  const tone =
    value === 'PUBLISHED' || value === 'COMPLETED' || value === 'PUBLIC'
      ? 'bg-emerald-50 text-emerald-700'
      : value === 'CANCELLED' || value === 'ARCHIVED'
        ? 'bg-rose-50 text-rose-700'
        : value === 'IN_PROGRESS' || value === 'CONFIRMED'
          ? 'bg-sky-50 text-sky-700'
          : 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex rounded px-2 py-1 text-xs font-black uppercase ${tone}`}>
      {label}
    </span>
  );
}

function RecordThumbnail({
  record,
  resource,
  label,
}: {
  record: AdminRecord;
  resource: string;
  label: string;
}) {
  const imageUrls = getRecordImageUrls(record, resource);
  const imageUrl = imageUrls[0];

  if (!imageUrl) {
    return (
      <span className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed bg-slate-50 text-[10px] font-black uppercase text-slate-400">
        Không ảnh
      </span>
    );
  }

  return (
    <span className="relative block h-12 w-16 overflow-hidden rounded-md bg-slate-100">
      <LoadingImage
        src={imageUrl}
        alt={record.featuredImage?.altText || textValue(record.altText) || label}
        fill
        className="object-cover"
        sizes="64px"
        unoptimized={imageUrl.startsWith('data:')}
      />
      {imageUrls.length > 1 ? (
        <span className="absolute bottom-1 right-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
          {imageUrls.length} ảnh
        </span>
      ) : null}
    </span>
  );
}

function AdminResourcePageContent({ title, resource }: { title: string; resource: string }) {
  const config = useMemo(() => resourceConfigs[resource] ?? resourceConfigs.services, [resource]);
  const updateFields = useMemo(() => getUpdateFields(config, resource), [config, resource]);
  const canCreate = !config.readOnly && (config.allowCreate ?? true);
  const canUpdate = !config.readOnly && updateFields.length > 0;
  const canDelete = !config.readOnly && (config.allowDelete ?? true);
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => createInitialForm(config));
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(null);
  const [pendingDeleteRecord, setPendingDeleteRecord] = useState<AdminRecord | null>(null);
  const [screenMode, setScreenMode] = useState<AdminScreenMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

  useEffect(() => {
    setForm(createInitialForm(config));
    setEditingRecord(null);
    setSelectedRecord(null);
    setScreenMode('list');
    setFieldErrors({});
    setSearchTerm('');
    setCurrentPage(1);
  }, [config]);

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['admin', resource],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/${resource}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as { items: AdminRecord[]; total: number };
    },
    enabled: Boolean(token),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data?.items.length]);

  const updateField = (name: string, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const resetForm = () => {
    setForm(createInitialForm(config));
    setFieldErrors({});
    setEditingRecord(null);
    setSelectedRecord(null);
    setScreenMode('list');
  };

  const handleCreateRecord = () => {
    if (!canCreate) return;
    setForm(createInitialForm(config));
    setFieldErrors({});
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

    const activeFields = editingRecord ? updateFields : config.fields;
    const nextFieldErrors = getRequiredFieldErrors(activeFields, form);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      toast({
        title: 'Thiếu thông tin bắt buộc',
        description: 'Vui lòng kiểm tra các trường được đánh dấu *.',
        variant: 'error',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingRecord?.id) {
        const payload = buildPayload(activeFields, form);
        await apiClient.patch(`/admin/${resource}/${editingRecord.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: 'Đã cập nhật dữ liệu',
          description: title,
          variant: 'success',
        });
      } else {
        const payload = buildPayload(activeFields, form);
        await apiClient.post(`/admin/${resource}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: 'Đã tạo dữ liệu mới',
          description: title,
          variant: 'success',
        });
      }
      resetForm();
      await refetch();
    } catch {
      toast({
        title: 'Không lưu được dữ liệu',
        description: 'Vui lòng kiểm tra thông tin rồi thử lại.',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>, field: AdminField) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      updateField(field.name, await readImageFile(file));
      toast({
        title: 'Đã chọn ảnh',
        description: file.name,
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Không đọc được ảnh',
        description: 'Vui lòng chọn file ảnh khác.',
        variant: 'error',
      });
      return;
    }

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
    if (!canUpdate) return;
    setEditingRecord(record);
    setSelectedRecord(record);
    setFieldErrors({});
    setForm(createEditForm(config, record));
    setScreenMode('edit');
  };

  const handleDeleteRecord = async (record: AdminRecord) => {
    if (!canDelete) return;
    if (!token || !record.id) return;
    setPendingDeleteRecord(record);
  };

  const confirmDeleteRecord = async () => {
    if (!token || !pendingDeleteRecord?.id) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/admin/${resource}/${pendingDeleteRecord.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Đã xóa dữ liệu',
        description: config.primaryLabel(pendingDeleteRecord, 0),
        variant: 'success',
      });
      if (editingRecord?.id === pendingDeleteRecord.id) resetForm();
      setPendingDeleteRecord(null);
      await refetch();
    } catch {
      toast({
        title: 'Không xóa được dữ liệu',
        description: 'Vui lòng thử lại sau.',
        variant: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const currentImagePreviews = editingRecord
    ? getCurrentImagePreviews(resource, config, editingRecord)
    : [];
  const selectedImagePreviews = selectedRecord
    ? getCurrentImagePreviews(resource, config, selectedRecord)
    : [];
  const filteredRecords = useMemo(
    () =>
      (data?.items ?? []).filter((record, index) =>
        recordMatchesSearch(record, index, config, searchTerm),
      ),
    [config, data?.items, searchTerm],
  );
  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pagedRecords = filteredRecords.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const hasSearch = searchTerm.trim().length > 0;

  return (
    <main className="flex min-h-full w-full flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-primary">
            Quản trị dữ liệu
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">{title}</h1>
        </div>
        {screenMode === 'list' && canCreate ? (
          <Button
            type="button"
            className="h-11 font-black"
            onClick={handleCreateRecord}
            disabled={!token}
          >
            Thêm mới
          </Button>
        ) : null}
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        {screenMode === 'create' || screenMode === 'edit' ? (
          <form
            noValidate
            className="max-w-3xl rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                {editingRecord ? 'Chỉnh sửa dữ liệu' : 'Tạo dữ liệu'}
              </h2>
              <button
                type="button"
                className="text-sm font-semibold text-slate-500"
                onClick={resetForm}
              >
                Quay lại danh sách
              </button>
            </div>

            <CurrentImagePreviewSection previews={currentImagePreviews} />

            <div className="mt-4 grid gap-4">
              {(editingRecord ? updateFields : config.fields).map((field) => (
                <label key={field.name} className="grid gap-2 text-sm font-semibold text-slate-700">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-red-600"> *</span> : null}
                  </span>
                  <FormField
                    field={field}
                    error={fieldErrors[field.name]}
                    value={form[field.name]}
                    onChange={(value) => updateField(field.name, value)}
                    onImageChange={(event) => handleImageChange(event, field)}
                  />
                  {fieldErrors[field.name] ? (
                    <span className="text-xs font-semibold text-red-600">
                      {fieldErrors[field.name]}
                    </span>
                  ) : null}
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
                <p className="text-sm font-semibold uppercase text-slate-500">Chi tiết</p>
                <h2 className="text-xl font-black">{config.primaryLabel(selectedRecord, 0)}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Quay lại
                </Button>
                {canUpdate ? (
                  <Button type="button" onClick={() => handleEditRecord(selectedRecord)}>
                    Cập nhật
                  </Button>
                ) : null}
              </div>
            </div>

            <CurrentImagePreviewSection previews={selectedImagePreviews} />

            <dl className="mt-5 grid gap-3 md:grid-cols-2">
              {config.fields.map((field) => (
                <div key={field.name} className="rounded-md border bg-slate-50 p-3">
                  <dt className="text-xs font-black uppercase text-slate-500">{field.label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {field.name === 'featuredImageUrl'
                      ? getRecordImageUrl(selectedRecord, resource) || 'Chưa có'
                      : field.name === 'featuredImageAlt'
                        ? selectedRecord.featuredImage?.altText ||
                          textValue(selectedRecord.altText) ||
                          'Chưa có'
                        : formatAdminValue(selectedRecord[field.name])}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div
          aria-busy={isLoading || isFetching}
          className={
            screenMode === 'list'
              ? 'flex flex-1 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm'
              : 'hidden'
          }
        >
          {!token ? (
            <EmptyState
              title="Cần đăng nhập"
              description="Vui lòng đăng nhập bằng tài khoản quản trị để xem dữ liệu."
            />
          ) : null}

          {token ? (
            <div className="border-b border-slate-200 bg-white px-4 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900">
                    {hasSearch
                      ? `${filteredRecords.length} kết quả phù hợp`
                      : `Tổng số: ${data?.total ?? 0}`}
                  </p>
                  {config.readOnlyMessage ? (
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {config.readOnlyMessage}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="relative block min-w-0 sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      value={searchTerm}
                      placeholder="Tìm theo tên, slug, email..."
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 gap-2 font-black"
                    disabled={isFetching}
                    onClick={() => refetch()}
                  >
                    <RefreshCw
                      className={isFetching ? 'h-4 w-4 motion-safe:animate-spin' : 'h-4 w-4'}
                    />
                    Tải lại
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {isLoading ? <LoadingRows /> : null}

          {isError ? (
            <EmptyState
              title="Không tải được dữ liệu"
              description="Kiểm tra kết nối API hoặc phiên đăng nhập rồi thử tải lại."
              action={
                <Button type="button" variant="outline" onClick={() => refetch()}>
                  Tải lại
                </Button>
              }
            />
          ) : null}

          {!isLoading && !isError && data ? (
            <>
              {pagedRecords.length > 0 ? (
                <>
                  <AdminRecordsTable
                    config={config}
                    records={pagedRecords}
                    resource={resource}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onView={handleViewRecord}
                    onEdit={handleEditRecord}
                    onDelete={handleDeleteRecord}
                  />
                  <PaginationBar
                    currentPage={safeCurrentPage}
                    pageCount={pageCount}
                    totalItems={filteredRecords.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <EmptyState
                  title={hasSearch ? 'Không tìm thấy dữ liệu' : 'Chưa có dữ liệu'}
                  description={
                    hasSearch
                      ? 'Thử đổi từ khóa tìm kiếm hoặc xóa bộ lọc hiện tại.'
                      : 'Dữ liệu mới sẽ xuất hiện tại đây sau khi được tạo.'
                  }
                />
              )}
            </>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingDeleteRecord)}
        title="Xóa dữ liệu?"
        description={
          pendingDeleteRecord
            ? `Bạn có chắc muốn xóa "${config.primaryLabel(pendingDeleteRecord, 0)}"? Thao tác này sẽ cập nhật dữ liệu trên hệ thống.`
            : ''
        }
        confirmLabel="Xóa"
        variant="destructive"
        isLoading={isDeleting}
        onCancel={() => setPendingDeleteRecord(null)}
        onConfirm={confirmDeleteRecord}
      />
    </main>
  );
}

function AdminRecordsTable({
  config,
  records,
  resource,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
}: {
  config: ResourceConfig;
  records: AdminRecord[];
  resource: string;
  canUpdate: boolean;
  canDelete: boolean;
  onView: (record: AdminRecord) => void;
  onEdit: (record: AdminRecord) => void;
  onDelete: (record: AdminRecord) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
          <tr>
            {config.listColumns.map((column) => (
              <th key={column.key} className={`px-4 py-3 ${column.className ?? ''}`}>
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {records.map((record, index) => (
            <tr
              key={record.id ?? `${resource}-${index}`}
              className="animate-in fade-in slide-in-from-bottom-1 align-middle duration-300 motion-reduce:animate-none transition hover:bg-slate-50"
              style={{ animationDelay: `${Math.min(index * 35, 200)}ms` }}
            >
              {config.listColumns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.render(record, index)}
                </td>
              ))}
              <td className="px-4 py-3">
                {record.id ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onView(record)}
                    >
                      Xem
                    </Button>
                    {canUpdate ? (
                      <Button type="button" size="sm" onClick={() => onEdit(record)}>
                        Cập nhật
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(record)}
                      >
                        Xóa
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <span className="block text-right text-sm font-semibold text-slate-500">
                    Không có
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="grid gap-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        <Search className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-base font-black text-slate-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function PaginationBar({
  currentPage,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Hiển thị {start}-{end} trong {totalItems} mục
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <span className="min-w-20 text-center text-xs font-black uppercase text-slate-500">
          {currentPage}/{pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CurrentImagePreviewSection({ previews }: { previews: CurrentImagePreview[] }) {
  if (!previews.length) return null;

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-black uppercase text-slate-500">Hình ảnh hiện tại</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {previews.map((preview) => (
          <div key={preview.key} className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">{preview.label}</span>
            {preview.url ? (
              <span className="relative block aspect-[16/9] overflow-hidden rounded-md border bg-white">
                <LoadingImage
                  src={preview.url}
                  alt={preview.alt}
                  fill
                  className="object-cover"
                  sizes="360px"
                  unoptimized={preview.url.startsWith('data:')}
                />
              </span>
            ) : (
              <span className="flex aspect-[16/9] items-center justify-center rounded-md border border-dashed bg-white text-sm font-semibold text-slate-500">
                Chưa có ảnh
              </span>
            )}
            {preview.note ? (
              <span className="break-words text-xs font-medium text-slate-500">{preview.note}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormField({
  field,
  error,
  value,
  onChange,
  onImageChange,
}: {
  field: AdminField;
  error?: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputClass =
    'min-h-11 rounded-md border px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10';
  const invalidClass = error
    ? 'border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100'
    : '';

  if (field.type === 'textarea') {
    return (
      <textarea
        className={`${inputClass} ${invalidClass} min-h-28`}
        value={String(value ?? '')}
        required={field.required}
        aria-invalid={Boolean(error)}
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
      <select
        className={`${inputClass} ${invalidClass}`}
        value={String(value ?? '')}
        required={field.required}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
      >
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
            <LoadingImage
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
          className={`${inputClass} ${invalidClass}`}
          value={imageUrl}
          required={field.required}
          aria-invalid={Boolean(error)}
          placeholder="Dán URL ảnh hoặc chọn file bên dưới"
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="text-sm font-medium"
          onChange={onImageChange}
        />
      </span>
    );
  }

  return (
    <input
      type={field.type}
      className={`${inputClass} ${invalidClass}`}
      value={String(value ?? '')}
      required={field.required}
      aria-invalid={Boolean(error)}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
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
