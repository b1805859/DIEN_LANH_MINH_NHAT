import { BadRequestException } from '@nestjs/common';
import { AnalyticsService } from '../src/modules/analytics/analytics.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AnalyticsService', () => {
  const prisma = {
    $queryRaw: jest.fn(),
    websiteDailyMetric: { upsert: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
  };
  let service: AnalyticsService;
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-01T17:30:00Z')); // 00:30 Nov 2 in Vietnam
    jest.resetAllMocks();
    service = new AnalyticsService(prisma as unknown as PrismaService);
    prisma.$queryRaw.mockResolvedValue([{ date: '2026-11-01', count: 3n }]);
    prisma.websiteDailyMetric.findMany.mockResolvedValue([{ date: new Date('2026-11-01T00:00:00Z'), pageViews: 18 }]);
    prisma.websiteDailyMetric.findFirst.mockResolvedValue({ date: new Date('2026-11-01T00:00:00Z'), pageViews: 18 });
  });
  afterEach(() => jest.useRealTimers());

  it('uses Vietnam dates, fills gaps, and distinguishes unavailable view history from measured zero', async () => {
    const result = await service.getTrends('7');
    expect(result.from).toBe('2026-10-27');
    expect(result.to).toBe('2026-11-02');
    expect(result.points).toHaveLength(7);
    expect(result.points[0]).toEqual({ date: '2026-10-27', bookings: 0, pageViews: null });
    expect(result.points[5]).toEqual({ date: '2026-11-01', bookings: 3, pageViews: 18 });
    expect(result.points[6]).toEqual({ date: '2026-11-02', bookings: 0, pageViews: 0 });
    expect(prisma.$queryRaw.mock.calls[0][1]).toEqual(new Date('2026-10-26T17:00:00Z'));
    expect(prisma.$queryRaw.mock.calls[0][2]).toEqual(new Date('2026-11-02T17:00:00Z'));
    expect(() => JSON.stringify(result)).not.toThrow(); // PostgreSQL count bigint is serialized as number
  });

  it('does not invent zero views before tracking has begun', async () => {
    prisma.websiteDailyMetric.findFirst.mockResolvedValue(null);
    prisma.websiteDailyMetric.findMany.mockResolvedValue([]);
    const result = await service.getTrends('30');
    expect(result.trackingStartedAt).toBeNull();
    expect(result.points.every((point) => point.pageViews === null)).toBe(true);
  });

  it.each(['0', '8', '365', '30 OR 1=1', ''])('rejects unsupported range %s', async (days) => {
    await expect(service.getTrends(days)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('increments atomically on the current Vietnam date', async () => {
    await service.recordPageView('/services/sua-may-lanh');
    expect(prisma.websiteDailyMetric.upsert).toHaveBeenCalledWith({
      where: { date: new Date('2026-11-02T00:00:00Z') },
      create: { date: new Date('2026-11-02T00:00:00Z'), pageViews: 1 },
      update: { pageViews: { increment: 1 } },
    });
  });

  it.each(['/admin', '/admin/dashboard', '/api/bookings', '/_next/static/a.js', '//example.com', '/?token=secret', '/page#fragment', '/favicon.ico'])('rejects non-public or identifying path %s', async (path) => {
    await expect(service.recordPageView(path)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.websiteDailyMetric.upsert).not.toHaveBeenCalled();
  });
});
