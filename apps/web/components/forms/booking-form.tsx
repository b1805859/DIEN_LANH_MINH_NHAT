'use client';

import { ArrowRight, CalendarDays, LoaderCircle } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRIORITY_DISTRICTS, SERVICES } from '@minhnhat/shared';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useId, useRef } from 'react';
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
    .refine(
      (date) =>
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) &&
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date,
      'Ngày hẹn chưa hợp lệ.',
    )
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

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-semibold leading-5 text-red-600">
      {message}
    </p>
  );
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
  const formId = useId();
  const submitting = useRef(false);
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
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
        customerPhone: booking.customerPhone.replace(/[\s.-]/g, ''),
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
    onSettled: () => {
      submitting.current = false;
    },
  });
  const today = getToday();
  const errors = form.formState.errors;

  return (
    <form
      noValidate
      aria-busy={mutation.isPending}
      aria-describedby={`${formId}-help`}
      className="mn-booking-form grid min-w-0 gap-3"
      onChange={() => {
        if (mutation.isSuccess || mutation.isError) mutation.reset();
      }}
      onSubmit={form.handleSubmit((values) => {
        if (submitting.current) return;
        submitting.current = true;
        mutation.mutate(values);
      })}
    >
      <p className="mn-form-help" id={`${formId}-help`}>
        Các mục có dấu * cần được điền. Lịch hẹn được xác nhận sau khi Minh Nhật liên hệ với bạn.
      </p>
      <fieldset disabled={mutation.isPending} className="grid min-w-0 gap-4">
        <legend className="sr-only">Yêu cầu đặt lịch dịch vụ</legend>
        <fieldset className={`mn-form-fields grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
          <legend>1. Thông tin liên hệ</legend>
          <label className="mn-field-name grid gap-1.5">
            <span className="text-xs font-black uppercase text-slate-500">Họ tên *</span>
            <input
              className={fieldClass}
              autoComplete="name"
              placeholder="Nguyễn Văn An"
              required
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? `${formId}-customerName-error` : undefined}
              {...form.register('customerName')}
            />
            <FieldError
              id={`${formId}-customerName-error`}
              message={errors.customerName?.message}
            />
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
              aria-describedby={errors.customerPhone ? `${formId}-customerPhone-error` : undefined}
              {...form.register('customerPhone')}
            />
            <FieldError
              id={`${formId}-customerPhone-error`}
              message={errors.customerPhone?.message}
            />
          </label>
        </fieldset>
        <fieldset className={`mn-form-fields grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
          <legend>2. Dịch vụ và địa điểm</legend>
          <label className="mn-field-service grid gap-1.5">
            <span className="text-xs font-black uppercase text-slate-500">
              Dịch vụ cần hỗ trợ *
            </span>
            <select
              className={fieldClass}
              required
              aria-invalid={Boolean(errors.serviceId)}
              aria-describedby={errors.serviceId ? `${formId}-serviceId-error` : undefined}
              {...form.register('serviceId')}
            >
              <option value="">Chọn dịch vụ cần hỗ trợ</option>
              {SERVICES.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </select>
            <FieldError id={`${formId}-serviceId-error`} message={errors.serviceId?.message} />
          </label>
          <label className="mn-field-location grid gap-1.5">
            <span className="text-xs font-black uppercase text-slate-500">Khu vực *</span>
            <select
              className={fieldClass}
              required
              aria-invalid={Boolean(errors.locationId)}
              aria-describedby={errors.locationId ? `${formId}-locationId-error` : undefined}
              {...form.register('locationId')}
            >
              {PRIORITY_DISTRICTS.map((district) => (
                <option key={district.slug} value={district.slug}>
                  {district.name}
                </option>
              ))}
            </select>
            <FieldError id={`${formId}-locationId-error`} message={errors.locationId?.message} />
          </label>
          <label className="mn-field-date grid gap-1.5">
            <span className="text-xs font-black uppercase text-slate-500">Ngày hẹn *</span>
            <input
              className={fieldClass}
              type="date"
              min={today}
              required
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? `${formId}-date-error` : undefined}
              {...form.register('date')}
            />
            <FieldError id={`${formId}-date-error`} message={errors.date?.message} />
          </label>
        </fieldset>
        <label className="grid gap-1.5">
          <span className="text-xs font-black uppercase text-slate-500">Địa chỉ *</span>
          <input
            className={fieldClass}
            autoComplete="street-address"
            placeholder="Số nhà, đường, phường tại Cần Thơ"
            required
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? `${formId}-address-error` : undefined}
            {...form.register('address')}
          />
          <FieldError id={`${formId}-address-error`} message={errors.address?.message} />
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
          {mutation.isPending ? (
            <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <CalendarDays size={18} aria-hidden="true" />
          )}
          {mutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
          <ArrowRight size={17} />
        </Button>
      </fieldset>
      {mutation.isSuccess ? (
        <p role="status" className="mn-form-feedback text-sm text-emerald-700">
          Đã gửi yêu cầu. Minh Nhật sẽ liên hệ xác nhận lịch hẹn.
        </p>
      ) : null}
      {mutation.isError ? (
        <p role="alert" className="mn-form-feedback text-sm text-red-600">
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
      <BookingFormContent
        key={`${props.serviceSlug || ''}:${props.locationSlug || ''}`}
        {...props}
      />
    </QueryBoundary>
  );
}
