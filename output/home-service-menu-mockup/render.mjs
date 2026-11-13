import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('./', import.meta.url).pathname;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}home-before.png` });
const home = await page.evaluate(() => ({ head: document.head.innerHTML, body: document.body.innerHTML, bodyClass: document.body.className }));
await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${out}services-reference.png` });
const services = await page.evaluate(() => ({ header: document.querySelector('header.mn-header').outerHTML, styles: [...document.querySelectorAll('link[rel="stylesheet"]')].map(el => el.outerHTML).join('') }));
await writeFile(`${out}snapshot.json`, JSON.stringify({ home, services }));
await browser.close();
