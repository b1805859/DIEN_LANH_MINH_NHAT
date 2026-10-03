import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Render the areas page and exercise its UI. Every booking POST is intercepted;
// the script never sends a booking to the real API.
const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(repositoryRoot, 'output/areas-reference');
const baseURL = process.env.AREAS_QA_URL || 'http://localhost:3000';
const widths = [320, 390, 768, 880, 1440];
const referenceSource =
  process.env.AREAS_QA_REFERENCE ||
  '/Users/macbookprom1/Downloads/Khu vực phục vụ Điện Lạnh Minh Nhật Cần Thơ (1).png';
const referencePath = path.join(output, 'reference.png');
const results = {
  baseURL,
  startedAt: new Date().toISOString(),
  viewports: [],
  checks: [],
  pageErrors: [],
  consoleErrors: [],
  expectedConsoleErrors: [],
};
await mkdir(output, { recursive: true });
await copyFile(referenceSource, referencePath);
const referenceMetadata = await sharp(referencePath).metadata();
assert.equal(referenceMetadata.width, 880, 'Reference width');
assert.equal(referenceMetadata.height, 1788, 'Reference height');
results.reference = { width: referenceMetadata.width, height: referenceMetadata.height };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
const page = await context.newPage();
page.setDefaultTimeout(15_000);
page.on('pageerror', (error) =>
  results.pageErrors.push({ url: page.url(), message: error.message }),
);

let bookingMode = 'forbidden';
page.on('console', (message) => {
  if (message.type() !== 'error') return;
  const record = { url: page.url(), message: message.text(), location: message.location() };
  if (bookingMode === 'error' && /503/.test(record.message))
    results.expectedConsoleErrors.push(record);
  else results.consoleErrors.push(record);
});
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
const visit = async (pathname = '/areas') => {
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
      const height = width <= 700 ? 844 : 1788;
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
            hero: bounds('section[aria-labelledby="areas-hero-title"]'),
            areas: bounds('#area-list'),
            nearby: bounds('#nearby-areas'),
            commitments: bounds('section[aria-label="Cam kết dịch vụ"]'),
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
      const screenshot = `areas-${width}.png`;
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
      assert.equal(await page.locator('#area-cards button').count(), 8, 'Eight area cards');
      const cardLayout = await page.locator('#area-cards button').evaluateAll((cards) => {
        const bounds = cards.map((card) => card.getBoundingClientRect());
        const top = bounds[0].top;
        return {
          columns: bounds.filter((bound) => Math.abs(bound.top - top) < 1).length,
          widths: bounds.map((bound) => Math.round(bound.width * 100) / 100),
        };
      });
      if (width >= 880) assert.equal(cardLayout.columns, 4, 'Four desktop card columns');
      else if (width >= 768) assert.equal(cardLayout.columns, 2, 'Two tablet card columns');
      else assert.ok([1, 2].includes(cardLayout.columns), 'One or two mobile card columns');
      const cardSources = await page
        .locator('#area-cards img')
        .evaluateAll((images) => images.map((image) => image.currentSrc || image.src));
      assert.equal(cardSources.length, 8);
      assert.equal(new Set(cardSources).size, 8, 'Eight distinct area photos');
      assert.equal(
        await page.locator('section[aria-label="Cam kết dịch vụ"] > div').count(),
        4,
        'Four commitments',
      );
      assert.equal(await page.locator('#nearby-areas button').count(), 6, 'Six nearby area chips');
      const active = page.locator(
        'header nav[aria-label="Điều hướng chính"] [aria-current="page"]',
      );
      assert.equal(await active.innerText(), 'Khu vực');
      assert.equal(await active.getAttribute('href'), '/areas');
      if (width === 880) {
        const sectionTops = {
          hero: 0,
          areas: 471,
          nearby: 996,
          commitments: 1145,
          booking: 1230,
          footer: 1533,
        };
        for (const [section, y] of Object.entries(sectionTops))
          assert.ok(
            Math.abs(geometry.sections[section].y - y) <= 2,
            `${section} top ${geometry.sections[section].y}; expected ${y}`,
          );
        assert.equal(geometry.documentHeight, 1788, 'Native mockup height');
        assert.equal(geometry.form.height, 272, 'Booking form native height');
      }
      return {
        screenshot,
        documentWidth: geometry.documentWidth,
        documentHeight: geometry.documentHeight,
        imageCount: images.length,
      };
    });
  }

  await check('native mockup side-by-side comparison artifact', async () => {
    const actualPath = path.join(output, 'areas-880.png');
    const actualMetadata = await sharp(actualPath).metadata();
    const canvasWidth = 880 * 2 + 24;
    await sharp({
      create: {
        width: canvasWidth,
        height: Math.max(1788, actualMetadata.height) + 38,
        channels: 3,
        background: '#e7f4f8',
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${canvasWidth}" height="38"><text x="12" y="25" font-family="Arial" font-size="16">REFERENCE · 880 × 1788</text><text x="916" y="25" font-family="Arial" font-size="16">IMPLEMENTATION · 880 × ${actualMetadata.height}</text></svg>`,
          ),
          left: 0,
          top: 0,
        },
        { input: referencePath, left: 0, top: 38 },
        { input: actualPath, left: 904, top: 38 },
      ])
      .png()
      .toFile(path.join(output, 'compare-desktop.png'));
    return {
      screenshot: 'compare-desktop.png',
      reference: 'reference.png',
      implementation: 'areas-880.png',
      note: 'Visual review required; geometry and image appearance are assessed separately.',
    };
  });

  await page.setViewportSize({ width: 880, height: 900 });
  await visit();
  await check('area search unaccented filter Escape and service selection', async () => {
    const trigger = page.getByRole('button', { name: 'Tìm kiếm khu vực', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Tìm kiếm khu vực', exact: true });
    const search = dialog.getByRole('searchbox');
    await search.fill('binh thuy');
    const result = dialog.getByRole('button', { name: /Bình Thủy/ });
    assert.equal(await result.count(), 1);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(
      await trigger.evaluate((element) => element === document.activeElement),
      true,
      'Restore focus after Escape',
    );
    await trigger.click();
    await search.fill('binh thuy');
    await result.click();
    const details = page.locator('dialog[open]');
    await details.waitFor({ state: 'visible' });
    assert.match(await details.innerText(), /Bình Thủy/);
    const service = details.getByRole('link', { name: 'Tháo lắp máy lạnh', exact: true });
    assert.match(await service.getAttribute('href'), /services\/thao-lap-may-lanh/);
    await service.click();
    await page.waitForURL('**/services/thao-lap-may-lanh');
    await page.getByRole('heading', { level: 1 }).waitFor();
    return { query: 'binh thuy', destination: new URL(page.url()).pathname };
  });

  await visit();
  await check('eight area cards and six nearby chips open working details', async () => {
    const names = [
      'Quận Ninh Kiều',
      'Quận Bình Thủy',
      'Quận Cái Răng',
      'Quận Ô Môn',
      'Quận Thốt Nốt',
      'Huyện Phong Điền',
      'Huyện Thới Lai',
      'Huyện Vĩnh Thạnh',
    ];
    for (const [index, name] of names.entries()) {
      const trigger = page.locator('#area-cards button').nth(index);
      assert.match(await trigger.innerText(), new RegExp(name));
      await trigger.click();
      const dialog = page.locator('dialog[open]');
      await dialog.waitFor({ state: 'visible' });
      assert.match(await dialog.innerText(), new RegExp(name));
      assert.ok((await dialog.locator('a[href^="/services/"]').count()) >= 8);
      assert.equal(await dialog.locator('a[href="#dat-lich"]').count(), 1);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    }
    const nearby = ['Hậu Giang', 'Kiên Giang', 'Sóc Trăng', 'Vĩnh Long', 'Đồng Tháp', 'An Giang'];
    for (const [index, name] of nearby.entries()) {
      const trigger = page.locator('#nearby-areas button').nth(index);
      assert.equal(await trigger.innerText(), name);
      await trigger.click();
      const dialog = page.locator('dialog[open]');
      await dialog.waitFor({ state: 'visible' });
      assert.match(await dialog.innerText(), new RegExp(name));
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
    }
    return { areas: names, nearby };
  });

  await visit();
  await check('booking anchor scrolls to form', async () => {
    await page.locator('header > div a[href="#dat-lich"]').click();
    await page.waitForURL('**/areas#dat-lich');
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
    await dialog.getByRole('link', { name: 'Giới thiệu', exact: true }).click();
    await page.waitForURL('**/about');
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    return { destination: new URL(page.url()).pathname };
  });

  await check('existing Home and Services source and assets remain unchanged', async () => {
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
    const allowed = ['apps/web/app/areas/page.tsx', 'apps/web/components/layout/site-chrome.tsx'];
    assert.deepEqual(
      changed.filter((file) => !allowed.includes(file)),
      [],
    );
    return { checkedFiles: Object.keys(before).length, changedExistingFiles: changed, allowed };
  });

  for (const [route, name, width] of [
    ['/', 'home', 1024],
    ['/services', 'services', 941],
  ]) {
    await check(`${name} visual regression`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await visit(route);
      await loadImages();
      const afterPath = path.join(output, `${name}-after.png`);
      await page.screenshot({ path: afterPath, fullPage: true });
      const before = await sharp(path.join(output, `${name}-before.png`))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const after = await sharp(afterPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(after.info.width, before.info.width);
      assert.equal(after.info.height, before.info.height);
      let differentPixels = 0;
      let maxChannelDifference = 0;
      let differentPixelsOutsidePhotos = 0;
      const photoBounds = await page.locator('img').evaluateAll((images) =>
        images
          .filter((image) => image.width > 50 && !image.closest('dialog'))
          .map((image) => {
            const r = image.getBoundingClientRect();
            return [
              Math.floor(r.x) - 2,
              Math.floor(r.y) - 2,
              Math.ceil(r.right) + 2,
              Math.ceil(r.bottom) + 2,
            ];
          }),
      );
      for (let i = 0; i < before.data.length; i += 4) {
        let changed = false;
        for (let channel = 0; channel < 4; channel++) {
          const difference = Math.abs(before.data[i + channel] - after.data[i + channel]);
          if (difference) changed = true;
          maxChannelDifference = Math.max(maxChannelDifference, difference);
        }
        if (changed) {
          differentPixels++;
          const pixel = i / 4;
          const x = pixel % after.info.width;
          const y = Math.floor(pixel / after.info.width);
          if (
            !photoBounds.some(
              ([left, top, right, bottom]) => x >= left && x <= right && y >= top && y <= bottom,
            )
          )
            differentPixelsOutsidePhotos++;
        }
      }
      const comparison = {
        width: after.info.width,
        height: after.info.height,
        viewport: { width, height: 900 },
        fullPage: true,
        differentPixels,
        differentPixelsOutsidePhotos,
        maxChannelDifference,
        screenshot: `${name}-after.png`,
      };
      results[`${name}Comparison`] = comparison;
      {
        // Chrome can rasterize the existing fractional-size photos differently after
        // scrolling/repaint, even with identical source and computed styles. Keep the
        // original raw pixel count, assert exact pixels outside photos, and separately
        // prove that every computed property/box/image source is unchanged by Areas CSS.
        assert.equal(
          differentPixelsOutsidePhotos,
          0,
          `All pixels outside ${name} photos are identical`,
        );
        const isolation = await page.evaluate(() => {
          const snapshot = () =>
            [...document.querySelectorAll('body *')].map((element) => {
              const styles = getComputedStyle(element);
              const r = element.getBoundingClientRect();
              return {
                tag: element.tagName,
                rect: [r.x, r.y, r.width, r.height],
                properties: Object.fromEntries(
                  [...styles].map((key) => [key, styles.getPropertyValue(key)]),
                ),
                image:
                  element instanceof HTMLImageElement
                    ? [element.currentSrc, element.naturalWidth, element.naturalHeight]
                    : null,
              };
            });
          const before = snapshot();
          let removedRules = 0;
          for (const sheet of document.styleSheets) {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
              if (/areas-module|AreasRoboto/.test(sheet.cssRules[i].cssText)) {
                sheet.deleteRule(i);
                removedRules++;
              }
            }
          }
          const after = snapshot();
          return {
            removedRules,
            checkedElements: before.length,
            changedElements: before.flatMap((element, i) =>
              JSON.stringify(element) === JSON.stringify(after[i]) ? [] : [i],
            ),
          };
        });
        assert.ok(isolation.removedRules > 0, 'Exercise the Areas stylesheet');
        assert.deepEqual(isolation.changedElements, [], `Areas CSS changes no ${name} element`);
        results[`${name}StyleIsolation`] = isolation;
        comparison.note =
          'Raw photo raster differences are retained; source hashes, every computed style/box/image URL and pixels outside photos remain unchanged.';
        assert.ok(
          maxChannelDifference <= 40,
          `Photo raster channel difference ${maxChannelDifference} exceeds observed compositor variation`,
        );
      }
      return comparison;
    });
  }

  await check('no runtime errors and no real booking requests', async () => {
    assert.deepEqual(results.pageErrors, []);
    assert.deepEqual(results.consoleErrors, []);
    assert.equal(
      interceptedBookings.some((request) => request.mode === 'forbidden'),
      false,
      'No unexpected booking submissions',
    );
    return {
      runtimeErrors: 0,
      consoleErrors: 0,
      expectedSimulatedServerErrors: results.expectedConsoleErrors.length,
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
    '# Areas reference QA',
    '',
    `URL: ${baseURL}/areas`,
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
    ...['home', 'services'].map((name) =>
      results[`${name}Comparison`]
        ? `${name}: ${results[`${name}Comparison`].differentPixels} pixels changed against ${name}-before.png.`
        : '',
    ),
  ].join('\n');
  await writeFile(path.join(output, 'qa-results.md'), summary);
  await browser.close();
}
console.log(JSON.stringify({ passed: results.passed, failed: results.failed, output }));
process.exitCode = results.failed ? 1 : 0;
