import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { addDays, dateKeyInTimeZone, inclusiveDayCount, toUtcDate } from '../../common/utils/date';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ScheduleQueryDto } from './dto/schedule-query.dto';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const BOOKING_STATUSES = Object.values(BookingStatus);
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    if (dto.scheduledDate) this.validateBookingDate(dto.scheduledDate);

    const [service, location] = await Promise.all([
      this.prisma.service.findFirst({
        where: { OR: [{ id: dto.serviceId }, { slug: dto.serviceId }] },
      }),
      dto.locationId
        ? this.prisma.location.findFirst({
            where: { OR: [{ id: dto.locationId }, { slug: dto.locationId }] },
          })
        : Promise.resolve(null),
    ]);

    if (!service || (dto.locationId && !location)) {
      throw new BadRequestException('Invalid service or district.');
    }

    const booking = await this.prisma.booking.create({
      data: {
        address: dto.address,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        notes: dto.notes,
        serviceId: service.id,
        locationId: location?.id ?? null,
        scheduledDate: dto.scheduledDate ? toUtcDate(dto.scheduledDate) : null,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return { success: true, ...booking };
  }

  list(query: { status?: BookingStatus; serviceId?: string; locationId?: string; date?: string }) {
    const scheduledDate = query.date ? new Date(`${query.date}T00:00:00.000Z`) : null;

    return this.prisma.booking.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.serviceId ? { serviceId: query.serviceId } : {}),
        ...(query.locationId ? { locationId: query.locationId } : {}),
        ...(scheduledDate ? { scheduledDate } : {}),
      },
      include: { service: true, location: true },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async getSchedule(query: ScheduleQueryDto) {
    this.validateScheduleRange(query.from, query.to);

    const bookings = await this.prisma.booking.findMany({
      where: {
        scheduledDate: {
          gte: toUtcDate(query.from),
          lte: toUtcDate(query.to),
        },
      },
      include: { service: true, location: true },
      orderBy: [{ scheduledDate: 'asc' }, { createdAt: 'desc' }],
    });

    const dayMap = new Map<
      string,
      {
        date: string;
        activeCount: number;
        cancelledCount: number;
        statusCounts: Record<BookingStatus, number>;
      }
    >();

    for (const booking of bookings) {
      if (!booking.scheduledDate) continue;
      const date = booking.scheduledDate.toISOString().slice(0, 10);
      const day = dayMap.get(date) ?? {
        date,
        activeCount: 0,
        cancelledCount: 0,
        statusCounts: Object.fromEntries(BOOKING_STATUSES.map((status) => [status, 0])) as Record<
          BookingStatus,
          number
        >,
      };

      day.statusCounts[booking.status] += 1;
      if (booking.status === BookingStatus.CANCELLED) {
        day.cancelledCount += 1;
      } else {
        day.activeCount += 1;
      }
      dayMap.set(date, day);
    }

    return {
      from: query.from,
      to: query.to,
      days: [...dayMap.values()],
      bookings,
    };
  }

  get(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { service: true, location: true },
    });
  }

  async updateStatus(id: string, nextStatus: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new BadRequestException('Booking not found.');
    }

    if (!ALLOWED_TRANSITIONS[booking.status].includes(nextStatus)) {
      throw new BadRequestException(`Cannot move booking from ${booking.status} to ${nextStatus}.`);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: nextStatus },
    });
  }

  private validateBookingDate(scheduledDate: string) {
    if (
      !DATE_KEY_PATTERN.test(scheduledDate) ||
      toUtcDate(scheduledDate).toISOString().slice(0, 10) !== scheduledDate
    ) {
      throw new BadRequestException('Scheduled date is invalid.');
    }

    if (scheduledDate < dateKeyInTimeZone()) {
      throw new BadRequestException('Scheduled date cannot be in the past.');
    }
  }

  private validateScheduleRange(from: string, to: string) {
    if (!DATE_KEY_PATTERN.test(from) || !DATE_KEY_PATTERN.test(to)) {
      throw new BadRequestException('Schedule dates must use YYYY-MM-DD format.');
    }

    if (
      toUtcDate(from).toISOString().slice(0, 10) !== from ||
      toUtcDate(to).toISOString().slice(0, 10) !== to
    ) {
      throw new BadRequestException('Schedule dates are invalid.');
    }

    const dayCount = inclusiveDayCount(from, to);
    if (!Number.isFinite(dayCount) || dayCount < 1) {
      throw new BadRequestException('Schedule range is invalid.');
    }

    if (dayCount > 62) {
      throw new BadRequestException('Schedule range cannot exceed 62 days.');
    }

    if (addDays(from, dayCount - 1) !== to) {
      throw new BadRequestException('Schedule dates are invalid.');
    }
  }
}
