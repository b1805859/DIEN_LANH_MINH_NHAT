import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

type Delegate = {
  count: (args?: unknown) => Promise<number>;
  findMany: (args?: unknown) => Promise<Record<string, unknown>[]>;
  findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
  create: (args: unknown) => Promise<Record<string, unknown>>;
  update: (args: unknown) => Promise<Record<string, unknown>>;
  delete: (args: unknown) => Promise<Record<string, unknown>>;
};

type MutationDelegate = {
  deleteMany?: (args: unknown) => Promise<unknown>;
  updateMany?: (args: unknown) => Promise<unknown>;
};

const RESOURCE_DELEGATES: Record<string, string> = {
  services: 'service',
  locations: 'location',
  categories: 'category',
  tags: 'tag',
  faqs: 'fAQ',
  media: 'mediaFile',
  seo: 'sEOSetting',
  users: 'user',
  roles: 'role',
  contacts: 'contactRequest',
  blog: 'blogPost',
  bookings: 'booking',
};

const SEARCH_FIELDS: Record<string, string[]> = {
  services: ['name', 'slug'],
  locations: ['name', 'slug'],
  categories: ['name', 'slug'],
  tags: ['name', 'slug'],
  faqs: ['question'],
  contacts: ['name', 'phone', 'email'],
  blog: ['title', 'slug'],
  media: ['fileName', 'originalName'],
  seo: ['title', 'pageKey'],
  users: ['email', 'name'],
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      services,
      locations,
      bookings,
      pendingBookings,
      contacts,
      unresolvedContacts,
      posts,
      publishedPosts,
    ] = await Promise.all([
      this.prisma.service.count(),
      this.prisma.location.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.contactRequest.count(),
      this.prisma.contactRequest.count({ where: { isResolved: false } }),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    ]);

    return {
      services,
      locations,
      bookings,
      pendingBookings,
      contacts,
      unresolvedContacts,
      posts,
      publishedPosts,
    };
  }

  async list(resource: string, query: Record<string, string | undefined>) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize ?? 20), 1), 100);
    const where = this.buildWhere(resource, query.search);
    const delegate = this.getDelegate(resource);
    const [total, items] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: this.getInclude(resource),
      }),
    ]);

    return { items: this.sanitize(items), total, page, pageSize };
  }

  async get(resource: string, id: string) {
    const item = await this.getDelegate(resource).findUnique({
      where: { id },
      include: this.getInclude(resource),
    });
    if (!item) {
      throw new NotFoundException(`${resource} item not found.`);
    }

    return this.sanitize(item);
  }

  async create(resource: string, payload: Record<string, unknown>) {
    const data = await this.preparePayload(resource, payload);
    const item = await this.getDelegate(resource).create({ data });
    return this.sanitize(item);
  }

  async update(resource: string, id: string, payload: Record<string, unknown>) {
    const data = await this.preparePayload(resource, payload, true, id);
    const item = await this.getDelegate(resource).update({ where: { id }, data });
    return this.sanitize(item);
  }

  async remove(resource: string, id: string) {
    return this.prisma.$transaction(async (client) => {
      await this.prepareHardDelete(client, resource, id);
      const item = await this.getDelegate(resource, client).delete({ where: { id } });
      return this.sanitize(item);
    });
  }

  private getDelegate(resource: string, client: unknown = this.prisma) {
    const delegateName = RESOURCE_DELEGATES[resource];
    if (!delegateName) {
      throw new BadRequestException(`Unsupported CMS resource: ${resource}`);
    }

    return (client as Record<string, Delegate>)[delegateName];
  }

  private async prepareHardDelete(client: unknown, resource: string, id: string) {
    const delegates = client as Record<string, MutationDelegate>;

    switch (resource) {
      case 'services':
        await Promise.all([
          delegates.booking?.deleteMany?.({ where: { serviceId: id } }),
          delegates.serviceLocationOverride?.deleteMany?.({ where: { serviceId: id } }),
          delegates.fAQ?.updateMany?.({ where: { serviceId: id }, data: { serviceId: null } }),
          delegates.testimonial?.updateMany?.({ where: { serviceId: id }, data: { serviceId: null } }),
          delegates.sEOSetting?.updateMany?.({ where: { serviceId: id }, data: { serviceId: null } }),
        ]);
        break;
      case 'locations':
        await Promise.all([
          delegates.booking?.deleteMany?.({ where: { locationId: id } }),
          delegates.serviceLocationOverride?.deleteMany?.({ where: { locationId: id } }),
          delegates.fAQ?.updateMany?.({ where: { locationId: id }, data: { locationId: null } }),
          delegates.testimonial?.updateMany?.({ where: { locationId: id }, data: { locationId: null } }),
          delegates.sEOSetting?.updateMany?.({ where: { locationId: id }, data: { locationId: null } }),
        ]);
        break;
      case 'categories':
        await delegates.blogPost?.updateMany?.({ where: { categoryId: id }, data: { categoryId: null } });
        break;
      case 'media':
        await delegates.blogPost?.updateMany?.({
          where: { featuredImageId: id },
          data: { featuredImageId: null },
        });
        break;
      case 'blog':
        await Promise.all([
          delegates.fAQ?.updateMany?.({ where: { blogPostId: id }, data: { blogPostId: null } }),
          delegates.sEOSetting?.updateMany?.({ where: { blogPostId: id }, data: { blogPostId: null } }),
        ]);
        break;
      case 'users':
        await delegates.refreshToken?.deleteMany?.({ where: { userId: id } });
        break;
      default:
        break;
    }
  }

  private buildWhere(resource: string, search?: string) {
    if (!search) {
      return {};
    }

    const fields = SEARCH_FIELDS[resource] ?? [];
    return {
      OR: fields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      })),
    };
  }

  private getInclude(resource: string) {
    if (resource === 'blog') {
      return { category: true, tags: true, featuredImage: true };
    }

    return undefined;
  }

  private async preparePayload(
    resource: string,
    payload: Record<string, unknown>,
    isUpdate = false,
    id?: string,
  ) {
    const data = { ...payload };

    if (resource === 'users') {
      if (typeof data.password === 'string' && data.password.length >= 8) {
        data.passwordHash = await hash(data.password, 12);
      } else if (!isUpdate) {
        throw new BadRequestException('User password is required.');
      }
      delete data.password;
    }

    if (resource === 'bookings' && typeof data.scheduledAt === 'string') {
      data.scheduledAt = new Date(data.scheduledAt);
    }

    if (resource === 'blog') {
      if (typeof data.publishedAt === 'string') {
        data.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
      }

      if (typeof data.featuredImageUrl === 'string') {
        const featuredImageUrl = data.featuredImageUrl.trim();
        const altText = typeof data.featuredImageAlt === 'string' ? data.featuredImageAlt : undefined;

        if (featuredImageUrl) {
          const fileName = this.buildImageFileName(
            typeof data.slug === 'string' ? data.slug : id ?? 'blog-image',
            featuredImageUrl,
          );
          const currentPost = isUpdate && id
            ? await this.prisma.blogPost.findUnique({ where: { id }, select: { featuredImageId: true } })
            : null;
          const mediaFile = currentPost?.featuredImageId
            ? await this.prisma.mediaFile.update({
                where: { id: currentPost.featuredImageId },
                data: {
                  fileName,
                  originalName: fileName,
                  mimeType: this.inferImageMimeType(featuredImageUrl),
                  size: featuredImageUrl.length,
                  url: featuredImageUrl,
                  altText,
                },
              })
            : await this.prisma.mediaFile.create({
                data: {
                  fileName,
                  originalName: fileName,
                  mimeType: this.inferImageMimeType(featuredImageUrl),
                  size: featuredImageUrl.length,
                  url: featuredImageUrl,
                  altText,
                },
              });

          data.featuredImageId = mediaFile.id;
        } else {
          data.featuredImageId = null;
        }
      }

      delete data.featuredImageUrl;
      delete data.featuredImageAlt;
    }

    return data;
  }

  private buildImageFileName(baseName: string, imageUrl: string) {
    const extension = imageUrl.startsWith('data:image/png')
      ? 'png'
      : imageUrl.startsWith('data:image/webp')
        ? 'webp'
        : imageUrl.startsWith('data:image/gif')
          ? 'gif'
          : imageUrl.split('?')[0]?.split('.').pop()?.slice(0, 8) || 'jpg';

    return `${baseName.replace(/[^a-z0-9-]/gi, '-').toLowerCase()}-image.${extension}`;
  }

  private inferImageMimeType(imageUrl: string) {
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl.slice(5, imageUrl.indexOf(';'));
    }

    const normalizedUrl = imageUrl.toLowerCase().split('?')[0] ?? '';
    if (normalizedUrl.endsWith('.png')) return 'image/png';
    if (normalizedUrl.endsWith('.webp')) return 'image/webp';
    if (normalizedUrl.endsWith('.gif')) return 'image/gif';
    return 'image/jpeg';
  }

  private sanitize(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    if (value && typeof value === 'object') {
      const output = { ...(value as Record<string, unknown>) };
      delete output.passwordHash;
      delete output.tokenHash;
      return output;
    }

    return value;
  }
}
