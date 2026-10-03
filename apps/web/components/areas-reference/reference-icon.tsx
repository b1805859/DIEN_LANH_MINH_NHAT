import type { SVGProps } from 'react';

/** Solid people and the double price tag visible in the supplied mockup. */
export function AreasReferenceIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: 'people' | 'tag' }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === 'people' ? (
        <g fill="currentColor" stroke="none">
          <circle cx="14" cy="8" r="4" />
          <circle cx="4.5" cy="9" r="3" />
          <circle cx="23.5" cy="9" r="3" />
          <path d="M7 23v-4a7 7 0 0 1 14 0v4H7ZM1 22v-4a5 5 0 0 1 6-4.9 9 9 0 0 0-2 5.9v3H1ZM27 22h-4v-3a9 9 0 0 0-2-5.9 5 5 0 0 1 6 4.9v4Z" />
        </g>
      ) : (
        <>
          <path d="m4 15 11-11 10-1-1 10-11 11-9-9Z" />
          <path d="m7 18-5-5L13 2h8M10 15l7-7M13 18l7-7" />
          <circle cx="20.5" cy="6.5" r="1" />
        </>
      )}
    </svg>
  );
}
