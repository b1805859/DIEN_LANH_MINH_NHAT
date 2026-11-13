'use client';

import { useEffect, useId, useRef } from 'react';
import { Eye, Pencil, Trash2, X } from 'lucide-react';

export function AdminServiceActions({
  title,
  onClose,
  onView,
  onEdit,
  onDelete,
}: {
  title: string | null;
  onClose: () => void;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (title) {
      if (!node.open) node.showModal();
    } else if (node.open) node.close();
  }, [title]);
  return (
    <dialog
      ref={dialog}
      className="mn-admin-service-actions"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mn-admin-sheet-heading">
        <h2 id={titleId}>{title}</h2>
        <button type="button" aria-label="Đóng thao tác dịch vụ" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <button type="button" onClick={onView}>
        <Eye size={20} />
        Xem chi tiết
      </button>
      {onEdit && (
        <button type="button" onClick={onEdit}>
          <Pencil size={20} />
          Cập nhật
        </button>
      )}
      {onDelete && (
        <button type="button" className="mn-admin-sheet-delete" onClick={onDelete}>
          <Trash2 size={20} />
          Xóa
        </button>
      )}
    </dialog>
  );
}
