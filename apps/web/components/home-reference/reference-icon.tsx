import type { SVGProps } from 'react';

type IconName = 'cooling' | 'efficient' | 'clean-air' | 'durable' | 'quick' | 'parts';

/** Outline symbols traced as simple geometry to match the supplied reference. */
export function ReferenceIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === 'cooling' && (
        <>
          <circle cx="18" cy="18" r="3" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx="18"
              cy="6.7"
              rx="2.8"
              ry="4.3"
              transform={`rotate(${angle} 18 18)`}
            />
          ))}
        </>
      )}
      {name === 'efficient' && (
        <>
          <path d="M12 25c0-3-6-5-6-12a12 12 0 0 1 24 0c0 7-6 9-6 12l-6 7-6-7Z" />
          <path d="M12 12c0-7 12-7 12 0 0 4-6 8-6 8s-6-4-6-8ZM14 25h8" />
        </>
      )}
      {name === 'clean-air' && (
        <>
          {[
            [18, 7],
            [9, 12],
            [27, 12],
            [8, 23],
            [18, 27],
            [28, 23],
            [18, 17],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y - 5}l4.6 2.5v5L${x} ${y + 5}l-4.6-2.5v-5Z`} />
          ))}
        </>
      )}
      {name === 'durable' && (
        <>
          {[
            [9, 8],
            [19, 7],
            [28, 10],
            [9, 19],
            [19, 18],
            [28, 21],
            [9, 29],
            [19, 28],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y - 4.5}l4.2 2.3v4.5L${x} ${y + 4.5}l-4.2-2.2v-4.5Z`}
            />
          ))}
        </>
      )}
      {name === 'quick' && (
        <>
          <path d="m20 3-11 16h8l-3 14 13-19h-9l2-11Z" />
          <path d="m11 4-5 4-3 12 5 7M26 5l6 8-1 12-4 6" />
          <circle cx="28" cy="26" r="2.5" />
          <path d="m25 33 1-4 4 1 1 4" />
        </>
      )}
      {name === 'parts' && (
        <>
          <path d="m18 2 13 6-2 16-11 10L7 24 5 8 18 2Z" />
          <path d="m18 10 3 2 3 1 1 4-1 4-3 1-3 2-3-2-3-1-1-4 1-4 3-1 3-2Z" />
          <circle cx="18" cy="17" r="3" />
        </>
      )}
    </svg>
  );
}
