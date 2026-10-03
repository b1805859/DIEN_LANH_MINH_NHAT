'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/lib/auth/tokens';
import { apiClient } from '@/lib/api/client';
import styles from './site-chrome.module.css';

// Home remains the single source for the public brand, navigation, and mobile menu.
export { HomeHeader as SiteHeader } from '@/components/home-reference/chrome';

export function AdminSessionControls() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasAdminSession, setHasAdminSession] = useState(false);

  useEffect(() => {
    const syncAdminSession = () => setHasAdminSession(Boolean(getStoredAccessToken()));

    syncAdminSession();
    window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAdminSession);
    window.addEventListener('focus', syncAdminSession);
    window.addEventListener('storage', syncAdminSession);

    return () => {
      window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, syncAdminSession);
      window.removeEventListener('focus', syncAdminSession);
      window.removeEventListener('storage', syncAdminSession);
    };
  }, []);

  const handleLogout = async () => {
    const accessToken = getStoredAccessToken();
    const refreshToken = getStoredRefreshToken();

    if (accessToken && refreshToken) {
      try {
        await apiClient.post(
          '/auth/logout',
          { refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } catch {
        // Local logout should still complete even if the token is already invalid.
      }
    }

    clearStoredAuthTokens();
    setHasAdminSession(false);

    if (pathname.startsWith('/admin')) {
      router.replace('/admin/login');
    }
  };

  if (!hasAdminSession) return null;

  return (
    <div className={styles.adminSession}>
      <Link href="/admin/dashboard">Quản trị</Link>
      <button type="button" onClick={handleLogout}>
        <LogOut aria-hidden="true" /> Đăng xuất
      </button>
    </div>
  );
}
