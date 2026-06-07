import type { MetadataRoute } from 'next';
import { BLOG_POSTS, PRIORITY_DISTRICTS, SERVICES } from '@minhnhat/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticPaths = ['/', '/about', '/services', '/blog', '/booking', '/contact', '/faq'];
  const servicePaths = SERVICES.map((service) => `/services/${service.slug}`);
  const districtPaths = PRIORITY_DISTRICTS.map((district) => `/areas/${district.slug}`);
  const programmaticPaths = PRIORITY_DISTRICTS.flatMap((district) =>
    SERVICES.map((service) => `/areas/${district.slug}/${service.slug}`),
  );
  const blogPaths = BLOG_POSTS.map((post) => `/blog/${post.slug}`);

  return [...staticPaths, ...servicePaths, ...districtPaths, ...programmaticPaths, ...blogPaths].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path.includes('/areas/') ? 0.95 : 0.8,
    }),
  );
}

