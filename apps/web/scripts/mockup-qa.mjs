// Run from repository root: node apps/web/scripts/mockup-qa.mjs
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const output = 'output/visual-qa';
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === 'darwin'
      ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }
      : {}),
  });
  const errors = [],
    results = [];
  const routes = [
    ['home', '/'],
    ['service', '/services/sua-tu-lanh'],
    ['booking', '/booking'],
    ['about', '/about'],
    ['contact', '/contact'],
  ];
  for (const width of [375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 1000 } });
    page.on('pageerror', (error) => errors.push(error.message));
    for (const [name, path] of routes) {
      const response = await page.goto(base + path);
      assert.equal(response.status(), 200, path);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images]
            .filter((i) => i.getClientRects().length)
            .map((i) => i.decode().catch(() => {})),
        );
      });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images]
          .filter((i) => i.getClientRects().length && (!i.complete || !i.naturalWidth))
          .map((i) => i.src),
      }));
      results.push({ width, page: name, ...state });
      if (width === 1280 || width === 390)
        await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true });
    }
    if (width < 768) {
      await page.goto(base);
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await page.getByRole('dialog').waitFor();
      if (width === 390) await page.screenshot({ path: `${output}/menu-390.png`, fullPage: true });
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(), 0);
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      await page
        .getByRole('navigation', { name: 'Liên kết di động' })
        .getByRole('link', { name: 'Tủ lạnh', exact: true })
        .click();
      await page.waitForURL('**/services/sua-tu-lanh');
      assert.equal(await page.getByRole('dialog').count(), 0);
    }
    await page.close();
  }
  const p = await browser.newPage();
  await p.goto(base + '/booking');
  await p.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();
  assert.equal(await p.locator('form').getByRole('alert').count(), 4, 'required fields');
  let payload;
  await p.route('**/bookings', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: '{"id":"qa-booking"}',
    });
  });
  await p.getByLabel('Họ và tên').fill('Nguyễn Văn Kiểm Thử');
  await p.getByLabel('Số điện thoại').fill('090 123 4567');
  await p.getByLabel('Dịch vụ cần làm').selectOption('sua-tu-lanh');
  await p.getByLabel('Địa chỉ').fill('123 Cần Thơ');
  await p.getByLabel('Ghi chú').fill('Ghi chú kiểm thử — không gửi đến máy chủ.');
  await p.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();
  await p.getByText('Đã gửi yêu cầu. Minh Nhật sẽ liên hệ xác nhận.', { exact: true }).waitFor();
  assert.equal(payload.customerPhone, '0901234567');
  assert.equal(payload.notes, 'Ghi chú kiểm thử — không gửi đến máy chủ.');
  await browser.close();
  const report = {
    results,
    errors,
    booking:
      'Required-field validation and intercepted success payload passed; no live booking created.',
  };
  fs.writeFileSync(`${output}/results.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.equal(errors.length, 0, 'browser errors');
  assert.ok(
    results.every((r) => !r.overflow && !r.broken.length),
    'responsive/image checks',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
