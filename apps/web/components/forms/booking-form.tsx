'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SERVICES } from '@minhnhat/shared';
import { useMutation } from '@tanstack/react-query';
import { useId, useRef } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { useToast } from '@/components/ui/toast';

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, 'Vui lòng nhập họ tên.'),
  customerPhone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .refine(
      (value) => /^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/.test(value.replace(/[\s.-]/g, '')),
      'Số điện thoại chưa hợp lệ.',
    ),
  serviceId: z.string().min(1, 'Vui lòng chọn dịch vụ.'),
  address: z.string().trim().min(5, 'Vui lòng nhập địa chỉ cụ thể hơn.'),
});

type BookingInput = z.infer<typeof bookingSchema>;
const fieldClass =
  'h-12 w-full min-w-0 rounded-md border border-[#c8e0fc] bg-white px-3 text-base text-[#09245b] outline-none transition placeholder:text-[#8aa6ce] focus:border-[#0874e5] focus:ring-4 focus:ring-[#0874e5]/10';

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="text-xs font-semibold text-red-600">
      {message}
    </p>
  ) : null;
}

function BookingFormContent({
  serviceSlug,
  locationSlug,
}: {
  serviceSlug?: string;
  locationSlug?: string;
}) {
  const { toast } = useToast();
  const submitting = useRef(false);
  const formId = useId();
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      serviceId: SERVICES.some((service) => service.slug === serviceSlug) ? serviceSlug : '',
      address: '',
    },
  });
  const mutation = useMutation({
    mutationFn: (input: BookingInput) =>
      apiClient.post('/bookings', {
        ...input,
        customerPhone: input.customerPhone.replace(/[\s.-]/g, ''),
        ...(locationSlug ? { locationId: locationSlug } : {}),
      }),
    onSuccess: () => {
      toast({
        title: 'Đã gửi yêu cầu',
        description: 'Minh Nhật sẽ liên hệ để xác nhận lịch.',
        variant: 'success',
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Không gửi được yêu cầu',
        description: 'Vui lòng thử lại hoặc gọi hotline.',
        variant: 'error',
      });
    },
    onSettled: () => {
      submitting.current = false;
    },
  });
  const errors = form.formState.errors;

  return (
    <form
      noValidate
      aria-busy={mutation.isPending}
      className="mock-request-form"
      onSubmit={form.handleSubmit((values) => {
        if (submitting.current) return;
        submitting.current = true;
        mutation.mutate(values);
      })}
    >
      <div className="mock-request-row">
        <label>
          <span className="mock-field-label">
            Họ và tên <span aria-hidden="true">*</span>
          </span>
          <input
            className={fieldClass}
            autoComplete="name"
            placeholder="Nhập họ và tên"
            required
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? `${formId}-name-error` : undefined}
            {...form.register('customerName')}
          />
          <FieldError id={`${formId}-name-error`} message={errors.customerName?.message} />
        </label>
        <label>
          <span className="mock-field-label">
            Số điện thoại <span aria-hidden="true">*</span>
          </span>
          <input
            className={fieldClass}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Nhập số điện thoại"
            required
            aria-invalid={Boolean(errors.customerPhone)}
            aria-describedby={errors.customerPhone ? `${formId}-phone-error` : undefined}
            {...form.register('customerPhone')}
          />
          <FieldError id={`${formId}-phone-error`} message={errors.customerPhone?.message} />
        </label>
      </div>
      <label>
        <span className="mock-field-label">
          Dịch vụ cần làm <span aria-hidden="true">*</span>
        </span>
        <select
          className={fieldClass}
          required
          aria-invalid={Boolean(errors.serviceId)}
          aria-describedby={errors.serviceId ? `${formId}-service-error` : undefined}
          {...form.register('serviceId')}
        >
          <option value="">Chọn dịch vụ</option>
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        <FieldError id={`${formId}-service-error`} message={errors.serviceId?.message} />
      </label>
      <label>
        <span className="mock-field-label">
          Địa chỉ <span aria-hidden="true">*</span>
        </span>
        <input
          className={fieldClass}
          autoComplete="street-address"
          placeholder="Nhập địa chỉ (phường/xã, quận/huyện, Cần Thơ)"
          required
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? `${formId}-address-error` : undefined}
          {...form.register('address')}
        />
        <FieldError id={`${formId}-address-error`} message={errors.address?.message} />
      </label>
      <button className="mock-request-submit" type="submit" disabled={mutation.isPending}>
        <Send size={19} /> {mutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </button>
      <p className="mock-request-note">
        Minh Nhật sẽ liên hệ để xác nhận thời gian.{' '}
        <Link href="/privacy-policy">Chính sách bảo mật</Link>
      </p>
      {mutation.isSuccess ? (
        <p role="status" aria-live="polite" className="text-sm font-semibold text-emerald-700">
          Đã gửi yêu cầu. Minh Nhật sẽ liên hệ xác nhận.
        </p>
      ) : null}
      {mutation.isError ? (
        <p role="alert" className="text-sm font-semibold text-red-600">
          Không gửi được yêu cầu. Vui lòng thử lại hoặc{' '}
          <a className="underline" href={`tel:${integrationSettings.phone}`}>
            gọi {integrationSettings.phone}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}

export function BookingForm(props: {
  compact?: boolean;
  hideNotes?: boolean;
  serviceSlug?: string;
  locationSlug?: string;
}) {
  return (
    <QueryBoundary>
      <BookingFormContent {...props} />
    </QueryBoundary>
  );
}
