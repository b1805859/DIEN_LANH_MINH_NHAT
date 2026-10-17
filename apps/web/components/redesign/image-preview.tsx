'use client';

import Image from 'next/image';
import { Expand, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export function ImagePreview({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const label = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <>
      <button
        type="button"
        className="mn-image-preview-trigger"
        onClick={() => setOpen(true)}
        aria-label={`Phóng lớn ảnh: ${title}`}
        aria-haspopup="dialog"
      >
        <Expand size={18} aria-hidden="true" /> Xem ảnh
      </button>
      <dialog
        ref={dialog}
        className="mn-image-preview"
        aria-labelledby={label}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {open && (
          <div className="mn-image-preview-surface">
            <div className="mn-image-preview-heading">
              <p id={label}>
                {title}
                <small>Hình ảnh minh họa dịch vụ</small>
              </p>
              <button type="button" aria-label="Đóng ảnh" onClick={() => dialog.current?.close()}>
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="mn-image-preview-photo">
              <Image src={src} alt={`${title} – ảnh minh họa`} fill sizes="90vw" loading="eager" />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
