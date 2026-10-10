import type { MetadataRoute } from 'next';
import { BLOG_CATEGORIES, BLOG_POSTS, PRIORITY_DISTRICTS, SERVICES } from '@minhnhat/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost';
  const urls: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/booking', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
    ...SERVICES.map((service) => ({
      path: `/services/${service.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...PRIORITY_DISTRICTS.map((district) => ({
      path: `/areas/${district.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...PRIORITY_DISTRICTS.flatMap((district) =>
      SERVICES.map((service) => ({
        path: `/areas/${district.slug}/${service.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ),
    ...BLOG_CATEGORIES.filter((category) =>
      BLOG_POSTS.some((post) => post.category === category.slug),
    ).map((category) => ({
      path: `/blog/category/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
    ...BLOG_POSTS.map((post) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return urls.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency,
    priority,
  }));
}
