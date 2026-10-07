import React from 'react';

/**
 * Clean 3-blade cooling propeller icon matching the CoolFix design from the video.
 */
export function CoolFixPropeller({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3 aerodynamic cooling blades radiating at 0°, 120°, 240° */}
      <g transform="translate(16, 16)">
        {[0, 120, 240].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M-3.5 -5.5 C-3.5 -10, -0.5 -13.5, 3.5 -13 C5.5 -8, 2.5 -4, 0 -2.5 Z"
              fill="currentColor"
            />
            <circle cx="0" cy="-8.5" r="3.2" fill="currentColor" />
          </g>
        ))}
        <circle cx="0" cy="0" r="2.4" fill="currentColor" opacity="0.9" />
      </g>
    </svg>
  );
}
