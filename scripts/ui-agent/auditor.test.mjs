import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { domMetrics } from './auditor.mjs';

test('DOM audit measures rendered targets and flags unsafe transitions without counting hidden controls', async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  try {
    const page = await browser.newPage();
    await page.setContent(`<style>
      button { width:44px; height:44px; border:0; padding:0; transition:transform 180ms ease; }
      a { display:inline-block; width:20px; height:20px; }
      #all { transition:all 180ms ease; }
      #layout { transition:width 180ms ease; }
    </style><button id="safe">Safe</button><button id="all">All</button><button id="layout">Layout</button>
    <a href="#">Tiny</a><button hidden>Hidden</button><div inert><button>Inert</button></div><button disabled>Disabled</button><input type="hidden">`);
    const metrics = await domMetrics(page);
    assert.equal(metrics.totalInteractive, 4);
    assert.equal(metrics.smallTouchTargets, 1);
    assert.equal(metrics.missingTransitions, 1);
    assert.equal(metrics.unsafeTransitions, 2);
    assert.deepEqual(
      metrics.elements.find((element) => element.selector === '#all').unsafeTransitions,
      ['all'],
    );
    assert.deepEqual(
      metrics.elements.find((element) => element.selector === '#layout').unsafeTransitions,
      ['width'],
    );
    await page.close();
  } finally {
    await browser.close();
  }
});

test('DOM audit detects active layout animations and respects reduced-motion media', async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chromium' });
  try {
    const page = await browser.newPage();
    await page.setContent(`<style>
      button { width:44px; height:44px; transition:opacity 180ms ease; }
      .bad { animation:resize 1s linear infinite; }
      @keyframes resize { from { width:44px; } to { width:80px; } }
      @media (prefers-reduced-motion:reduce) { * { transition:none!important; animation:none!important; } }
    </style><button>Safe</button><div class="bad">Animated</div>`);
    const normal = await domMetrics(page);
    assert.equal(normal.missingTransitions, 0);
    assert.equal(normal.layoutAnimations.length, 1);
    assert.deepEqual(normal.layoutAnimations[0].properties, ['width']);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reduced = await domMetrics(page);
    assert.equal(reduced.missingTransitions, 1);
    assert.equal(reduced.layoutAnimations.length, 0);
    await page.close();
  } finally {
    await browser.close();
  }
});
