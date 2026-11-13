import type { MetadataRoute } from 'next';
import { siteUrl, isPreviewDeployment } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreviewDeployment ? [{ userAgent: '*', disallow: '/' }] : [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: new URL(siteUrl).origin,
  };
}
