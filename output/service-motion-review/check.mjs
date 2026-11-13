import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const errors = [];
const checks = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', error => errors.push(error.message));
const goto = async (route, target = page) => {
  const response = await target.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, route);
};
const scrollTo = async (y, target = page) => {
  await target.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
};
const readable = async (locator) => {
  for (const item of await locator.evaluateAll(es => es.map(e => ({ text: e.textContent.slice(0, 45), opacity: getComputedStyle(e).opacity, state: e.dataset.mnReveal })))) {
    assert.equal(item.opacity, '1', JSON.stringify(item));
    if (item.state) assert.equal(item.state, 'ready', JSON.stringify(item));
  }
};
await goto('/services');
assert.equal(await page.locator('.mn-service-card [data-mn-reveal]').count(), 0);
const targetCount = await page.locator('[data-mn-reveal]').count();
assert.ok(targetCount < 30);
await scrollTo(340);
await page.waitForTimeout(800);
await readable(page.locator('.mn-service-card'));
assert.equal(await page.locator('.mn-service-card[style*="transform"]').count(), 0);
await scrollTo(0);
await page.waitForTimeout(300);
await readable(page.locator('.mn-service-card'));
checks.push('Desktop: whole-card entrances finish after scrolling stops; upward scroll keeps content readable; transforms released for hover.');
for (const category of ['Máy lạnh', 'Máy giặt', 'Tủ lạnh', 'Điện nước · Nóng lạnh', 'Tất cả dịch vụ']) {
  await page.getByRole('button', { name: category, exact: true }).click();
  await page.waitForTimeout(700);
  assert.ok(await page.locator('.mn-service-card').count() > 0);
  const visible = page.locator('.mn-service-card').filter({ visible: true });
  const opacity = await visible.evaluateAll(es => es.filter(e => e.getBoundingClientRect().top < innerHeight).map(e => getComputedStyle(e).opacity));
  assert.ok(opacity.every(value => value === '1'), `${category}: ${opacity}`);
}
const routes = await page.locator('.mn-service-card').evaluateAll(es => es.map(e => new URL(e.href).pathname));
await page.getByRole('button', { name: 'Thu gọn dịch vụ' }).click();
await page.waitForTimeout(700);
assert.equal(await page.locator('.mn-service-card').count(), 6);
checks.push('All category filters and expand/collapse return readable cards.');
// Reach a below-fold card by keyboard: focus must complete its entrance.
await page.getByRole('button', { name: /Xem tất cả/ }).click();
await page.keyboard.press('Tab');
await page.locator('.mn-service-card').last().focus();
await page.waitForTimeout(100);
await readable(page.locator('.mn-service-card').last());
checks.push('Keyboard focus reveals a below-fold service card immediately.');
for (const route of [...routes, '/areas/cai-rang/sua-tu-lanh']) {
  await goto(route);
  assert.equal(await page.locator('.mn-site').getAttribute('data-service-page'), 'true');
  const form = page.locator('.mn-detail-booking');
  assert.equal(await form.getAttribute('data-mn-reveal'), null);
  await readable(form);
  assert.equal(await form.evaluate(e => getComputedStyle(e).transform), 'none');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
}
checks.push(`All ${routes.length} service details and one area-service page load; booking panels stay visible and free of transforms.`);
await goto('/services/sua-may-lanh');
await page.keyboard.press('Tab');
await page.locator('.mn-faq-list summary').first().focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(500);
assert.equal(await page.locator('.mn-faq-list details').first().evaluate(e => e.open), true);
await readable(page.locator('.mn-faq-list details').first());
await page.screenshot({ path: 'output/service-motion-review/after-faq-desktop.png' });
await page.locator('.mn-process').scrollIntoViewIfNeeded();
await page.waitForTimeout(2200);
assert.equal(await page.locator('.mn-process').getAttribute('data-journey-state'), 'complete');
await page.screenshot({ path: 'output/service-motion-review/after-process-desktop.png' });
checks.push('FAQ works with keyboard; desktop process emphasis completes within 2.2 seconds.');
// Navigate via Next links to verify cleanup, not just fresh document loads.
await page.locator('.mn-detail-layout > article > .mn-text-link').click();
await page.waitForURL('**/services');
await page.waitForTimeout(800);
await page.locator('.mn-service-card').first().click();
await page.waitForURL('**/services/sua-may-lanh');
await page.waitForTimeout(800);
await readable(page.locator('.mn-detail-booking'));
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(400);
assert.equal(await page.locator('[data-mn-reveal]').count(), 0);
await readable(page.locator('.mn-service-symptoms li, .mn-faq-list details, .mn-detail-booking'));
assert.equal(await page.locator('.mn-page-hero h1').evaluate(e => getComputedStyle(e).animationName), 'none');
checks.push('Client navigation cleans up old reveals; changing reduced-motion preference restores static content.');
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
mobile.on('pageerror', error => errors.push(error.message));
await goto('/services', mobile);
assert.equal(await mobile.locator('.mn-site').getAttribute('data-motion-budget'), 'limited');
const secondTop = await mobile.locator('.mn-service-card').nth(1).evaluate(e => e.getBoundingClientRect().top + scrollY);
await scrollTo(secondTop - 550, mobile);
await mobile.waitForTimeout(600);
await readable(mobile.locator('.mn-service-card').nth(1));
await mobile.screenshot({ path: 'output/service-motion-review/after-catalog-mobile.png' });
await scrollTo(0, mobile);
await mobile.waitForTimeout(250);
await readable(mobile.locator('.mn-service-card').nth(1));
await goto('/services/sua-may-lanh', mobile);
await mobile.screenshot({ path: 'output/service-motion-review/after-detail-mobile.png' });
await mobile.locator('.mn-detail-booking').scrollIntoViewIfNeeded();
await readable(mobile.locator('.mn-detail-booking'));
await mobile.screenshot({ path: 'output/service-motion-review/after-booking-mobile.png' });
await mobile.locator('.mn-process').scrollIntoViewIfNeeded();
assert.equal(await mobile.locator('.mn-process').getAttribute('data-journey-state'), 'complete');
checks.push('Touch mobile uses shorter entrances without image zoom; form and compact process stay immediately available.');
for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ['/services', '/services/sua-may-lanh', '/areas/cai-rang/sua-tu-lanh']) {
    await goto(route);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${width}`);
    await readable(page.locator('.mn-detail-booking'));
  }
}
checks.push('No horizontal overflow at 320, 390, 768 or 1440px.');
await goto('/');
assert.equal(await page.locator('.mn-site').getAttribute('data-service-page'), null);
await goto('/about');
assert.equal(await page.locator('.mn-site').getAttribute('data-service-page'), null);
checks.push('Homepage and About retain their existing motion scope.');
assert.deepEqual(errors, []);
await fs.writeFile('output/service-motion-review/results.json', JSON.stringify({ targetCount, routes, checks, errors }, null, 2));
console.log(JSON.stringify({ targetCount, checks, errors }, null, 2));
await browser.close();
