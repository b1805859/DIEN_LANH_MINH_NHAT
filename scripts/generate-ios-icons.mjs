import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1e38"/>
      <stop offset="50%" stop-color="#0a1526"/>
      <stop offset="100%" stop-color="#060c18"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.38"/>
      <stop offset="60%" stop-color="#0369a1" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="logoBlue" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.5"/>
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background for App Icon (Apple recommends filling the entire 1024x1024 square without rounding) -->
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>
  <circle cx="512" cy="460" r="420" fill="url(#glow)"/>

  <!-- Subtle Shield/Ring Contour -->
  <circle cx="512" cy="470" r="330" fill="none" stroke="url(#borderGrad)" stroke-width="3" stroke-dasharray="8 12"/>

  <!-- Logo Centered -->
  <!-- Original viewbox: 0 0 82 54. Scale factor ~ 6.8 => width: 557.6, height: 367.2. Center offset: x = (1024 - 557.6)/2 = 233.2, y = (900 - 367.2)/2 = 266.4 -->
  <g transform="translate(233, 260) scale(6.8)" filter="url(#shadow)">
    <path fill="url(#logoBlue)" d="M1 48 25 8Q29 1 34 8L45 26 38 38 29 23 14 48Z" />
    <path
      fill="url(#logoBlue)"
      d="M30 48 47 19 65 48H80V6H69V32L53 7Q48 0 43 8L22 43Z"
    />
    <path fill="#0284c7" d="m3 6 20 33 7-12L16 6Z" />
    <path fill="#7dd3fc" d="m40 34 8-14 18 28H53Z" />
  </g>

  <!-- Subtitle Badge for Admin -->
  <g transform="translate(512, 770)">
    <rect x="-140" y="-24" width="280" height="48" rx="24" fill="#0f2744" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.6"/>
    <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#e0f2fe" letter-spacing="4" text-anchor="middle">ADMIN CMS</text>
  </g>
</svg>
`;

async function generate() {
  const publicIconsDir = path.resolve('apps/web/public/icons');
  await fs.mkdir(publicIconsDir, { recursive: true });

  const svgBuffer = Buffer.from(iconSvg);

  // Generate 1024x1024
  const png1024 = await sharp(svgBuffer).resize(1024, 1024).png().toBuffer();
  // Generate 512x512
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  // Generate 192x192
  const png192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  // Generate 180x180 (Apple Touch Icon for iPhone 13)
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();

  await fs.writeFile(path.join(publicIconsDir, 'icon-512.png'), png512);
  await fs.writeFile(path.join(publicIconsDir, 'icon-192.png'), png192);
  await fs.writeFile(path.join(publicIconsDir, 'apple-touch-icon.png'), png180);
  await fs.writeFile(path.join(publicIconsDir, 'apple-touch-icon-precomposed.png'), png180);

  console.log('Generated Web PWA / Apple Touch Icons successfully.');
  return png1024;
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
