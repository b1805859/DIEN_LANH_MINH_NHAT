'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { setStoredAuthTokens } from '@/lib/auth/tokens';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ.'),
  password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự.'),
});

type LoginInput = z.infer<typeof loginSchema>;

function AdminLoginPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: (input: LoginInput) => apiClient.post('/auth/login', input),
    onSuccess: (response) => {
      setStoredAuthTokens(response.data.accessToken, response.data.refreshToken);
      toast({
        title: 'Đăng nhập thành công',
        description: 'Đang chuyển đến bảng quản trị.',
        variant: 'success',
      });
      router.push('/admin/dashboard');
    },
    onError: () => {
      toast({
        title: 'Đăng nhập không thành công',
        description: 'Vui lòng kiểm tra tài khoản và mật khẩu.',
        variant: 'error',
      });
    },
  });

  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12">
      <form
        className="w-full max-w-sm rounded-md border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/80"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <p className="text-xs font-black uppercase tracking-wide text-primary">Admin CMS</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">Đăng nhập quản trị</h1>
        <label className="mt-5 grid gap-1.5 text-sm font-bold text-slate-700">
          Email
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            inputMode="email"
            placeholder="admin@example.com"
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <span className="text-xs font-semibold text-red-600">
              {form.formState.errors.email.message}
            </span>
          ) : null}
        </label>
        <label className="mt-3 grid gap-1.5 text-sm font-bold text-slate-700">
          Mật khẩu
          <input
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            type="password"
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <span className="text-xs font-semibold text-red-600">
              {form.formState.errors.password.message}
            </span>
          ) : null}
        </label>
        <Button className="mt-5 h-11 w-full font-black" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
        {mutation.isError ? (
          <p className="mt-3 text-sm text-red-600">Đăng nhập không thành công.</p>
        ) : null}
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <QueryBoundary>
      <AdminLoginPageContent />
    </QueryBoundary>
  );
}
