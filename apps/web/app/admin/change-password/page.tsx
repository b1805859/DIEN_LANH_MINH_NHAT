'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { clearStoredAuthTokens, getStoredAccessToken } from '@/lib/auth/tokens';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Mật khẩu hiện tại cần ít nhất 8 ký tự.'),
    newPassword: z.string().min(8, 'Mật khẩu mới cần ít nhất 8 ký tự.'),
    confirmPassword: z.string().min(8, 'Vui lòng nhập lại mật khẩu mới.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

function ChangePasswordPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getStoredAccessToken());
  }, []);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      apiClient.post(
        '/auth/change-password',
        {
          currentPassword: input.currentPassword,
          newPassword: input.newPassword,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      ),
    onSuccess: () => {
      clearStoredAuthTokens();
      toast({
        title: 'Đã đổi mật khẩu',
        description: 'Vui lòng đăng nhập lại bằng mật khẩu mới.',
        variant: 'success',
      });
      router.replace('/admin/login');
    },
    onError: () => {
      toast({
        title: 'Không đổi được mật khẩu',
        description: 'Vui lòng kiểm tra mật khẩu hiện tại và thử lại.',
        variant: 'error',
      });
    },
  });

  return (
    <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="max-w-lg">
        <p className="text-xs font-black uppercase tracking-wide text-primary">Bảo mật tài khoản</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Đổi mật khẩu</h1>
        <form
          className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <label className="block text-sm font-bold text-slate-700" htmlFor="currentPassword">
            Mật khẩu hiện tại
          </label>
          <input
            id="currentPassword"
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            type="password"
            autoComplete="current-password"
            {...form.register('currentPassword')}
          />
          {form.formState.errors.currentPassword ? (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.currentPassword.message}
            </p>
          ) : null}

          <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            type="password"
            autoComplete="new-password"
            {...form.register('newPassword')}
          />
          {form.formState.errors.newPassword ? (
            <p className="mt-2 text-sm text-red-600">{form.formState.errors.newPassword.message}</p>
          ) : null}

          <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="confirmPassword">
            Nhập lại mật khẩu mới
          </label>
          <input
            id="confirmPassword"
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            type="password"
            autoComplete="new-password"
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}

          <Button
            className="mt-5 h-11 font-black"
            type="submit"
            disabled={!token || mutation.isPending}
          >
            {mutation.isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function ChangePasswordPage() {
  return (
    <QueryBoundary>
      <ChangePasswordPageContent />
    </QueryBoundary>
  );
}
