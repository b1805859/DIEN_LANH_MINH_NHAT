import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.UI_QA_URL || 'http://127.0.0.1:3001';
const output = path.resolve('output/about-polish');
const before = JSON.parse(await readFile(path.join(output, 'before-layouts.json'), 'utf8'));
const hashes = JSON.parse(await readFile(path.join(output, 'before-hashes.json'), 'utf8'));
const results = {
  baseURL,
  checks: [],
  layouts: [],
  pageErrors: [],
  interceptedBookings: [],
  realPosts: 0,
};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce' });
let bookingMode = 'blocked';
await context.route('**/*', async (route) => {
  const request = route.request();
  if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/bookings')) {
    results.interceptedBookings.push({ mode: bookingMode, payload: request.postDataJSON() });
    return route.fulfill({
      status: bookingMode === 'success' ? 201 : 503,
      contentType: 'application/json',
      body: JSON.stringify(bookingMode === 'success' ? { id: 'qa-only' } : { message: 'QA error' }),
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
const visit = async (route = '/about', width = 1440) => {
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
    const query = (name) => document.querySelector('[class*="' + name + '"]');
    const form = document.querySelector('#dat-lich form');
    const controls = Array.from(form.querySelectorAll('input,select')).map((el) => ({
      ...rect(el),
      name: el.name,
      radius: getComputedStyle(el).borderRadius,
      font: getComputedStyle(el).fontSize,
    }));
    const articles = (className) =>
      Array.from(query(className).querySelectorAll('article')).map((el) => ({
        ...rect(el),
        title: el.querySelector('h3').textContent,
        contentFits: Array.from(el.querySelectorAll('h3,p')).every((child) => {
          const r = rect(child),
            parent = rect(el);
          return r.x >= parent.x && r.right <= parent.right && r.bottom <= parent.bottom;
        }),
      }));
    return {
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      hero: rect(query('aboutHero')),
      heroCopy: rect(query('heroCopy')),
      actions: Array.from(query('heroActions').children).map(rect),
      intro: rect(query('introduction')),
      introColumns: getComputedStyle(query('introduction'))
        .gridTemplateColumns.split(' ')
        .map(parseFloat),
      introHeading: rect(query('introHeading')),
      introCopy: rect(query('introCopy')),
      values: articles('valuesGrid'),
      work: articles('workGrid'),
      controls,
      form: rect(form),
      formRadius: getComputedStyle(form).borderRadius,
      bookingCopy: rect(query('bookingCopy')),
      bookingImage: rect(query('bookingImage')),
      images: Array.from(document.querySelectorAll('main img')).map((image) => ({
        src: image.getAttribute('src'),
        alt: image.alt,
        decoded: image.complete && image.naturalWidth > 0,
      })),
      headingFont: getComputedStyle(document.querySelector('h1')).fontSize,
      sections: Array.from(document.querySelectorAll('main>section')).map(
        (section) => section.getAttribute('aria-labelledby') || section.getAttribute('aria-label'),
      ),
    };
  });
try {
  await check('existing assets, booking logic and unrelated page sources unchanged', async () => {
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
  });
  for (const width of [1920, 1440, 1280, 1199, 1024, 960, 768, 760, 600, 390, 320]) {
    await check(`responsive About ${width}`, async () => {
      await visit('/about', width);
      const data = await layout();
      results.layouts.push(data);
      assert.ok(data.scrollWidth <= width, 'No horizontal overflow');
      assert.equal(data.values.length, 3);
      assert.equal(data.work.length, 3);
      assert.ok(data.values.every((card) => card.contentFits));
      assert.ok(data.work.every((card) => card.contentFits));
      assert.ok(
        Math.max(...data.values.map((card) => card.height)) -
          Math.min(...data.values.map((card) => card.height)) <
          1,
        'Value cards have equal heights',
      );
      assert.ok(data.images.every((image) => image.decoded && image.alt));
      assert.ok(
        data.heroCopy.y >= data.hero.y && data.heroCopy.bottom <= data.hero.bottom,
        'Hero content fits',
      );
      assert.equal(data.actions[0].height, data.actions[1].height, 'Hero CTA heights match');
      assert.ok(
        data.controls.every((control) => control.height === 48 && control.radius === '10px'),
      );
      assert.equal(data.formRadius, '16px');
      assert.ok(data.form.x >= 0 && data.form.right <= width, 'Form stays within viewport');
      if (width >= 1200) {
        const ratio = data.introColumns[0] / (data.introColumns[0] + data.introColumns[1]);
        assert.ok(Math.abs(ratio - 0.4) < 0.01, 'Intro has 40/60 columns');
        assert.ok(data.work.every((card) => Math.abs(card.height - data.work[0].height) < 1));
      }
      if (width <= 600) assert.ok(data.actions[1].y >= data.actions[0].bottom, 'Mobile CTA stacks');
      if (width <= 760) {
        assert.ok(data.values[1].y >= data.values[0].bottom);
        assert.ok(data.work[1].y >= data.work[0].bottom);
      }
      if (width > 760 && width <= 960) {
        assert.ok(data.bookingCopy.right <= data.bookingImage.x);
        assert.ok(data.form.y > data.bookingImage.bottom);
      }
      const original = before.find((entry) => entry.route === '/about' && entry.width === width);
      if (original)
        assert.deepEqual(
          data.images.map((i) => i.src),
          original.images.map((i) => i.src),
          'Original image sources/order retained',
        );
      assert.deepEqual(data.sections, [
        'about-hero-title',
        'about-intro-title',
        'about-values-title',
        'about-story-title',
        'about-work-title',
        'about-team-title',
        'Cam kết dịch vụ',
        'areas-booking-title',
      ]);
      await page.screenshot({ path: path.join(output, `about-${width}.png`), fullPage: true });
      if ([1440, 768, 390].includes(width)) {
        await page.locator('#dat-lich').screenshot({
          path: path.join(output, `booking-${width}.png`),
          style: 'header { visibility: hidden; }',
        });
      }
      return { height: data.height, headingFont: data.headingFont };
    });
  }
  await visit();
  await check('brand content, shared navigation, links and SEO', async () => {
    assert.equal(await page.getByRole('heading', { level: 1 }).innerText(), 'Điện Lạnh\nMinh Nhật');
    const nav = page.getByRole('navigation', { name: 'Điều hướng chính', exact: true });
    assert.equal(await nav.locator('[aria-current="page"]').innerText(), 'Về chúng tôi');
    assert.equal(await nav.getByRole('link').count(), 5);
    assert.equal(
      await page.locator('[class*="heroActions"] a').first().getAttribute('href'),
      '#dat-lich',
    );
    assert.equal(
      await page.getByRole('link', { name: 'Khám phá dịch vụ', exact: true }).getAttribute('href'),
      '/services',
    );
    assert.equal(
      await page
        .getByRole('link', { name: 'Xem khu vực phục vụ', exact: true })
        .getAttribute('href'),
      '/areas',
    );
    assert.match(await page.locator('link[rel="canonical"]').getAttribute('href'), /\/about$/);
    assert.ok(await page.locator('script[type="application/ld+json"]').count());
    const text = await page.locator('main').innerText();
    assert.doesNotMatch(text, /\d+\+|số 1|hàng đầu Việt Nam|năm thành lập|chứng nhận|giải thưởng/i);
    assert.equal(await page.locator('[class*="commitmentPanel"] li').count(), 4);
    assert.equal(await page.locator('[class*="teamApproach"] li').count(), 3);
    assert.ok(text.includes('Hình ảnh minh họa dịch vụ'));
    return { menu: 5, commitments: 4, teamStandards: 3 };
  });
  await check('booking anchor and accessible validation', async () => {
    await page.locator('[class*="heroActions"] a[href="#dat-lich"]').click();
    await page.waitForURL('**/about#dat-lich');
    await page.waitForFunction(
      () => Math.abs(document.querySelector('#dat-lich').getBoundingClientRect().top - 108) < 2,
    );
    const form = page.getByRole('form', { name: 'ĐẶT LỊCH DỊCH VỤ', exact: true });
    await form.getByRole('button', { name: 'Gửi yêu cầu ngay' }).click();
    await form.getByText('Vui lòng nhập họ tên.').waitFor();
    assert.equal(await form.locator('[aria-invalid="true"]').count(), 4);
    assert.equal(results.interceptedBookings.length, 0);
    assert.equal(
      await form
        .locator('[aria-invalid="true"]')
        .evaluateAll((controls) =>
          controls.every((i) => document.getElementById(i.getAttribute('aria-describedby'))),
        ),
      true,
    );
    await form.getByLabel('Họ và tên').focus();
    assert.notEqual(
      await form.getByLabel('Họ và tên').evaluate((i) => getComputedStyle(i).outlineStyle),
      'none',
    );
    return { errors: 4, realPosts: 0 };
  });
  for (const mode of ['success', 'error']) {
    await visit('/about', 390);
    await check(`booking ${mode} presentation with mocked response`, async () => {
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
      return { mode, realPosts: 0 };
    });
  }
  await check('shared form appearance matches Services', async () => {
    for (const width of [1440, 768, 390]) {
      const appearance = async (route) => {
        await visit(route, width);
        return page.locator('#dat-lich form').evaluate((form) => {
          const style = (el) => {
            const s = getComputedStyle(el);
            return {
              radius: s.borderRadius,
              padding: s.padding,
              font: s.fontSize,
              background: s.backgroundImage,
              height: el.getBoundingClientRect().height,
            };
          };
          return {
            form: { ...style(form), height: undefined },
            controls: Array.from(form.querySelectorAll('input,select')).map(style),
            button: style(form.querySelector('button')),
            title: style(form.querySelector('h3')),
            heading: (() => {
              const s = getComputedStyle(document.querySelector('#dat-lich h2'));
              return { font: s.fontSize, lineHeight: s.lineHeight, marginTop: s.marginTop };
            })(),
          };
        });
      };
      assert.deepEqual(
        await appearance('/about'),
        await appearance('/services'),
        `Same form appearance at ${width}`,
      );
    }
    return { widths: [1440, 768, 390] };
  });
  await check('shared mobile menu navigation', async () => {
    await visit('/about', 390);
    await page.getByRole('button', { name: 'Mở menu', exact: true }).click();
    const menu = page.getByRole('dialog', { name: 'Menu điều hướng', exact: true });
    assert.equal(await menu.getByRole('navigation').getByRole('link').count(), 5);
    assert.equal(await menu.locator('[aria-current="page"]').innerText(), 'Về chúng tôi');
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });
    return { active: 'Về chúng tôi' };
  });
  await check('Home, Services, Contact and Areas retain their layouts/content', async () => {
    for (const route of ['/', '/services', '/contact', '/areas'])
      for (const width of [1440, 390]) {
        await visit(route, width);
        const original = before.find((entry) => entry.route === route && entry.width === width);
        const actual = await page.evaluate(() => ({
          height: document.documentElement.scrollHeight,
          text: document.querySelector('main').innerText,
          width: document.documentElement.scrollWidth,
          form: Array.from(document.querySelectorAll('form input,form select')).map((i) => ({
            name: i.name,
            height: i.getBoundingClientRect().height,
            radius: getComputedStyle(i).borderRadius,
            font: getComputedStyle(i).fontSize,
          })),
        }));
        assert.ok(actual.width <= width);
        assert.equal(actual.text, original.text, route);
        assert.ok(Math.abs(actual.height - original.height) <= 1, `${route} height unchanged`);
        assert.deepEqual(actual.form, original.form, `${route} controls unchanged`);
      }
    return { routes: 4, viewports: 2 };
  });
  await check('no uncaught errors or real booking requests', async () => {
    assert.deepEqual(results.pageErrors, []);
    assert.equal(
      results.interceptedBookings.some((request) => request.mode === 'blocked'),
      false,
    );
    return { errors: 0, realPosts: 0 };
  });
} finally {
  results.passed = results.checks.filter((check) => check.passed).length;
  results.failed = results.checks.filter((check) => !check.passed).length;
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ passed: results.passed, failed: results.failed, output }));
process.exitCode = results.failed ? 1 : 0;
