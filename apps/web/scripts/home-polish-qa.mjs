import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.UI_QA_URL || 'http://127.0.0.1:3001';
const output = path.resolve('output/home-polish');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce' });
await context.route('**/*', (route) =>
  ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort(),
);
const page = await context.newPage();
const results = { baseURL, checks: [], pageErrors: [], screenshots: [], layouts: [] };
page.on('pageerror', (error) => results.pageErrors.push(error.message));
const check = async (name, run) => {
  try {
    const detail = await run();
    results.checks.push({ name, passed: true, detail });
    console.log('PASS', name);
  } catch (error) {
    results.checks.push({ name, passed: false, error: error.message });
    console.log('FAIL', name, error.message);
  }
};
const visit = async (route, width) => {
  await page.setViewportSize({ width, height: 1000 });
  const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
};
const layout = () =>
  page.evaluate(() => {
    const query = (name) => document.querySelector('[class*="' + name + '"]');
    const elements = (name) => Array.from(document.querySelectorAll('[class*="' + name + '"]'));
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    const cards = elements('serviceCard').map((el) => ({
      ...rect(el),
      title: el.querySelector('h3').textContent,
      headingY: el.querySelector('h3').getBoundingClientRect().top,
    }));
    const hero = query('heroCopy');
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heading: document.querySelector('h1').textContent.replace(/\s+/g, ' ').trim(),
      headingFont: getComputedStyle(document.querySelector('h1')).fontSize,
      cards,
      gridColumns: getComputedStyle(query('serviceGrid')).gridTemplateColumns,
      workflowColumns: getComputedStyle(query('processRow').querySelector('ol'))
        .gridTemplateColumns,
      heroCopy: rect(hero),
      heroImage: rect(query('heroImage')),
      video: rect(query('featureVideo')),
      play: rect(query('bigPlay')),
      gallery: elements('galleryGrid')[0]
        ? Array.from(query('galleryGrid').children).map(rect)
        : [],
      finalButtons: Array.from(query('finalCtaActions').children).map(rect),
      headerHeight: document.querySelector('header').getBoundingClientRect().height,
      resources: performance
        .getEntriesByType('resource')
        .filter((r) => new URL(r.name).origin === location.origin)
        .map((r) => ({
          name: new URL(r.name).pathname,
          bytes: r.transferSize,
          duration: r.duration,
        })),
      navigation: performance
        .getEntriesByType('navigation')
        .map((n) => ({ domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd })),
      lcp: performance.getEntriesByType('largest-contentful-paint').map((p) => p.startTime),
    };
  });
const screenshot = async (width) => {
  await page.evaluate(async () => {
    document.querySelectorAll('main img').forEach((img) => {
      img.loading = 'eager';
    });
    for (let y = 0; y < document.documentElement.scrollHeight; y += 800) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
  });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll('main img'))
        .filter((img) => img.getClientRects().length)
        .every((img) => img.complete && img.naturalWidth > 0),
    { timeout: 20000 },
  );
  await page.evaluate(() => scrollTo(0, 0));
  const filename = path.join(output, 'home-' + width + '.png');
  await page.screenshot({ path: filename, fullPage: true });
  results.screenshots.push(filename);
};
try {
  for (const width of [1920, 1440, 1280, 1024, 768, 600, 390, 320]) {
    await check('Home layout and images at ' + width, async () => {
      await visit('/', width);
      const details = await layout();
      results.layouts.push(details);
      assert.ok(details.scrollWidth <= width, 'No horizontal scrollbar');
      assert.equal(details.cards.length, 5, 'All five services are available');
      assert.ok(
        details.cards.every((c) => Math.abs(c.height - details.cards[0].height) < 1),
        'Consistent card height',
      );
      if (width >= 1200) {
        assert.equal(
          new Set(details.cards.map((c) => Math.round(c.y))).size,
          1,
          'All five cards share one desktop row',
        );
        assert.equal(
          new Set(details.cards.map((c) => Math.round(c.headingY))).size,
          1,
          'Card heading baselines align',
        );
      }
      if (width <= 600)
        assert.equal(
          new Set(details.cards.map((c) => Math.round(c.x))).size,
          1,
          'Mobile service cards stack',
        );
      if (width <= 760) {
        assert.ok(
          details.heroImage.y >= details.heroCopy.y + details.heroCopy.height,
          'Mobile hero image follows the text',
        );
        assert.ok(
          details.finalButtons[1].y >= details.finalButtons[0].y + details.finalButtons[0].height,
          'Final CTA buttons stack',
        );
        assert.ok(
          details.workflowColumns.split(' ').length === 1,
          'Mobile workflow is a vertical timeline',
        );
      }
      const center = (r) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
      const videoCenter = center(details.video),
        playCenter = center(details.play);
      assert.ok(
        Math.abs(videoCenter.x - playCenter.x) < 2 && Math.abs(videoCenter.y - playCenter.y) < 2,
        'Play control is centered in the visual',
      );
      assert.ok(
        details.gallery.every((r) => Math.abs(r.width / r.height - 4 / 3) < 0.03),
        'Gallery ratios match',
      );
      await screenshot(width);
      return { width, cardHeight: details.cards[0].height, headingFont: details.headingFont };
    });
  }
  await check('Sticky header, route navigation, menu and search', async () => {
    await visit('/', 1440);
    await page.evaluate(() => scrollTo(0, 1100));
    await page.waitForTimeout(100);
    const r = await page.locator('header').boundingBox();
    assert.ok(Math.abs(r.y) < 1, 'Scrolled header stays at viewport top');
    await page.getByRole('button', { name: 'Tìm kiếm dịch vụ', exact: true }).click();
    const search = page.getByRole('dialog', { name: 'Tìm kiếm dịch vụ' });
    await search.getByRole('searchbox').fill('may lanh');
    assert.ok((await search.locator('a[href^="/services/"]').count()) >= 3);
    await page.keyboard.press('Escape');
    assert.equal(await search.isVisible(), false);
    await visit('/', 390);
    await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
    const menu = page.getByRole('dialog', { name: 'Menu điều hướng' });
    await menu.getByRole('link', { name: 'Dịch vụ', exact: false }).click();
    await page.waitForURL('**/services');
    assert.equal(await page.locator('dialog[open]').count(), 0);
  });
  await check('Video and gallery keyboard interaction', async () => {
    await visit('/', 390);
    await page
      .getByRole('button', { name: 'Xem video quy trình của chúng tôi', exact: true })
      .click();
    const video = page.getByRole('dialog', {
      name: 'Video giới thiệu quy trình Điện Lạnh Minh Nhật',
    });
    assert.equal(await video.isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await video.isVisible(), false);
    await page.getByRole('button', { name: 'Xem thêm', exact: false }).click();
    const gallery = page.getByRole('dialog', { name: 'Thư viện hình ảnh' });
    const before = await gallery.locator('img').getAttribute('alt');
    await page.keyboard.press('ArrowRight');
    assert.notEqual(await gallery.locator('img').getAttribute('alt'), before);
    await page.keyboard.press('Escape');
    assert.equal(await gallery.isVisible(), false);
  });
  await check('Call and booking destinations agree with the configured hotline', async () => {
    await visit('/', 1440);
    const call = await page.locator('main a[href^="tel:"]').getAttribute('href');
    const footerCall = await page.locator('footer a[href^="tel:"]').getAttribute('href');
    assert.equal(call, footerCall);
    assert.equal(
      await page.getByRole('link', { name: 'Đặt lịch sửa chữa' }).getAttribute('href'),
      '/booking',
    );
    assert.equal(await page.locator('main h1').count(), 1);
    assert.ok(await page.locator('link[rel="canonical"]').count());
  });
  await check('Shared header and footer do not overflow other public pages', async () => {
    for (const route of [
      '/services',
      '/areas',
      '/about',
      '/contact',
      '/blog',
      '/booking',
      '/faq',
      '/privacy-policy',
    ]) {
      for (const width of [1440, 768, 320]) {
        await visit(route, width);
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          route + ' overflows at ' + width,
        );
        assert.equal(await page.locator('header').count(), 1);
        assert.equal(await page.locator('footer').count(), 1);
      }
    }
  });
  await check('Text contrast for solid surfaces and primary button gradient', async () => {
    const luminance = (hex) => {
      const channels = hex
        .match(/\w\w/g)
        .map((v) => parseInt(v, 16) / 255)
        .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const pairs = [
      ['body', '213752', 'f6fafd'],
      ['heading', '0a2053', 'ffffff'],
      ['section link', '0065cd', 'f6fafd'],
      ['footer', 'b9cedd', '001a31'],
      ['primary start', 'ffffff', '0074cc'],
      ['primary end', 'ffffff', '005de6'],
      ['hero accent', '48d1fa', '001c32'],
    ].map(([name, fg, bg]) => {
      const a = luminance(fg),
        b = luminance(bg);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      assert.ok(ratio >= 4.5, name + ': ' + ratio.toFixed(2));
      return { name, ratio };
    });
    return pairs;
  });
  await check('No uncaught browser errors', () => assert.deepEqual(results.pageErrors, []));
} finally {
  results.summary = {
    passed: results.checks.filter((c) => c.passed).length,
    failed: results.checks.filter((c) => !c.passed).length,
  };
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(results.summary);
if (results.summary.failed) process.exitCode = 1;
