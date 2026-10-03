export const navigationItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dịch vụ', href: '/services' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Tin tức', href: '/blog' },
  { label: 'Liên hệ', href: '/contact' },
] as const;

export function isNavigationItemActive(href: string, pathname: string, hash: string) {
  const [route, fragment] = href.split('#');
  if (fragment) return pathname === route && hash === '#' + fragment;
  if (route === '/') {
    return (
      pathname === '/' &&
      !navigationItems.some((item) => item.href.includes('#') && item.href === pathname + hash)
    );
  }
  return pathname === route || pathname.startsWith(route + '/');
}
