'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SERVICES } from '@minhnhat/shared';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, CalendarDays, ChevronDown } from 'lucide-react';
import { useId, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QueryBoundary } from '@/components/layout/query-boundary';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import { integrationSettings } from '@/lib/integrations/settings';
import styles from './booking-form.module.css';

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

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className={`${styles.fieldError} motion-feedback`}>
      {message}
    </p>
  ) : null;
}

function BookingFormContent() {
  const formId = useId();
  const submitting = useRef(false);
  const { toast } = useToast();
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { customerName: '', customerPhone: '', serviceId: '', address: '' },
  });
  const mutation = useMutation({
    mutationFn: (input: BookingInput) =>
      apiClient.post('/bookings', {
        ...input,
        customerPhone: input.customerPhone.replace(/[\s.-]/g, ''),
      }),
    onSuccess: () => {
      form.reset();
      toast({
        title: 'Đã gửi yêu cầu',
        description: 'Minh Nhật sẽ liên hệ để xác nhận lịch.',
        variant: 'success',
      });
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
      className={styles.card}
      noValidate
      aria-labelledby={`${formId}-title`}
      aria-busy={mutation.isPending}
      onSubmit={form.handleSubmit((values) => {
        if (submitting.current) return;
        submitting.current = true;
        mutation.mutate(values);
      })}
    >
      <h3 className={styles.title} id={`${formId}-title`}>
        <CalendarDays aria-hidden="true" /> ĐẶT LỊCH DỊCH VỤ
      </h3>
      <fieldset className={styles.fields} disabled={mutation.isPending}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor={`${formId}-name`}>
              Họ và tên <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${formId}-name`}
              className={styles.control}
              autoComplete="name"
              placeholder="Nhập họ và tên"
              required
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? `${formId}-name-error` : undefined}
              {...form.register('customerName')}
            />
            <FieldError id={`${formId}-name-error`} message={errors.customerName?.message} />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${formId}-phone`}>
              Số điện thoại <span aria-hidden="true">*</span>
            </label>
            <input
              id={`${formId}-phone`}
              className={styles.control}
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
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-service`}>
            Dịch vụ cần hỗ trợ <span aria-hidden="true">*</span>
          </label>
          <div className={styles.selectWrap}>
            <select
              id={`${formId}-service`}
              className={styles.control}
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
            <ChevronDown aria-hidden="true" />
          </div>
          <FieldError id={`${formId}-service-error`} message={errors.serviceId?.message} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-address`}>
            Địa chỉ <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-address`}
            className={styles.control}
            autoComplete="street-address"
            placeholder="Nhập địa chỉ tại Cần Thơ"
            required
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? `${formId}-address-error` : undefined}
            {...form.register('address')}
          />
          <FieldError id={`${formId}-address-error`} message={errors.address?.message} />
        </div>
      </fieldset>
      <button className={`${styles.submit} motion-button`} type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu ngay'}
        {!mutation.isPending && <ArrowRight aria-hidden="true" />}
      </button>
      {mutation.isSuccess && (
        <p role="status" aria-live="polite" className={`${styles.success} motion-feedback`}>
          Đã gửi yêu cầu. Minh Nhật sẽ liên hệ xác nhận.
        </p>
      )}
      {mutation.isError && (
        <p role="alert" className={`${styles.submitError} motion-feedback`}>
          Không gửi được yêu cầu. Vui lòng thử lại hoặc{' '}
          <a href={`tel:${integrationSettings.phone}`}>gọi {integrationSettings.phone}</a>.
        </p>
      )}
    </form>
  );
}

export function ServicesBookingForm() {
  return (
    <QueryBoundary>
      <BookingFormContent />
    </QueryBoundary>
  );
}
