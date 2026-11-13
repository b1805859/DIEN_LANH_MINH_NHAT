// Stable production origin; never use a per-deployment preview URL as canonical.
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallback = process.env.NODE_ENV === 'production'
  ? 'https://dien-lanh-minh-nhat.vercel.app'
  : 'http://localhost:3000';
const parsed = new URL(configured || fallback);
if (!['https:', 'http:'].includes(parsed.protocol) || parsed.pathname !== '/' || parsed.search || parsed.hash) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, query or hash.');
}
if (process.env.NODE_ENV === 'production' && (parsed.protocol !== 'https:' || ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(parsed.hostname))) {
  throw new Error('Production SEO requires a public HTTPS NEXT_PUBLIC_SITE_URL.');
}
export const siteUrl = parsed.origin;
export const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
