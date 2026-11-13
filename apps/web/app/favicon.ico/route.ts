import { minhNhatGradient, minhNhatMark } from '@/components/brand/minh-nhat-mark';

const stops = minhNhatGradient.map(({ offset, color }) =>
  `<stop offset="${offset}" stop-color="${color}"/>`,
).join('');
const paths = minhNhatMark.map(({ fill, path }) =>
  `<path fill="${fill === 'gradient' ? 'url(#blue)' : fill}" d="${path}"/>`,
).join('');

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -19 90 90">
  <defs><linearGradient id="blue" x1="0" y1="1" x2="1" y2="0">${stops}</linearGradient></defs>
  ${paths}
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/svg+xml',
    },
  });
}
