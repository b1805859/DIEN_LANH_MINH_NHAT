'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from '@/lib/analytics';

const reportVital: Parameters<typeof useReportWebVitals>[0] = ({ name, value, id }) => {
  if (['LCP', 'INP', 'CLS'].includes(name)) {
    trackEvent('web_vital', { metric_name: name, metric_value: value, metric_id: id, non_interaction: true });
  }
};

/** Anonymous aggregate: count one public page render, including client navigation. */
export function PageViewTracker() {
  useReportWebVitals(reportVital);
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    const trackContact = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      const href = link?.getAttribute('href') || '';
      if (href.startsWith('tel:')) trackEvent('phone_click');
      else if (/^https:\/\/(?:www\.)?zalo\.me\//.test(href)) trackEvent('zalo_click');
    };
    document.addEventListener('click', trackContact);
    return () => document.removeEventListener('click', trackContact);
  }, []);
  useEffect(() => {
    if (!pathname || /^\/(admin|api|_next)(\/|$)/.test(pathname) || lastPath.current === pathname)
      return;
    lastPath.current = pathname;
    // Local development/preview traffic must not inflate production analytics.
    if (process.env.NODE_ENV !== 'production') return;
    void fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      credentials: 'omit',
      keepalive: true,
    }).catch(() => {
      /* Analytics must never block browsing. */
    });
  }, [pathname]);
  return null;
}
