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

const RESOURCE_DELEGATES: Record<string, string> = {
  services: 'service',
  locations: 'location',
  categories: 'category',
  tags: 'tag',
  faqs: 'fAQ',
  testimonials: 'testimonial',
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
  testimonials: ['customerName', 'content'],
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
    const data = await this.preparePayload(resource, payload, true);
    const item = await this.getDelegate(resource).update({ where: { id }, data });
    return this.sanitize(item);
  }

  async remove(resource: string, id: string) {
    const item = await this.getDelegate(resource).delete({ where: { id } });
    return this.sanitize(item);
  }

  private getDelegate(resource: string) {
    const delegateName = RESOURCE_DELEGATES[resource];
    if (!delegateName) {
      throw new BadRequestException(`Unsupported CMS resource: ${resource}`);
    }

    return (this.prisma as unknown as Record<string, Delegate>)[delegateName];
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

  private async preparePayload(resource: string, payload: Record<string, unknown>, isUpdate = false) {
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

    return data;
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
