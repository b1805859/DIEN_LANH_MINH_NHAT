'use client';

import { CheckCircle2, Info, XCircle } from 'lucide-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastInput & {
  id: number;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-red-200 bg-red-50 text-red-950',
  info: 'border-sky-200 bg-sky-50 text-sky-950',
};

const iconStyles: Record<ToastVariant, string> = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-sky-600',
};

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setToasts((current) => [
      ...current,
      {
        ...input,
        id,
        variant: input.variant ?? 'info',
      },
    ]);
  }, []);

  const value = useMemo(() => ({ toast, dismissToast }), [toast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts[0] ? (
        <NotificationModal toast={toasts[0]} onDismiss={() => dismissToast(toasts[0].id)} />
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider.');
  }

  return context;
}

function NotificationModal({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const Icon = toastIcons[toast.variant];
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`notification-title-${toast.id}`}
        aria-describedby={toast.description ? `notification-description-${toast.id}` : undefined}
        className="w-full max-w-md animate-in rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xl fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        <div
          className={cn(
            'mx-auto flex h-14 w-14 items-center justify-center rounded-full border',
            variantStyles[toast.variant],
          )}
        >
          <Icon className={cn('h-7 w-7', iconStyles[toast.variant])} aria-hidden />
        </div>
        <h2
          id={`notification-title-${toast.id}`}
          className="mt-4 text-xl font-black leading-7 text-slate-950"
        >
          {toast.title}
        </h2>
        {toast.description ? (
          <p
            id={`notification-description-${toast.id}`}
            className="mt-2 text-sm font-medium leading-6 text-slate-600"
          >
            {toast.description}
          </p>
        ) : null}
        <Button
          ref={closeButtonRef}
          type="button"
          className="mt-6 h-11 w-full font-black"
          onClick={onDismiss}
        >
          Đã hiểu
        </Button>
      </div>
    </div>
  );
}
