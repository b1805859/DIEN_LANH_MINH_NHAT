import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { addDays, dateKeyInTimeZone, toUtcDate } from '../../common/utils/date';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async recordPageView(path: string) {
    // Never include admin/API/static-resource traffic in public website totals.
    if (
      !path.startsWith('/') ||
      path.startsWith('//') ||
      /[?#\\]/.test(path) ||
      /^\/(admin|api|_next)(\/|$)/i.test(path) ||
      /\.[a-z0-9]{2,8}$/i.test(path)
    ) {
      throw new BadRequestException('Only public page paths can be counted.');
    }
    const date = toUtcDate(dateKeyInTimeZone());
    await this.prisma.websiteDailyMetric.upsert({
      where: { date },
      create: { date, pageViews: 1 },
      update: { pageViews: { increment: 1 } },
    });
  }

  async getTrends(daysParam = '30') {
    if (!['7', '30', '90'].includes(daysParam)) {
      throw new BadRequestException('days must be 7, 30 or 90.');
    }
    const days = Number(daysParam);
    const today = dateKeyInTimeZone();
    const from = addDays(today, 1 - days);
    // Prisma timestamps are stored as UTC without a PostgreSQL time-zone suffix.
    const start = new Date(`${from}T00:00:00+07:00`);
    const end = new Date(`${addDays(today, 1)}T00:00:00+07:00`);
    const [bookings, views, firstMetric] = await Promise.all([
      this.prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
        SELECT (("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Ho_Chi_Minh')::date::text AS date,
               COUNT(*) AS count
        FROM "bookings"
        WHERE "createdAt" >= (${start}::timestamptz AT TIME ZONE 'UTC')
          AND "createdAt" < (${end}::timestamptz AT TIME ZONE 'UTC')
        GROUP BY 1 ORDER BY 1
      `,
      this.prisma.websiteDailyMetric.findMany({
        where: { date: { gte: toUtcDate(from), lte: toUtcDate(today) } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.websiteDailyMetric.findFirst({ orderBy: { date: 'asc' } }),
    ]);
    const bookingCounts = new Map(bookings.map((item) => [item.date, Number(item.count)]));
    const viewCounts = new Map(
      views.map((item) => [item.date.toISOString().slice(0, 10), item.pageViews]),
    );
    const trackingStartedAt = firstMetric?.date.toISOString().slice(0, 10) ?? null;
    const points = Array.from({ length: days }, (_, index) => {
      const date = addDays(from, index);
      return {
        date,
        bookings: bookingCounts.get(date) ?? 0,
        // Unknown history must not be displayed as zero measured visits.
        pageViews:
          trackingStartedAt && date >= trackingStartedAt ? (viewCounts.get(date) ?? 0) : null,
      };
    });
    return { days, timeZone: 'Asia/Ho_Chi_Minh', from, to: today, trackingStartedAt, points };
  }
}
