'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@minhnhat/shared';
import { cn } from '@/lib/utils';

const navItems = [
  ['Dịch vụ', '/services'],
  ['Khu vực', '/areas/ninh-kieu/sua-may-lanh'],
  ['Blog', '/blog'],
  ['Đặt lịch', '/booking'],
  ['Liên hệ', '/contact'],
];

export function SiteHeader() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setHasScrolled(window.scrollY > 12);

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !hasScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300',
          isTransparent
            ? 'border-white/15 bg-transparent text-white'
            : 'border-slate-200 bg-white/90 text-slate-950 shadow-sm backdrop-blur-xl',
        )}
      >
        <div className="container flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold sm:text-base">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
              MN
            </span>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>
          <nav
            className={cn(
              'hidden items-center justify-end gap-5 text-sm transition-colors md:flex',
              isTransparent ? 'text-white/85' : 'text-slate-700',
            )}
          >
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn('transition', isTransparent ? 'hover:text-white' : 'hover:text-primary')}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {isHomePage ? null : <div className="h-16" aria-hidden="true" />}
    </>
  );
}
