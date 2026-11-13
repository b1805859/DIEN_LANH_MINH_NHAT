import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.argv[2] || 'http://127.0.0.1:3006';
const output = 'output/home-ice-blue/responsive-fix';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const sizes = [[320,700],[360,800],[390,844],[430,932],[600,900],[601,900],
  [768,1024],[820,1180],[844,390],[900,700],[901,700],[1024,768],
  [1100,800],[1101,800],[1122,850],[1280,800],[1440,900],[1920,1080],[2560,1440]];
const screenshotWidths = new Set([390,768,1024,1440,1920,2560]);
try {
  for (const [width, height] of sizes) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(origin, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const hero = await page.locator('section[aria-labelledby="ice-home-title"]').evaluate(element => {
      const copy = element.firstElementChild.getBoundingClientRect();
      const art = element.lastElementChild.getBoundingClientRect();
      return { copy: copy.toJSON(), art: art.toJSON() };
    });
    assert(hero.art.width > 200 && hero.art.height > 150, `House missing at ${width}`);
    assert(hero.copy.right <= hero.art.left + 1 || hero.copy.bottom <= hero.art.top + 1, `Hero overlap at ${width}`);
    assert.equal(await page.locator('h1').count(), 1);
    const menu = page.getByRole('button', { name: 'Mở menu', exact: true });
    assert.equal(await menu.isVisible(), width < 1101, `Home navigation at ${width}`);
    if (await menu.isVisible()) {
      await menu.click();
      const dialog = page.getByRole('dialog', { name: 'Điều hướng di động' });
      assert(await dialog.isVisible(), `Menu failed at ${width}`);
      assert(await dialog.getByRole('link', { name: 'Nhận tư vấn' }).isVisible());
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
    }
    const groups = page.getByRole('group', { name: 'Chọn nhóm thiết bị' }).getByRole('button');
    assert.equal(await groups.count(), 6);
    const panels = [];
    for (let index = 0; index < 6; index++) {
      await groups.nth(index).evaluate(element => element.scrollIntoView({ block: 'center' }));
      await groups.nth(index).click();
      const id = await groups.nth(index).getAttribute('aria-controls');
      const panel = page.locator(`#${id}`);
      assert(await panel.isVisible());
      const metrics = await panel.locator('article').evaluateAll(cards => cards.map(card => {
        const title = card.querySelector('h3');
        const copy = card.querySelector('p');
        const button = card.querySelector('a');
        const rect = card.getBoundingClientRect();
        const nodes = [title, copy, button];
        return {
          titleFont: parseFloat(getComputedStyle(title).fontSize),
          bodyFont: parseFloat(getComputedStyle(copy).fontSize),
          buttonHeight: button.getBoundingClientRect().height,
          buttonGap: button.getBoundingClientRect().top - copy.getBoundingClientRect().bottom,
          overflow: nodes.some(node => {
            const bounds = node.getBoundingClientRect();
            return node.scrollWidth > node.clientWidth + 1 || bounds.right > rect.right + 1 || bounds.bottom > rect.bottom + 1;
          }),
        };
      }));
      assert.equal(metrics.length, [3,2,1,1,1,1][index]);
      assert(metrics.every(card => card.titleFont >= 17 && card.bodyFont >= 14 && card.buttonHeight >= 44 && card.buttonGap >= 0 && !card.overflow), `Card layout ${width}: ${id}: ${JSON.stringify(metrics)}`);
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert(!horizontalOverflow, `Horizontal overflow ${width}: ${id}`);
      panels.push({ id, metrics });
    }
    // Native keyboard selection must leave focus on the control.
    await groups.first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await groups.first().getAttribute('aria-pressed'), 'true');
    assert(await groups.first().evaluate(element => element === document.activeElement));
    const header = await page.locator('header .mn-nav-shell').evaluate(element => {
      const visible = [...element.querySelectorAll('a,button')].filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.width && rect.height && !node.closest('details:not([open])');
      });
      return visible.filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 2;
      }).map(node => node.textContent);
    });
    assert.equal(header.length, 0, `Header clipping ${width}: ${header}`);
    await page.evaluate(() => {
      document.activeElement?.blur();
      scrollTo(0, 0);
    });
    if (screenshotWidths.has(width)) {
      await page.screenshot({ path: `${output}/after-${width}.png`, fullPage: true });
      await page.screenshot({ path: `${output}/after-top-${width}.png` });
    }
    assert.deepEqual(errors, []);
    results.push({ width, height, hero, panels, errors });
    console.log(`PASS ${width} × ${height}: hero, six groups, readable cards, menu, keyboard, no overflow`);
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, reducedMotion: 'reduce' });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
  await page.setViewportSize({ width: 1101, height: 800 });
  await page.getByRole('dialog', { name: 'Điều hướng di động' }).waitFor({ state: 'hidden' });
  await page.setViewportSize({ width: 640, height: 500 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, '200% zoom/reflow equivalent at 1280px');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({ content: ':root { --mn-safe-top: 44px; }' });
  await page.evaluate(() => scrollTo(0, 0));
  const shell = await page.locator('header .mn-nav-shell').boundingBox();
  assert(shell.y >= 44, 'Header must respect the top safe area');
  const area = page.locator('.mn-area-chips button').first();
  await area.evaluate(element => element.scrollIntoView({ block: 'center' }));
  await area.click();
  assert.equal(await area.getAttribute('aria-pressed'), 'true');
  assert(await page.locator('.mn-area-photo-credit').isVisible());
  const footer = page.getByRole('button', { name: 'Liên kết nhanh', exact: true });
  await footer.click();
  assert.equal(await footer.getAttribute('aria-expanded'), 'true');
  for (const route of ['/services', '/services/sua-may-lanh', '/contact']) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert(await page.locator('header .mn-nav-book').isVisible(), `Inner-page header changed: ${route}`);
  }
  console.log('PASS resize, reflow, safe-area, service area, footer, four inner routes');
} finally {
  await fs.writeFile(`${output}/after.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
