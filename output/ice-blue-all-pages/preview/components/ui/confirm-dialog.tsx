'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { backdropMotion, surfaceMotion } from '@/components/ui/motion-tokens';
import { useModalFocus } from '@/components/ui/use-modal-focus';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'default',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalFocus(open, panelRef);
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, onCancel, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...backdropMotion}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            {...surfaceMotion}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <h2 id="confirm-dialog-title" className="text-lg font-black text-slate-950">
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-2 text-sm font-medium leading-6 text-slate-600"
            >
              {description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button type="button" variant={variant} onClick={onConfirm} disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
