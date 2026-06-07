import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    const [service, location] = await Promise.all([
      this.prisma.service.findFirst({ where: { OR: [{ id: dto.serviceId }, { slug: dto.serviceId }] } }),
      this.prisma.location.findFirst({
        where: { OR: [{ id: dto.locationId }, { slug: dto.locationId }] },
      }),
    ]);

    if (!service || !location) {
      throw new BadRequestException('Invalid service or district.');
    }

    return this.prisma.booking.create({
      data: {
        address: dto.address,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        notes: dto.notes,
        serviceId: service.id,
        locationId: location.id,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  list(query: { status?: BookingStatus; serviceId?: string; locationId?: string; date?: string }) {
    const dayStart = query.date ? new Date(`${query.date}T00:00:00.000Z`) : null;
    const dayEnd = query.date ? new Date(`${query.date}T23:59:59.999Z`) : null;

    return this.prisma.booking.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.serviceId ? { serviceId: query.serviceId } : {}),
        ...(query.locationId ? { locationId: query.locationId } : {}),
        ...(dayStart && dayEnd ? { scheduledAt: { gte: dayStart, lte: dayEnd } } : {}),
      },
      include: { service: true, location: true },
      orderBy: { scheduledAt: 'desc' },
    });
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
}
