# Ice Blue homepage — verification, 2026-11-02

## Delivered

- Home-only Ice Blue theme, orange booking CTA, real brand logo, generated 3D house, six equipment groups and four-step process.
- All 11 existing service links are server-rendered; client selection exposes the corresponding panel. AC has three featured cards plus relocation and gas links.
- Original coverage component, footer component and floating AI/Zalo component are byte-for-byte unchanged (see `preserved.sha`). The original coverage wrapper is retained because existing CSS depends on it.
- Other pages retain their original header palette. Booking APIs, schema, canonical and analytics are unchanged.
- Preview: http://127.0.0.1:3006 (production build). No production deployment performed.

## Checks

- Production build passed: 106 static pages. Homepage route 5.82 kB, first-load JS 171 kB (Next build report).
- TypeScript and targeted ESLint passed; `git diff --check` passed.
- `node scripts/audit-ice-blue.mjs http://127.0.0.1:3006`: passed at 360×800, 390×844, 768×1024, 844×390, 1440×1000, 1920×1080, 2560×1440.
- No horizontal overflow or uncaught page errors; six category buttons, 11 service links, keyboard selection, area activation/photo credit, footer disclosure and mobile menu passed.
- `/services`, `/services/sua-may-lanh`, `/contact`, `/booking`, `/about` passed navigation, H1 and header-theme regression checks.
- AI open/close, phone/Zalo hrefs and navigation to booking form passed at 390 and 1440 px. No real message or booking was submitted; API delivery was not tested.
- `node scripts/audit-seo.mjs http://127.0.0.1:3006`: passed 36 sitemap URLs, 11 services, seven unique blog articles, noindex area combinations and 404. Canonical remains the Vercel production hostname.
- Reduced-motion screenshots captured; ordinary-motion desktop also inspected. New home mounts no canvas and has no continuous hero animation.
- Coverage/footer comparison used equal viewport dimensions: element sizes agree within 1 CSS px from fractional screenshot rounding. Source and inherited styles are retained. Screenshots are not pixel-identical because page position, sticky/floating controls and image loading can differ.

## Local performance comparison

Chromium, 390×844, DPR 2, touch/mobile, cold browser cache per run, 4× CPU slowdown, 150 ms latency, 200,000 bytes/s down, 93,750 bytes/s up. Three runs per version; values below are medians. Observation ends six seconds after load; these are lab observations, not field Core Web Vitals or Lighthouse scores.

The before version is the archived `.next-seo-build` production build; the after version is `.next-ice-blue-build`. The archived build is a comparison reference, not a reconstruction of every uncommitted workspace change present at task start. Before/after layout screenshots were captured directly from the workspace during this task.

| Metric | Before archived build | Ice Blue build |
|---|---:|---:|
| LCP | 6,652 ms | 2,476 ms |
| FCP | 1,068 ms | 1,048 ms |
| CLS in observation window | 0.3223 | 0 |
| Sum of long-task duration over 50 ms | 816 ms | 43 ms |
| Resource transfer size | 3,019,793 bytes | 633,712 bytes |

Raw runs: `performance.json`. These results do not establish real-device FPS or guarantee production LCP. No physical iPhone/Safari testing was performed. Safe-area CSS is retained; responsive emulation cannot certify actual notch behavior.

## Assets and evidence

- Generated with the built-in image_gen tool, then WebP-encoded with Sharp. No runtime 3D library. Three source sheets total approximately 280 KiB.
- Runtime assets: `apps/web/public/images/home-ice-blue/{house,devices,services}.webp`. Next Image serves responsive derivatives; the sheets share one URL across device/service illustrations.
- Asset provenance and prompt set: `assets.json`, `prompts.md`. Images are illustrations, not verified photos of actual staff or work.
- Final screenshots: `after-{width}.png`; desktop first-screen preview: `motion-desktop.png`.
- Protected-component comparisons: `before-{area|footer}-{width}.png`, `preserved-{area|footer}-{width}.png`, `preservation.json`.
- Existing unrelated workspace changes were retained. No database migration is needed for this homepage change.
