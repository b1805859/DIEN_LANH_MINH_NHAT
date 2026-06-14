import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async getSitemapEntries() {
    const [services, posts] = await Promise.all([
      this.prisma.service.findMany({ where: { isActive: true } }),
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
      ...posts.map((post) => ({
        path: `/blog/${post.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ];
  }
}
