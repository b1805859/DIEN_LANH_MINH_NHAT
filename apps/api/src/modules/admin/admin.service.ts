import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { RequestUser } from '../../common/types/request-user';
import { addDays, dateKeyInTimeZone, toUtcDate } from '../../common/utils/date';
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
  blog: 'blogPost',
  bookings: 'booking',
};

const SEARCH_FIELDS: Record<string, string[]> = {
  services: ['name', 'slug'],
  locations: ['name', 'slug'],
  categories: ['name', 'slug'],
  tags: ['name', 'slug'],
  faqs: ['question'],
  blog: ['title', 'slug'],
  media: ['fileName', 'originalName'],
  seo: ['title', 'pageKey'],
  users: ['email', 'name'],
};

const CUSTOMER_MANAGED_RESOURCES = new Set(['bookings']);
const BOOKING_STATUSES = new Set(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
const CONTENT_RESOURCES = new Set([
  'services',
  'locations',
  'categories',
  'tags',
  'faqs',
  'media',
  'seo',
  'blog',
]);
const LEAD_RESOURCES = new Set(['bookings']);
const IDENTITY_RESOURCES = new Set(['users', 'roles']);
const IMAGE_UPDATE_FIELDS: Record<string, Set<string>> = {
  services: new Set(['imageUrl']),
  blog: new Set(['featuredImageUrl', 'featuredImageId']),
  media: new Set(['url']),
  seo: new Set(['openGraphImage']),
};

type AdminAction = 'read' | 'create' | 'update' | 'delete';
type AuditAction = 'UPDATE' | 'DELETE';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(role: string) {
    this.assertCanAccessDashboard(role);
    const today = dateKeyInTimeZone();
    const tomorrow = addDays(today, 1);
    const seventhDay = addDays(today, 7);

    const [
      services,
      locations,
      bookings,
      pendingBookings,
      posts,
      publishedPosts,
      todayBookings,
      upcoming7DaysBookings,
      nextBooking,
    ] = await Promise.all([
      this.prisma.service.count(),
      this.prisma.location.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.blogPost.count(),
      this.prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.booking.count({
        where: {
          scheduledDate: toUtcDate(today),
          status: { not: 'CANCELLED' },
        },
      }),
      this.prisma.booking.count({
        where: {
          scheduledDate: {
            gte: toUtcDate(tomorrow),
            lte: toUtcDate(seventhDay),
          },
          status: { not: 'CANCELLED' },
        },
      }),
      this.prisma.booking.findFirst({
        where: {
          scheduledDate: { gte: toUtcDate(today) },
          status: { not: 'CANCELLED' },
        },
        orderBy: { scheduledDate: 'asc' },
        select: { scheduledDate: true },
      }),
    ]);
    const nextBookingDate = nextBooking?.scheduledDate?.toISOString().slice(0, 10) ?? null;
    const nextBookingCount = nextBookingDate
      ? await this.prisma.booking.count({
          where: {
            scheduledDate: toUtcDate(nextBookingDate),
            status: { not: 'CANCELLED' },
          },
        })
      : 0;

    return {
      services,
      locations,
      bookings,
      pendingBookings,
      posts,
      publishedPosts,
      bookingOverview: {
        todayActive: todayBookings,
        upcoming7DaysActive: upcoming7DaysBookings,
        pendingActive: pendingBookings,
        nextBookingDate,
        nextBookingCount,
      },
    };
  }

  async list(resource: string, query: Record<string, string | undefined>, role: string) {
    this.assertCanAccessResource(role, resource, 'read');
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

  async get(resource: string, id: string, role: string) {
    this.assertCanAccessResource(role, resource, 'read');
    const item = await this.getDelegate(resource).findUnique({
      where: { id },
      include: this.getInclude(resource),
    });
    if (!item) {
      throw new NotFoundException(`${resource} item not found.`);
    }

    return this.sanitize(item);
  }

  async create(resource: string, payload: Record<string, unknown>, role: string) {
    this.assertCanAccessResource(role, resource, 'create');
    this.assertAdminCanMutateResource(resource, 'create');
    const data = await this.preparePayload(resource, payload);
    const item = await this.getDelegate(resource).create({ data });
    return this.sanitize(item);
  }

  async update(resource: string, id: string, payload: Record<string, unknown>, user: RequestUser) {
    this.assertCanAccessResource(user.role, resource, 'update');
    this.assertNoImageUpdateFields(resource, payload);
    const delegate = this.getDelegate(resource);
    const beforeSnapshot = await delegate.findUnique({ where: { id } });
    if (!beforeSnapshot) {
      throw new NotFoundException(`${resource} item not found.`);
    }

    const data = await this.preparePayload(resource, payload, true, id);
    const item = await this.prisma.$transaction(async (client) => {
      const updatedItem = await this.getDelegate(resource, client).update({ where: { id }, data });
      await this.createAuditLog(client, {
        action: 'UPDATE',
        resource,
        recordId: id,
        user,
        beforeSnapshot,
        afterSnapshot: updatedItem,
      });
      return updatedItem;
    });

    return this.sanitize(item);
  }

  async remove(resource: string, id: string, user: RequestUser) {
    this.assertCanAccessResource(user.role, resource, 'delete');
    this.assertAdminCanMutateResource(resource, 'delete');
    return this.prisma.$transaction(async (client) => {
      const beforeSnapshot = await this.getDelegate(resource, client).findUnique({ where: { id } });
      if (!beforeSnapshot) {
        throw new NotFoundException(`${resource} item not found.`);
      }

      await this.prepareHardDelete(client, resource, id);
      const item = await this.getDelegate(resource, client).delete({ where: { id } });
      await this.createAuditLog(client, {
        action: 'DELETE',
        resource,
        recordId: id,
        user,
        beforeSnapshot,
        afterSnapshot: null,
      });
      return this.sanitize(item);
    });
  }

  async listHistory(query: Record<string, string | undefined>, role: string) {
    this.assertCanAccessDashboard(role);
    const page = Math.max(Number(query.page ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(query.pageSize ?? 20), 1), 100);
    const where: Record<string, unknown> = {};

    if (query.resource) {
      where.resource = query.resource;
    }

    if (query.action) {
      where.action = query.action;
    }

    const [total, items] = await Promise.all([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { items: this.sanitize(items), total, page, pageSize };
  }

  async revertHistory(id: string, user: RequestUser) {
    const auditLog = await this.prisma.adminAuditLog.findUnique({ where: { id } });
    if (!auditLog) {
      throw new NotFoundException('History item not found.');
    }

    if (auditLog.revertedAt) {
      throw new BadRequestException('This history item has already been reverted.');
    }

    const action = auditLog.action as AuditAction;
    if (!['UPDATE', 'DELETE'].includes(action)) {
      throw new BadRequestException('Unsupported history action.');
    }

    const mutationAction: AdminAction = action === 'DELETE' ? 'create' : 'update';
    this.assertCanAccessResource(user.role, auditLog.resource, mutationAction);
    if (action === 'DELETE') {
      this.assertAdminCanMutateResource(auditLog.resource, 'create');
    }

    const beforeSnapshot = this.getSnapshotRecord(auditLog.beforeSnapshot);
    if (!beforeSnapshot) {
      throw new BadRequestException('History item does not have a restore snapshot.');
    }

    const delegate = this.getDelegate(auditLog.resource);
    const existingRecord = await delegate.findUnique({ where: { id: auditLog.recordId } });

    await this.prisma.$transaction(async (client) => {
      const txDelegate = this.getDelegate(auditLog.resource, client);

      if (action === 'DELETE') {
        if (existingRecord) {
          throw new BadRequestException('Cannot revert delete because the record already exists.');
        }
        await txDelegate.create({ data: beforeSnapshot });
      } else if (existingRecord) {
        await txDelegate.update({
          where: { id: auditLog.recordId },
          data: this.omitReadOnlyRestoreFields(auditLog.resource, beforeSnapshot),
        });
      } else {
        await txDelegate.create({ data: beforeSnapshot });
      }

      await (client as typeof this.prisma).adminAuditLog.update({
        where: { id },
        data: {
          revertedAt: new Date(),
          revertedById: user.sub,
          revertedByEmail: user.email,
        },
      });
    });

    return { success: true };
  }

  private getDelegate(resource: string, client: unknown = this.prisma) {
    const delegateName = RESOURCE_DELEGATES[resource];
    if (!delegateName) {
      throw new BadRequestException(`Unsupported CMS resource: ${resource}`);
    }

    return (client as Record<string, Delegate>)[delegateName];
  }

  private assertCanAccessDashboard(role: string) {
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF'].includes(role)) {
      throw new ForbiddenException('Admin access denied.');
    }
  }

  private assertCanAccessResource(role: string, resource: string, action: AdminAction) {
    this.getDelegate(resource);

    if (role === 'SUPER_ADMIN') return;

    if (IDENTITY_RESOURCES.has(resource)) {
      throw new ForbiddenException('Only SUPER_ADMIN can access user and role data.');
    }

    if (LEAD_RESOURCES.has(resource)) {
      if (['ADMIN', 'STAFF'].includes(role) && ['read', 'update'].includes(action)) return;
      throw new ForbiddenException('Lead data is limited to ADMIN and STAFF roles.');
    }

    if (CONTENT_RESOURCES.has(resource)) {
      if (['ADMIN', 'EDITOR'].includes(role)) return;
      throw new ForbiddenException('Content data is limited to ADMIN and EDITOR roles.');
    }

    throw new ForbiddenException('Admin resource access denied.');
  }

  private assertAdminCanMutateResource(resource: string, action: 'create' | 'delete') {
    if (CUSTOMER_MANAGED_RESOURCES.has(resource)) {
      throw new BadRequestException(
        `Admin cannot ${action} ${resource}. Customers create these records from the website.`,
      );
    }
  }

  private assertNoImageUpdateFields(resource: string, payload: Record<string, unknown>) {
    const blockedFields = IMAGE_UPDATE_FIELDS[resource];
    if (!blockedFields) return;

    const requestedBlockedFields = Object.keys(payload).filter((field) => blockedFields.has(field));
    if (requestedBlockedFields.length === 0) return;

    throw new BadRequestException(
      `Admin cannot update image fields for ${resource}: ${requestedBlockedFields.join(', ')}.`,
    );
  }

  private async prepareHardDelete(client: unknown, resource: string, id: string) {
    const delegates = client as Record<string, MutationDelegate>;

    switch (resource) {
      case 'services':
        await Promise.all([
          delegates.booking?.deleteMany?.({ where: { serviceId: id } }),
          delegates.serviceLocationOverride?.deleteMany?.({ where: { serviceId: id } }),
          delegates.fAQ?.updateMany?.({ where: { serviceId: id }, data: { serviceId: null } }),
          delegates.testimonial?.updateMany?.({
            where: { serviceId: id },
            data: { serviceId: null },
          }),
          delegates.sEOSetting?.updateMany?.({
            where: { serviceId: id },
            data: { serviceId: null },
          }),
        ]);
        break;
      case 'locations':
        await Promise.all([
          delegates.booking?.deleteMany?.({ where: { locationId: id } }),
          delegates.serviceLocationOverride?.deleteMany?.({ where: { locationId: id } }),
          delegates.fAQ?.updateMany?.({ where: { locationId: id }, data: { locationId: null } }),
          delegates.testimonial?.updateMany?.({
            where: { locationId: id },
            data: { locationId: null },
          }),
          delegates.sEOSetting?.updateMany?.({
            where: { locationId: id },
            data: { locationId: null },
          }),
        ]);
        break;
      case 'categories':
        await delegates.blogPost?.updateMany?.({
          where: { categoryId: id },
          data: { categoryId: null },
        });
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
          delegates.sEOSetting?.updateMany?.({
            where: { blogPostId: id },
            data: { blogPostId: null },
          }),
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
    if (CUSTOMER_MANAGED_RESOURCES.has(resource)) {
      if (!isUpdate) {
        throw new BadRequestException(`Admin cannot create ${resource}.`);
      }

      return this.prepareCustomerManagedUpdate(resource, payload);
    }

    const data = { ...payload };

    if (resource === 'users') {
      if (typeof data.password === 'string' && data.password.length >= 8) {
        data.passwordHash = await hash(data.password, 12);
      } else if (!isUpdate) {
        throw new BadRequestException('User password is required.');
      }
      delete data.password;
    }

    if (resource === 'blog') {
      if (typeof data.publishedAt === 'string') {
        data.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
      }

      if (!isUpdate && typeof data.featuredImageUrl === 'string') {
        const featuredImageUrl = data.featuredImageUrl.trim();
        const altText =
          typeof data.featuredImageAlt === 'string' ? data.featuredImageAlt : undefined;

        if (featuredImageUrl) {
          const fileName = this.buildImageFileName(
            typeof data.slug === 'string' ? data.slug : (id ?? 'blog-image'),
            featuredImageUrl,
          );
          const currentPost =
            isUpdate && id
              ? await this.prisma.blogPost.findUnique({
                  where: { id },
                  select: { featuredImageId: true },
                })
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

      if (isUpdate && id && typeof data.featuredImageAlt === 'string') {
        const currentPost = await this.prisma.blogPost.findUnique({
          where: { id },
          select: { featuredImageId: true },
        });

        if (currentPost?.featuredImageId) {
          await this.prisma.mediaFile.update({
            where: { id: currentPost.featuredImageId },
            data: { altText: data.featuredImageAlt.trim() || null },
          });
        }
      }

      delete data.featuredImageUrl;
      delete data.featuredImageAlt;
    }

    return data;
  }

  private prepareCustomerManagedUpdate(resource: string, payload: Record<string, unknown>) {
    if (resource === 'bookings') {
      if (typeof payload.status !== 'string' || !BOOKING_STATUSES.has(payload.status)) {
        throw new BadRequestException('Booking status is required.');
      }

      return { status: payload.status };
    }

    throw new BadRequestException(`Unsupported customer-managed resource: ${resource}`);
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

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value && typeof value === 'object') {
      const output = { ...(value as Record<string, unknown>) };
      delete output.passwordHash;
      delete output.tokenHash;
      for (const [key, nestedValue] of Object.entries(output)) {
        output[key] = this.sanitize(nestedValue);
      }
      return output;
    }

    return value;
  }

  private async createAuditLog(
    client: unknown,
    input: {
      action: AuditAction;
      resource: string;
      recordId: string;
      user: RequestUser;
      beforeSnapshot: unknown;
      afterSnapshot: unknown;
    },
  ) {
    await (client as typeof this.prisma).adminAuditLog.create({
      data: {
        action: input.action,
        resource: input.resource,
        recordId: input.recordId,
        actorUserId: input.user.sub,
        actorEmail: input.user.email,
        beforeSnapshot: this.toJsonSnapshot(input.beforeSnapshot),
        afterSnapshot: this.toJsonSnapshot(input.afterSnapshot),
      },
    });
  }

  private toJsonSnapshot(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    if (value === null || value === undefined) return Prisma.JsonNull;
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private getSnapshotRecord(value: unknown) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return { ...(value as Record<string, unknown>) };
  }

  private omitReadOnlyRestoreFields(resource: string, value: Record<string, unknown>) {
    const output = { ...value };
    delete output.id;

    for (const field of IMAGE_UPDATE_FIELDS[resource] ?? []) {
      delete output[field];
    }

    return output;
  }
}
