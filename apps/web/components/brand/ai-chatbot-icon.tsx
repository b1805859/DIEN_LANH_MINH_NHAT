import { cn } from '@/lib/utils';

type AiChatbotIconProps = {
  className?: string;
  idPrefix?: string;
  title?: string;
};

export function AiChatbotIcon({
  className,
  idPrefix = 'ai-chatbot-icon',
  title = 'AI tư vấn Điện Lạnh Minh Nhật',
}: AiChatbotIconProps) {
  const bgId = `${idPrefix}-bg`;
  const faceId = `${idPrefix}-face`;
  const lensId = `${idPrefix}-lens`;

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
          <stop stopColor="#22D3EE" />
          <stop offset="0.5" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id={faceId} x1="19" x2="45" y1="23" y2="47" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFEFF" />
          <stop offset="1" stopColor="#BAE6FD" />
        </linearGradient>
        <linearGradient id={lensId} x1="24" x2="40" y1="31" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="18" fill="#0B172A" />
      <circle cx="32" cy="32" r="23.5" fill={`url(#${bgId})`} />
      <path
        d="M19 22c3.1-3.6 7.7-5.9 13-5.9 4.3 0 8.2 1.5 11.3 4.1"
        fill="none"
        stroke="#CFFAFE"
        strokeLinecap="round"
        strokeWidth="3"
        opacity="0.75"
      />

      <path
        d="M21 31c0-5.5 4.5-10 10-10h3c5.5 0 10 4.5 10 10v6.4c0 5.2-4.2 9.4-9.4 9.4h-4.2c-5.2 0-9.4-4.2-9.4-9.4V31Z"
        fill={`url(#${faceId})`}
      />
      <path d="M32.5 16.8v5" stroke="#E0F2FE" strokeLinecap="round" strokeWidth="3" />
      <circle cx="32.5" cy="15.3" r="2.5" fill="#FDE68A" />

      <rect x="24.5" y="30.5" width="16" height="8" rx="4" fill={`url(#${lensId})`} />
      <circle cx="29" cy="34.5" r="1.5" fill="#67E8F9" />
      <circle cx="36" cy="34.5" r="1.5" fill="#67E8F9" />
      <path d="M29.5 41.5h6" stroke="#0284C7" strokeLinecap="round" strokeWidth="2" />

      <path
        d="M45.5 16.5v8M41.5 20.5h8M42.6 17.6l5.8 5.8M48.4 17.6l-5.8 5.8"
        fill="none"
        stroke="#F8FAFC"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path d="M45.5 16.5v8M41.5 20.5h8" stroke="#22D3EE" strokeLinecap="round" strokeWidth="1.1" />

      <path d="M16.5 49.5h31" fill="none" stroke="#FACC15" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}
