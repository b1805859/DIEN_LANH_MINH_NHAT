import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(root, 'output/company-reference');
const baseURL = process.env.COMPANY_QA_URL || 'http://127.0.0.1:3001';
const results = {
  startedAt: new Date().toISOString(),
  checks: [],
  viewports: [],
  pageErrors: [],
  consoleErrors: [],
  externalFailures: [],
  bookings: [],
};
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(15000);
let bookingMode = 'blocked';
let releaseBooking;
page.on('pageerror', (error) =>
  results.pageErrors.push({ url: page.url(), message: error.message }),
);
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const record = { text: message.text(), location: message.location() };
  if (bookingMode === 'error' && /503/.test(record.text)) return;
  if (/google|gstatic|doubleclick|maps\.google/.test(record.location.url))
    results.externalFailures.push(record);
  else results.consoleErrors.push(record);
});
page.on('requestfailed', (request) => {
  if (!request.url().startsWith(baseURL))
    results.externalFailures.push({ url: request.url(), failure: request.failure() });
});
await context.route(/\/bookings(?:\?.*)?$/, async (route) => {
  if (route.request().method() !== 'POST') return route.continue();
  const record = { mode: bookingMode, payload: route.request().postDataJSON() };
  results.bookings.push(record);
  if (bookingMode === 'blocked') return route.abort();
  if (bookingMode === 'pending')
    await new Promise((resolve) => {
      releaseBooking = resolve;
    });
  await route.fulfill({
    status: record.mode === 'error' ? 503 : 201,
    contentType: 'application/json',
    body: JSON.stringify(
      record.mode === 'error'
        ? { message: 'QA simulated failure' }
        : { id: 'qa-only', ...record.payload },
    ),
  });
});
const visit = async (route) => {
  const response = await page.goto(baseURL + route, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => !image.closest('dialog'))
        .map((image) => {
          image.loading = 'eager';
          return image.decode();
        }),
    );
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};
const check = async (name, run) => {
  try {
    const details = await run();
    results.checks.push({ name, passed: true, details });
    console.log('PASS ' + name);
  } catch (error) {
    results.checks.push({ name, passed: false, error: error.message });
    console.error('FAIL ' + name + ': ' + error.message);
    await page
      .screenshot({
        path: path.join(output, name.replace(/[^a-z0-9]+/gi, '-') + '-failure.png'),
        fullPage: true,
      })
      .catch(() => {});
    if (releaseBooking) {
      releaseBooking();
      releaseBooking = undefined;
    }
    await page
      .evaluate(() => document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close()))
      .catch(() => {});
  }
};
const form = () => page.getByRole('form', { name: 'ĐẶT LỊCH DỊCH VỤ', exact: true });
const fill = async () => {
  await form().getByLabel('Họ và tên').fill('Nguyễn Minh Kiểm Tra');
  await form().getByLabel('Số điện thoại').fill('0939 370 109');
  await form().getByLabel('Dịch vụ cần hỗ trợ').selectOption('ve-sinh-may-lanh');
  await form().getByLabel('Địa chỉ').fill('123 Đường kiểm thử, Cần Thơ');
};

try {
  for (const [route, label] of [
    ['/about', 'Giới thiệu'],
    ['/contact', 'Liên hệ'],
  ]) {
    for (const width of [320, 390, 768, 880, 1440]) {
      await check(`${route.slice(1)} viewport ${width}`, async () => {
        await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
        await visit(route);
        const geometry = await page.evaluate(() => {
          const images = [...document.images]
            .filter((image) => image.getClientRects().length && !image.closest('dialog'))
            .map((image) => ({
              src: image.currentSrc,
              w: image.naturalWidth,
              h: image.naturalHeight,
            }));
          return {
            width: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            images,
            sections: [...document.querySelectorAll('main>section')].map((e) => {
              const r = e.getBoundingClientRect();
              return {
                id: e.id || e.getAttribute('aria-labelledby') || e.getAttribute('aria-label'),
                x: r.x,
                y: r.y,
                w: r.width,
                h: r.height,
              };
            }),
          };
        });
        assert.ok(geometry.documentWidth <= width, 'No horizontal overflow');
        assert.ok(
          geometry.images.every((image) => image.w && image.h),
          'No broken images',
        );
        assert.equal(
          await page
            .locator('header nav[aria-label="Điều hướng chính"] [aria-current="page"]')
            .innerText(),
          label,
        );
        assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
        assert.equal(await form().locator('input,select').count(), 4);
        if (route === '/contact') {
          // Keep the external map inside the viewport while Chrome captures the full page.
          // Layout and overflow were checked above at the original viewport height.
          await page.setViewportSize({ width, height: geometry.height });
          await page
            .frameLocator('iframe')
            .getByText(/Dữ liệu bản đồ|Map data/)
            .first()
            .waitFor({ state: 'attached', timeout: 15000 });
          await page.waitForTimeout(1500);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollHeight),
            geometry.height,
          );
        }
        await page.screenshot({
          path: path.join(output, `${route.slice(1)}-${width}.png`),
          fullPage: true,
        });
        results.viewports.push({ route, ...geometry });
        return { width, height: geometry.height, images: geometry.images.length };
      });
    }
    await page.setViewportSize({ width: 880, height: 1000 });
    await visit(route);
    await check(`${route.slice(1)} search and menu`, async () => {
      await page.getByRole('button', { name: 'Tìm kiếm khu vực', exact: true }).click();
      const search = page.getByRole('dialog', { name: 'Tìm kiếm khu vực', exact: true });
      await search.getByRole('searchbox').fill('ninh kieu');
      await search.getByRole('button', { name: 'Quận Ninh Kiều', exact: true }).click();
      const details = page.getByRole('dialog', { name: 'Dịch vụ tại Quận Ninh Kiều', exact: true });
      await details.waitFor();
      assert.equal(await details.locator('a[href^="/services/"]').count(), 8);
      await page.keyboard.press('Escape');
      await page.setViewportSize({ width: 390, height: 844 });
      const menuTrigger = page.getByRole('button', { name: 'Mở menu', exact: true });
      await menuTrigger.click();
      const menu = page.getByRole('dialog', { name: 'Menu điều hướng' });
      assert.equal(await menu.locator('[aria-current="page"]').innerText(), label);
      await page.keyboard.press('Escape');
      assert.equal(await menuTrigger.evaluate((e) => e === document.activeElement), true);
      return { search: true, activeLabel: label };
    });
    await check(`${route.slice(1)} form validation and submission`, async () => {
      await visit(route);
      await page.locator('header a[href="#dat-lich"]').first().click();
      await form().getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
      await page.waitForFunction(
        () => document.querySelectorAll('form [aria-invalid="true"]').length === 4,
      );
      await fill();
      await form().getByLabel('Số điện thoại').fill('12345');
      await form().getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
      await form().getByText('Số điện thoại chưa hợp lệ.').waitFor();
      assert.equal(results.bookings.filter((r) => r.mode === 'blocked').length, 0);
      await fill();
      bookingMode = 'pending';
      const before = results.bookings.length;
      await form().getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
      await page.waitForFunction(() => document.querySelector('form[aria-busy="true"]'));
      assert.equal(await form().getByRole('button').isDisabled(), true);
      for (let i = 0; i < 30 && !releaseBooking; i++) await page.waitForTimeout(50);
      await form().evaluate((e) => {
        e.requestSubmit();
        e.requestSubmit();
      });
      assert.equal(results.bookings.length, before + 1);
      assert.equal(results.bookings.at(-1).payload.customerPhone, '0939370109');
      releaseBooking();
      releaseBooking = undefined;
      await form().getByRole('status').waitFor();
      assert.equal(await form().getByLabel('Họ và tên').inputValue(), '');
      bookingMode = 'blocked';
      return { realPosts: 0, simulatedPosts: 1, duplicateGuard: true };
    });
  }
  await check('contact error retry and contact channels', async () => {
    await page.setViewportSize({ width: 880, height: 1000 });
    await visit('/contact');
    await fill();
    bookingMode = 'error';
    await form().getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form().getByRole('alert').waitFor();
    assert.match(await form().getByLabel('Họ và tên').inputValue(), /Nguyễn/);
    const notification = page.getByRole('alertdialog', { name: 'Không gửi được yêu cầu' });
    await notification.getByRole('button', { name: 'Đã hiểu' }).click();
    bookingMode = 'success';
    await form().getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form().getByRole('status').waitFor();
    bookingMode = 'blocked';
    assert.ok(await page.locator('main a[href="tel:0939370109"]').count());
    assert.ok(await page.locator('main a[href="mailto:dienlanhminhnhat@gmail.com"]').count());
    assert.equal(await page.locator('main a[href^="https://zalo.me/"]').count(), 1);
    assert.equal(await page.locator('main a[href*="facebook.com"]').count(), 1);
    assert.ok(
      await page.locator('iframe[title="Bản đồ khu vực phục vụ Cần Thơ"]').getAttribute('src'),
    );
    assert.equal(
      await page.getByRole('link', { name: 'Mở Google Maps' }).getAttribute('target'),
      '_blank',
    );
    return {
      errorRetainsValues: true,
      retry: true,
      map: await page.locator('iframe').getAttribute('src'),
    };
  });
  await check('original source and assets retained', async () => {
    const before = JSON.parse(await readFile(path.join(output, 'before-hashes.json'), 'utf8'));
    const changed = [];
    for (const [file, oldHash] of Object.entries(before)) {
      const hash = createHash('sha256')
        .update(await readFile(path.join(root, file)))
        .digest('hex');
      if (hash !== oldHash) changed.push(file);
    }
    const allowed = [
      'apps/web/components/areas-reference/chrome.tsx',
      'apps/web/components/layout/site-chrome.tsx',
    ];
    assert.deepEqual(
      changed.filter((file) => !allowed.includes(file)),
      [],
    );
    return { files: Object.keys(before).length, changed };
  });
  for (const [route, name, width, height] of [
    ['/', 'home', 1024, 900],
    ['/services', 'services', 941, 900],
    ['/areas', 'areas', 880, 1788],
  ]) {
    await check(`${name} visual regression`, async () => {
      await page.setViewportSize({ width, height });
      await visit(route);
      await page.screenshot({ path: path.join(output, name + '-after.png'), fullPage: true });
      const old = await sharp(path.join(output, name + '-before.png'))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const actual = await sharp(path.join(output, name + '-after.png'))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(actual.info.width, old.info.width);
      assert.equal(actual.info.height, old.info.height);
      let pixels = 0,
        max = 0;
      for (let i = 0; i < actual.data.length; i += 4) {
        let changed = false;
        for (let c = 0; c < 3; c++) {
          const d = Math.abs(actual.data[i + c] - old.data[i + c]);
          if (d) changed = true;
          max = Math.max(max, d);
        }
        if (changed) pixels++;
      }
      const isolation = await page.evaluate(() => {
        const snapshot = () =>
          [...document.querySelectorAll('body *')].map((e) => {
            const s = getComputedStyle(e),
              r = e.getBoundingClientRect();
            return {
              tag: e.tagName,
              rect: [r.x, r.y, r.width, r.height],
              style: Object.fromEntries([...s].map((k) => [k, s.getPropertyValue(k)])),
              image:
                e instanceof HTMLImageElement
                  ? [e.currentSrc, e.naturalWidth, e.naturalHeight]
                  : null,
            };
          });
        const before = snapshot();
        let removed = 0;
        for (const sheet of document.styleSheets) {
          try {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
              if (/company-module|company_/.test(sheet.cssRules[i].cssText)) {
                sheet.deleteRule(i);
                removed++;
              }
            }
          } catch {}
        }
        const after = snapshot();
        return {
          removedRules: removed,
          elements: before.length,
          changed: before.flatMap((e, i) =>
            JSON.stringify(e) === JSON.stringify(after[i]) ? [] : [i],
          ),
        };
      });
      assert.deepEqual(isolation.changed, [], 'Company stylesheet changes no existing page');
      const baseline = JSON.parse(await readFile(path.join(output, name + '-before.json'), 'utf8'));
      const properties = Object.keys(baseline.elements[0].properties);
      const actualElements = await page.evaluate(
        (properties) =>
          [...document.querySelectorAll('body *')]
            .filter(
              (element) =>
                element.getClientRects().length && !element.closest('dialog:not([open])'),
            )
            .map((element) => {
              const r = element.getBoundingClientRect(),
                style = getComputedStyle(element);
              return {
                tag: element.tagName,
                rect: [r.x, r.y, r.width, r.height],
                properties: Object.fromEntries(
                  properties.map((key) => [key, style.getPropertyValue(key)]),
                ),
                image:
                  element instanceof HTMLImageElement
                    ? [element.currentSrc, element.naturalWidth, element.naturalHeight]
                    : null,
              };
            }),
        properties,
      );
      const normalizeOrigin = (value) =>
        JSON.stringify(value).replaceAll('http://localhost:3000', '').replaceAll(baseURL, '');
      assert.equal(
        actualElements.length,
        baseline.elements.length,
        'Visible element count retained',
      );
      const changedElements = baseline.elements.flatMap((element, index) => {
        const actual = actualElements[index];
        const changed =
          element.tag !== actual.tag ||
          element.rect.some((value, i) => Math.abs(value - actual.rect[i]) > 0.05) ||
          normalizeOrigin(element.properties) !== normalizeOrigin(actual.properties) ||
          normalizeOrigin(element.image) !== normalizeOrigin(actual.image);
        return changed
          ? [
              {
                index,
                tag: element.tag,
                oldRect: element.rect,
                newRect: actual.rect,
                changedProperties: properties.filter(
                  (key) =>
                    normalizeOrigin(element.properties[key]) !==
                    normalizeOrigin(actual.properties[key]),
                ),
              },
            ]
          : [];
      });
      await writeFile(
        path.join(output, name + '-dom-comparison.json'),
        JSON.stringify({ checkedElements: actualElements.length, changedElements }, null, 2),
      );
      assert.deepEqual(changedElements, [], 'Baseline styles, geometry and image sources retained');
      const comparison = {
        differentPixels: pixels,
        maxChannelDifference: max,
        baselineElements: actualElements.length,
        changedElements,
        isolation,
      };
      results[name + 'Comparison'] = comparison;
      return comparison;
    });
  }
  await check('no runtime errors or real booking requests', async () => {
    assert.deepEqual(results.pageErrors, []);
    assert.deepEqual(results.consoleErrors, []);
    assert.equal(
      results.bookings.some((r) => r.mode === 'blocked'),
      false,
    );
    return {
      pageErrors: 0,
      consoleErrors: 0,
      realPosts: 0,
      simulatedPosts: results.bookings.length,
      externalMapFailures: results.externalFailures.length,
    };
  });
} finally {
  if (releaseBooking) releaseBooking();
  results.completedAt = new Date().toISOString();
  results.passed = results.checks.filter((c) => c.passed).length;
  results.failed = results.checks.filter((c) => !c.passed).length;
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  await writeFile(
    path.join(output, 'qa-results.md'),
    [
      '# About and Contact QA',
      '',
      `Passed: ${results.passed}; failed: ${results.failed}.`,
      'No real booking was sent. All booking POSTs intercepted.',
      '',
      ...results.checks.map(
        (c) => `- ${c.passed ? 'PASS' : 'FAIL'} ${c.name}${c.error ? ': ' + c.error : ''}`,
      ),
      '',
      `External map request failures: ${results.externalFailures.length}; inspect JSON for details.`,
    ].join('\n'),
  );
  await browser.close();
}
console.log(JSON.stringify({ passed: results.passed, failed: results.failed }));
process.exitCode = results.failed ? 1 : 0;
