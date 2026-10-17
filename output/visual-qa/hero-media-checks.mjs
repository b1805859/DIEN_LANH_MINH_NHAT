import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
try {
  for (const failure of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const exceptions = [];
    page.on('pageerror', (error) => exceptions.push(error.message));
    await page.addInitScript(() => {
      window.heroQaMetrics = { cls: 0, lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            !entry.hadRecentInput &&
            entry.sources?.some((source) => source.node?.closest?.('.mn-hero-carousel'))
          )
            window.heroQaMetrics.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        window.heroQaMetrics.lcp = list.getEntries().at(-1)?.startTime || 0;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.route('**/_next/image?*', async (route) => {
      if (!route.request().url().includes('carousel-home-visits-album')) return route.continue();
      if (failure) return route.abort('failed');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return route.continue();
    });
    await page.goto(process.env.HERO_QA_URL || 'http://127.0.0.1:3001', {
      waitUntil: 'networkidle',
    });
    const hero = page.locator('.mn-hero-carousel');
    const height = (await hero.boundingBox()).height;
    await page.getByRole('button', { name: 'Slide 3: Tận nơi tại Cần Thơ', exact: true }).click();
    if (!failure) {
      assert.equal(await hero.getAttribute('data-selected'), '2');
      assert.equal(await hero.getAttribute('data-active'), '0');
      assert.equal(
        await page.locator('#hero-family').evaluate((el) => getComputedStyle(el).opacity),
        '1',
      );
      await page.waitForFunction(
        () => document.querySelector('.mn-hero-carousel').dataset.active === '2',
      );
      results.push(
        'Delayed image keeps the complete previous slide visible until the new photo is ready',
      );
    } else {
      await page.waitForFunction(
        () => document.querySelector('.mn-hero-carousel').dataset.selected === '0',
      );
      assert.equal(await hero.getAttribute('data-active'), '0');
      assert.equal(
        await page
          .locator('#hero-family img')
          .first()
          .evaluate((el) => el.complete && el.naturalWidth > 0),
        true,
      );
      results.push('Failed image returns to the current slide instead of a blank or broken image');
    }
    assert.equal((await hero.boundingBox()).height, height);
    const metrics = await page.evaluate(() => window.heroQaMetrics);
    assert(metrics.cls < 0.01, `Unexpected hero layout shift: ${metrics.cls}`);
    assert.deepEqual(exceptions, []);
    results.push({
      failureInjected: failure,
      heroCls: metrics.cls,
      localLcpMs: Math.round(metrics.lcp),
    });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.route('**/_next/image?*', (route) =>
    route.request().url().includes('carousel-maintenance')
      ? route.abort('failed')
      : route.continue(),
  );
  await page.goto(process.env.HERO_QA_URL || 'http://127.0.0.1:3001', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Slide 2: Dịch vụ chuyên nghiệp', exact: true }).click();
  assert.equal(await page.locator('.mn-hero-carousel').getAttribute('data-selected'), '0');
  assert.equal(await page.locator('.mn-hero-carousel').getAttribute('aria-busy'), 'false');
  await page.getByRole('button', { name: 'Slide tiếp theo', exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.active === '2',
  );
  results.push(
    'An image that failed during preload cannot leave navigation stuck; next skips the unavailable slide',
  );
  await context.close();
  await fs.writeFile('output/visual-qa/hero-media-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
