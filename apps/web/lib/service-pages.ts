export function isServicePage(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/(?:services|areas)(?:\/|$)/.test(pathname);
}
