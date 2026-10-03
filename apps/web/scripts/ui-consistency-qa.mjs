import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import sharp from 'sharp';

// Run against an already running web server. Intercept every write request so
// the interaction checks cannot create bookings or mutate any external data.
const root = fileURLToPath(new URL('../../../', import.meta.url));
const web = path.join(root, 'apps/web');
const output = path.join(root, 'output/ui-consistency');
const snapshot = process.env.UI_QA_SNAPSHOT || '/tmp/minh-nhat-ui-before';
const baselinePath = process.env.UI_QA_BASELINE || path.join(output, 'content-baseline.json');
const baseURL = process.env.UI_QA_URL || 'http://localhost:3000';
const fast = process.argv.includes('--representative');
const results = {
  baseURL,
  startedAt: new Date().toISOString(),
  scope: fast ? 'representative public routes' : 'all concrete public routes',
  checks: [],
  pages: [],
  pageErrors: [],
  consoleErrors: [],
  blockedWrites: [],
};
await mkdir(output, { recursive: true });
const files = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(path.join(directory, entry.name))
          : path.join(directory, entry.name),
      ),
    )
  ).flat();
};
const sharedSource = await readFile(path.join(root, 'packages/shared/src/index.ts'), 'utf8');
const sharedAst = ts.createSourceFile('index.ts', sharedSource, ts.ScriptTarget.Latest, true);
const slugs = (name) => {
  let declaration;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(sharedAst) === name) declaration = node;
    ts.forEachChild(node, visit);
  };
  visit(sharedAst);
  assert.ok(declaration, `Shared dataset ${name} exists`);
  return [...declaration.getText(sharedAst).matchAll(/slug:\s*'([^']+)'/g)].map(
    (match) => match[1],
  );
};
const serviceSlugs = slugs('SERVICES');
const areaSlugs = slugs('PRIORITY_DISTRICTS');
const postSlugs = slugs('BLOG_POSTS');
const categorySlugs = slugs('BLOG_CATEGORIES');
const publicPages = (await files(path.join(web, 'app'))).filter(
  (file) => file.endsWith('/page.tsx') && !file.includes('/admin/'),
);
const topLevel = publicPages
  .filter((file) => !file.includes('['))
  .map((file) => `/${path.relative(path.join(web, 'app'), file).replace(/(^|\/)page\.tsx$/, '')}`)
  .sort();
const allRoutes = [
  ...topLevel,
  ...serviceSlugs.map((slug) => `/services/${slug}`),
  ...areaSlugs.map((slug) => `/areas/${slug}`),
  ...areaSlugs.flatMap((area) => serviceSlugs.map((service) => `/areas/${area}/${service}`)),
  ...postSlugs.map((slug) => `/blog/${slug}`),
  ...categorySlugs.map((slug) => `/blog/category/${slug}`),
];
const representatives = [
  ...topLevel,
  `/services/${serviceSlugs[0]}`,
  `/areas/${areaSlugs[0]}`,
  `/areas/${areaSlugs[0]}/${serviceSlugs[0]}`,
  `/blog/${postSlugs[0]}`,
  `/blog/category/${categorySlugs[0]}`,
];
results.inventory = { topLevel, serviceSlugs, areaSlugs, postSlugs, categorySlugs, allRoutes };
await writeFile(
  path.join(output, 'route-inventory.json'),
  JSON.stringify(results.inventory, null, 2),
);

const hash = (value) => createHash('sha256').update(value).digest('hex');
const contentFingerprint = (source, filename) => {
  const ast = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const content = [];
  const metadata = [];
  const printer = ts.createPrinter({ removeComments: true });
  const visit = (node) => {
    // The intended change is presentation. Content, destinations, image paths,
    // form defaults and messages remain checked while CSS tokens are ignored.
    if (ts.isImportDeclaration(node)) return;
    if (ts.isJsxAttribute(node) && ['className', 'style'].includes(node.name.getText(ast))) return;
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'fieldClass') return;
    if (
      (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'metadata') ||
      (ts.isFunctionDeclaration(node) && node.name?.getText(ast) === 'generateMetadata')
    )
      metadata.push(printer.printNode(ts.EmitHint.Unspecified, node, ast));
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, ' ').trim();
      if (text) content.push(['text', text]);
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      content.push(['string', node.text]);
    } else if (ts.isTemplateExpression(node)) {
      content.push([
        'template',
        node.head.text,
        ...node.templateSpans.map((span) => span.literal.text),
      ]);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return { content, metadata };
};
const behaviorFingerprint = (source, filename) => {
  const ast = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const transformed = ts.transform(ast, [
    (context) => {
      const visit = (node) => {
        if (ts.isImportDeclaration(node) && /\.css['"]$/.test(node.moduleSpecifier.getText(ast)))
          return undefined;
        if (ts.isJsxAttribute(node) && ['className', 'style'].includes(node.name.getText(ast)))
          return undefined;
        if (
          ts.isVariableStatement(node) &&
          node.declarationList.declarations.every((item) => item.name.getText(ast) === 'fieldClass')
        )
          return undefined;
        return ts.visitEachChild(node, visit, context);
      };
      return (rootNode) => ts.visitNode(rootNode, visit);
    },
  ]);
  const text = ts.createPrinter({ removeComments: true }).printFile(transformed.transformed[0]);
  transformed.dispose();
  return text;
};
const protectedFiles = [
  ...publicPages,
  ...(await files(path.join(web, 'components'))).filter(
    (file) =>
      file.endsWith('/data.ts') ||
      file.endsWith('/sections.tsx') ||
      file.endsWith('/booking-form.tsx') ||
      file.endsWith('/content-sections.tsx'),
  ),
  ...(await files(path.join(web, 'lib'))).filter((file) => /\.[jt]sx?$/.test(file)),
  path.join(web, 'app/layout.tsx'),
  path.join(web, 'app/sitemap.ts'),
  path.join(web, 'app/robots.ts'),
];
let baseline;
try {
  baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  baseline = { version: 1, sourceSnapshot: snapshot, files: {} };
  // Baseline creation reads ONLY the saved original sources, never current code.
  // The resulting manifest is reusable after the temporary snapshot is removed.
  for (const file of protectedFiles) {
    const relative = path.relative(web, file);
    const before = await readFile(path.join(snapshot, relative), 'utf8');
    const fingerprint = contentFingerprint(before, relative);
    baseline.files[relative] = {
      contentHash: hash(JSON.stringify(fingerprint.content)),
      metadataHash: hash(JSON.stringify(fingerprint.metadata)),
      behaviorHash: hash(behaviorFingerprint(before, relative)),
      sourceHash: hash(before),
    };
  }
  await writeFile(baselinePath, JSON.stringify(baseline, null, 2));
}
if (process.argv.includes('--write-baseline')) {
  console.log(`Original-source manifest ready: ${baselinePath}`);
  process.exit(0);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
await context.route('**/*', async (route) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())) return route.continue();
  results.blockedWrites.push({ url: route.request().url(), method: route.request().method() });
  return route.abort('blockedbyclient');
});
const page = await context.newPage();
page.setDefaultTimeout(10_000);
page.setDefaultNavigationTimeout(30_000);
page.on('pageerror', (error) =>
  results.pageErrors.push({ url: page.url(), message: error.message }),
);
page.on('console', (message) => {
  if (message.type() === 'error')
    results.consoleErrors.push({ url: page.url(), message: message.text() });
});
const check = async (name, action) => {
  try {
    const detail = await action();
    results.checks.push({ name, passed: true, detail });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.checks.push({ name, passed: false, error: String(error.message) });
    console.error(`FAIL ${name}: ${error.message}`);
    await page
      .evaluate(() => document.querySelectorAll('dialog[open]').forEach((node) => node.close()))
      .catch(() => {});
  }
};
const visit = async (route, width = 1440) => {
  await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
  const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'load' });
  assert.equal(response.status(), 200, `${route} responds successfully`);
  await page.locator('main').first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
};
const chromeDetails = () =>
  page.evaluate(() => {
    const normalized = (text) => text.replace(/\s+/g, ' ').trim();
    const properties = [
      'height',
      'color',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'borderBottomWidth',
      'boxShadow',
    ];
    const style = (element) =>
      Object.fromEntries(properties.map((prop) => [prop, getComputedStyle(element)[prop]]));
    const links = (element) =>
      Array.from(element.querySelectorAll('a')).map((link) => ({
        text: normalized(link.textContent),
        href: link.getAttribute('href'),
      }));
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const nav = header?.querySelector('nav[aria-label="Điều hướng chính"]');
    return {
      headerCount: document.querySelectorAll('header').length,
      footerCount: document.querySelectorAll('footer').length,
      header: header ? { style: style(header), links: links(header) } : null,
      headerContext: header
        ? {
            position: getComputedStyle(header).position,
            backgroundColor: getComputedStyle(header).backgroundColor,
          }
        : null,
      footer: footer
        ? {
            style: { ...style(footer), backgroundImage: getComputedStyle(footer).backgroundImage },
            links: links(footer),
            text: normalized(footer.textContent),
          }
        : null,
      nav: nav ? links(nav) : null,
      active: nav
        ? Array.from(nav.querySelectorAll('[aria-current="page"]')).map((link) =>
            link.getAttribute('href'),
          )
        : [],
      mobileActive: header
        ? Array.from(
            header.querySelectorAll('nav[aria-label="Điều hướng di động"] [aria-current="page"]'),
          ).map((link) => link.getAttribute('href'))
        : [],
    };
  });
const layoutDetails = () =>
  page.evaluate(() => {
    const main = document.querySelector('main');
    const visible = (el) => el.getClientRects().length && !el.closest('dialog:not([open])');
    const overflow = Array.from(document.querySelectorAll('body *'))
      .filter((element) => {
        if (
          !visible(element) ||
          element.closest('nextjs-portal') ||
          element.classList.contains('skip-link')
        )
          return false;
        const rect = element.getBoundingClientRect();
        return rect.right > innerWidth + 1 || rect.left < -1;
      })
      .map((element) => ({
        tag: element.tagName,
        className: String(element.className).slice(0, 120),
        text: element.textContent.trim().slice(0, 80),
      }))
      .slice(0, 15);
    return {
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      overflow,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      headings: Array.from(main.querySelectorAll('h1,h2,h3,h4')).map((heading) => ({
        level: heading.tagName,
        text: heading.textContent.replace(/\s+/g, ' ').trim(),
      })),
      mainText: main.textContent.replace(/\s+/g, ' ').trim(),
      imageSources: Array.from(main.querySelectorAll('img')).map((img) => ({
        src: img.getAttribute('src'),
        alt: img.alt,
      })),
      formValues: Array.from(main.querySelectorAll('input,select,textarea')).map((field) => ({
        name: field.name,
        type: field.type,
        value: field.value,
        options: field.options
          ? Array.from(field.options).map((option) => ({ value: option.value, text: option.text }))
          : undefined,
      })),
    };
  });
const screenshot = async (pathname, width) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
    // Full-page capture must wait for lazy images outside the final viewport.
    // Otherwise a fast local navigation can capture unloaded placeholders.
    const images = Array.from(document.images);
    images.forEach((img) => {
      img.loading = 'eager';
    });
    let timeout;
    try {
      await Promise.race([
        Promise.all(images.map((img) => img.decode().catch(() => {}))),
        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Image loading did not settle before screenshot')),
            15000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timeout);
    }
    const missing = images.filter(
      (img) => img.getClientRects().length && (!img.complete || !img.naturalWidth),
    );
    if (missing.length)
      throw new Error(
        `Unloaded screenshot images: ${missing.map((img) => img.currentSrc || img.src).join(', ')}`,
      );
    scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const name = `${pathname === '/' ? 'home' : pathname.slice(1).replaceAll('/', '-')}-${width}.png`;
  await page.screenshot({ path: path.join(output, name), fullPage: true });
  return name;
};

try {
  await check(
    'Original content, image paths, form values, URLs and SEO metadata preserved',
    async () => {
      const details = [];
      for (const file of protectedFiles) {
        const relative = path.relative(web, file);
        const after = await readFile(file, 'utf8');
        const afterFingerprint = contentFingerprint(after, relative);
        const before = baseline.files[relative];
        assert.ok(before, `${relative}: original baseline exists`);
        assert.equal(
          hash(JSON.stringify(afterFingerprint.content)),
          before.contentHash,
          `${relative}: content, image paths and destinations unchanged`,
        );
        assert.equal(
          hash(JSON.stringify(afterFingerprint.metadata)),
          before.metadataHash,
          `${relative}: metadata unchanged`,
        );
        details.push({
          file: relative,
          identical: true,
          unchanged: hash(after) === before.sourceHash,
        });
      }
      return details;
    },
  );
  await check(
    'Booking validation, request payloads, API and integration behavior unchanged',
    async () => {
      const behavioralFiles = [
        'components/forms/booking-form.tsx',
        'components/services-reference/booking-form.tsx',
        'lib/api/client.ts',
        'lib/integrations/settings.ts',
      ];
      for (const relative of behavioralFiles) {
        const after = await readFile(path.join(web, relative), 'utf8');
        assert.equal(
          hash(behaviorFingerprint(after, relative)),
          baseline.files[relative].behaviorHash,
          `${relative}: behavioral AST unchanged`,
        );
      }
      return behavioralFiles;
    },
  );
  const homeChrome = {};
  for (const width of [1440, 768, 390, 320]) {
    await visit('/', width);
    homeChrome[width] = await chromeDetails();
  }
  const screenshotRoutes = new Set([
    '/',
    '/services',
    '/areas',
    '/about',
    '/contact',
    '/booking',
    '/blog',
    `/services/${serviceSlugs[0]}`,
    `/areas/${areaSlugs[0]}`,
    `/blog/${postSlugs[0]}`,
  ]);
  const selected = fast ? representatives : allRoutes;
  for (const pathname of selected) {
    for (const width of [1440, 320, ...(representatives.includes(pathname) ? [768, 390] : [])]) {
      await check(`render ${pathname} at ${width}px`, async () => {
        await visit(pathname, width);
        const chrome = await chromeDetails();
        const layout = await layoutDetails();
        const record = { pathname, width, chrome, ...layout };
        results.pages.push(record);
        if (screenshotRoutes.has(pathname) && [1440, 390].includes(width))
          record.screenshot = await screenshot(pathname, width);
        assert.equal(chrome.headerCount, 1, 'Exactly one common header');
        assert.equal(chrome.footerCount, 1, 'Exactly one common footer');
        assert.deepEqual(
          chrome.header,
          homeChrome[width].header,
          'Header links and styling match Home',
        );
        assert.deepEqual(
          chrome.headerContext,
          pathname === '/'
            ? homeChrome[width].headerContext
            : { position: 'relative', backgroundColor: 'rgb(0, 28, 50)' },
          'Interior header uses Home navy backing in document flow',
        );
        const { height: footerHeight, ...footerStyle } = chrome.footer.style;
        const { height: homeFooterHeight, ...homeFooterStyle } = homeChrome[width].footer.style;
        assert.ok(parseFloat(footerHeight) > 0 && parseFloat(homeFooterHeight) > 0);
        assert.deepEqual(
          footerStyle,
          homeFooterStyle,
          'Footer uses Home typography, palette and background',
        );
        if (pathname === '/') {
          assert.deepEqual(
            chrome.footer,
            homeChrome[width].footer,
            'Original Home footer preserved',
          );
        } else {
          const text = chrome.footer.text;
          const destinations = chrome.footer.links.map(({ href }) => href);
          assert.ok(text.includes('0939 370 109'), 'Original contact number preserved');
          if (['/services', '/areas', '/about', '/contact'].includes(pathname)) {
            assert.ok(text.includes('Sửa chữa – Vệ sinh – Lắp đặt – Bảo trì điện lạnh'));
            assert.ok(
              text.includes(
                pathname === '/services'
                  ? 'tại Cần Thơ nhanh chóng – Uy tín – Chuyên nghiệp.'
                  : 'tại Cần Thơ. Nhanh chóng – Uy tín – Chuyên nghiệp.',
              ),
            );
            assert.ok(text.includes('08:00 – 20:00 (T2 – CN)'));
            assert.ok(text.includes('Ninh Kiều, Cần Thơ'));
            assert.ok(text.includes('dienlanhminhnhat@gmail.com'));
            assert.equal(destinations.filter((href) => href.startsWith('/services/')).length, 8);
            for (const href of ['/privacy-policy', '/terms-of-service'])
              assert.ok(destinations.includes(href));
          } else {
            for (const original of [
              'Đồng hành cùng ngôi nhà bạn',
              'Điều hòa – máy giặt – tủ lạnh – điện nước tại nhà.',
              'Tận tâm và chu đáo trong từng dịch vụ.',
              '08:00 – 20:00 Thứ 2 – CN',
              'Facebook Điện Lạnh Minh Nhật',
              'Khu vực phục vụ',
              'All rights reserved.',
            ])
              assert.ok(text.includes(original), `Original footer text: ${original}`);
            for (const href of [
              '/',
              '/services',
              '/areas',
              '/about',
              '/contact',
              ...areaSlugs.map((slug) => `/areas/${slug}`),
            ])
              assert.ok(destinations.includes(href), `Original footer destination: ${href}`);
          }
        }
        assert.deepEqual(chrome.nav, homeChrome[width].nav, 'Same Home navigation');
        const active =
          pathname === '/'
            ? ['/']
            : homeChrome[width].nav
                .filter(
                  ({ href }) =>
                    !href.includes('#') &&
                    href !== '/' &&
                    (pathname === href || pathname.startsWith(`${href}/`)),
                )
                .map(({ href }) => href);
        assert.deepEqual(chrome.active, active, 'Desktop navigation active state matches route');
        assert.deepEqual(
          chrome.mobileActive,
          active,
          'Mobile navigation active state matches route',
        );
        assert.ok(
          layout.documentWidth <= width && layout.bodyWidth <= width,
          `No horizontal overflow: ${JSON.stringify(layout.overflow)}`,
        );
        assert.equal(
          layout.headings.filter(({ level }) => level === 'H1').length,
          1,
          'Exactly one page H1',
        );
        assert.ok(
          layout.title && layout.description && layout.canonical,
          'Title, description and canonical are present',
        );
      });
    }
  }
  await check(
    'Search keyboard open, accent-insensitive filtering, empty result and Escape focus return',
    async () => {
      await visit('/blog', 1440);
      const button = page.getByRole('button', { name: 'Tìm kiếm dịch vụ', exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Tìm kiếm dịch vụ' });
      assert.equal(await dialog.isVisible(), true);
      const input = dialog.getByRole('searchbox');
      assert.equal(await input.evaluate((el) => el === document.activeElement), true);
      await input.fill('may lanh');
      assert.ok((await dialog.locator('a[href^="/services/"]').count()) > 0);
      await input.fill('zz-no-match');
      assert.equal(
        await dialog.getByText('Chưa tìm thấy dịch vụ.', { exact: false }).isVisible(),
        true,
      );
      await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await button.evaluate((el) => el === document.activeElement), true);
    },
  );
  await check(
    'Mobile menu keyboard focus containment, Escape and destination navigation',
    async () => {
      await visit('/services', 390);
      const button = page.getByRole('button', { name: 'Mở menu', exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Menu điều hướng' });
      assert.equal(await dialog.isVisible(), true);
      for (let i = 0; i < 15; i++) {
        await page.keyboard.press('Tab');
        assert.equal(
          await dialog.evaluate(
            (el) => el.contains(document.activeElement) || document.activeElement === document.body,
          ),
          true,
          'Native modal prevents focus on background controls (browser chrome may receive Tab)',
        );
      }
      await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await button.evaluate((el) => el === document.activeElement), true);
      await button.click();
      await dialog.getByRole('link', { name: 'Tin tức', exact: false }).click();
      await page.waitForURL('**/blog');
      assert.equal(await page.locator('dialog[open]').count(), 0);
    },
  );
  await check(
    'Booking validation and service defaults remain usable without network writes',
    async () => {
      await visit(`/areas/${areaSlugs[0]}/${serviceSlugs[0]}`, 390);
      const form = page.locator('main form').first();
      assert.equal(await form.locator('select').inputValue(), serviceSlugs[0]);
      await form.getByRole('button', { name: /gửi|đặt lịch/i }).click();
      assert.ok(
        (await form.getByRole('alert').count()) >= 2,
        'Invalid blank fields show validation',
      );
      await form.locator('input[name="customerName"]').fill('Kiểm tra giao diện');
      await form.locator('input[name="customerPhone"]').fill('123');
      await form.locator('input[name="address"]').fill('123 Cần Thơ');
      await form.getByRole('button', { name: /gửi|đặt lịch/i }).click();
      assert.equal(
        await form.getByText('Số điện thoại chưa hợp lệ.', { exact: true }).isVisible(),
        true,
      );
      assert.equal(
        results.blockedWrites.filter(({ url }) => new URL(url).pathname.includes('/bookings'))
          .length,
        0,
        'Invalid submissions never call booking backend',
      );
    },
  );
  await check('Reveal retains card styling and FAQ native keyboard disclosure', async () => {
    await visit('/blog', 1440);
    const cards = page.locator('main a.reveal[href^="/blog/"]:not([href^="/blog/category/"])');
    assert.ok((await cards.count()) > 0, 'Blog cards render through Reveal as child elements');
    const cardStyles = await cards.evaluateAll((elements) =>
      elements.map((element) => ({
        grouped: element.classList.contains('group'),
        borderRadius: getComputedStyle(element).borderRadius,
        borderStyle: getComputedStyle(element).borderStyle,
      })),
    );
    assert.ok(
      cardStyles.every(
        (item) => item.grouped && item.borderRadius !== '0px' && item.borderStyle === 'solid',
      ),
      'Reveal preserves grouped, rounded and bordered card classes',
    );
    await visit('/faq', 390);
    const disclosure = page.locator('main details.reveal').first();
    assert.ok(
      (await page.locator('main details.reveal').count()) > 0,
      'FAQ uses native details without wrapper fallback',
    );
    const summary = disclosure.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.equal(await disclosure.getAttribute('open'), '', 'Enter opens the native disclosure');
    assert.equal(await disclosure.locator('p').isVisible(), true);
    await page.keyboard.press('Enter');
    assert.equal(await disclosure.getAttribute('open'), null, 'Enter closes the native disclosure');
    return cardStyles;
  });
  await check('Home desktop and mobile visual source of truth preserved', async () => {
    const comparison = [];
    for (const width of [1440, 390]) {
      const before = await sharp(path.join(output, `home-before-${width}.png`))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const after = await sharp(path.join(output, `home-${width}.png`))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(after.info.width, before.info.width, 'Home screenshot width preserved');
      assert.equal(after.info.height, before.info.height, 'Home full-page height preserved');
      let differentPixels = 0;
      let totalDifference = 0;
      for (let i = 0; i < before.data.length; i += 4) {
        let difference = 0;
        for (let channel = 0; channel < 3; channel++)
          difference += Math.abs(before.data[i + channel] - after.data[i + channel]);
        if (difference > 24) differentPixels++;
        totalDifference += difference;
      }
      const percent = (differentPixels / (before.info.width * before.info.height)) * 100;
      comparison.push({
        width,
        height: before.info.height,
        differentPixels,
        percent,
        meanChannelDelta: totalDifference / (before.info.width * before.info.height * 3),
      });
      assert.ok(
        percent < 1,
        `Home ${width}: visual differences under 1% to allow screenshot rasterization (${percent.toFixed(3)}%)`,
      );
    }
    await writeFile(path.join(output, 'home-comparison.json'), JSON.stringify(comparison, null, 2));
    return comparison;
  });
  await check('No uncaught browser errors', () => assert.deepEqual(results.pageErrors, []));
} finally {
  results.completedAt = new Date().toISOString();
  results.summary = {
    passed: results.checks.filter((item) => item.passed).length,
    failed: results.checks.filter((item) => !item.passed).length,
    routeCount: new Set(results.pages.map(({ pathname }) => pathname)).size,
    viewportCount: results.pages.length,
    sourceSnapshot: snapshot,
    baselineManifest: baselinePath,
  };
  await writeFile(path.join(output, 'qa-results.json'), JSON.stringify(results, null, 2));
  await writeFile(
    path.join(output, 'qa-results.md'),
    [
      '# UI consistency verification',
      '',
      `- Server: ${baseURL}`,
      `- Routes: ${results.summary.routeCount} / ${allRoutes.length}`,
      `- Viewport checks: ${results.summary.viewportCount}`,
      `- Passed: ${results.summary.passed}`,
      `- Failed: ${results.summary.failed}`,
      `- Uncaught browser errors: ${results.pageErrors.length}`,
      `- Network writes intercepted: ${results.blockedWrites.length}`,
      '',
      ...results.checks
        .filter((item) => !item.passed)
        .map((item) => `- FAIL ${item.name}: ${item.error}`),
      '',
      'The source preservation audit excludes common chrome (intentionally unified), CSS class/style attributes and the booking input CSS token. It compares public page content, image paths, form values, URLs and metadata against the saved pre-edit source. Screenshots cover desktop and mobile examples; 320px overflow is checked on every public route.',
    ].join('\n'),
  );
  await browser.close();
}
console.log(JSON.stringify(results.summary));
if (results.summary.failed) process.exitCode = 1;
