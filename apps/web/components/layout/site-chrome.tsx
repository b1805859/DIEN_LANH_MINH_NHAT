'use client';

import { ReactNode, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { useSiteMotion } from './use-site-motion';
import { useHomeMotion } from './use-home-motion';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const site = useRef<HTMLDivElement>(null);
  useSiteMotion(site, pathname, !pathname.startsWith('/admin'));
  useHomeMotion(site, pathname);

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div className="mn-site" data-home={pathname === '/' ? 'true' : undefined} ref={site}>
      <a className="mn-skip-link" href="#mn-main-content">Bỏ qua menu, đến nội dung</a>
      <SiteHeader />
      <div className="flex-1" id="mn-main-content" tabIndex={-1}>{children}</div>
      <SiteFooter />
      <div className="mn-floating">
        <FloatingActions />
      </div>
    </div>
  );
}
