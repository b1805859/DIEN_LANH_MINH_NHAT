'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
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
        description: 'Đang chuyển đến bảng điều khiển Aurora CMS.',
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
    <main className="mn-admin-login-scene relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      {/* Deep Aurora Borealis Light Plumes */}
      <div className="mn-admin-login-aurora" aria-hidden="true">
        <span className="mn-login-orb mn-login-orb-1" />
        <span className="mn-login-orb mn-login-orb-2" />
        <span className="mn-login-orb mn-login-orb-3" />
      </div>

      <div className="mn-admin-login-grid relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Brand & Aurora Showcase Panel */}
        <section className="mn-admin-login-showcase flex flex-col justify-between p-5 text-white sm:p-8 lg:p-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="mn-admin-logo-orb">
                <MinhNhatLogoMark className="h-10 w-10 sm:h-11 sm:w-11" idPrefix="login-logo" />
              </span>
              <div>
                <p className="text-sm font-black tracking-wider text-white uppercase">
                  ĐIỆN LẠNH MINH NHẬT
                </p>
                <p className="text-xs font-semibold text-cyan-200/85">
                  Aurora Web App • Hệ thống Điều phối & CMS
                </p>
              </div>
            </Link>

            <div className="mt-5 sm:mt-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/35 bg-cyan-300/15 px-3 py-1 text-xs font-extrabold text-cyan-100 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                Không gian quản trị đồng bộ Ice-Blue Aurora
              </span>
              <h1 className="mt-3 text-2xl leading-tight font-black tracking-tight text-white sm:mt-4 sm:text-4xl">
                Điều phối lịch thợ & quản trị dịch vụ tại Cần Thơ
              </h1>
              <p className="mt-2.5 text-sm leading-6 text-cyan-50/85 sm:mt-3 sm:text-base">
                Theo dõi yêu cầu sửa chữa máy lạnh, máy giặt, tủ lạnh theo thời gian thực, quản lý nội dung cẩm nang và kiểm soát chất lượng phục vụ tận nơi.
              </p>
            </div>

            <div className="mt-6 hidden gap-3 lg:grid lg:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-200 uppercase">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Điều phối tức thì
                </div>
                <p className="mt-1.5 text-xs font-medium leading-5 text-cyan-50/85">
                  Quản lý lịch hẹn theo ngày/tháng và cập nhật trạng thái xử lý chỉ với 1 chạm.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-200 uppercase">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  Nhật ký an toàn
                </div>
                <p className="mt-1.5 text-xs font-medium leading-5 text-cyan-50/85">
                  Lưu vết toàn bộ thay đổi dữ liệu và hỗ trợ khôi phục phiên bản trước đó.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs font-semibold text-cyan-100/80 sm:mt-8 sm:pt-5">
            <span>Hỗ trợ 8 Quận/Huyện TP. Cần Thơ</span>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-cyan-200 transition hover:text-white"
            >
              Quay về trang chủ
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Right Frosted Glass Login Form */}
        <section className="mn-admin-login-card flex flex-col justify-center p-5 sm:p-8 lg:p-10">
          <div className="mb-5 sm:mb-6">
            <p className="text-xs font-black tracking-wider text-sky-600 uppercase">
              Xác thực quản trị viên
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Đăng nhập hệ thống
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Nhập thông tin tài khoản quản trị để đăng nhập.
            </p>
          </div>

          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <label className="grid gap-1.5 text-xs font-black tracking-wide text-slate-700 uppercase">
              Email quản trị
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-sky-600" />
                <input
                  className="h-12 w-full rounded-xl border border-slate-200/90 bg-white/90 pr-3.5 pl-10 text-base font-semibold text-slate-900 shadow-inner outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/20"
                  inputMode="email"
                  placeholder="admin@dienlanhminhnhat.vn"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email ? (
                <span className="text-xs font-semibold text-red-600 normal-case">
                  {form.formState.errors.email.message}
                </span>
              ) : null}
            </label>

            <label className="grid gap-1.5 text-xs font-black tracking-wide text-slate-700 uppercase">
              Mật khẩu
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-sky-600" />
                <input
                  className="h-12 w-full rounded-xl border border-slate-200/90 bg-white/90 pr-3.5 pl-10 text-base font-semibold text-slate-900 shadow-inner outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/20"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  {...form.register('password')}
                />
              </div>
              {form.formState.errors.password ? (
                <span className="text-xs font-semibold text-red-600 normal-case">
                  {form.formState.errors.password.message}
                </span>
              ) : null}
            </label>

            <Button
              className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:brightness-105"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {mutation.isError ? (
              <p className="text-xs font-semibold text-red-600">Đăng nhập không thành công.</p>
            ) : null}
          </form>


        </section>
      </div>
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
