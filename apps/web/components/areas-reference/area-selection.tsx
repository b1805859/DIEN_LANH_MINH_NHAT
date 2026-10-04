'use client';

import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { serviceCards } from '@/components/services-reference/data';
import styles from './areas.module.css';

const AreaContext = createContext<(area: string) => void>(() => {});

export function AreaSelectionProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [area, setArea] = useState('');
  return (
    <AreaContext.Provider
      value={(name) => {
        setArea(name);
        dialog.current?.showModal();
      }}
    >
      {children}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="area-details-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className={styles.closeButton}
          data-motion-hover="icon"
          aria-label="Đóng chi tiết khu vực"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <h2 id="area-details-title">Dịch vụ tại {area}</h2>
        <div className={styles.dialogLinks}>
          {serviceCards.map((service) => (
            <Link
              key={service.slug}
              data-motion-hover="button"
              href={`/services/${service.slug}`}
              onClick={() => dialog.current?.close()}
            >
              {service.title}
              <ArrowRight />
            </Link>
          ))}
        </div>
        <a
          className={styles.primaryButton}
          data-motion-hover="button"
          href="#dat-lich"
          onClick={() => dialog.current?.close()}
        >
          Đặt lịch tại {area}
          <ArrowRight />
        </a>
      </dialog>
    </AreaContext.Provider>
  );
}

export function AreaButton({
  area,
  children,
  className,
  motionHover = 'button',
}: {
  area: string;
  children: ReactNode;
  className?: string;
  motionHover?: 'card' | 'button';
}) {
  const selectArea = useContext(AreaContext);
  return (
    <button
      type="button"
      className={className}
      data-motion-hover={motionHover}
      onClick={() => selectArea(area)}
      aria-label={`Xem dịch vụ tại ${area}`}
    >
      {children}
    </button>
  );
}

export function useAreaSelection() {
  return useContext(AreaContext);
}
