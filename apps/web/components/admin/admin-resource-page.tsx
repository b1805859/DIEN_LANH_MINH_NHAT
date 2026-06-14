'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/layout/query-boundary';

function AdminResourcePageContent({ title, resource }: { title: string; resource: string }) {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : '';
  const [payload, setPayload] = useState('{\n  \n}');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', resource],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/${resource}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return response.data as { items: unknown[]; total: number };
    },
    enabled: Boolean(token),
  });

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form
          className="rounded-md border bg-white p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await apiClient.post(`/admin/${resource}`, JSON.parse(payload), {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            setPayload('{\n  \n}');
            await refetch();
          }}
        >
          <h2 className="font-semibold">Tạo dữ liệu</h2>
          <textarea
            className="mt-3 min-h-72 w-full rounded-md border p-3 font-mono text-xs"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
          />
          <Button className="mt-3" type="submit" disabled={!token}>
            Tạo mới
          </Button>
        </form>
        <div className="rounded-md border bg-white p-4">
          {!token ? <p className="text-sm text-slate-600">Vui lòng đăng nhập để quản trị.</p> : null}
          {isLoading ? <p className="text-sm text-slate-600">Đang tải...</p> : null}
          {data ? (
            <div>
              <p className="text-sm text-slate-600">Tổng số: {data.total}</p>
              <div className="mt-4 grid gap-3">
                {data.items.map((item, index) => {
                  const record = item as {
                    id?: string;
                    name?: string;
                    title?: string;
                    email?: string;
                    featuredImage?: { url?: string; altText?: string };
                  };
                  return (
                    <div
                      key={record.id ?? index}
                      className="flex items-center justify-between rounded-md border p-3 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {record.featuredImage?.url ? (
                          <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                            <Image
                              src={record.featuredImage.url}
                              alt={record.featuredImage.altText ?? record.title ?? 'Ảnh bài viết'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </span>
                        ) : null}
                        <span className="truncate">
                          {record.name ?? record.title ?? record.email ?? record.id ?? `Mục ${index + 1}`}
                        </span>
                      </span>
                      {record.id ? (
                        <button
                          className="text-red-600"
                          onClick={async () => {
                            await apiClient.delete(`/admin/${resource}/${record.id}`, {
                              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                            });
                            await refetch();
                          }}
                        >
                          Xóa
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function AdminResourcePage(props: { title: string; resource: string }) {
  return (
    <QueryBoundary>
      <AdminResourcePageContent {...props} />
    </QueryBoundary>
  );
}
