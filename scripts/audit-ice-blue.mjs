import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = process.argv[2] || 'http://127.0.0.1:3005';
const output = 'output/home-ice-blue';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [width, height] of [[360,800],[390,844],[768,1024],[844,390],[1440,1000],[1920,1080],[2560,1440]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 901 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert(await page.locator('h1').isVisible());
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert(!overflow, `Horizontal overflow at ${width}`);
    const groups = page.getByRole('group', { name: 'Chọn nhóm thiết bị' }).getByRole('button');
    assert.equal(await groups.count(), 6);
    const acSpacing = await page.locator('#services-air-conditioner article').evaluateAll(cards => cards.map(card => {
      const title = card.querySelector('h3').getBoundingClientRect();
      const copy = card.querySelector('p').getBoundingClientRect();
      const button = card.querySelector('a').getBoundingClientRect();
      return { headingGap: copy.top - title.bottom, buttonGap: button.top - copy.bottom };
    }));
    assert(acSpacing.every(item => item.headingGap >= 0 && item.buttonGap >= 0), `AC card overlap at ${width}px`);
    const counts = [3,2,1,1,1,1];
    const urls = new Set();
    for (let index = 0; index < 6; index++) {
      await groups.nth(index).click();
      assert.equal(await groups.nth(index).getAttribute('aria-pressed'), 'true');
      const panelId = await groups.nth(index).getAttribute('aria-controls');
      const panel = page.locator(`#${panelId}`);
      assert(await panel.isVisible());
      const links = await panel.locator('a[href^="/services/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
      assert.equal(links.length, counts[index]);
      links.forEach(link => urls.add(link));
    }
    assert.equal(urls.size, 9);
    await groups.nth(0).click();
    // Keyboard selection uses native button semantics without moving focus to content.
    await groups.nth(1).focus();
    await page.keyboard.press('Enter');
    assert.equal(await groups.nth(1).getAttribute('aria-pressed'), 'true');
    await groups.nth(0).click();
    await page.evaluate(() => scrollTo(0,0));
    await page.screenshot({ path: `${output}/after-${width}.png`, fullPage: true });
    for (const [key, selector] of [['area','.mn-home-coverage-band'],['footer','.mn-home-footer']]) {
      await page.locator(selector).screenshot({ path: `${output}/after-${key}-${width}.png` });
    }
    const area = page.locator('.mn-area-chips button').first();
    await area.scrollIntoViewIfNeeded();
    await area.focus();
    await page.keyboard.press('Enter');
    assert.equal(await area.getAttribute('aria-pressed'), 'true');
    assert(await page.locator('.mn-area-photo-credit').isVisible());
    if (width < 901) {
      const footer = page.getByRole('button', { name: 'Liên kết nhanh', exact: true });
      await footer.click();
      assert.equal(await footer.getAttribute('aria-expanded'), 'true');
      await page.evaluate(() => scrollTo(0,0));
      await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
      assert(await page.getByRole('dialog', { name: 'Điều hướng di động' }).isVisible());
      await page.keyboard.press('Escape');
    }
    assert.equal(errors.length, 0, errors.join('\n'));
    await page.goto(origin + '/services', { waitUntil: 'networkidle' });
    const catalogueLinks = new Set(await page.locator('a[href^="/services/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))));
    assert.equal(catalogueLinks.size, 11);
    results.push({ width, height, groups: 6, serviceLinks: urls.size, catalogueLinks: catalogueLinks.size, overflow, errors,
      metrics: await page.evaluate(() => ({ navigation: performance.getEntriesByType('navigation')[0].toJSON(), paint: performance.getEntriesByType('paint').map(x => x.toJSON()) })) });
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const route of ['/services','/services/sua-may-lanh','/contact','/about']) {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route);
    assert.equal(await page.locator('header a.mn-nav-book').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(7, 89, 199)', `Home orange leaked into ${route}`);
  }
  await page.goto(origin, {waitUntil:'networkidle'});
  assert.equal(await page.locator('main canvas').count(), 0, 'Home should not mount the old airflow canvas');
  await page.screenshot({path:`${output}/motion-desktop.png`});
  console.log('PASS: seven viewports, six equipment groups, eleven catalogue service links, keyboard, area, footer, mobile menu and five inner routes.');
} finally {
  await fs.writeFile(`${output}/after-metrics.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
