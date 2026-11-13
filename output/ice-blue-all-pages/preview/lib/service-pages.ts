// All service catalogues, service details and local service landing pages are static.
export function isServicePage(pathname: string) {
  return /^\/(?:services|areas)(?:\/|$)/.test(pathname);
}
