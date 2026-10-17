import type { CSSProperties } from 'react';
import styles from './hero.module.css';

// Photo coordinates: the actual outlet runs from (1040, 229) to (1310, 187).
// Curves cross the empty wall above the family, then dip below the copy.
// Smooth cubic joins avoid corners as the airflow spreads away from the outlet.
const ribbons = [
  'M1040 229 C1000 365 735 380 395 555 S-310 1000 -1520 915',
  'M1108 219 C1068 360 765 365 415 528 S-325 970 -1520 886',
  'M1176 209 C1136 355 795 350 435 501 S-340 940 -1520 857',
  'M1244 199 C1204 350 825 335 455 474 S-355 910 -1520 828',
  'M1310 187 C1270 345 855 320 475 447 S-370 880 -1520 800',
];

const leaves = [
  { x: -850, y: 875, scale: 1.05, angle: -17 },
  { x: -570, y: 870, scale: 1.65, angle: -28 },
  { x: -300, y: 870, scale: 1.12, angle: -43 },
  { x: -505, y: 620, scale: 1.08, angle: 27 },
  { x: -245, y: 610, scale: 1.16, angle: -35 },
  { x: -25, y: 590, scale: 1.05, angle: -22 },
  { x: 80, y: 475, scale: 0.85, angle: -30 },
  { x: 220, y: 430, scale: 1, angle: 15 },
  { x: 395, y: 398, scale: 0.8, angle: -24 },
];

export function HeroAirflow() {
  return (
    <svg
      className={styles.airflow}
      viewBox="0 0 1536 1024"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="home-airflow-ribbon"
          x1="1220"
          y1="210"
          x2="-1520"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#effcff" stopOpacity=".85" />
          <stop offset=".16" stopColor="#a8edff" stopOpacity=".75" />
          <stop offset=".42" stopColor="#64d2ff" stopOpacity=".58" />
          <stop offset=".68" stopColor="#399def" stopOpacity=".35" />
          <stop offset=".9" stopColor="#477ecc" stopOpacity=".1" />
          <stop offset="1" stopColor="#477ecc" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="home-airflow-mist"
          x1="1200"
          y1="220"
          x2="-1450"
          y2="900"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e4f8ff" stopOpacity=".11" />
          <stop offset=".35" stopColor="#a4e6ff" stopOpacity=".065" />
          <stop offset=".7" stopColor="#69b8f1" stopOpacity=".025" />
          <stop offset="1" stopColor="#69b8f1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="home-airflow-leaf"
          x1="-18"
          y1="-10"
          x2="18"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b1de37" />
          <stop offset=".45" stopColor="#75bb22" />
          <stop offset="1" stopColor="#2d7d20" />
        </linearGradient>
        <filter
          id="home-airflow-soft"
          x="-5%"
          y="-15%"
          width="110%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <path
        className={styles.airflowMist}
        d="M1040 229 C1000 365 735 380 395 555 S-310 1000 -1520 915 L-1520 800 C-370 880 95 574 475 447 S1270 345 1310 187Z"
        fill="url(#home-airflow-mist)"
      />
      <g fill="none" stroke="url(#home-airflow-ribbon)" strokeLinecap="round">
        <g className={styles.airflowGlow} filter="url(#home-airflow-soft)" strokeWidth="9">
          {ribbons.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className={styles.airflowRibbons}>
          {ribbons.map((d, index) => (
            <path
              key={d}
              d={d}
              strokeWidth={index % 2 === 0 ? 1.1 : 0.8}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g className={styles.airflowHighlights}>
          {ribbons
            .filter((_, index) => index % 2 === 0)
            .map((d, index) => (
              <path
                key={d}
                d={d}
                pathLength="1000"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
                style={
                  {
                    '--stream-delay': `${index * -6.7}s`,
                    '--stream-duration': `${17 + index * 3}s`,
                  } as CSSProperties
                }
              />
            ))}
        </g>
      </g>
      <g className={styles.airflowLeaves}>
        {leaves.map(({ x, y, scale, angle }, index) => (
          <g key={x} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
            <g
              className={styles.airflowLeaf}
              style={{ '--leaf-delay': `${index * -0.83}s` } as CSSProperties}
            >
              <path d="M-21 5C-11-12 8-15 22-8C16 7-4 15-21 5Z" fill="url(#home-airflow-leaf)" />
              <path
                d="M-18 5Q0 0 18-7"
                fill="none"
                stroke="#c0e35b"
                strokeOpacity=".55"
                strokeWidth="1"
              />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
