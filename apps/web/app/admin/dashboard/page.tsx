'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { apiClient } from '@/lib/api/client';

const resources = [
  { key: 'services', label: 'Dịch vụ' },
  { key: 'locations', label: 'Khu vực' },
  { key: 'categories', label: 'Danh mục' },
  { key: 'tags', label: 'Thẻ' },
  { key: 'faqs', label: 'Hỏi đáp' },
  { key: 'testimonials', label: 'Đánh giá khách hàng' },
  { key: 'blog', label: 'Bài viết' },
  { key: 'bookings', label: 'Lịch hẹn' },
  { key: 'contacts', label: 'Liên hệ' },
  { key: 'media', label: 'Thư viện' },
  { key: 'seo', label: 'Tối ưu tìm kiếm' },
  { key: 'users', label: 'Người dùng' },
  { key: 'roles', label: 'Vai trò' },
];

function AdminDashboardPageContent() {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : '';
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as Record<string, number>;
    },
    enabled: Boolean(token),
  });

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Link key={resource.key} href={`/admin/${resource.key}`} className="rounded-md border p-4 font-semibold">
            <span className="block">{resource.label}</span>
            {data ? (
              <span className="mt-2 block text-sm font-medium text-slate-500">
                Số lượng: {data[resource.key] ?? 0}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <QueryBoundary>
      <AdminDashboardPageContent />
    </QueryBoundary>
  );
}
