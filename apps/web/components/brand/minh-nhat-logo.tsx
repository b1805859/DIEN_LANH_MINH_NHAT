import { cn } from '@/lib/utils';
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
          <stop stopColor="#0874df" />
          <stop offset=".55" stopColor="#26bfff" />
          <stop offset="1" stopColor="#a0f0ff" />
        </linearGradient>
      </defs>
      <path fill={`url(#${idPrefix}-blue)`} d="M1 48 25 8Q29 1 34 8L45 26 38 38 29 23 14 48Z" />
      <path
        fill={`url(#${idPrefix}-blue)`}
        d="M30 48 47 19 65 48H80V6H69V32L53 7Q48 0 43 8L22 43Z"
      />
      <path fill="#066cc4" d="m3 6 20 33 7-12L16 6Z" />
      <path fill="#55d5ff" d="m40 34 8-14 18 28H53Z" />
    </svg>
  );
}
