// Pass the original seven-panel mockup path as the first argument.
import sharp from 'sharp';
import { chromium } from '@playwright/test';
const reference = process.argv[2];
if (!reference)
  throw new Error('Usage: node apps/web/scripts/mockup-compare.mjs /absolute/path/mockup.png');
const panels = [
  ['home', '/', { left: 15, top: 25, width: 488, height: 641 }],
  ['service', '/services/sua-tu-lanh', { left: 524, top: 25, width: 494, height: 610 }],
  ['booking', '/booking', { left: 1033, top: 25, width: 489, height: 557 }],
  ['about', '/about', { left: 15, top: 691, width: 488, height: 317 }],
  ['contact', '/contact', { left: 524, top: 663, width: 533, height: 348 }],
  ['mobile', '/', { left: 1135, top: 628, width: 147, height: 371 }],
  ['menu', '/', { left: 1345, top: 631, width: 153, height: 367 }],
];
const browser = await chromium.launch({
  headless: true,
  ...(process.platform === 'darwin'
    ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }
    : {}),
});
for (const [name, route, rect] of panels) {
  const mobile = ['mobile', 'menu'].includes(name);
  const page = await browser.newPage({
    viewport: { width: mobile ? 390 : 1280, height: mobile ? 844 : 1000 },
  });
  await page.goto((process.env.QA_BASE_URL || 'http://localhost:3000') + route);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((i) => i.getClientRects().length)
        .map((i) => i.decode().catch(() => {})),
    );
  });
  if (name === 'menu') await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
  const height = mobile
    ? 844
    : Math.ceil(
        await page
          .locator('.mock-footer')
          .evaluate((el) => el.getBoundingClientRect().bottom + scrollY),
      );
  if (name === 'contact') await page.waitForTimeout(3500);
  const screenshot = await page.screenshot({ fullPage: true });
  const shotMeta = await sharp(screenshot).metadata();
  const width = mobile ? 390 : 600;
  const original = await sharp(reference).extract(rect).resize({ width }).png().toBuffer();
  const actual = await sharp(screenshot)
    .extract({
      left: 0,
      top: 0,
      width: mobile ? 390 : 1280,
      height: Math.min(height, shotMeta.height),
    })
    .resize({ width })
    .png()
    .toBuffer();
  const a = await sharp(original).metadata(),
    b = await sharp(actual).metadata();
  await sharp({
    create: {
      width: width * 2 + 24,
      height: Math.max(a.height, b.height) + 36,
      channels: 3,
      background: '#e7f4f8',
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${width * 2 + 24}" height="36"><text x="12" y="24" font-size="16">REFERENCE</text><text x="${width + 36}" y="24" font-size="16">IMPLEMENTATION</text></svg>`,
        ),
        top: 0,
        left: 0,
      },
      { input: original, top: 36, left: 0 },
      { input: actual, top: 36, left: width + 24 },
    ])
    .png()
    .toFile(`output/visual-qa/compare-${name}.png`);
  await page.close();
}
await browser.close();
