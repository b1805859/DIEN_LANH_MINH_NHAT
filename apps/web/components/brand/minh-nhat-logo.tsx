import { cn } from '@/lib/utils';
import { minhNhatGradient, minhNhatMark } from './minh-nhat-mark';
export function MinhNhatLogoMark({
  className,
  idPrefix = 'minh-nhat-logo',
  title = 'Logo Điện Lạnh Minh Nhật',
}: {
  className?: string;
  idPrefix?: string;
  title?: string;
}) {
  return (
    <svg
      className={cn('brand-mark', className)}
      viewBox="0 0 82 54"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${idPrefix}-blue`} x1="0" y1="1" x2="1" y2="0">
          {minhNhatGradient.map(({ offset, color }) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      {minhNhatMark.map(({ fill, path }) => (
        <path key={path} fill={fill === 'gradient' ? `url(#${idPrefix}-blue)` : fill} d={path} />
      ))}
    </svg>
  );
}
