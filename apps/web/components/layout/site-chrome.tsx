'use client';

import { ReactNode, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { HomeFooter } from '@/components/layout/home-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { useSiteMotion } from './use-site-motion';
import { useHomeMotion, useInnerPageMotion } from './use-home-motion';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const site = useRef<HTMLDivElement>(null);
  useSiteMotion(site, pathname, !pathname.startsWith('/admin'));
  useHomeMotion(site, pathname);
  useInnerPageMotion(site, pathname);

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div
      className="mn-site"
      data-home={pathname === '/' ? 'true' : undefined}
      data-inner-page={pathname !== '/' ? 'true' : undefined}
      ref={site}
    >
      <a className="mn-skip-link" href="#mn-main-content">Bỏ qua menu, đến nội dung</a>
      <SiteHeader />
      <div className={pathname === '/' ? 'flex-1' : 'flex-1 mn-home-reuse'} id="mn-main-content" tabIndex={-1}>{children}</div>
      <HomeFooter />
      <div className="mn-floating">
        <FloatingActions />
      </div>
    </div>
  );
}
