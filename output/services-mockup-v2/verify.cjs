const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1672, 1440, 1200, 1024, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 941 } });
      await page.goto('http://127.0.0.1:3040/services');
      await page.evaluate(() => document.fonts.ready);
      const result = await page.locator('.mn-services-modern-page').evaluate((main) => {
        const rect = (element) => {
          const {x, y, width, height} = element.getBoundingClientRect();
          return {x, y, width, height};
        };
        const hero = main.querySelector('section');
        const grid = main.querySelector('#services-grid');
        const benefits = grid.nextElementSibling;
        const cards = [...grid.querySelectorAll('a')];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          header: rect(document.querySelector('.mn-nav-shell')),
          hero: rect(hero),
          filter: rect(main.querySelector('nav')),
          grid: rect(grid),
          cards: cards.map(rect),
          benefits: rect(benefits.firstElementChild),
          filtersFit: [...main.querySelectorAll('[role="tab"]')].every((button) => {
            const label = button.querySelector('span').getBoundingClientRect();
            const pill = button.getBoundingClientRect();
            return label.left >= pill.left && label.right <= pill.right;
          }),
          titlesInside: cards.every((card) => {
            const title = card.querySelector('h2').getBoundingClientRect();
            const photo = card.querySelector('img').getBoundingClientRect();
            return title.left >= photo.left && title.right <= photo.right && title.bottom <= photo.bottom;
          }),
        };
      });
      assert.equal(result.cards.length, 4);
      assert.equal(result.overflow, false, `Document overflow at ${width}px`);
      assert.equal(result.titlesInside, true);
      assert.equal(result.filtersFit, true);
      assert.equal(result.grid.x, result.benefits.x);
      assert.equal(result.grid.width, result.benefits.width);
      if (width === 1672 || width === 390) {
        await page.locator('#services-grid img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
        await page.waitForFunction(() => {
          const launcher = document.querySelector('.mn-floating button');
          return launcher && launcher.getAnimations().length === 0 && getComputedStyle(launcher).opacity === '1';
        });
        await page.screenshot({ path: `output/services-mockup-v2/actual-${width}.png` });
      }
      if (width === 1672) {
        for (const [region, expectedY] of [['header', 16], ['hero', 120], ['grid', 475], ['benefits', 830]]) {
          assert.ok(Math.abs(result[region].y - expectedY) <= 1, `${region} y=${result[region].y}, expected ${expectedY}`);
        }
        assert.equal(result.cards[0].height, 315);
        console.log(JSON.stringify(result, null, 2));
        const categories = ['Máy lạnh', 'Máy giặt', 'Tủ lạnh', 'Điện nước – Nóng lạnh', 'Tất cả dịch vụ'];
        for (const name of categories) {
          const tab = page.getByRole('tab', { name, exact: true });
          await tab.click();
          assert.equal(await tab.getAttribute('aria-selected'), 'true');
          assert.ok(await page.locator('#services-grid a').count());
        }
        await page.locator('#services-grid').getByRole('link', { name: 'Sửa chữa máy lạnh', exact: true }).click();
        await page.waitForURL('**/services/sua-may-lanh');
      }
      await page.close();
      console.log(`Passed ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
