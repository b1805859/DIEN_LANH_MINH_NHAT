import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Run against a built, running website. All write requests are intercepted.
const baseURL = process.env.MOTION_QA_URL || 'http://localhost:3000';
const output = new URL('../../../output/motion-qa/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
const results = { baseURL, checks: [], pages: [], errors: [] };
const check = async (name, fn) => {
  await fn();
  results.checks.push(name);
  console.log(`PASS ${name}`);
};
const routes = [
  '/',
  '/services',
  '/about',
  '/blog',
  '/contact',
  '/areas',
  '/booking',
  '/services/sua-tu-lanh',
  '/areas/ninh-kieu',
  '/faq',
  '/blog/category/may-lanh',
  '/blog/bao-lau-nen-ve-sinh-may-lanh-mot-lan',
];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.route('**/*', async (route) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())) {
    return route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'motion-qa' }),
    });
  }
  return route.continue();
});
await context.addInitScript(() => {
  window.__motionAudit = { calls: [], observers: [], shifts: 0 };
  const originalAnimate = Element.prototype.animate;
  Element.prototype.animate = function (frames, options) {
    if (this.closest('.public-site'))
      window.__motionAudit.calls.push({
        node: this,
        variant: this.dataset.motion,
        frames,
        options,
      });
    return originalAnimate.call(this, frames, options);
  };
  const OriginalObserver = window.IntersectionObserver;
  window.IntersectionObserver = class extends OriginalObserver {
    constructor(callback, options) {
      super(callback, options);
      this.audit = {
        disconnected: false,
        motion: options?.threshold === 0.15 && options?.rootMargin === '0px 0px -40px 0px',
        targets: new Set(),
      };
      window.__motionAudit.observers.push(this.audit);
    }
    observe(target) {
      this.audit.targets.add(target);
      return super.observe(target);
    }
    unobserve(target) {
      this.audit.targets.delete(target);
      return super.unobserve(target);
    }
    disconnect() {
      this.audit.disconnected = true;
      this.audit.targets.clear();
      return super.disconnect();
    }
  };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.__motionAudit.shifts += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const page = await context.newPage();
page.on('pageerror', (error) => results.errors.push(error.message));
async function ready(path) {
  const response = await page.goto(baseURL + path);
  assert.equal(response.status(), 200, path);
  await page.waitForFunction(
    () => document.querySelector('[data-motion="header"]')?.dataset.motionState === 'visible',
  );
  await page.waitForTimeout(1400);
}
async function scrollPage() {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await pause(70);
    }
  });
  await page.waitForTimeout(1700);
}
try {
  for (const width of process.env.MOTION_QA_INTERACTIONS_ONLY ? [] : [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const path of routes) {
      await ready(path);
      await scrollPage();
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        active: document
          .getAnimations()
          .filter((a) => a.playState === 'running' && a.effect?.target?.closest?.('.public-site'))
          .length,
        cls: window.__motionAudit.shifts,
        markers: document.querySelectorAll('[data-motion], [data-motion-stagger] > *').length,
        invisible: [
          ...document.querySelectorAll('[data-motion], [data-motion-stagger] > *'),
        ].filter(
          (n) =>
            n.getBoundingClientRect().height > 0 &&
            !n.closest('dialog:not([open])') &&
            getComputedStyle(n).opacity === '0',
        ).length,
      }));
      assert.equal(metrics.overflow, false, `${path} ${width}: horizontal overflow`);
      assert.equal(metrics.invisible, 0, `${path} ${width}: hidden content`);
      assert.equal(metrics.active, 0, `${path} ${width}: animations did not settle`);
      results.pages.push({ path, width, ...metrics });
      if (['/', '/services', '/contact', '/blog'].includes(path)) {
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(300);
        await page.screenshot({
          path: new URL(`${path.slice(1) || 'home'}-${width}.png`, output).pathname,
          fullPage: true,
        });
      }
      console.log(`PASS page ${width} ${path}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await ready('/');
  await check(
    'hero starts once, uses transform-only LCP frames and finishes within 1.4s',
    async () => {
      const calls = await page.evaluate(() =>
        window.__motionAudit.calls
          .filter((c) => c.variant?.startsWith('hero'))
          .map((c) => ({ variant: c.variant, frames: c.frames, options: c.options })),
      );
      assert.ok(calls.length >= 6);
      assert.ok(calls.every((c) => c.options.delay + c.options.duration <= 1400));
      assert.ok(calls.every((c) => c.frames.every((f) => f.opacity === undefined)));
    },
  );
  await check('service hover moves card and image without changing layout or asset', async () => {
    const card = page.locator('#dich-vu [data-motion-hover="card"]').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const src = await card.locator('img').getAttribute('src');
    await card.hover();
    await page.waitForTimeout(650);
    const style = await card.evaluate((n) => ({
      transform: getComputedStyle(n).transform,
      scale: getComputedStyle(n.querySelector('img')).scale,
    }));
    assert.match(style.transform, /-4\)/);
    assert.equal(style.scale, '1.025');
    assert.equal(await card.locator('img').getAttribute('src'), src);
  });
  await check('scroll reveals do not replay', async () => {
    await scrollPage();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await scrollPage();
    assert.equal(
      await page.evaluate(() => {
        const nodes = new Set();
        return window.__motionAudit.calls.filter((call) => {
          if (nodes.has(call.node)) return true;
          nodes.add(call.node);
          return false;
        }).length;
      }),
      0,
    );
  });
  await check('gallery changes preserve keyboard focus and lightbox Escape closes', async () => {
    const next = page.getByRole('button', { name: 'Nhóm ảnh tiếp theo', exact: true });
    const photo = page.locator('#hinh-anh button[data-motion-hover="image"]').first();
    const old = await photo.getAttribute('aria-label');
    await next.click();
    assert.notEqual(await photo.getAttribute('aria-label'), old);
    assert.equal(await next.evaluate((n) => n === document.activeElement), true);
    await photo.click();
    assert.equal(await page.getByRole('dialog', { name: 'Thư viện hình ảnh' }).isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog', { name: 'Thư viện hình ảnh' }).isVisible(), false);
  });
  await check('client routes clean up observers and preserve the shared header', async () => {
    for (const path of ['/services', '/about', '/blog']) {
      await page.locator(`header .motion-nav a[href="${path}"]`).click();
      await page.waitForURL(baseURL + path);
      await page.waitForTimeout(1400);
      const audit = await page.evaluate(() => ({
        active: window.__motionAudit.observers.filter((o) => o.motion && !o.disconnected).length,
        header: window.__motionAudit.calls.filter((c) => c.variant === 'header').length,
      }));
      assert.equal(audit.active, 1, 'one active motion observer');
      assert.equal(audit.header, 1, 'header only enters once');
    }
  });
  await check('news categories navigate and update active state', async () => {
    const chip = page.locator(
      'nav[aria-label="Chuyên mục bài viết"] a[href="/blog/category/may-lanh"]',
    );
    await chip.click();
    await page.waitForURL('**/blog/category/may-lanh');
    assert.equal(
      await page
        .locator('nav[aria-label="Chuyên mục bài viết"] a[aria-current="page"]')
        .getAttribute('href'),
      '/blog/category/may-lanh',
    );
    assert.ok((await page.locator('main article').count()) > 0);
  });
  await check(
    'form validation and mocked success preserve existing business behavior',
    async () => {
      await ready('/services');
      const form = page.locator('main form');
      await form.locator('button[type="submit"]').click();
      assert.equal(await form.locator('[role="alert"]').count(), 4);
      await form.getByLabel('Họ và tên', { exact: false }).fill('Khách kiểm thử');
      await form.getByLabel('Số điện thoại', { exact: false }).fill('0901234567');
      await form.locator('select').selectOption({ index: 1 });
      await form.getByLabel('Địa chỉ', { exact: false }).fill('Địa chỉ kiểm thử Cần Thơ');
      await form.locator('button[type="submit"]').click();
      await page.getByRole('alertdialog').waitFor();
      assert.ok((await page.getByRole('alertdialog').textContent()).includes('Đã gửi yêu cầu'));
      await page.getByRole('button', { name: 'Đã hiểu' }).click();
    },
  );
  await check(
    'reduced motion cancels active animations and keeps full content usable',
    async () => {
      await ready('/');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await scrollPage();
      assert.equal(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (a) => a.playState === 'running' && a.effect?.target?.closest?.('.public-site'),
              ).length,
        ),
        0,
      );
      await page.locator('header .motion-nav a[href="/services"]').click();
      await page.waitForURL('**/services');
      await page.waitForTimeout(200);
      assert.equal(
        await page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(
                (a) => a.playState === 'running' && a.effect?.target?.closest?.('.public-site'),
              ).length,
        ),
        0,
      );
      assert.equal(await page.locator('main h1').isVisible(), true);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    },
  );
  await check('touch menu and booking navigation remain usable', async () => {
    const touch = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobile = await touch.newPage();
    await mobile.goto(baseURL);
    await mobile.getByRole('button', { name: 'Mở menu', exact: true }).click();
    const menu = mobile.getByRole('dialog', { name: 'Menu điều hướng' });
    await menu.getByRole('link', { name: 'Dịch vụ', exact: true }).click();
    await mobile.waitForURL('**/services');
    assert.equal(await menu.isVisible(), false);
    await touch.close();
  });
  await check('no-JavaScript SSR remains visible on every representative route', async () => {
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const staticPage = await noJs.newPage();
    for (const path of routes) {
      await staticPage.goto(baseURL + path);
      assert.equal(await staticPage.locator('main h1').isVisible(), true, path);
      const hidden = await staticPage
        .locator('[data-motion], [data-motion-stagger] > *')
        .evaluateAll(
          (nodes) =>
            nodes.filter(
              (n) =>
                n.getBoundingClientRect().height > 0 &&
                !n.closest('dialog:not([open])') &&
                getComputedStyle(n).opacity === '0',
            ).length,
        );
      assert.equal(hidden, 0, path);
    }
    await noJs.close();
  });
  assert.deepEqual(results.errors, [], 'no runtime errors');
} finally {
  await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(
  `Complete: ${results.pages.length} route/viewport checks and ${results.checks.length} interaction checks.`,
);
