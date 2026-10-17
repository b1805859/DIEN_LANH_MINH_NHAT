import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.HERO_QA_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const checks = [];
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
const hero = page.locator('.mn-hero-carousel');
const select = (index) =>
  page.getByRole('button', { name: new RegExp(`^Slide ${index + 1}:`) }).click();
const active = () => hero.getAttribute('data-active');
async function idlePointer() {
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement?.blur());
}
async function waitActive(index) {
  await page.waitForFunction(
    (i) => document.querySelector('.mn-hero-carousel').dataset.active === String(i),
    index,
  );
}
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#hero-family img')?.complete);
  await idlePointer();
  assert.equal(await hero.getAttribute('data-running'), 'true');
  assert.equal(
    await page.locator('#hero-local img').count(),
    0,
    'Third slide must not download at initial load',
  );
  checks.push('Family image has priority; only the next slide is preloaded initially');

  // Real playback: not a mocked timer. The first automatic transition takes seven seconds.
  await waitActive(1);
  await page.waitForTimeout(1100);
  assert.equal(
    await page.getByRole('heading', { level: 1 }).innerText(),
    'Chăm sóc thiết bị,\nan tâm mỗi ngày',
  );
  checks.push('Seven-second autoplay advances to the service slide with its own heading');
  await page.mouse.move(500, 200);
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'false',
  );
  const scale = () =>
    page
      .locator('[aria-current="true"] span span')
      .evaluate((el) => getComputedStyle(el).transform);
  const progress = await scale();
  await page.waitForTimeout(600);
  assert.equal(await scale(), progress, 'Progress must freeze during hover');
  await idlePointer();
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'true',
  );
  checks.push('Hover freezes progress and elapsed time; leaving resumes autoplay');

  await page.getByRole('button', { name: 'Slide tiếp theo', exact: true }).focus();
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'false',
  );
  await idlePointer();
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'true',
  );
  checks.push('Keyboard focus pauses autoplay and blur resumes it');

  // Simulate the browser visibility event without touching the user's tabs.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'false',
  );
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'true',
  );
  checks.push('Visibility-change handling pauses/resumes the single autoplay timer');
  await page.getByRole('button', { name: 'Slide tiếp theo', exact: true }).focus();

  await select(0);
  await waitActive(0);
  await page.waitForTimeout(1100);
  const before = await hero.boundingBox();
  await select(1);
  await waitActive(1);
  await page.waitForTimeout(200);
  const opacities = await page
    .locator('#hero-family, #hero-services')
    .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
  assert(
    opacities.every((v) => v > 0 && v < 1),
    `Expected crossfade, got ${opacities}`,
  );
  await page.waitForTimeout(950);
  assert.equal((await hero.boundingBox()).height, before.height);
  checks.push('700ms crossfade has both images visible mid-transition and no height jump');
  await page.getByRole('button', { name: 'Slide tiếp theo', exact: true }).focus();
  await page.keyboard.press('End');
  await waitActive(2);
  await page.keyboard.press('ArrowRight');
  await waitActive(0);
  await page.keyboard.press('ArrowLeft');
  await waitActive(2);
  await page.keyboard.press('Home');
  await waitActive(0);
  checks.push('Arrow keys, Home/End and infinite previous/next loop work');
  for (const index of [2, 1, 0, 2, 0]) await select(index);
  await waitActive(0);
  await page.waitForTimeout(1100);
  assert.equal(await hero.locator('article[aria-hidden="false"]').count(), 1);
  assert.equal(await hero.locator('article:not([aria-hidden="false"]):not([inert])').count(), 0);
  checks.push('Rapid manual navigation settles on one accessible slide without stale state');

  const sizes = [1440, 1280, 1024, 768, 390, 375];
  for (const width of sizes) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    for (const index of [0, 1, 2]) {
      await select(index);
      await waitActive(index);
      await page.waitForTimeout(1100);
      await page.evaluate(() => window.scrollTo(0, 0));
      const layout = await hero.evaluate((el) => {
        const article = el.querySelector('article[aria-hidden="false"]');
        const copy = article.querySelector('.mn-hero-copy').getBoundingClientRect();
        const controls = el
          .querySelector('[aria-label="Điều khiển carousel"]')
          .getBoundingClientRect();
        const quick = el.querySelector('.mn-quick-services').getBoundingClientRect();
        const media = article
          .querySelector('img')
          .parentElement.parentElement.getBoundingClientRect();
        const image = article.querySelector('img').getBoundingClientRect();
        const svg = article.querySelector('svg[viewBox="0 0 1747 900"]')?.getBoundingClientRect();
        const familyFits =
          !svg ||
          [
            [965, 465, 1150, 590],
            [1180, 540, 1340, 660],
            [1380, 440, 1510, 580],
            [1160, 144, 1512, 335],
          ].every(
            ([x1, y1, x2, y2]) =>
              image.left + (x1 / 1747) * image.width >= media.left - 1 &&
              image.left + (x2 / 1747) * image.width <= media.right + 1 &&
              image.top + (y1 / 900) * image.height >= media.top - 1 &&
              image.top + (y2 / 900) * image.height <= media.bottom + 1,
          );
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          copyOverlapsControls: copy.bottom > controls.top,
          controlsOverlapQuick: controls.bottom > quick.top,
          familyFits,
          aligned:
            !svg ||
            (Math.abs(svg.left - image.left) < 1 &&
              Math.abs(svg.top - image.top) < 1 &&
              Math.abs(svg.width - image.width) < 1 &&
              Math.abs(svg.height - image.height) < 1),
        };
      });
      assert.equal(layout.overflow, false, `Overflow at ${width}, slide ${index}`);
      assert.equal(
        layout.copyOverlapsControls,
        false,
        `Copy/control overlap at ${width}, slide ${index}`,
      );
      assert.equal(
        layout.controlsOverlapQuick,
        false,
        `Controls/services overlap at ${width}, slide ${index}`,
      );
      assert.equal(layout.familyFits, true, `Family face/AC crop at ${width}`);
      assert.equal(layout.aligned, true, `SVG/photo misalignment at ${width}`);
      await hero.screenshot({
        path: `output/visual-qa/hero-premium-${width}-slide${index + 1}.png`,
      });
    }
    console.log(`Responsive slides passed: ${width}px`);
  }
  checks.push(
    'All three slides pass 1440/1280/1024/768/390/375px: no overlap, overflow or cropped family/AC; SVG stays aligned',
  );

  await select(0);
  await waitActive(0);
  const origins = await page.locator('#hero-family svg path[pathLength="1"]').evaluateAll((paths) =>
    paths.map((p) => {
      const { x, y } = p.getPointAtLength(0);
      const bottom = 334 - 0.2 * (x - 1200);
      return x >= 1190 && x <= 1440 && y <= bottom && y >= bottom - 20;
    }),
  );
  assert(origins.length === 7 && origins.every(Boolean));
  checks.push('All seven moving streams start inside the photographed vent opening');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.running === 'false',
  );
  const motion = await page
    .locator('#hero-family svg path[pathLength="1"]')
    .first()
    .evaluate((el) => ({
      display: getComputedStyle(el).display,
      animation: getComputedStyle(el).animationName,
    }));
  assert.equal(motion.display, 'none');
  await select(1);
  await waitActive(1);
  assert.equal(
    await page.locator('#hero-services').evaluate((el) => getComputedStyle(el).transitionDuration),
    '0s',
  );
  await page.waitForTimeout(7500);
  assert.equal(await active(), '1');
  checks.push(
    'Reduced motion disables autoplay, airflow and crossfade; manual switching stays usable',
  );

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const touch = await touchContext.newPage();
  await touch.goto(base, { waitUntil: 'networkidle' });
  const cdp = await touchContext.newCDPSession(touch);
  const swipe = async (from, to) => {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: from, y: 540 }],
    });
    for (const x of [(from + to) / 2, to])
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: 541 }],
      });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  await swipe(300, 100);
  await touch.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.active === '1',
  );
  await swipe(100, 300);
  await touch.waitForFunction(
    () => document.querySelector('.mn-hero-carousel').dataset.active === '0',
  );
  await touchContext.close();
  checks.push('Real touch input swipes forward and backward on 390px mobile');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await select(0);
  await waitActive(0);
  assert.equal(
    await hero.locator('.lucide-play, .lucide-pause, .mn-play, [data-carousel-rotation]').count(),
    0,
  );
  checks.push('Hero has no Play/Pause controls or introduction Play button');
  assert.deepEqual(errors, []);
  checks.push('No browser console or page errors');
  await fs.writeFile(
    'output/visual-qa/hero-premium-results.json',
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
