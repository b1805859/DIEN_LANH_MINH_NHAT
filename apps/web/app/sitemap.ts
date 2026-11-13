import type { MetadataRoute } from 'next';
import { PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { getWebsiteContent } from '@/lib/content/website-content';
import { siteUrl, isPreviewDeployment } from '@/lib/seo/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreviewDeployment) return [];
  const { services, posts, categories } = await getWebsiteContent();
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
    { path: '/contact', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...PRIORITY_DISTRICTS.map((district) => ({
      path: `/areas/${district.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    // Service/area combinations remain usable, but are noindex until they have
    // independently useful local content and verified examples of work.
    ...categories.filter((category) =>
      posts.some((post) => post.category === category.slug),
    ).map((category) => ({
      path: `/blog/category/${category.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    })),
    ...posts.map((post) => ({
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
