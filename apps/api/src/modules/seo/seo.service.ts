import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async getSitemapEntries() {
    const [services, locations, posts] = await Promise.all([
      this.prisma.service.findMany({ where: { isActive: true } }),
      this.prisma.location.findMany({ where: { isActive: true } }),
      this.prisma.blogPost.findMany({ where: { status: 'PUBLISHED' } }),
    ]);

    return [
      { path: '/', changeFrequency: 'weekly', priority: 1 },
      { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
      { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
      { path: '/booking', changeFrequency: 'monthly', priority: 0.8 },
      { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
      ...services.map((service) => ({
        path: `/services/${service.slug}`,
        changeFrequency: 'weekly',
        priority: 0.9,
      })),
      ...locations.map((location) => ({
        path: `/areas/${location.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      })),
      ...locations.flatMap((location) =>
        services.map((service) => ({
          path: `/areas/${location.slug}/${service.slug}`,
          changeFrequency: 'weekly',
          priority: 0.95,
        })),
      ),
      ...posts.map((post) => ({
        path: `/blog/${post.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ];
  }
}

