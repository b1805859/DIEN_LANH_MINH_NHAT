'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div className="public-site contents">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <SiteHeader />
      <div id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </div>
      <SiteFooter />
      <FloatingActions
        minimal={
          pathname === '/' ||
          pathname === '/booking' ||
          pathname === '/about' ||
          pathname === '/contact' ||
          pathname.startsWith('/services/')
        }
      />
    </div>
  );
}
