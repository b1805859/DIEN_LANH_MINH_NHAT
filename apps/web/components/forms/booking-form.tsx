'use client';

import { ArrowRight, CalendarDays } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRIORITY_DISTRICTS, SERVICES } from '@minhnhat/shared';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { useToast } from '@/components/ui/toast';

function getToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Vui lòng chọn dịch vụ.'),
  locationId: z.string().min(1, 'Vui lòng chọn khu vực.'),
  date: z
    .string()
    .min(1, 'Vui lòng chọn ngày hẹn.')
    .refine((date) => !date || date >= getToday(), 'Vui lòng chọn ngày hẹn từ hôm nay trở đi.'),
  address: z.string().trim().min(8, 'Vui lòng nhập địa chỉ cụ thể hơn.'),
  customerName: z.string().trim().min(2, 'Vui lòng nhập họ tên.'),
  customerPhone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .refine(
      (phone) => /^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/.test(phone.replace(/[\s.-]/g, '')),
      'Số điện thoại chưa hợp lệ.',
    ),
  notes: z.string().optional(),
});

type BookingInput = z.infer<typeof bookingSchema>;

const fieldClass =
  'h-12 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-semibold leading-5 text-red-600">{message}</p>;
}

function BookingFormContent({
  compact = false,
  serviceSlug,
  locationSlug,
}: {
  compact?: boolean;
  serviceSlug?: string;
  locationSlug?: string;
}) {
  const { toast } = useToast();
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: serviceSlug || '',
      locationId: locationSlug || PRIORITY_DISTRICTS[0].slug,
      date: '',
      address: '',
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (input: BookingInput) => {
      const { date, ...booking } = input;

      return apiClient.post('/bookings', {
        ...booking,
        scheduledDate: date,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Đã gửi lịch hẹn',
        description: 'Minh Nhật sẽ liên hệ xác nhận sớm.',
        variant: 'success',
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Không gửi được lịch hẹn',
        description: 'Vui lòng thử lại hoặc gọi hotline.',
        variant: 'error',
      });
    },
  });
  const today = getToday();
  const errors = form.formState.errors;

  return (
    <form
      noValidate
      className="mn-booking-form grid min-w-0 gap-3"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div className={`mn-form-fields grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <label className="mn-field-name grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Họ tên *</span>
          <input
            className={fieldClass}
            autoComplete="name"
            placeholder="Nguyễn Văn An"
            required
            aria-invalid={Boolean(errors.customerName)}
            {...form.register('customerName')}
          />
          <FieldError message={errors.customerName?.message} />
        </label>
        <label className="mn-field-phone grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Số điện thoại *</span>
          <input
            className={fieldClass}
            inputMode="tel"
            type="tel"
            autoComplete="tel"
            placeholder={siteContent.phoneDisplay}
            required
            aria-invalid={Boolean(errors.customerPhone)}
            {...form.register('customerPhone')}
          />
          <FieldError message={errors.customerPhone?.message} />
        </label>
        <label className="mn-field-service grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Dịch vụ cần hỗ trợ *</span>
          <select
            className={fieldClass}
            required
            aria-invalid={Boolean(errors.serviceId)}
            {...form.register('serviceId')}
          >
            <option value="">Chọn dịch vụ cần hỗ trợ</option>
            {SERVICES.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.serviceId?.message} />
        </label>
        <label className="mn-field-location grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Khu vực *</span>
          <select
            className={fieldClass}
            required
            aria-invalid={Boolean(errors.locationId)}
            {...form.register('locationId')}
          >
            {PRIORITY_DISTRICTS.map((district) => (
              <option key={district.slug} value={district.slug}>
                {district.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.locationId?.message} />
        </label>
        <label className="mn-field-date grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Ngày hẹn *</span>
          <input
            className={fieldClass}
            type="date"
            min={today}
            required
            aria-invalid={Boolean(errors.date)}
            {...form.register('date')}
          />
          <FieldError message={errors.date?.message} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Địa chỉ *</span>
        <input
          className={fieldClass}
          placeholder="Số nhà, đường, phường tại Cần Thơ"
          required
          aria-invalid={Boolean(errors.address)}
          {...form.register('address')}
        />
        <FieldError message={errors.address?.message} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-black uppercase text-slate-500">Nội dung yêu cầu</span>
        <textarea
          className="min-h-24 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          placeholder="Mô tả nhanh tình trạng thiết bị"
          {...form.register('notes')}
        />
      </label>
      <Button
        className="mn-button h-12 w-full font-bold"
        type="submit"
        disabled={mutation.isPending}
      >
        <CalendarDays size={18} />
        {mutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
        <ArrowRight size={17} />
      </Button>
      {mutation.isSuccess ? (
        <p role="status" className="text-sm text-emerald-700">
          Đã gửi yêu cầu. Minh Nhật sẽ liên hệ xác nhận lịch hẹn.
        </p>
      ) : null}
      {mutation.isError ? (
        <p role="alert" className="text-sm text-red-600">
          Chưa gửi được yêu cầu. Vui lòng thử lại hoặc{' '}
          <a className="underline" href={siteContent.phoneHref}>
            gọi {siteContent.phoneDisplay}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}

export function BookingForm(props: {
  compact?: boolean;
  serviceSlug?: string;
  locationSlug?: string;
}) {
  return (
    <QueryBoundary>
      <BookingFormContent {...props} />
    </QueryBoundary>
  );
}
