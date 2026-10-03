import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Exercise the rendered homepage in real Chrome. All navigation is local and no
// booking/contact forms are submitted. Output is reviewable alongside the mockup.
const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const output = path.join(repositoryRoot, 'output/reference-home');
const baseURL = process.env.HOME_QA_URL || 'http://localhost:3000';
const widths = [320, 375, 390, 768, 1024, 1280, 1440];
const results = { baseURL, startedAt: new Date().toISOString(), viewports: [], checks: [] };
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(15_000);
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push({ url: page.url(), message: error.message }));

const settle = async () => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};
const home = async () => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).waitFor();
  await settle();
};
const check = async (name, run) => {
  try {
    const details = await run();
    results.checks.push({ name, passed: true, details });
    console.log(`PASS ${name}`);
  } catch (error) {
    const screenshot = `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-failure.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true }).catch(() => {});
    const message = error.message.replace(/\u001b\[[0-9;]*m/g, '');
    results.checks.push({ name, passed: false, error: message, screenshot });
    console.error(`FAIL ${name}: ${error.message}`);
    await page.evaluate(() => document.querySelectorAll('dialog[open]').forEach((d) => d.close())).catch(() => {});
  }
};

try {
  for (const width of widths) {
    await check(`viewport ${width}`, async () => {
      const height = width <= 390 ? 844 : 1536;
      await page.setViewportSize({ width, height });
      await home();
      // Visit the full document to load actual lazy images before checking them.
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let top = 0; top < scrollHeight; top += height * 0.75) {
        await page.evaluate((y) => window.scrollTo(0, y), top);
        await page.waitForTimeout(80);
      }
      const imageResults = await page.locator('img').evaluateAll(async (images) => {
        const visible = images.filter((img) => img.getClientRects().length && !img.closest('dialog:not([open])'));
        return Promise.all(visible.map(async (img) => {
          let error;
          let timeout;
          try {
            await Promise.race([
              img.decode(),
              new Promise((_, reject) => {
                timeout = setTimeout(() => reject(new Error('Image decode timed out after 10s')), 10_000);
              }),
            ]);
          } catch (caught) {
            error = String(caught);
          } finally {
            clearTimeout(timeout);
          }
          return { alt: img.alt, src: img.currentSrc || img.src, width: img.naturalWidth, height: img.naturalHeight, error };
        }));
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle();
      const geometry = await page.evaluate(() => {
        const round = (value) => Math.round(value * 100) / 100;
        const bounds = (selector) => {
          const element = document.querySelector(selector);
          const rectangle = element.getBoundingClientRect();
          return { y: round(rectangle.top + window.scrollY), height: round(rectangle.height), bottom: round(rectangle.bottom + window.scrollY) };
        };
        return {
          viewportWidth: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          sections: {
            hero: bounds('section[aria-labelledby="home-title"]'),
            services: bounds('#dich-vu'),
            about: bounds('#gioi-thieu'),
            process: bounds('#quy-trinh'),
            gallery: bounds('#hinh-anh'),
            footer: bounds('footer'),
          },
        };
      });
      const screenshot = `home-${width}.png`;
      await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
      const data = { width, height, ...geometry, images: imageResults, screenshot };
      results.viewports.push(data);
      assert.ok(geometry.documentWidth <= width, `document scroll width ${geometry.documentWidth} exceeds ${width}`);
      assert.ok(geometry.bodyWidth <= width, `body scroll width ${geometry.bodyWidth} exceeds ${width}`);
      const failedImages = imageResults.filter((image) => image.error || !image.width || !image.height);
      assert.deepEqual(failedImages, [], 'All rendered images must decode; hidden dialog images are excluded');
      assert.equal(await page.locator('#dich-vu h3').count(), 5, 'Five service cards');
      assert.equal(await page.locator('#quy-trinh ol > li').count(), 4, 'Four process steps');
      assert.equal(await page.locator('#hinh-anh button[aria-label^="Xem ảnh:"]').count(), 5, 'Five gallery thumbnails');
      if (width === 1024) {
        const referenceY = { hero: 0, services: 466, about: 720, process: 1023, gallery: 1196, footer: 1354 };
        for (const [section, y] of Object.entries(referenceY)) {
          assert.ok(Math.abs(geometry.sections[section].y - y) <= 1, `${section} begins at ${geometry.sections[section].y}; reference ${y}`);
        }
        assert.ok(Math.abs(geometry.documentHeight - 1536) <= 1, `Native page height ${geometry.documentHeight}; reference 1536`);
      }
      return { screenshot, documentWidth: geometry.documentWidth, imageCount: imageResults.length };
    });
  }

  await page.setViewportSize({ width: 1024, height: 1536 });
  await home();
  await check('search unaccented filter Escape focus and result navigation', async () => {
    const trigger = page.getByRole('button', { name: 'Tìm kiếm dịch vụ', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Tìm kiếm dịch vụ', exact: true });
    await dialog.waitFor({ state: 'visible' });
    await dialog.getByRole('searchbox', { name: 'Tên dịch vụ' }).fill('may giat');
    const links = dialog.getByRole('link');
    assert.equal(await links.count(), 1);
    assert.equal(await links.first().innerText(), 'Sửa chữa máy giặt');
    assert.equal(await links.first().getAttribute('href'), '/services/sua-may-giat');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await trigger.evaluate((button) => button === document.activeElement), true, 'Escape restores focus to search trigger');
    await trigger.click();
    await dialog.getByRole('searchbox', { name: 'Tên dịch vụ' }).fill('lap dat');
    assert.equal(await links.count(), 1, 'Unaccented d matches Vietnamese đ');
    assert.equal(await links.first().getAttribute('href'), '/services/thao-lap-may-lanh');
    await dialog.getByRole('searchbox', { name: 'Tên dịch vụ' }).fill('may giat');
    await links.first().click();
    await page.waitForURL('**/services/sua-may-giat');
    await page.getByRole('heading', { level: 1 }).waitFor();
    return { destination: new URL(page.url()).pathname };
  });

  await home();
  await check('gallery cycling lightbox arrows Escape and focus', async () => {
    const thumbnails = page.locator('#hinh-anh button[aria-label^="Xem ảnh:"]');
    const original = await thumbnails.locator('img').evaluateAll((images) => images.map((img) => img.alt));
    const nextGroup = page.getByRole('button', { name: 'Nhóm ảnh tiếp theo', exact: true });
    await nextGroup.click();
    assert.equal(await thumbnails.first().locator('img').getAttribute('alt'), original[1]);
    for (let index = 0; index < 4; index++) await nextGroup.click();
    assert.deepEqual(await thumbnails.locator('img').evaluateAll((images) => images.map((img) => img.alt)), original);
    await thumbnails.first().click();
    const dialog = page.getByRole('dialog', { name: 'Thư viện hình ảnh' });
    await dialog.waitFor({ state: 'visible' });
    const photo = dialog.locator('img');
    assert.equal(await photo.getAttribute('alt'), original[0]);
    await dialog.getByRole('button', { name: 'Ảnh tiếp theo', exact: true }).click();
    assert.equal(await photo.getAttribute('alt'), original[1]);
    await page.keyboard.press('ArrowRight');
    assert.equal(await photo.getAttribute('alt'), original[2]);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await photo.getAttribute('alt'), original[1]);
    await dialog.getByRole('button', { name: 'Ảnh trước', exact: true }).click();
    assert.equal(await photo.getAttribute('alt'), original[0]);
    await photo.evaluate((image) => image.decode());
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await thumbnails.first().evaluate((button) => button === document.activeElement), true);
    return { cycleLength: original.length };
  });

  await check('video plays 14 seconds and close pauses', async () => {
    await page.getByRole('button', { name: 'Xem video', exact: true }).click();
    const dialog = page.locator('dialog[aria-label="Video giới thiệu quy trình Điện Lạnh Minh Nhật"]').first();
    await dialog.waitFor({ state: 'visible' });
    const video = dialog.locator('video');
    await page.waitForFunction(() => {
      const element = document.querySelector('dialog[open] video');
      return element && element.readyState >= 2 && element.currentTime > 0 && !element.paused;
    });
    const playback = await video.evaluate((element) => ({ duration: element.duration, currentTime: element.currentTime, paused: element.paused, error: element.error?.message }));
    assert.ok(Math.abs(playback.duration - 14) < 0.1, `Expected 14s, received ${playback.duration}`);
    assert.equal(playback.error, undefined);
    await dialog.getByRole('button', { name: 'Đóng video' }).click();
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every((element) => element.paused));
    assert.equal(await video.evaluate((element) => element.paused), true);
    return playback;
  });

  await check('booking CTA navigates locally without submission', async () => {
    await page.locator('section[aria-labelledby="home-title"]').getByRole('link', { name: 'Đặt lịch ngay' }).click();
    await page.waitForURL('**/booking');
    await page.getByRole('heading', { level: 1 }).waitFor();
    return { destination: new URL(page.url()).pathname };
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await home();
  await check('mobile menu opens and services link navigates', async () => {
    await page.getByRole('button', { name: 'Mở menu' }).click();
    const navigation = page.getByRole('navigation', { name: 'Điều hướng di động' });
    await navigation.waitFor({ state: 'visible' });
    await navigation.getByRole('link', { name: 'Dịch vụ', exact: true }).click();
    await page.waitForURL('**/services');
    await page.getByRole('heading', { level: 1 }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    return { destination: new URL(page.url()).pathname };
  });
  await check('no unhandled browser page errors', async () => {
    assert.deepEqual(pageErrors, []);
    return { pageErrors };
  });
} finally {
  results.finishedAt = new Date().toISOString();
  results.pageErrors = pageErrors;
  results.passed = results.checks.every((check) => check.passed);
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
  const report = ['# Homepage reference QA', '', `URL: ${baseURL}`, '', ...results.checks.map((check) => `- ${check.passed ? 'PASS' : 'FAIL'} ${check.name}${check.error ? `: ${check.error}` : ''}`), '', 'Screenshots: home-{320,375,390,768,1024,1280,1440}.png', '', 'No forms were submitted. Hidden dialog images are excluded from initial image checks.', ''];
  await writeFile(path.join(output, 'results.md'), report.join('\n'));
  await browser.close();
}
if (!results.passed) process.exitCode = 1;
