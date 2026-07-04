'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { useToast } from '@/components/ui/toast';
import { setStoredAuthTokens } from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
        className="w-full max-w-sm rounded-md border p-6"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <h1 className="text-2xl font-bold">Đăng nhập quản trị</h1>
        <input
          className="mt-5 h-11 w-full rounded-md border px-3"
          placeholder="Tài khoản"
          {...form.register('email')}
        />
        <input
          className="mt-3 h-11 w-full rounded-md border px-3"
          type="password"
          placeholder="Mật khẩu"
          {...form.register('password')}
        />
        <Button className="mt-5 w-full" type="submit" disabled={mutation.isPending}>
          Đăng nhập
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
