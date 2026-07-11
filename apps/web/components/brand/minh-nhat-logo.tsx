import { cn } from '@/lib/utils';

type MinhNhatLogoMarkProps = {
  className?: string;
  idPrefix?: string;
  title?: string;
};

export function MinhNhatLogoMark({
  className,
  idPrefix = 'minh-nhat-logo',
  title = 'Logo Điện Lạnh Minh Nhật',
}: MinhNhatLogoMarkProps) {
  const bgId = `${idPrefix}-bg`;
  const coldId = `${idPrefix}-cold`;
  const amberId = `${idPrefix}-amber`;

  return (
    <svg
      className={cn('block h-10 w-10 shrink-0', className)}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bgId} x1="10" x2="54" y1="8" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="0.48" stopColor="#0060B8" />
          <stop offset="1" stopColor="#0B172A" />
        </linearGradient>
        <linearGradient id={coldId} x1="14" x2="50" y1="31" y2="51" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CFFAFE" />
          <stop offset="0.5" stopColor="#22D3EE" />
          <stop offset="1" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id={amberId} x1="43" x2="53" y1="14" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="14" fill={`url(#${bgId})`} />
      <path
        d="M13 20.5A6.5 6.5 0 0 1 19.5 14h25A6.5 6.5 0 0 1 51 20.5v7A3.5 3.5 0 0 1 47.5 31h-31a3.5 3.5 0 0 1-3.5-3.5v-7Z"
        fill="#F8FAFC"
      />
      <path d="M19 23.5h22" stroke="#0B172A" strokeLinecap="round" strokeWidth="3" opacity="0.55" />
      <path d="M20 27h16" stroke="#0B172A" strokeLinecap="round" strokeWidth="2" opacity="0.25" />
      <circle cx="45.5" cy="22.5" r="2.5" fill={`url(#${amberId})`} />

      <path
        d="M15.5 49V35.5L24 44l8.5-8.5V49"
        fill="none"
        stroke={`url(#${coldId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.4"
      />
      <path
        d="M38 49V35.5L48.5 49V35.5"
        fill="none"
        stroke="#E0F2FE"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.4"
      />
    </svg>
  );
}
