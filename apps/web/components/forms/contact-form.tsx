'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { useToast } from '@/components/ui/toast';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập họ tên.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .regex(/^(?:\+?84|0)(?:\d[\s.-]?){8,10}\d$/, 'Số điện thoại chưa hợp lệ.'),
  email: z.string().email('Email chưa hợp lệ.').optional().or(z.literal('')),
  subject: z.string().trim().min(2, 'Vui lòng nhập nhu cầu.'),
  message: z.string().trim().min(10, 'Vui lòng mô tả nội dung cụ thể hơn.'),
});

type ContactInput = z.infer<typeof contactSchema>;

const fieldClass =
  'h-12 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-semibold leading-5 text-red-600">{message}</p>;
}

function ContactFormContent({ quotation = false }: { quotation?: boolean }) {
  const { toast } = useToast();
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', subject: '', message: '' },
  });
  const mutation = useMutation({
    mutationFn: (input: ContactInput) =>
      apiClient.post(quotation ? '/quotation-requests' : '/contact-requests', input),
    onSuccess: () => {
      toast({
        title: quotation ? 'Đã gửi yêu cầu báo giá' : 'Đã gửi liên hệ',
        description: 'Minh Nhật sẽ phản hồi trong thời gian sớm nhất.',
        variant: 'success',
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Không gửi được thông tin',
        description: 'Vui lòng thử lại hoặc gọi hotline.',
        variant: 'error',
      });
    },
  });
  const errors = form.formState.errors;

  return (
    <form
      noValidate
      className="grid min-w-0 gap-3"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Họ tên</span>
        <input
          className={fieldClass}
          placeholder="Nguyễn Văn A"
          required
          aria-invalid={Boolean(errors.name)}
          {...form.register('name')}
        />
        <FieldError message={errors.name?.message} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Số điện thoại</span>
        <input
          className={fieldClass}
          inputMode="tel"
          placeholder="0939 370 109"
          required
          aria-invalid={Boolean(errors.phone)}
          {...form.register('phone')}
        />
        <FieldError message={errors.phone?.message} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Email</span>
        <input
          className={fieldClass}
          inputMode="email"
          placeholder="email@example.com"
          aria-invalid={Boolean(errors.email)}
          {...form.register('email')}
        />
        <FieldError message={errors.email?.message} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Nhu cầu</span>
        <input
          className={fieldClass}
          placeholder={quotation ? 'Cần báo giá dịch vụ' : 'Cần tư vấn dịch vụ'}
          required
          aria-invalid={Boolean(errors.subject)}
          {...form.register('subject')}
        />
        <FieldError message={errors.subject?.message} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Nội dung</span>
        <textarea
          className="min-h-28 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          placeholder="Mô tả nhanh nhu cầu của bạn"
          required
          aria-invalid={Boolean(errors.message)}
          {...form.register('message')}
        />
        <FieldError message={errors.message?.message} />
      </label>
      <Button className="h-12 w-full font-bold" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Đang gửi...' : quotation ? 'Yêu cầu báo giá' : 'Gửi liên hệ'}
      </Button>
      {mutation.isSuccess ? (
        <p className="text-sm text-emerald-700">Thông tin đã được ghi nhận.</p>
      ) : null}
      {mutation.isError ? (
        <p className="text-sm text-red-600">Không gửi được thông tin, vui lòng thử lại.</p>
      ) : null}
    </form>
  );
}

export function ContactForm(props: { quotation?: boolean }) {
  return (
    <QueryBoundary>
      <ContactFormContent {...props} />
    </QueryBoundary>
  );
}
