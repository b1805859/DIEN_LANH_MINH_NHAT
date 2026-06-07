'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PRIORITY_DISTRICTS, SERVICES } from '@minhnhat/shared';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/layout/query-boundary';

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  locationId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  address: z.string().min(5),
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  notes: z.string().optional(),
});

type BookingInput = z.infer<typeof bookingSchema>;

const fieldClass =
  'h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10';

function BookingFormContent({ compact = false }: { compact?: boolean }) {
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: SERVICES[0].slug,
      locationId: PRIORITY_DISTRICTS[0].slug,
      date: '',
      time: '',
      address: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (input: BookingInput) =>
      apiClient.post('/bookings', {
        ...input,
        scheduledAt: new Date(`${input.date}T${input.time}:00`).toISOString(),
      }),
  });

  return (
    <form
      className="grid gap-3"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <select className={fieldClass} {...form.register('serviceId')}>
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        <select className={fieldClass} {...form.register('locationId')}>
          {PRIORITY_DISTRICTS.map((district) => (
            <option key={district.slug} value={district.slug}>
              {district.name}
            </option>
          ))}
        </select>
        <input className={fieldClass} type="date" {...form.register('date')} />
        <input className={fieldClass} type="time" {...form.register('time')} />
        <input
          className={fieldClass}
          placeholder="Họ tên"
          {...form.register('customerName')}
        />
        <input
          className={fieldClass}
          placeholder="Số điện thoại"
          {...form.register('customerPhone')}
        />
      </div>
      <input
        className={fieldClass}
        placeholder="Địa chỉ tại Cần Thơ"
        {...form.register('address')}
      />
      <textarea
        className="min-h-24 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
        placeholder="Ghi chú"
        {...form.register('notes')}
      />
      <Button className="h-12 font-bold" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Đang gửi...' : 'Đặt lịch'}
      </Button>
      {mutation.isSuccess ? <p className="text-sm text-emerald-700">Đã gửi lịch hẹn.</p> : null}
      {mutation.isError ? <p className="text-sm text-red-600">Không gửi được, vui lòng gọi hotline.</p> : null}
    </form>
  );
}

export function BookingForm(props: { compact?: boolean }) {
  return (
    <QueryBoundary>
      <BookingFormContent {...props} />
    </QueryBoundary>
  );
}
