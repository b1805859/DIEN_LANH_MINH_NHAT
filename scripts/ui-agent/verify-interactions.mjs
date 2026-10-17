import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { output, domMetrics } from './auditor.mjs';

const target = process.env.TARGET_URL || 'http://localhost:3000';
const results = [];
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
await mkdir(output, { recursive: true });
async function inspect(page, name) {
  await page.waitForTimeout(650);
  const dom = await domMetrics(page);
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await page.screenshot({
    path: path.join(output, `interaction-${name}.png`),
    animations: 'disabled',
  });
  const result = {
    name,
    smallTargets: dom.smallTouchTargets,
    missingTransitions: dom.missingTransitions,
    unsafeTransitions: dom.unsafeTransitions,
    horizontalOverflow: dom.horizontalOverflow,
    violations: axe.violations,
    incomplete: axe.incomplete.map((item) => ({ id: item.id, nodes: item.nodes.length })),
  };
  results.push(result);
  assert.equal(result.smallTargets, 0, `${name}: small targets`);
  assert.equal(result.missingTransitions, 0, `${name}: missing transitions`);
  assert.equal(result.unsafeTransitions, 0, `${name}: unsafe transitions`);
  assert.equal(result.horizontalOverflow, false, `${name}: horizontal overflow`);
  assert.equal(
    result.violations.length,
    0,
    `${name}: Axe violations: ${axe.violations.map((item) => item.id).join(', ')}`,
  );
}

try {
  for (const mobile of [false, true]) {
    const device = mobile ? 'mobile' : 'desktop';
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(target, { waitUntil: 'networkidle' });
    if (mobile) {
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Điều hướng di động' });
      await dialog.waitFor({ state: 'visible' });
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        assert.ok(
          await dialog.evaluate(
            (node) =>
              node.contains(document.activeElement) || document.activeElement === document.body,
          ),
          'Native modal traps focus',
        );
      }
      await inspect(page, `${device}-navigation`);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.ok(
        await page
          .getByRole('button', { name: 'Mở menu', exact: true })
          .evaluate((node) => node === document.activeElement),
        'Native modal restores trigger focus',
      );
    } else {
      const summary = page.locator('.mn-services-menu summary');
      await summary.click();
      await page.locator('.mn-services-dropdown').waitFor({ state: 'visible' });
      await inspect(page, `${device}-services-dropdown`);
      await summary.press('Escape');
      await page.locator('.mn-services-dropdown').waitFor({ state: 'hidden' });
      assert.equal(await page.locator('.mn-services-menu').getAttribute('open'), null);
    }

    await page.getByRole('button', { name: 'Mở AI tư vấn', exact: true }).click();
    const chat = page.getByRole('dialog', { name: 'AI tư vấn Minh Nhật', exact: true });
    await chat.waitFor({ state: 'visible' });
    await chat.getByRole('button', { name: 'Máy lạnh không lạnh', exact: true }).click();
    assert.ok(
      (await chat.getByRole('log').innerText()).includes('lưới lọc/dàn lạnh bẩn'),
      'Consultation rule unchanged',
    );
    await inspect(page, `${device}-chat`);
    await page.keyboard.press('Escape');
    await chat.waitFor({ state: 'hidden' });
    assert.ok(
      await page
        .getByRole('button', { name: 'Mở AI tư vấn', exact: true })
        .evaluate((node) => node === document.activeElement),
      'Chat restores trigger focus',
    );

    await page.getByRole('tab', { name: 'Tin tức hữu ích' }).click();
    assert.equal(
      await page.getByRole('tab', { name: 'Tin tức hữu ích' }).getAttribute('aria-selected'),
      'true',
    );
    await page.keyboard.press('ArrowLeft');
    assert.equal(
      await page.getByRole('tab', { name: 'Dự án thực tế' }).getAttribute('aria-selected'),
      'true',
    );

    await page.goto(new URL('/services', target).href, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Xem tất cả .* dịch vụ/ }).click();
    await page.getByRole('button', { name: 'Máy lạnh', exact: true }).click();
    assert.equal(
      await page
        .getByRole('button', { name: 'Máy lạnh', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await inspect(page, `${device}-service-filter`);

    await page.goto(new URL('/booking', target).href, { waitUntil: 'networkidle' });
    let mutations = 0;
    // Fail closed: these checks must never submit a real booking or log into an account.
    await page.route('**/*', async (route) => {
      if (route.request().method() !== 'GET' && route.request().method() !== 'HEAD') {
        mutations++;
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'UI audit fixture' }),
        });
      } else await route.continue();
    });
    await page.getByRole('button', { name: 'Gửi yêu cầu đặt lịch', exact: true }).click();
    await page.getByText('Vui lòng nhập họ tên.', { exact: true }).waitFor();
    assert.equal(mutations, 0, 'Invalid booking is rejected locally');
    await inspect(page, `${device}-booking-validation`);

    await page.goto(new URL('/admin/login', target).href, { waitUntil: 'networkidle' });
    await page
      .getByRole('textbox', { name: 'Email', exact: true })
      .fill('ui-audit@example.invalid');
    await page.getByLabel('Mật khẩu', { exact: true }).fill('ui-audit-invalid-password');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    const notification = page.getByRole('alertdialog');
    await notification.waitFor({ state: 'visible' });
    await page.keyboard.press('Tab');
    assert.ok(
      await notification.evaluate((node) => node.contains(document.activeElement)),
      'Notification traps focus',
    );
    await inspect(page, `${device}-notification`);
    await page.keyboard.press('Escape');
    await notification.waitFor({ state: 'hidden' });
    assert.equal(mutations, 1, 'Login error is mocked; no request reaches the server');

    await page.goto(target, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(700);
    const reduced = await domMetrics(page);
    assert.equal(
      reduced.elements.filter((element) => !element.missingTransition).length,
      0,
      'Reduced motion disables control transitions',
    );
    assert.equal(
      await page.evaluate(
        () =>
          document.getAnimations().filter((animation) => animation.playState === 'running').length,
      ),
      0,
      'Reduced motion stops decorative loops',
    );
    assert.deepEqual(errors, [], 'No browser runtime errors');
    results.push({
      name: `${device}-keyboard-and-reduced-motion`,
      passed: true,
      runtimeErrors: errors,
      realMutations: 0,
      mockedMutations: mutations,
    });
    await context.close();
  }
  console.log(`PASS: ${results.length} interaction checks.`);
} catch (error) {
  results.push({ name: 'failure', error: error.message });
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(
    path.join(output, 'interaction-verification.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), target, results }, null, 2),
  );
}
