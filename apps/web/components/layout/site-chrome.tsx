'use client';

import { ReactNode, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/conversion/floating-actions';
import { HomeFooter } from '@/components/layout/home-footer';
import { HomePreFooterCta } from '@/components/home-mockup/home-mockup';
import { ScrollProgressBar } from '@/components/ui/scroll-progress-bar';
import { SiteHeader } from '@/components/layout/site-header';
import type { WebsiteService } from '@/lib/content/website-content';
import { useSiteMotion } from './use-site-motion';
import { useHomeMotion, useInnerPageMotion } from './use-home-motion';
import { PageViewTracker } from '@/components/seo/page-view-tracker';
import { isServicePage } from '@/lib/service-pages';
import homeStyles from '@/components/home-ice-blue/home.module.css';
import entranceStyles from '@/components/home-ice-blue/staggered-hero.module.css';
import { observeHeroEntrance } from '@/components/home-ice-blue/hero-entrance';

export function SiteChrome({ children, services }: { children: ReactNode; services: WebsiteService[] }) {
  const pathname = usePathname();
  const site = useRef<HTMLDivElement>(null);
  useSiteMotion(site, pathname, !pathname.startsWith('/admin'));
  useHomeMotion(site, pathname);
  useInnerPageMotion(site, pathname);

  useLayoutEffect(() => {
    const root = site.current;
    if (!root || pathname === '/') return;
    const hero = root.querySelector<HTMLElement>('[data-u216-hero]');
    if (!hero) return;

    return observeHeroEntrance(root, hero);
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div
      className={`mn-site ${entranceStyles.u216} ${pathname === '/' ? homeStyles.siteBackground : ''}`}
      data-home={pathname === '/' ? 'true' : undefined}
      data-inner-page={pathname !== '/' ? 'true' : undefined}
      data-service-page={isServicePage(pathname) ? 'true' : undefined}
      ref={site}
    >
      <a className="mn-skip-link" href="#mn-main-content">Bỏ qua menu, đến nội dung</a>
      <ScrollProgressBar />
      <PageViewTracker />
      <SiteHeader services={services} />
      <div className={pathname === '/' ? 'flex-1' : 'flex-1 mn-home-reuse'} id="mn-main-content" tabIndex={-1}>{children}</div>
      {pathname !== '/' && pathname !== '/contact' && pathname !== '/booking' && <HomePreFooterCta />}
      <HomeFooter services={services} />
      <div className="mn-floating">
        <FloatingActions />
      </div>
    </div>
  );
}
