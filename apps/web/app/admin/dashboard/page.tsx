'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { apiClient } from '@/lib/api/client';

const resources = [
  'services',
  'locations',
  'categories',
  'tags',
  'faqs',
  'testimonials',
  'blog',
  'bookings',
  'contacts',
  'media',
  'seo',
  'users',
  'roles',
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
      <h1 className="text-3xl font-bold">CMS Dashboard</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <Link key={resource} href={`/admin/${resource}`} className="rounded-md border p-4 font-semibold">
            {resource}
          </Link>
        ))}
      </div>
      {data ? (
        <pre className="mt-8 rounded bg-slate-950 p-4 text-xs text-white">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : null}
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
