import type { MetadataRoute } from 'next';
import { BLOG_POSTS, SERVICES } from '@minhnhat/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticPaths = ['/', '/about', '/services', '/blog', '/booking', '/contact', '/faq'];
  const servicePaths = SERVICES.map((service) => `/services/${service.slug}`);
  const blogPaths = BLOG_POSTS.map((post) => `/blog/${post.slug}`);

  return [...staticPaths, ...servicePaths, ...blogPaths].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}
