'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function AdminBookingDetails({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <div className="mn-admin-booking-details" data-expanded={expanded}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded((value) => !value)}
      >
        Chi tiết &amp; trạng thái
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <div id={id} className="mn-admin-booking-detail-body">
        {children}
      </div>
    </div>
  );
}
