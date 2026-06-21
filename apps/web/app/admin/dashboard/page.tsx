'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { getStoredAccessToken } from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';

const resources = [
  { key: 'services', label: 'Dịch vụ' },
  { key: 'categories', label: 'Danh mục' },
  { key: 'faqs', label: 'Hỏi đáp' },
  { key: 'blog', label: 'Bài viết' },
  { key: 'bookings', label: 'Lịch hẹn' },
  { key: 'contacts', label: 'Liên hệ' },
];

function AdminDashboardPageContent() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

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
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
      {token === '' ? (
        <p className="mt-4 text-sm text-slate-600">
          Vui lòng{' '}
          <Link href="/admin/login" className="font-semibold text-primary">
            đăng nhập
          </Link>{' '}
          để quản trị.
        </p>
      ) : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="rounded-md border p-4 font-semibold"
          >
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
