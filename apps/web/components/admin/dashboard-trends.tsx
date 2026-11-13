'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Eye, RefreshCw, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import styles from './dashboard-trends.module.css';

type Point = { date: string; bookings: number; pageViews: number | null };
export type TrendData = {
  days: number;
  timeZone: string;
  from: string;
  to: string;
  trackingStartedAt: string | null;
  points: Point[];
};
const number = new Intl.NumberFormat('vi-VN');
const dateLabel = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;

export function DashboardTrends({ token }: { token: string }) {
  const [days, setDays] = useState(30);
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['admin-trends', days],
    queryFn: async () =>
      (
        await apiClient.get<TrendData>(`/admin/analytics/trends?days=${days}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data,
    staleTime: 60_000,
  });
  return (
    <section
      className={`${styles.section} mn-admin-glass-panel`}
      aria-labelledby="admin-trends-title"
    >
      <div className={styles.heading}>
        <div>
          <h2 id="admin-trends-title">
            <TrendingUp size={22} aria-hidden="true" /> Xu hướng hoạt động
          </h2>
          <p>Lượt đặt lịch mới và lượt xem website theo ngày · giờ Việt Nam</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.periods} role="group" aria-label="Khoảng thời gian thống kê">
            {[7, 30, 90].map((period) => (
              <button
                type="button"
                key={period}
                aria-pressed={days === period}
                onClick={() => setDays(period)}
              >
                {period} ngày
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.refresh}
            aria-label="Làm mới biểu đồ"
            disabled={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      {isPending ? (
        <p className={styles.message} role="status">
          Đang tải số liệu xu hướng…
        </p>
      ) : isError || !data ? (
        <div className={styles.error} role="alert">
          Không tải được dữ liệu biểu đồ.{' '}
          <button type="button" onClick={() => refetch()}>
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <p className={styles.range}>
            {dateLabel(data.from)}/{data.from.slice(0, 4)} – {dateLabel(data.to)}/
            {data.to.slice(0, 4)}
          </p>
          <div className={styles.charts}>
            <TrendLine
              key={`bookings-${days}`}
              title="Lượt đặt lịch"
              metric="bookings"
              points={data.points}
            />
            <TrendLine
              key={`views-${days}`}
              title="Lượt xem website"
              metric="pageViews"
              points={data.points}
            />
          </div>
          <p className={styles.note}>
            Lịch hẹn tính theo ngày gửi yêu cầu, gồm mọi trạng thái. Lượt xem tính mỗi lần mở trang
            hoặc chuyển trang công khai, không gồm admin và môi trường phát triển.{' '}
            {data.trackingStartedAt
              ? `Dữ liệu lượt xem bắt đầu từ ${dateLabel(data.trackingStartedAt)}/${data.trackingStartedAt.slice(0, 4)}; các ngày trước đó chưa có dữ liệu.`
              : 'Chưa ghi nhận lượt xem; số liệu sẽ bắt đầu khi website chính thức có truy cập.'}
          </p>
          <details className={styles.tableDetails}>
            <summary>Xem bảng số liệu theo ngày</summary>
            <div className={styles.tableScroll}>
              <table>
                <caption>Số liệu xu hướng {days} ngày (giờ Việt Nam)</caption>
                <thead>
                  <tr>
                    <th scope="col">Ngày</th>
                    <th scope="col">Lượt đặt lịch</th>
                    <th scope="col">Lượt xem website</th>
                  </tr>
                </thead>
                <tbody>
                  {data.points.map((point) => (
                    <tr key={point.date}>
                      <th scope="row">
                        {dateLabel(point.date)}/{point.date.slice(0, 4)}
                      </th>
                      <td>{number.format(point.bookings)}</td>
                      <td>
                        {point.pageViews === null
                          ? 'Chưa ghi nhận'
                          : number.format(point.pageViews)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

function TrendLine({
  title,
  metric,
  points,
}: {
  title: string;
  metric: 'bookings' | 'pageViews';
  points: Point[];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(520);
  const [active, setActive] = useState(points.length - 1);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, entry.contentRect.width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const values = points.map((point) => point[metric]);
  const measured = values.filter((value): value is number => value !== null);
  const total = measured.reduce((sum, value) => sum + value, 0);
  const peak = Math.max(1, ...measured);
  const magnitude = 10 ** Math.floor(Math.log10(peak / 4));
  const step = Math.max(
    1,
    [1, 2, 5, 10].find((factor) => factor * magnitude >= peak / 4)! * magnitude,
  );
  const max = Math.ceil(peak / step) * step;
  const left = 38,
    right = width - 12,
    top = 14,
    bottom = 184;
  const x = (index: number) => left + (index / Math.max(1, points.length - 1)) * (right - left);
  const y = (value: number) => bottom - (value / max) * (bottom - top);
  const segments: string[][] = [];
  values.forEach((value, index) => {
    if (value === null) return;
    if (index === 0 || values[index - 1] === null) segments.push([]);
    segments[segments.length - 1].push(`${x(index)},${y(value)}`);
  });
  const selected = points[Math.max(0, Math.min(points.length - 1, active))];
  const tickCount = Math.min(5, max / step + 1);
  const ticks = Array.from({ length: tickCount }, (_, index) =>
    Math.round((index * max) / Math.max(1, tickCount - 1)),
  );
  const labelIndices = [...new Set([0, Math.round((points.length - 1) / 2), points.length - 1])];
  const Icon = metric === 'bookings' ? CalendarDays : Eye;
  return (
    <article className={styles.card} data-metric={metric}>
      <div className={styles.cardHeading}>
        <h3>
          <Icon size={18} aria-hidden="true" />
          {title}
        </h3>
        <span>Tổng trong kỳ</span>
      </div>
      <p className={styles.total}>
        {measured.length ? number.format(total) : '—'} <small>lượt</small>
      </p>
      <p className={styles.readout}>
        {selected
          ? `${dateLabel(selected.date)}: ${selected[metric] === null ? 'Chưa ghi nhận' : `${number.format(selected[metric]!)} lượt`}`
          : 'Chưa có dữ liệu'}
      </p>
      <div
        ref={container}
        className={styles.plot}
        tabIndex={0}
        role="group"
        aria-label={`Biểu đồ đường ${title.toLowerCase()}. Dùng phím mũi tên trái và phải để xem từng ngày.`}
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          setActive((index) =>
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? points.length - 1
                : Math.max(
                    0,
                    Math.min(points.length - 1, index + (event.key === 'ArrowLeft' ? -1 : 1)),
                  ),
          );
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setActive(
            Math.max(
              0,
              Math.min(
                points.length - 1,
                Math.round(
                  ((((event.clientX - rect.left) / rect.width) * width - left) / (right - left)) *
                    (points.length - 1),
                ),
              ),
            ),
          );
        }}
      >
        <svg viewBox={`0 0 ${width} 216`} width="100%" height="216" aria-hidden="true">
          {ticks.map((tick) => (
            <g key={tick}>
              <line className={styles.gridLine} x1={left} x2={right} y1={y(tick)} y2={y(tick)} />
              <text className={styles.axisLabel} x={left - 8} y={y(tick) + 4} textAnchor="end">
                {number.format(tick)}
              </text>
            </g>
          ))}
          {labelIndices.map((index) => (
            <text
              key={index}
              className={styles.axisLabel}
              x={x(index)}
              y="207"
              textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
            >
              {dateLabel(points[index].date)}
            </text>
          ))}
          {segments.map((segment, index) => (
            <polyline key={index} className={styles.line} points={segment.join(' ')} />
          ))}
          {values.map((value, index) =>
            value !== null && (points.length <= 30 || index === active) ? (
              <circle
                key={index}
                className={styles.point}
                cx={x(index)}
                cy={y(value)}
                r={index === active ? 4.5 : 2.5}
              />
            ) : null,
          )}
          {selected && selected[metric] !== null && (
            <line className={styles.cursor} x1={x(active)} x2={x(active)} y1={top} y2={bottom} />
          )}
        </svg>
        {!measured.length && <span className={styles.noData}>Chưa ghi nhận lượt xem</span>}
      </div>
      {measured.length > 0 && total === 0 && (
        <p className={styles.empty}>Chưa có {title.toLowerCase()} trong giai đoạn này.</p>
      )}
    </article>
  );
}
