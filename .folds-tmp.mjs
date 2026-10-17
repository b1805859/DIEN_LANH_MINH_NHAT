import { chromium } from 'playwright';
const OUT = '/Users/macbookprom1/.gemini/antigravity/brain/29ebdbb4-df9d-4b4f-8f0f-37501a9de52d/scratch/shots/crops';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const shots = [
  ['home-d-fold', '/', { width: 1440, height: 900 }, 0],
  ['home-d-1366', '/', { width: 1366, height: 768 }, 0],
  ['home-m-fold', '/', { width: 390, height: 844 }, 0],
  ['home-m-hero2', '/', { width: 390, height: 844 }, 500],
  ['booking-d', '/booking', { width: 1440, height: 900 }, 0],
  ['booking-m', '/booking', { width: 390, height: 844 }, 350],
  ['svc-d', '/services/sua-may-lanh', { width: 1440, height: 900 }, 0],
  ['svc-d2', '/services/sua-may-lanh', { width: 1440, height: 900 }, 800],
  ['svc-m', '/services/sua-may-lanh', { width: 390, height: 844 }, 0],
  ['services-d', '/services', { width: 1440, height: 900 }, 0],
  ['blog-d', '/blog', { width: 1440, height: 900 }, 0],
  ['about-d', '/about', { width: 1440, height: 900 }, 0],
];
for (const [name, path, vp, y] of shots) { console.log(name);
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: vp.width < 500 ? 2 : 1, reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000' + path, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(async (y) => {
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    await document.fonts.ready;
    window.scrollTo(0, y);
  }, y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png`, animations: 'disabled' });
  await page.close();
}
// mobile menu open
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await m.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 60000 });
await m.click('.mn-menu-button');
await m.waitForTimeout(500);
await m.screenshot({ path: `${OUT}/menu-m.png` });
// chat open
await m.keyboard.press('Escape');
await m.waitForTimeout(300);
await m.click('.ai-chat-action');
await m.waitForTimeout(500);
await m.screenshot({ path: `${OUT}/chat-m.png` });
await browser.close();
console.log('done');
