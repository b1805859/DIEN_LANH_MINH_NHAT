'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { AdminSessionControls, SiteHeader } from '@/components/layout/site-header';
import { AreaSelectionProvider } from '@/components/areas-reference/area-selection';
import { HomeFooter } from '@/components/home-reference/chrome';
import { SiteMotion } from '@/components/motion/site-motion';
import { KageMotion } from '@/components/kage/kage-motion';
import { motionVariables } from '@/lib/motion/config';
import homeStyles from '@/components/home-reference/home.module.css';
import styles from './site-chrome.module.css';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  const isHome = pathname === '/';
  const hasImageHero = ['/', '/services', '/about', '/blog', '/contact', '/areas'].includes(
    pathname,
  );
  const hasAreaSelection = ['/areas', '/about', '/contact'].includes(pathname);
  const hasFloatingActions = !isHome && pathname !== '/services' && !hasAreaSelection;

  return (
    <div
      style={motionVariables}
      className={`public-site kage-site${isHome ? ' kage-home' : ''} ${homeStyles.site} ${styles.siteShell}${hasFloatingActions ? ' has-floating-actions' : ''}`}
    >
      <SiteMotion />
      <KageMotion />
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <SiteHeader className={hasImageHero ? undefined : styles.innerHeader} />
      {hasFloatingActions ? <AdminSessionControls /> : null}
      <div
        id="main-content"
        tabIndex={-1}
        className={`${styles.content}${hasImageHero && !isHome ? ` ${styles.overlayContent}` : ''}`}
      >
        {hasAreaSelection ? <AreaSelectionProvider>{children}</AreaSelectionProvider> : children}
      </div>
      <HomeFooter />
      {hasFloatingActions ? (
        <FloatingActions minimal={pathname === '/booking' || pathname.startsWith('/services/')} />
      ) : null}
    </div>
  );
}
