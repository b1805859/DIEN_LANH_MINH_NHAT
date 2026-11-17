import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('output/home-3d-preview');

function startStaticServer(dir) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.glb': 'model/gltf-binary',
  };
  const server = http.createServer(async (req, res) => {
    const reqPath = (req.url || '/').split('?')[0];
    const rel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
    const full = path.join(dir, rel);
    try {
      const data = await fs.readFile(full);
      const ext = path.extname(full);
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

const { server, url } = await startStaticServer(root);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader'] });
const report = { errors: [], consoleErrors: [], checks: {} };

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(90000);
  page.on('pageerror', (e) => report.errors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') report.consoleErrors.push(msg.text());
  });

  // 1. Desktop overview deterministic ?t=0 and ?t=2
  await page.goto(`${url}/index.html?t=0`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true);
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(root, 'desktop-overview.png') });

  // Verify canvas rendered non-blank pixels, stats & right-side vertical dock clearance
  const desktopCheck = await page.evaluate(() => {
    const heroCopy = document.querySelector('.heroCopy')?.getBoundingClientRect();
    const dock = document.querySelector('.stageDock')?.getBoundingClientRect();
    const dockBtns = Array.from(document.querySelectorAll('.stageDockBtn'));
    const rects = dockBtns.map((b) => b.getBoundingClientRect());
    const minButtonGap = rects.slice(1).reduce((m, r, idx) => Math.min(m, Math.round(r.top - rects[idx].bottom)), 999);
    const overlapX = Math.max(0, Math.min(heroCopy.right, dock.right) - Math.max(heroCopy.left, dock.left));
    const overlapY = Math.max(0, Math.min(heroCopy.bottom, dock.bottom) - Math.max(heroCopy.top, dock.top));
    return {
      stats: window.__hero3d.getStats(),
      heroBottom: Math.round(heroCopy.bottom),
      dockTop: Math.round(dock.top),
      dockRight: Math.round(dock.right),
      dockHeight: Math.round(dock.height),
      dockWidth: Math.round(dock.width),
      buttonCount: dockBtns.length,
      minButtonGap,
      lastButtonLabel: dockBtns[dockBtns.length - 1]?.textContent.trim(),
      overlapArea: Math.round(overlapX * overlapY),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  const overviewStats = desktopCheck.stats;
  report.checks.overviewStats = overviewStats;
  report.checks.desktopLayout = desktopCheck;
  assert.equal(desktopCheck.overflow, false, 'Desktop horizontal overflow');
  assert.equal(desktopCheck.overlapArea, 0, 'Stage dock must not overlap hero copy');
  assert(desktopCheck.minButtonGap >= 6, `Expected vertical spacing >= 6px between dock buttons, got ${desktopCheck.minButtonGap}`);
  assert(desktopCheck.dockRight >= 1400 && desktopCheck.dockWidth <= 180, 'Expected vertical right-side dock rail on desktop');
  assert.equal(desktopCheck.lastButtonLabel, 'Xem tất cả', 'Expected last button to be Xem tất cả');
  assert(overviewStats.render.triangles > 1000, 'Expected rich 3D geometry');

  // ?t=2 mid frame
  await page.evaluate(() => window.__hero3d.renderAt(2.0));
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(root, 'desktop-mid.png') });

  // 2. Service modes (Repair / Install / Clean / Washer-Repair / Washer-Clean / Fridge-Repair)
  for (const mode of ['repair', 'install', 'clean', 'washer-repair', 'washer-clean', 'fridge-repair']) {
    await page.goto(`${url}/index.html?t=1.2&mode=${mode}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready === true);
    await page.waitForTimeout(300);
    const tel = await page.evaluate(() => window.__hero3d.getTelemetry());
    for (const [label, ws] of [['ac', tel.wristStats], ['washer', tel.washerTech.wristStats], ['fridge', tel.fridgeTech.wristStats]]) {
      assert(ws.left.bendDeg <= 34.5 && ws.right.bendDeg <= 34.5, `Wrist bend exceeded 34.5 deg in ${mode} for ${label}: ${JSON.stringify(ws)}`);
    }
    await page.screenshot({ path: path.join(root, `desktop-mode-${mode}.png`) });
  }

  // 3. Interactive equipment click & new service buttons test (live mode without ?t)
  await page.goto(`${url}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true);
  const modeClickAssertions = [
    ['[data-mode="washer-repair"]', 'washer-repair', 'Xem dịch vụ Máy giặt'],
    ['[data-mode="washer-clean"]', 'washer-clean', 'Xem dịch vụ Máy giặt'],
    ['[data-mode="fridge-repair"]', 'fridge-repair', 'Xem dịch vụ Tủ lạnh'],
  ];
  for (const [selector, expectedMode, expectedCta] of modeClickAssertions) {
    await page.click(selector);
    await page.waitForTimeout(450);
    const state = await page.evaluate(() => ({
      mode: window.__hero3d.getStats().mode,
      cta: document.getElementById('chooser-cta-label').textContent,
    }));
    assert.equal(state.mode, expectedMode);
    assert.equal(state.cta, expectedCta);
  }
  await page.click('[data-eq="may-giat"]');
  await page.waitForTimeout(550);
  const afterWasherClick = await page.evaluate(() => ({
    focus: window.__hero3d.getStats().focus,
    cta: document.getElementById('chooser-cta-label').textContent,
  }));
  assert.equal(afterWasherClick.focus, 'washer');
  assert.equal(afterWasherClick.cta, 'Xem dịch vụ Máy giặt');

  // Verify "Xem tất cả" button opens modal and selecting a service closes modal & switches mode
  await page.click('#view-all-services-btn');
  await page.waitForTimeout(200);
  const modalOpen = await page.getAttribute('#all-services-backdrop', 'data-open');
  assert.equal(modalOpen, 'true', 'Expected All Services modal to open');
  await page.click('.allServiceItem[data-service-mode="fridge-repair"]');
  await page.waitForTimeout(350);
  const afterModalPick = await page.evaluate(() => ({
    modalOpen: document.getElementById('all-services-backdrop').getAttribute('data-open'),
    mode: window.__hero3d.getStats().mode,
  }));
  assert.equal(afterModalPick.modalOpen, 'false');
  assert.equal(afterModalPick.mode, 'fridge-repair');

  // 4. Responsive viewports: 390x844 mobile & 768x1024 tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${url}/index.html?t=0`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true);
  await page.waitForTimeout(350);
  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(tabletOverflow, false, 'Tablet horizontal overflow');
  await page.screenshot({ path: path.join(root, 'tablet-768.png') });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${url}/index.html?t=0`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true);
  await page.waitForTimeout(350);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(mobileOverflow, false, 'Mobile horizontal overflow');
  await page.screenshot({ path: path.join(root, 'mobile-390.png'), fullPage: true });

  // 5. Disposal leak check (note: PMREM internal cube texture is managed by WebGLRenderer)
  await page.evaluate(() => window.__hero3d.dispose());
  const postDispose = await page.evaluate(() => window.__hero3d.getStats().memory);
  report.checks.postDispose = postDispose;
  assert.equal(postDispose.geometries, 0, 'All geometries disposed');
  assert(postDispose.textures <= 2, 'Textures disposed cleanly');

  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.consoleErrors, []);
  console.log('VERIFICATION PASS:', JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  server.close();
}
