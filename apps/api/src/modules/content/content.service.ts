import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  listServices() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getService(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      include: { faqs: true, testimonials: true },
    });
    if (!service || !service.isActive) {
      throw new NotFoundException('Service not found.');
    }
    return service;
  }

  listLocations() {
    return this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: [{ isPriority: 'desc' }, { name: 'asc' }],
    });
  }

  async getLocation(slug: string) {
    const location = await this.prisma.location.findUnique({
      where: { slug },
      include: { faqs: true, testimonials: true },
    });
    if (!location || !location.isActive) {
      throw new NotFoundException('Location not found.');
    }
    return location;
  }

  listCategories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  listFaqs() {
    return this.prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  listTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  listBlog(params: { category?: string; tag?: string; search?: string }) {
    return this.prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        ...(params.search
          ? {
              OR: [
                { title: { contains: params.search, mode: 'insensitive' } },
                { excerpt: { contains: params.search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(params.category ? { category: { slug: params.category } } : {}),
        ...(params.tag ? { tags: { some: { slug: params.tag } } } : {}),
      },
      include: { category: true, tags: true, featuredImage: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getBlogPost(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, tags: true, featuredImage: true, faqs: true },
    });
    if (!post || post.status !== 'PUBLISHED') {
      throw new NotFoundException('Blog post not found.');
    }
    return post;
  }

  async getArea(locationSlug: string, serviceSlug: string) {
    const [location, service] = await Promise.all([
      this.prisma.location.findUnique({ where: { slug: locationSlug } }),
      this.prisma.service.findUnique({ where: { slug: serviceSlug } }),
    ]);

    if (!location || !service || !location.isActive || !service.isActive) {
      throw new NotFoundException('Area landing page not found.');
    }

    const override = await this.prisma.serviceLocationOverride.findUnique({
      where: { serviceId_locationId: { serviceId: service.id, locationId: location.id } },
    });

    const [faqs, testimonials, relatedPosts, relatedServices] = await Promise.all([
      this.prisma.fAQ.findMany({
        where: {
          isActive: true,
          OR: [{ serviceId: service.id }, { locationId: location.id }],
        },
        take: 8,
      }),
      this.prisma.testimonial.findMany({
        where: {
          isActive: true,
          OR: [{ serviceId: service.id }, { locationId: location.id }],
        },
        take: 6,
      }),
      this.prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        include: { category: true },
        take: 4,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.service.findMany({
        where: { isActive: true, NOT: { id: service.id } },
        take: 4,
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return {
      location,
      service,
      override,
      faqs,
      testimonials,
      relatedPosts,
      relatedServices,
    };
  }
}

