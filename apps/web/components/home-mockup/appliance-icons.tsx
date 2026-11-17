import React from 'react';

type IconProps = {
  className?: string;
  size?: number | string;
};

/** Solid filled phone handset icon matching header & CTA buttons in the mockup. */
export function SolidPhoneIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.384 17.752a2.108 2.108 0 0 1-.522 2.359l-1.358 1.358c-.855.855-2.062 1.242-3.26.98a19.654 19.654 0 0 1-8.575-4.882 19.654 19.654 0 0 1-4.882-8.575c-.262-1.198.125-2.405.98-3.26L5.125 4.374a2.108 2.108 0 0 1 2.359-.522l3.18 1.363a2.108 2.108 0 0 1 1.213 2.263l-.435 2.175a.9.9 0 0 0 .25.815l3.012 3.012a.9.9 0 0 0 .815.25l2.175-.435a2.108 2.108 0 0 1 2.263 1.213l1.427 3.244Z" />
    </svg>
  );
}

/** Duotone lightning bolt for Hero Commitment 1 ("Phản hồi nhanh"). */
export function HeroBoltIcon({ className, size = 30 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M17.8 3.5 6.5 17.5h8.2l-1.5 11 12.3-14h-8.2l.5-11Z"
        fill="#a3dffa"
        stroke="#0080cc"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Duotone shield with check for Hero Commitment 2 ("Kỹ thuật kinh nghiệm"). */
export function HeroShieldIcon({ className, size = 30 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 3.5 5.5 7.8v7.6c0 6.9 4.5 12.6 10.5 14.4 6-1.8 10.5-7.5 10.5-14.4V7.8L16 3.5Z"
        fill="#bce7fc"
        stroke="#0080cc"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m11.5 16.2 3 3 6.2-6.2"
        stroke="#0074be"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Duotone award badge with ribbon for Hero Commitment 3 ("Bảo hành rõ ràng"). */
export function HeroAwardIcon({ className, size = 30 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="m11.5 20.5-2.3 8.5 6.8-3.2 6.8 3.2-2.3-8.5"
        fill="#9ad9fa"
        stroke="#0080cc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="13" r="8.5" fill="#d0effe" stroke="#0080cc" strokeWidth="2" />
      <circle cx="16" cy="13" r="5.3" fill="#ffffff" stroke="#0080cc" strokeWidth="1.6" />
    </svg>
  );
}

/** Split air conditioner with cool airflow lines (Equipment Picker Tile 1). */
export function AcUnitIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect
        x="5"
        y="11"
        width="38"
        height="17"
        rx="3.5"
        fill="#dcefe"
        fillOpacity="0.85"
        stroke="#0b67b5"
        strokeWidth="2.1"
      />
      <rect x="6.2" y="12.2" width="35.6" height="14.6" rx="2.5" fill="#dff3fe" />
      <path d="M8.5 23h31" stroke="#0b67b5" strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="15.5" width="4.5" height="2" rx="1" fill="#008fe0" />
      <path
        d="M14 31.5 11.5 36M20.5 31.5v5M27.5 31.5v5M34 31.5l2.5 4.5"
        stroke="#0b67b5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Front-loading washing machine icon (Equipment Picker Tile 2). */
export function WasherIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect
        x="10"
        y="6"
        width="28"
        height="36"
        rx="3.5"
        fill="#e5f4fe"
        stroke="#0b67b5"
        strokeWidth="2.1"
      />
      <path d="M10 13.5h28" stroke="#0b67b5" strokeWidth="2" />
      <path d="M14 10h6" stroke="#0b67b5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="31" cy="10" r="1.5" fill="#0b67b5" />
      <circle cx="34.5" cy="10" r="1.5" fill="#008fe0" />
      <circle cx="24" cy="27.5" r="9" fill="#ffffff" stroke="#0b67b5" strokeWidth="2.1" />
      <circle cx="24" cy="27.5" r="6" fill="#ccebfb" stroke="#0b67b5" strokeWidth="1.6" />
      <path
        d="M19.5 27.5c1.5-2 3.2-2 4.5 0s3 2 4.5 0"
        stroke="#0b67b5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Double-door upright refrigerator icon (Equipment Picker Tile 3). */
export function FridgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect
        x="13"
        y="6"
        width="22"
        height="36"
        rx="3.5"
        fill="#e5f4fe"
        stroke="#0b67b5"
        strokeWidth="2.1"
      />
      <path d="M13 19.5h22" stroke="#0b67b5" strokeWidth="2.1" />
      <path
        d="M30.5 11v5M30.5 23.5v7"
        stroke="#0b67b5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="17" y="24" width="4.5" height="6" rx="1" fill="#b8e3fa" stroke="#0b67b5" strokeWidth="1.5" />
    </svg>
  );
}

/** Household plumbing faucet with left spout and falling drop (Equipment Picker Tile 4). */
export function PlumbingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M21 10h12M27 10v6.5"
        stroke="#0b67b5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M39 17.5H20c-4.5 0-7.5 2.8-7.5 7v2.5h6v-1.2c0-1.3.9-2.1 2.3-2.1H39v-6.2Z"
        fill="#dceffe"
        stroke="#0b67b5"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M39 14.5v12" stroke="#0b67b5" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M15.5 31.5c2.2 2.6 3.3 4.6 3.3 6.3a3.3 3.3 0 1 1-6.6 0c0-1.7 1.1-3.7 3.3-6.3Z"
        fill="#bce5fc"
        stroke="#0b67b5"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Hot/cold water dispenser icon (Equipment Picker Tile 5). */
export function WaterDispenserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect
        x="14"
        y="6.5"
        width="20"
        height="35"
        rx="3.5"
        fill="#e5f4fe"
        stroke="#0b67b5"
        strokeWidth="2.1"
      />
      <rect
        x="17.5"
        y="10.5"
        width="13"
        height="11"
        rx="2"
        fill="#ffffff"
        stroke="#0b67b5"
        strokeWidth="1.8"
      />
      <circle cx="24" cy="16" r="2.3" fill="#8fd4fa" stroke="#0b67b5" strokeWidth="1.6" />
      <circle cx="21" cy="26" r="1.4" fill="#0b67b5" />
      <circle cx="27" cy="26" r="1.4" fill="#008fe0" />
      <path d="M14 31h20" stroke="#0b67b5" strokeWidth="2" />
      <path d="M20 35.5h8" stroke="#0b67b5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Wall-mounted hot water heater tank icon (Equipment Picker Tile 6). */
export function WaterHeaterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect
        x="13.5"
        y="7.5"
        width="21"
        height="30"
        rx="4.5"
        fill="#e5f4fe"
        stroke="#0b67b5"
        strokeWidth="2.1"
      />
      <circle cx="24" cy="18.5" r="4.8" fill="#ffffff" stroke="#0b67b5" strokeWidth="2" />
      <circle cx="24" cy="18.5" r="1.6" fill="#008fe0" />
      <circle cx="21" cy="28.5" r="1.3" fill="#0b67b5" />
      <circle cx="27" cy="28.5" r="1.3" fill="#008fe0" />
      <path d="M20 33h8" stroke="#0b67b5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 37.5v3.5M28 37.5v3.5" stroke="#0b67b5" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

/** Step 1 Headset with microphone icon (Quy trình phục vụ). */
export function StepHeadsetIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 18a10 10 0 1 1 20 0"
        stroke="#007cc7"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect
        x="5.5"
        y="16.5"
        width="4.8"
        height="8.5"
        rx="2.4"
        fill="#8ed6fb"
        stroke="#007cc7"
        strokeWidth="2"
      />
      <rect
        x="25.7"
        y="16.5"
        width="4.8"
        height="8.5"
        rx="2.4"
        fill="#8ed6fb"
        stroke="#007cc7"
        strokeWidth="2"
      />
      <path
        d="M28 24.5c0 3-2.5 5-6.5 5H19"
        stroke="#007cc7"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="15" y="27.8" width="4.5" height="3.2" rx="1.6" fill="#007cc7" />
    </svg>
  );
}

/** Step 2 Magnifying glass icon (Quy trình phục vụ). */
export function StepSearchIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <circle
        cx="16"
        cy="16"
        r="8.8"
        fill="#cbeBfd"
        stroke="#007cc7"
        strokeWidth="2.4"
      />
      <path
        d="M12.5 13a4.8 4.8 0 0 1 6.2-1"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m22.5 22.5 6.5 6.5"
        stroke="#007cc7"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Step 3 Crossed wrench and screwdriver icon (Quy trình phục vụ). */
export function CrossedToolsIcon({ className, size = 34 }: IconProps) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M24.8 7.2a5 5 0 0 0-6.3 6.3l-9.6 9.6a2.6 2.6 0 1 0 3.7 3.7l9.6-9.6a5 5 0 0 0 6.3-6.3l-2.7 2.7-2.9-.7-.7-2.9 2.6-2.8Z"
        fill="#8fd6fb"
        stroke="#007cc7"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m10.5 8.2-3 3 3.4 3.4 1.8-1.8 11.4 11.4a2.3 2.3 0 0 0 3.2-3.2L15.9 9.6l1.8-1.8-3.4-3.4-3.8 3.8Z"
        fill="#bce7fc"
        stroke="#007cc7"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Step 4 Shield with checkmark icon (Quy trình phục vụ). */
export function StepShieldIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M18 5.5 7.5 9.8v8c0 7.2 4.5 13 10.5 15 6-2 10.5-7.8 10.5-15v-8L18 5.5Z"
        fill="#cbeBfd"
        stroke="#007cc7"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="m13.2 18.2 3.2 3.2 6.6-6.6"
        stroke="#0074be"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** About Pillar 1: Team of 3 people icon. */
export function AboutTeamIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <circle cx="18" cy="11.5" r="4.2" fill="#9addfc" stroke="#0082d1" strokeWidth="2" />
      <circle cx="9.5" cy="14" r="3.2" fill="#d4effe" stroke="#0082d1" strokeWidth="1.8" />
      <circle cx="26.5" cy="14" r="3.2" fill="#d4effe" stroke="#0082d1" strokeWidth="1.8" />
      <path
        d="M10.5 27.5c0-4 3.4-7 7.5-7s7.5 3 7.5 7"
        fill="#9addfc"
        stroke="#0082d1"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3.8 27.5c0-3.1 2.4-5.5 5.6-5.5M32.2 27.5c0-3.1-2.4-5.5-5.6-5.5"
        stroke="#0082d1"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** About Pillar 2: Faceted diamond icon. */
export function AboutDiamondIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M9.5 7.5h17l5.5 7.5L18 29.5 4 15l5.5-7.5Z"
        fill="#b8e5fc"
        stroke="#0082d1"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M4 15h28M9.5 7.5 13.5 15 18 29.5 22.5 15l4-7.5M13.5 15 18 7.5 22.5 15"
        stroke="#0082d1"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** About Pillar 3: Price tag icon. */
export function AboutPriceTagIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M18.2 5.8H8.5a2.7 2.7 0 0 0-2.7 2.7v9.7c0 .7.3 1.4.8 1.9l11.2 11.2a2.7 2.7 0 0 0 3.8 0l9.7-9.7a2.7 2.7 0 0 0 0-3.8L20.1 6.6a2.7 2.7 0 0 0-1.9-.8Z"
        fill="#a3dffa"
        stroke="#0082d1"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <circle cx="12.5" cy="12.5" r="2.2" fill="#ffffff" stroke="#0082d1" strokeWidth="1.8" />
    </svg>
  );
}

/** About Pillar 4: Support headset icon. */
export function AboutSupportIcon({ className, size = 34 }: IconProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M7.5 18a10.5 10.5 0 1 1 21 0"
        stroke="#0082d1"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="16.5"
        width="5"
        height="9"
        rx="2.5"
        fill="#8ed6fb"
        stroke="#0082d1"
        strokeWidth="2"
      />
      <rect
        x="26"
        y="16.5"
        width="5"
        height="9"
        rx="2.5"
        fill="#8ed6fb"
        stroke="#0082d1"
        strokeWidth="2"
      />
      <path
        d="M28.5 25c0 3-2.5 5-6.5 5h-3"
        stroke="#0082d1"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="30" r="1.8" fill="#0082d1" />
    </svg>
  );
}

/** Pre-footer large speech bubble with 3 dots icon. */
export function PreFooterChatIcon({ className, size = 46 }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M24 6C13.5 6 5 13.4 5 22.5c0 4.2 1.8 8 4.8 10.9L7.5 41l8.5-2.8c2.5.8 5.2 1.3 8 1.3 10.5 0 19-7.4 19-16.5S34.5 6 24 6Z"
        fill="#ffffff"
        stroke="#095ba6"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="22.8" r="2.2" fill="#095ba6" />
      <circle cx="24" cy="22.8" r="2.2" fill="#095ba6" />
      <circle cx="30.5" cy="22.8" r="2.2" fill="#095ba6" />
    </svg>
  );
}

/** Blue speech bubble with 3 white stars for Customer Reviews eyebrow badge. */
export function ReviewBadgeChatStarsIcon({ className, size = 28 }: IconProps) {
  return (
    <svg viewBox="0 0 34 28" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="mnRevBadgeGrad" x1="0" y1="0" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1ea4f7" />
          <stop offset="100%" stopColor="#0077cc" />
        </linearGradient>
      </defs>
      <path
        d="M17 2C8.7 2 2 7.3 2 13.8c0 3.2 1.6 6.1 4.2 8.2L4.5 26.5l5.8-2c2.1.7 4.3 1.1 6.7 1.1 8.3 0 15-5.3 15-11.8S25.3 2 17 2Z"
        fill="url(#mnRevBadgeGrad)"
      />
      {/* 3 white 5-point stars */}
      <path
        d="m9.5 10.2.8 1.7 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.6.9.3-1.9-1.4-1.3 1.9-.3.8-1.7Z"
        fill="#ffffff"
      />
      <path
        d="m17 9.7.9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1-1.5-1.4 2.1-.3.9-1.9Z"
        fill="#ffffff"
      />
      <path
        d="m24.5 10.2.8 1.7 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.6.9.3-1.9-1.4-1.3 1.9-.3.8-1.7Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/** Circular user outline icon for Featured Customer Review card. */
export function ReviewUserCircleIcon({ className, size = 38 }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="18" fill="#d9f0fe" stroke="#0c83d6" strokeWidth="2" />
      <circle cx="20" cy="15.2" r="5.2" fill="#ffffff" stroke="#0c83d6" strokeWidth="2" />
      <path
        d="M10.2 31.5c1.7-4.6 5.3-7.2 9.8-7.2s8.1 2.6 9.8 7.2"
        fill="#9dd9fb"
        stroke="#0c83d6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Solid location pin icon for Customer Reviews district labels. */
export function ReviewPinIcon({ className, size = 13 }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 1.2a5.1 5.1 0 0 0-5.1 5.1c0 3.6 4.4 7.8 4.8 8.2a.5.5 0 0 0 .6 0c.4-.4 4.8-4.6 4.8-8.2A5.1 5.1 0 0 0 8 1.2Z"
        fill="#0b5da2"
      />
      <circle cx="8" cy="6.2" r="2" fill="#ffffff" />
    </svg>
  );
}

/** Gold 5-pointed star for 5.0/5 review ratings. */
export function ReviewStarIcon({ className, size = 18 }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="m10 1.6 2.45 5.08 5.6.8-4.06 3.94.96 5.58L10 14.35 5.05 17l.96-5.58L1.95 7.48l5.6-.8L10 1.6Z"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stylized opening double quotation mark (“) matching the reviews mockup. */
export function ReviewQuoteOpenIcon({ className, size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 28 22" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.6 20.2C3.3 20.2 1.2 17.8 1.2 14.1c0-4.9 3.6-9.6 8.9-12.3l1.7 2.6C8.1 6.4 6.2 9 6 11.4c.5-.2 1.1-.3 1.8-.3 2.7 0 4.6 1.9 4.6 4.5 0 2.7-2.1 4.6-5.8 4.6Zm13.8 0c-3.3 0-5.4-2.4-5.4-6.1 0-4.9 3.6-9.6 8.9-12.3l1.7 2.6c-3.7 2-5.6 4.6-5.8 7 .5-.2 1.1-.3 1.8-.3 2.7 0 4.6 1.9 4.6 4.5 0 2.7-2.1 4.6-5.8 4.6Z"
        fill="#1e94e6"
      />
    </svg>
  );
}

/** Stylized closing double quotation mark (”) matching the reviews mockup. */
export function ReviewQuoteCloseIcon({ className, size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 28 22" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M21.4 1.8c3.3 0 5.4 2.4 5.4 6.1 0 4.9-3.6 9.6-8.9 12.3l-1.7-2.6c3.7-2 5.6-4.6 5.8-7-.5.2-1.1.3-1.8.3-2.7 0-4.6-1.9-4.6-4.5 0-2.7 2.1-4.6 5.8-4.6ZM7.6 1.8c3.3 0 5.4 2.4 5.4 6.1 0 4.9-3.6 9.6-8.9 12.3l-1.7-2.6c3.7-2 5.6-4.6 5.8-7-.5.2-1.1.3-1.8.3-2.7 0-4.6-1.9-4.6-4.5 0-2.7 2.1-4.6 5.8-4.6Z"
        fill="#1e94e6"
      />
    </svg>
  );
}

/** Duotone 4-point sparkles icon for "Vệ sinh máy lạnh" review service pill. */
export function ReviewSparklesIcon({ className, size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} fill="none" aria-hidden="true" className={className}>
      <path
        d="M11.5 3.5 13.8 10l6.5 2.3-6.5 2.3-2.3 6.5-2.3-6.5-6.5-2.3 6.5-2.3 2.3-6.5Z"
        fill="#9ddbfb"
        stroke="#0b77c5"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="11.5" cy="12.3" r="1.6" fill="#ffffff" />
      <path
        d="m21.2 14.2 1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2 1.2-3.4Z"
        fill="#bce7fc"
        stroke="#0b77c5"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
