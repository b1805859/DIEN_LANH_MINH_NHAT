import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] || 'http://localhost:3000').origin;
const get = async path => {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(60000) });
  return { response, html: await response.text() };
};
const text = html => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200);
const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert(urls.length > 0, 'Sitemap must contain indexable URLs');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
const canonicalOrigin = new URL(urls[0]).origin;
const robots = await get('/robots.txt');
assert(robots.html.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'Robots/sitemap origins differ');
const titles = new Set();
const articleBodies = new Set();
let serviceCount = 0;
let blogCount = 0;
for (const url of urls) {
  const path = new URL(url).pathname;
  assert.equal(new URL(url).origin, canonicalOrigin, `Mixed sitemap origin: ${url}`);
  assert(!/^\/areas\/[^/]+\/[^/]+/.test(path), `Thin area combination in sitemap: ${path}`);
  const { response, html } = await get(path);
  assert.equal(response.status, 200, `Invalid sitemap URL: ${path}`);
  assert(!response.headers.get('x-robots-tag')?.includes('noindex'), `Header noindex: ${path}`);
  assert(!/<meta[^>]+name="(?:robots|googlebot)"[^>]+content="[^"]*noindex/.test(html), `Meta noindex: ${path}`);
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
  assert(canonical, `Missing canonical: ${path}`);
  assert.equal(new URL(canonical).pathname, path, `Wrong canonical path: ${path}`);
  assert.equal(new URL(canonical).origin, canonicalOrigin, `Wrong canonical host: ${path}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title, `Missing title: ${path}`);
  assert(!titles.has(title), `Duplicate title: ${path}`);
  titles.add(title);
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, `Expected one server-rendered H1: ${path}`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert(schemas.some(schema => schema['@type'] === 'WebSite'), `Missing site schema: ${path}`);
  if (path.startsWith('/services/')) {
    serviceCount++;
    assert(schemas.some(schema => schema['@type'] === 'Service'), `Missing Service schema: ${path}`);
    assert(html.includes('Chuẩn bị trước khi hẹn thợ'), `Missing service-specific preparation: ${path}`);
  }
  if (/^\/blog\/[^/]+$/.test(path)) {
    blogCount++;
    const body = text(html.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1] || '');
    assert(body.length > 1000, `Incomplete article: ${path}`);
    assert(!articleBodies.has(body), `Duplicate article body: ${path}`);
    articleBodies.add(body);
    assert(html.includes('aria-label="Dịch vụ liên quan đến bài viết"'), `Missing article/service links: ${path}`);
  }
}
assert.equal(serviceCount, 11);
assert.equal(blogCount, 7);
const area = await get('/areas/ninh-kieu/sua-may-lanh');
assert.equal(area.response.status, 200);
assert(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(area.html), 'Thin area page must be noindex');
assert(!robots.html.includes('Disallow: /areas'), 'Allow Google to read area noindex');
const missing = await get('/services/not-a-real-service');
assert.equal(missing.response.status, 404);
console.log(`SEO audit passed: ${urls.length} sitemap URLs, ${serviceCount} services, ${blogCount} unique articles; area noindex and 404 verified. Canonical origin: ${canonicalOrigin}`);
