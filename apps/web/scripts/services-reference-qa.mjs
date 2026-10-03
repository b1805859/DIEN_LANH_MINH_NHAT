import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Render the services page and exercise its UI. Every booking POST is intercepted;
// the script never sends a booking to the real API.
const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(repositoryRoot, 'output/services-reference');
const baseURL = process.env.SERVICES_QA_URL || 'http://localhost:3000';
const widths = [320, 375, 390, 700, 768, 941, 1024, 1280, 1440];
const results = {
  baseURL,
  startedAt: new Date().toISOString(),
  viewports: [],
  checks: [],
  pageErrors: [],
};
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(15_000);
page.on('pageerror', (error) =>
  results.pageErrors.push({ url: page.url(), message: error.message }),
);

let bookingMode = 'forbidden';
let releaseBooking;
const interceptedBookings = [];
await context.route(/\/bookings(?:\?.*)?$/, async (route) => {
  if (route.request().method() !== 'POST') return route.continue();
  const record = {
    mode: bookingMode,
    url: route.request().url(),
    payload: route.request().postDataJSON(),
  };
  interceptedBookings.push(record);
  if (bookingMode === 'forbidden') return route.abort('blockedbyclient');
  if (bookingMode === 'pending')
    await new Promise((resolve) => {
      releaseBooking = resolve;
    });
  const error = record.mode === 'error';
  await route.fulfill({
    status: error ? 503 : 201,
    contentType: 'application/json',
    body: JSON.stringify(
      error
        ? { message: 'QA simulated service unavailable' }
        : { id: 'qa-intercept-only', ...record.payload },
    ),
  });
});

const settle = async () => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};
const visit = async (pathname = '/services') => {
  await page.goto(new URL(pathname, baseURL).href, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();
  await settle();
};
const loadImages = async () => {
  const height = await page.evaluate(() => innerHeight);
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let top = 0; top < scrollHeight; top += height * 0.75) {
    await page.evaluate((y) => scrollTo(0, y), top);
    await page.waitForTimeout(70);
  }
  const images = await page.locator('img').evaluateAll(async (allImages) => {
    const visible = allImages.filter(
      (img) => img.getClientRects().length && !img.closest('dialog:not([open])'),
    );
    return Promise.all(
      visible.map(async (img) => {
        let error;
        let timeout;
        try {
          await Promise.race([
            img.decode(),
            new Promise((_, reject) => {
              timeout = setTimeout(
                () => reject(new Error('Image decode exceeded 10 seconds')),
                10_000,
              );
            }),
          ]);
        } catch (caught) {
          error = String(caught);
        } finally {
          clearTimeout(timeout);
        }
        return {
          alt: img.alt,
          src: img.currentSrc || img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          error,
        };
      }),
    );
  });
  await page.evaluate(() => scrollTo(0, 0));
  await settle();
  return images;
};
const check = async (name, run) => {
  try {
    const details = await run();
    results.checks.push({ name, passed: true, details });
    console.log(`PASS ${name}`);
  } catch (error) {
    const screenshot = `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-failure.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true }).catch(() => {});
    results.checks.push({
      name,
      passed: false,
      error: String(error.message).replace(/\u001b\[[0-9;]*m/g, ''),
      screenshot,
    });
    console.error(`FAIL ${name}: ${error.message}`);
    await page
      .evaluate(() => document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close()))
      .catch(() => {});
    if (releaseBooking) {
      releaseBooking();
      releaseBooking = undefined;
    }
  }
};
const bookingForm = () => page.getByRole('form', { name: 'ĐẶT LỊCH DỊCH VỤ', exact: true });
const fillBooking = async () => {
  const form = bookingForm();
  await form.getByLabel('Họ và tên').fill('  Nguyễn Minh Kiểm Tra  ');
  await form.getByLabel('Số điện thoại').fill('0939 370 109');
  await form.getByLabel('Dịch vụ cần hỗ trợ').selectOption('ve-sinh-may-lanh');
  await form.getByLabel('Địa chỉ').fill('  123 Đường kiểm thử, Cần Thơ  ');
  return form;
};

try {
  for (const width of widths) {
    await check(`viewport ${width}`, async () => {
      const height = width <= 700 ? 844 : 1672;
      await page.setViewportSize({ width, height });
      await visit();
      const images = await loadImages();
      const geometry = await page.evaluate(() => {
        const round = (value) => Math.round(value * 100) / 100;
        const bounds = (selector) => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return {
            x: round(r.left),
            y: round(r.top + scrollY),
            width: round(r.width),
            height: round(r.height),
            bottom: round(r.bottom + scrollY),
          };
        };
        return {
          viewportWidth: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          sections: {
            hero: bounds('section[aria-labelledby="services-hero-title"]'),
            services: bounds('#service-list'),
            commitments: bounds('section[aria-label="Cam kết dịch vụ"]'),
            process: bounds('section[aria-labelledby="services-process-title"]'),
            booking: bounds('#dat-lich'),
            footer: bounds('footer'),
          },
          form: bounds('#dat-lich form'),
          overflowElements: Array.from(document.querySelectorAll('body *'))
            .filter((element) => {
              if (!element.getClientRects().length || element.closest('dialog:not([open])'))
                return false;
              const r = element.getBoundingClientRect();
              return r.right > innerWidth + 1 || r.left < -1;
            })
            .map((element) => ({
              tag: element.tagName,
              className: String(element.className).slice(0, 100),
            }))
            .slice(0, 20),
        };
      });
      const screenshot = `services-${width}.png`;
      await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
      results.viewports.push({ width, height, ...geometry, images, screenshot });
      assert.ok(
        geometry.documentWidth <= width,
        `document width ${geometry.documentWidth} exceeds ${width}`,
      );
      assert.ok(geometry.bodyWidth <= width, `body width ${geometry.bodyWidth} exceeds ${width}`);
      assert.deepEqual(
        images.filter((image) => image.error || !image.width || !image.height),
        [],
        'All visible images decode',
      );
      assert.equal(await page.locator('#service-cards > a').count(), 8, 'Eight service cards');
      assert.equal(
        await page.locator('section[aria-label="Cam kết dịch vụ"] > div').count(),
        4,
        'Four commitments',
      );
      assert.equal(
        await page.locator('section[aria-labelledby="services-process-title"] ol > li').count(),
        4,
        'Four process steps',
      );
      const active = page.locator(
        'header nav[aria-label="Điều hướng chính"] [aria-current="page"]',
      );
      assert.equal(await active.innerText(), 'Dịch vụ');
      assert.equal(await active.getAttribute('href'), '/services');
      if (width === 941) {
        const sectionTops = {
          hero: 0,
          services: 409,
          commitments: 917,
          process: 1004,
          booking: 1175,
          footer: 1484,
        };
        for (const [section, y] of Object.entries(sectionTops))
          assert.ok(
            Math.abs(geometry.sections[section].y - y) <= 1,
            `${section} top ${geometry.sections[section].y}; expected ${y}`,
          );
        assert.equal(geometry.documentHeight, 1672, 'Native mockup height');
        assert.equal(geometry.form.height, 279, 'Booking form native height');
      }
      return {
        screenshot,
        documentWidth: geometry.documentWidth,
        documentHeight: geometry.documentHeight,
        imageCount: images.length,
      };
    });
  }

  await page.setViewportSize({ width: 941, height: 900 });
  await visit();
  await check('search unaccented filter Escape focus and route', async () => {
    const trigger = page.getByRole('button', { name: 'Tìm kiếm dịch vụ', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Tìm kiếm dịch vụ', exact: true });
    const search = dialog.getByRole('searchbox', { name: 'Tên dịch vụ' });
    await search.fill('thao lap');
    const links = dialog.getByRole('link');
    assert.equal(await links.count(), 1);
    assert.equal(await links.first().innerText(), 'Tháo lắp máy lạnh');
    assert.equal(await links.first().getAttribute('href'), '/services/thao-lap-may-lanh');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(
      await trigger.evaluate((element) => element === document.activeElement),
      true,
      'Restore focus after Escape',
    );
    await trigger.click();
    await search.fill('thao lap');
    await links.first().click();
    await page.waitForURL('**/services/thao-lap-may-lanh');
    await page.getByRole('heading', { level: 1 }).waitFor();
    return { destination: new URL(page.url()).pathname };
  });

  await visit();
  await check('booking anchor scrolls to form', async () => {
    await page.locator('header > div a[href="#dat-lich"]').click();
    await page.waitForURL('**/services#dat-lich');
    await page.waitForFunction(() => {
      const r = document.querySelector('#dat-lich form').getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight + 1 && scrollY > 0;
    });
    return { scrollY: await page.evaluate(() => scrollY) };
  });

  await check('booking required fields and invalid phone', async () => {
    const form = bookingForm();
    assert.equal(await form.locator('input,select').count(), 4);
    assert.equal(await form.locator('input[required],select[required]').count(), 4);
    assert.equal(
      await form.locator('select option').count(),
      11,
      'Ten service options plus placeholder',
    );
    const before = interceptedBookings.length;
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByText('Vui lòng nhập họ tên.').waitFor();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    assert.equal(await form.getByRole('alert').count(), 4);
    await fillBooking();
    await form.getByLabel('Số điện thoại').fill('12345');
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByText('Số điện thoại chưa hợp lệ.').waitFor();
    assert.equal(interceptedBookings.length, before, 'Invalid forms never reach POST');
    const described = await form.locator('[aria-invalid="true"]').evaluateAll((elements) =>
      elements.every((element) => {
        const id = element.getAttribute('aria-describedby');
        return Boolean(id && document.getElementById(id));
      }),
    );
    assert.equal(described, true, 'Invalid controls link to accessible error messages');
    return { controls: 4, serviceOptions: 10, postCount: interceptedBookings.length - before };
  });

  await visit();
  await check('booking intercepted success pending and duplicate guard', async () => {
    bookingMode = 'pending';
    const form = await fillBooking();
    const before = interceptedBookings.length;
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await page.waitForFunction(
      () => document.querySelector('#dat-lich form').getAttribute('aria-busy') === 'true',
    );
    for (let i = 0; i < 30 && interceptedBookings.length === before; i++)
      await page.waitForTimeout(100);
    assert.equal(interceptedBookings.length, before + 1);
    assert.equal(await form.getByRole('button').isDisabled(), true);
    assert.equal(await form.getByLabel('Họ và tên').isDisabled(), true);
    await form.evaluate((element) => {
      element.requestSubmit();
      element.requestSubmit();
    });
    await page.waitForTimeout(150);
    assert.equal(interceptedBookings.length, before + 1, 'Duplicate submission suppressed');
    assert.deepEqual(interceptedBookings.at(-1).payload, {
      customerName: 'Nguyễn Minh Kiểm Tra',
      customerPhone: '0939370109',
      serviceId: 've-sinh-may-lanh',
      address: '123 Đường kiểm thử, Cần Thơ',
    });
    releaseBooking();
    releaseBooking = undefined;
    await form.getByRole('status').waitFor();
    assert.match(await form.getByRole('status').innerText(), /Đã gửi yêu cầu/);
    assert.equal(await form.getByLabel('Họ và tên').inputValue(), '');
    assert.equal(await form.getByLabel('Số điện thoại').inputValue(), '');
    assert.equal(await form.getByLabel('Dịch vụ cần hỗ trợ').inputValue(), '');
    assert.equal(await form.getByLabel('Địa chỉ').inputValue(), '');
    assert.equal(await form.getByRole('button').isDisabled(), false);
    bookingMode = 'forbidden';
    return { simulatedPosts: 1, realPosts: 0, payload: interceptedBookings.at(-1).payload };
  });

  await visit();
  await check('booking simulated server error retains values and permits retry', async () => {
    bookingMode = 'error';
    const form = await fillBooking();
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByRole('alert').waitFor();
    assert.match(await form.getByRole('alert').innerText(), /Không gửi được yêu cầu/);
    assert.match(await form.getByLabel('Họ và tên').inputValue(), /Nguyễn Minh Kiểm Tra/);
    assert.equal(await form.getByRole('button').isDisabled(), false);
    assert.match(await form.getByRole('alert').getByRole('link').getAttribute('href'), /^tel:/);
    const notification = page.getByRole('alertdialog', { name: 'Không gửi được yêu cầu' });
    await notification.getByRole('button', { name: 'Đã hiểu' }).click();
    await notification.waitFor({ state: 'hidden' });
    bookingMode = 'success';
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByRole('status').waitFor();
    assert.equal(await form.getByRole('alert').count(), 0);
    bookingMode = 'forbidden';
    return { errorStatus: 503, retryStatus: 201, realPosts: 0 };
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await visit();
  await check('mobile menu Escape focus and navigation', async () => {
    const trigger = page.getByRole('button', { name: 'Mở menu', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Menu điều hướng', exact: true });
    await trigger.click();
    await dialog.waitFor({ state: 'visible' });
    assert.equal(
      await dialog
        .getByRole('navigation', { name: 'Điều hướng di động' })
        .getByRole('link')
        .count(),
      5,
    );
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    await trigger.click();
    await dialog.getByRole('link', { name: 'Về chúng tôi', exact: true }).click();
    await page.waitForURL('**/about');
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    return { destination: new URL(page.url()).pathname };
  });

  await check(
    'existing source and assets remain unchanged outside service integration',
    async () => {
      const before = JSON.parse(await readFile(path.join(output, 'before-hashes.json'), 'utf8'));
      const changed = [];
      const missing = [];
      for (const [file, oldHash] of Object.entries(before)) {
        try {
          const hash = createHash('sha256')
            .update(await readFile(path.join(repositoryRoot, file)))
            .digest('hex');
          if (hash !== oldHash) changed.push(file);
        } catch (error) {
          missing.push({ file, error: error.message });
        }
      }
      assert.deepEqual(missing, []);
      const allowed = [
        'apps/web/app/services/page.tsx',
        'apps/web/components/layout/site-chrome.tsx',
      ];
      assert.deepEqual(
        changed.filter((file) => !allowed.includes(file)),
        [],
      );
      return { checkedFiles: Object.keys(before).length, changedExistingFiles: changed, allowed };
    },
  );

  await check('homepage full-page screenshot unchanged at 1024 by 1536', async () => {
    // Match the baseline's full-page capture from a shorter browser viewport.
    // Chrome composites a fractional-height background image differently when
    // a 1536px viewport contains the whole page, despite identical DOM/assets.
    await page.setViewportSize({ width: 1024, height: 900 });
    await visit('/');
    await loadImages();
    const afterPath = path.join(output, 'home-after.png');
    await page.screenshot({ path: afterPath, fullPage: true });
    const before = await sharp(path.join(output, 'home-before.png'))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const after = await sharp(afterPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(after.info.width, before.info.width);
    assert.equal(after.info.height, before.info.height);
    let differentPixels = 0;
    let maxChannelDifference = 0;
    for (let i = 0; i < before.data.length; i += 4) {
      let changed = false;
      for (let channel = 0; channel < 4; channel++) {
        const difference = Math.abs(before.data[i + channel] - after.data[i + channel]);
        if (difference) changed = true;
        maxChannelDifference = Math.max(maxChannelDifference, difference);
      }
      if (changed) differentPixels++;
    }
    const comparison = {
      width: after.info.width,
      height: after.info.height,
      viewport: { width: 1024, height: 900 },
      fullPage: true,
      differentPixels,
      maxChannelDifference,
      screenshot: 'home-after.png',
    };
    results.homeComparison = comparison;
    assert.equal(differentPixels, 0, `Homepage has ${differentPixels} changed pixels`);
    return comparison;
  });

  await check('no runtime errors and no real booking requests', async () => {
    assert.deepEqual(results.pageErrors, []);
    assert.equal(
      interceptedBookings.some((request) => request.mode === 'forbidden'),
      false,
      'No unexpected booking submissions',
    );
    return {
      runtimeErrors: 0,
      realBookingRequests: 0,
      simulatedBookingRequests: interceptedBookings.length,
    };
  });
} finally {
  if (releaseBooking) releaseBooking();
  results.completedAt = new Date().toISOString();
  results.passed = results.checks.filter((check) => check.passed).length;
  results.failed = results.checks.filter((check) => !check.passed).length;
  results.interceptedBookings = interceptedBookings;
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  const summary = [
    '# Services reference QA',
    '',
    `URL: ${baseURL}/services`,
    `Checks passed: ${results.passed}; failed: ${results.failed}.`,
    'All booking POSTs were intercepted. No real booking was submitted.',
    '',
    ...results.checks.map(
      (check) =>
        `- ${check.passed ? 'PASS' : 'FAIL'} ${check.name}${check.error ? `: ${check.error.replace(/\n/g, ' ')}` : ''}`,
    ),
    '',
    '## Screenshots',
    '',
    ...results.viewports.map(
      (viewport) =>
        `- [${viewport.width}px](${viewport.screenshot}), document ${viewport.documentWidth}×${viewport.documentHeight}, ${viewport.images.length} decoded images.`,
    ),
    '',
    results.homeComparison
      ? `Homepage: ${results.homeComparison.differentPixels} pixels changed against home-before.png.`
      : '',
  ].join('\n');
  await writeFile(path.join(output, 'qa-results.md'), summary);
  await browser.close();
}
console.log(JSON.stringify({ passed: results.passed, failed: results.failed, output }));
process.exitCode = results.failed ? 1 : 0;
