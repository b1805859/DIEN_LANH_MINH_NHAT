import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });

const viewports = [
  { name: 'mobile-320', width: 320, height: 600, isMobile: true, hasTouch: true },
  { name: 'mobile-375', width: 375, height: 667, isMobile: true, hasTouch: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'tablet-820', width: 820, height: 1180, isMobile: true, hasTouch: true },
];

const routes = [
  '/',
  '/services',
  '/services/sua-may-lanh',
  '/contact',
  '/about',
  '/blog',
  '/areas/ninh-kieu',
];

await fs.mkdir('output/responsive-audit', { recursive: true });

const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const route of routes) {
    try {
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(600);

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const winWidth = window.innerWidth;
        const hasOverflow = doc.scrollWidth > winWidth || body.scrollWidth > winWidth;
        
        // Find specific elements causing overflow
        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1 || rect.left < -1) {
            // Check if element is hidden or zero size
            if (rect.width > 0 && rect.height > 0) {
              const style = window.getComputedStyle(el);
              if (style.overflow !== 'hidden' && style.display !== 'none' && style.visibility !== 'hidden') {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className?.toString?.().slice(0, 50) || '',
                  id: el.id,
                  rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
                });
              }
            }
          }
        }
        return {
          hasOverflow,
          scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
          innerWidth: winWidth,
          overflowingCount: overflowingElements.length,
          overflowingElements: overflowingElements.slice(0, 5),
        };
      });

      // Capture screenshot for inspection
      const filename = `${vp.name}-${route.replaceAll('/', '--') || 'home'}.png`;
      await page.screenshot({ path: `output/responsive-audit/${filename}`, fullPage: false });

      results.push({
        viewport: vp.name,
        width: vp.width,
        route,
        overflow,
        screenshot: filename,
      });
    } catch (err) {
      results.push({
        viewport: vp.name,
        width: vp.width,
        route,
        error: err.message,
      });
    }
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
