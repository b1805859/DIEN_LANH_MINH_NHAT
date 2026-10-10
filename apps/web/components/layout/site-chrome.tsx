'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 450);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div className="mn-site">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <div className={`mn-floating ${scrolled ? 'is-visible' : ''}`}>
        <FloatingActions />
      </div>
    </div>
  );
}
