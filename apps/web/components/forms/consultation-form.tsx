'use client';

import { useRef, useState, type FormEvent } from 'react';
import { apiClient } from '@/lib/api/client';
import { siteContent } from '@/lib/content/site-content';
import { trackEvent } from '@/lib/analytics';

const fieldClass = 'min-h-12 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-950';

export function ConsultationForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    const customerName = String(fields.get('customerName') ?? '').trim();
    const customerPhone = String(fields.get('customerPhone') ?? '').replace(/[\s.-]/g, '');
    if (customerName.length < 2 || !/^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/.test(customerPhone)) {
      setState('idle');
      setValidationError(
        customerName.length < 2 ? 'Vui lòng nhập họ tên.' : 'Số điện thoại chưa hợp lệ.',
      );
      return;
    }

    setValidationError('');
    submitting.current = true;
    setState('sending');
    trackEvent('consultation_submit');

    try {
      await apiClient.post('/consultations', { customerName, customerPhone });
      form.reset();
      setState('sent');
      trackEvent('consultation_success');
    } catch {
      setState('error');
      trackEvent('consultation_error');
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form className="grid gap-3" onSubmit={submit} aria-busy={state === 'sending'}>
      <fieldset disabled={state === 'sending'} className="grid min-w-0 gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">
          Họ tên
          <input className={fieldClass} name="customerName" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Số điện thoại
          <input className={fieldClass} name="customerPhone" type="tel" autoComplete="tel" required minLength={8} maxLength={24} />
        </label>
        <button type="submit" className="mn-button sm:col-span-2">
          {state === 'sending' ? 'Đang gửi…' : 'Gửi yêu cầu tư vấn'}
        </button>
      </fieldset>
      {validationError && <p role="alert">{validationError}</p>}
      {state === 'sent' && <p role="status">Đã gửi thông tin. Nhân viên Minh Nhật sẽ gọi lại để tư vấn.</p>}
      {state === 'error' && (
        <p role="alert">
          Chưa gửi được thông tin. Vui lòng thử lại hoặc{' '}
          <a className="underline" href={siteContent.phoneHref}>gọi {siteContent.phoneDisplay}</a>.
        </p>
      )}
    </form>
  );
}
