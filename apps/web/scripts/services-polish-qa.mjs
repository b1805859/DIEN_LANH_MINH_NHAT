import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.UI_QA_URL || 'http://127.0.0.1:3001';
const output = path.resolve('output/services-polish');
const baseline = JSON.parse(await readFile(path.join(output, 'before-layouts.json'), 'utf8'));
const hashes = JSON.parse(await readFile(path.join(output, 'before-hashes.json'), 'utf8'));
const results = { baseURL, checks: [], layouts: [], pageErrors: [], realBookingRequests: 0 };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce' });
let bookingMode = 'blocked';
let interceptedBookings = 0;
await context.route('**/*', async (route) => {
  const request = route.request();
  if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/bookings')) {
    interceptedBookings++;
    assert.notEqual(bookingMode, 'blocked', 'Unexpected booking submission');
    return route.fulfill({
      status: bookingMode === 'error' ? 503 : 201,
      contentType: 'application/json',
      body: JSON.stringify(bookingMode === 'error' ? { message: 'QA error' } : { id: 'qa-only' }),
    });
  }
  return ['GET', 'HEAD', 'OPTIONS'].includes(request.method()) ? route.continue() : route.abort();
});
const page = await context.newPage();
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
const visit = async (route = '/services', width = 1440) => {
  await page.setViewportSize({ width, height: 1000 });
  const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
    });
    await Promise.all(Array.from(document.images).map((image) => image.decode().catch(() => {})));
  });
};
const layout = () =>
  page.evaluate(() => {
    const rect = (element) => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    const columns = (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length;
    const cards = Array.from(document.querySelectorAll('#service-cards>a')).map((card) => {
      const image = card.querySelector('img');
      const frame = rect(image.parentElement);
      return {
        ...rect(card),
        title: card.querySelector('h3').textContent,
        headingY: rect(card.querySelector('h3')).y,
        descriptionY: rect(card.querySelector('p')).y,
        image: {
          src: image.getAttribute('src'),
          ratio: frame.width / frame.height,
          fit: getComputedStyle(image).objectFit,
          position: getComputedStyle(image).objectPosition,
          decoded: image.complete && image.naturalWidth > 0,
        },
        textWithinCard: Array.from(card.querySelectorAll('h3,p')).every((el) => {
          const r = rect(el),
            c = rect(card);
          return r.x >= c.x && r.right <= c.right && r.bottom <= c.bottom;
        }),
      };
    });
    const controls = Array.from(document.querySelectorAll('#dat-lich input, #dat-lich select')).map(
      rect,
    );
    const actions = Array.from(document.querySelector('[class*="heroActions"]').children).map(rect);
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      cards,
      controls,
      actions,
      columns: columns(document.querySelector('#service-cards')),
      processColumns: columns(
        document.querySelector('section[aria-labelledby="services-process-title"] ol'),
      ),
      headingFont: getComputedStyle(document.querySelector('h1')).fontSize,
      booking: rect(document.querySelector('#dat-lich form')),
      bookingCopy: rect(document.querySelector('[class*="bookingCopy"]')),
      bookingImage: rect(document.querySelector('[class*="bookingImage"]')),
      footer: rect(document.querySelector('footer')),
      hero: rect(document.querySelector('section[aria-labelledby="services-hero-title"]')),
      heroCopy: rect(document.querySelector('[class*="heroCopy"]')),
      text: document.querySelector('main').innerText,
    };
  });
// Ignore responsive line-break whitespace; all original words must remain.
const normalize = (value) => value.replace(/\s+/g, '');
try {
  await check(
    'locked assets, service data, booking logic and shared header unchanged',
    async () => {
      for (const [file, hash] of Object.entries(hashes)) {
        assert.equal(
          createHash('sha256')
            .update(await readFile(file))
            .digest('hex'),
          hash,
          file,
        );
      }
      return { files: Object.keys(hashes).length };
    },
  );
  for (const width of [1920, 1440, 1280, 1199, 1024, 960, 768, 760, 600, 390, 320]) {
    await check(`responsive layout ${width}`, async () => {
      await visit('/services', width);
      const data = await layout();
      results.layouts.push(data);
      assert.ok(data.scrollWidth <= width && data.bodyWidth <= width, 'No horizontal overflow');
      assert.equal(data.cards.length, 8);
      assert.equal(data.columns, width >= 1200 ? 4 : width > 600 ? 2 : 1);
      assert.equal(data.processColumns, width >= 1200 ? 4 : width > 600 ? 2 : 1);
      assert.ok(
        Math.max(...data.cards.map((c) => c.height)) -
          Math.min(...data.cards.map((c) => c.height)) <
          1,
        'All card heights align',
      );
      assert.ok(data.cards.every((c) => c.image.decoded && c.textWithinCard));
      assert.ok(
        data.heroCopy.y >= data.hero.y && data.heroCopy.bottom <= data.hero.bottom,
        'Hero content fits',
      );
      assert.ok(data.booking.x >= 0 && data.booking.right <= width, 'Form fits');
      if (width > 760 && width <= 960) {
        assert.ok(
          data.bookingCopy.right <= data.bookingImage.x,
          'Tablet copy and technician do not overlap',
        );
        assert.ok(data.booking.y > data.bookingImage.bottom, 'Tablet form clears technician image');
      }
      assert.ok(
        data.controls.every((c) => c.height === 48),
        'Input and select heights match',
      );
      assert.equal(data.actions[0].height, data.actions[1].height, 'CTA heights match');
      if (width >= 1200) {
        assert.ok(
          data.cards.slice(0, 4).every((c) => Math.abs(c.headingY - data.cards[0].headingY) < 1),
        );
        assert.ok(
          data.cards
            .slice(0, 4)
            .every((c) => Math.abs(c.descriptionY - data.cards[0].descriptionY) < 1),
        );
      }
      if (width <= 420) assert.ok(data.actions[1].y >= data.actions[0].bottom);
      const before = baseline.find((entry) => entry.width === width);
      if (before) {
        assert.equal(
          normalize(data.text),
          normalize(before.text),
          'Existing page content unchanged',
        );
        data.cards.forEach((card, index) => {
          const original = before.cards[index];
          assert.equal(card.title, original.title);
          assert.equal(card.image.src, original.src, 'Image src unchanged');
          assert.equal(card.image.fit, original.fit);
          assert.equal(card.image.position, original.position);
          assert.ok(
            Math.abs(card.image.ratio - original.ratio) < 0.001,
            'Image composition ratio unchanged',
          );
        });
      }
      await page.screenshot({ path: path.join(output, `services-${width}.png`), fullPage: true });
      if (width === 768 || width === 390) {
        await page.locator('#dat-lich').screenshot({
          path: path.join(output, `booking-${width}.png`),
          style: 'header { visibility: hidden; }',
        });
      }
      return {
        columns: data.columns,
        processColumns: data.processColumns,
        cardHeight: data.cards[0].height,
      };
    });
  }
  await visit();
  await check(
    'shared header active state, hotline, service routes and booking anchor',
    async () => {
      const nav = page.getByRole('navigation', { name: 'Điều hướng chính', exact: true });
      assert.equal(await nav.locator('[aria-current="page"]').innerText(), 'Dịch vụ');
      assert.equal(await nav.getByRole('link', { name: 'Dự án', exact: true }).count(), 0);
      assert.equal(
        await page.locator('[class*="consultButton"]').getAttribute('href'),
        'tel:0939370109',
      );
      const links = await page
        .locator('#service-cards>a')
        .evaluateAll((items) => items.map((i) => i.getAttribute('href')));
      assert.equal(new Set(links).size, 8);
      await page.locator('[class*="heroActions"] a[href="#dat-lich"]').click();
      await page.waitForURL('**/services#dat-lich');
      await page.waitForFunction(
        () => Math.abs(document.querySelector('#dat-lich').getBoundingClientRect().top - 108) < 2,
      );
      return { active: 'Dịch vụ', serviceLinks: links.length };
    },
  );
  await check('existing validation and accessible focus', async () => {
    const form = page.getByRole('form', { name: 'ĐẶT LỊCH DỊCH VỤ', exact: true });
    const before = interceptedBookings;
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByText('Vui lòng nhập họ tên.').waitFor();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    assert.equal(interceptedBookings, before);
    assert.equal(
      await form
        .locator('[aria-invalid="true"]')
        .evaluateAll((items) =>
          items.every((i) => document.getElementById(i.getAttribute('aria-describedby'))),
        ),
      true,
    );
    const control = form.getByLabel('Họ và tên');
    await control.focus();
    assert.notEqual(await control.evaluate((i) => getComputedStyle(i).outlineStyle), 'none');
    await page.screenshot({ path: path.join(output, 'form-errors.png'), fullPage: true });
    return { errors: 4, realPosts: 0 };
  });
  for (const mode of ['success', 'error']) {
    await visit('/services', 390);
    await check(`existing booking ${mode} UI with intercepted request`, async () => {
      bookingMode = mode;
      const form = page.getByRole('form', { name: 'ĐẶT LỊCH DỊCH VỤ', exact: true });
      await form.getByLabel('Họ và tên').fill('Nguyễn Minh Kiểm Tra');
      await form.getByLabel('Số điện thoại').fill('0939 370 109');
      await form.getByLabel('Dịch vụ cần hỗ trợ').selectOption('ve-sinh-may-lanh');
      await form.getByLabel('Địa chỉ').fill('123 Đường kiểm thử, Cần Thơ');
      await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
      await form.getByRole(mode === 'success' ? 'status' : 'alert').waitFor();
      assert.equal(
        await form.getByLabel('Họ và tên').inputValue(),
        mode === 'success' ? '' : 'Nguyễn Minh Kiểm Tra',
      );
      assert.equal(await form.getByRole('button').isEnabled(), true);
      bookingMode = 'blocked';
      return { response: mode === 'success' ? 201 : 503, realPosts: 0 };
    });
  }
  await visit('/services', 390);
  await check('shared mobile menu', async () => {
    await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
    const menu = page.getByRole('dialog', { name: 'Menu điều hướng', exact: true });
    assert.equal(await menu.getByRole('navigation').getByRole('link').count(), 5);
    assert.equal(await menu.locator('[aria-current="page"]').innerText(), 'Dịch vụ');
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });
    return { items: 5 };
  });
  await check('shared form and footer remain usable on other pages', async () => {
    for (const route of ['/', '/contact', '/areas', '/about', '/services/thao-lap-may-lanh']) {
      await visit(route, 390);
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      );
      if (route === '/contact' || route === '/areas') {
        assert.equal(await page.locator('form input[required],form select[required]').count(), 4);
      }
    }
    return { routes: 5 };
  });
  await check('no uncaught runtime errors', async () => {
    assert.deepEqual(results.pageErrors, []);
  });
} finally {
  results.passed = results.checks.filter((c) => c.passed).length;
  results.failed = results.checks.filter((c) => !c.passed).length;
  results.interceptedBookings = interceptedBookings;
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ passed: results.passed, failed: results.failed, output }));
process.exitCode = results.failed ? 1 : 0;
