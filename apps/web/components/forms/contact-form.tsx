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
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().optional(),
});

type ContactInput = z.infer<typeof contactSchema>;

const fieldClass =
  'h-12 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10';

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

  return (
    <form
      className="grid min-w-0 gap-3"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <input className={fieldClass} placeholder="Họ tên" {...form.register('name')} />
      <input className={fieldClass} placeholder="Số điện thoại" {...form.register('phone')} />
      <input className={fieldClass} placeholder="Thư điện tử" {...form.register('email')} />
      <input className={fieldClass} placeholder="Nhu cầu" {...form.register('subject')} />
      <textarea
        className="min-h-28 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
        placeholder="Nội dung"
        {...form.register('message')}
      />
      <Button className="h-12 w-full font-bold" type="submit" disabled={mutation.isPending}>
        {quotation ? 'Yêu cầu báo giá' : 'Gửi liên hệ'}
      </Button>
      {mutation.isSuccess ? (
        <p className="text-sm text-emerald-700">Thông tin đã được ghi nhận.</p>
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
