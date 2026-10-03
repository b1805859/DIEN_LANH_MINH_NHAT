# Khu vực — implementation and visual QA

Route: `/areas` (local preview: http://localhost:3000/areas).

The page is implemented with real HTML/React components and an isolated CSS module. It replaces the previous redirect to `/areas/ninh-kieu`. No global style, Home component, Services component, or pre-existing image asset was changed for this task. The existing validated booking form logic is reused inside a page-scoped visual wrapper.

## Files

- `apps/web/app/areas/page.tsx`
- `apps/web/components/layout/site-chrome.tsx` — adds only the `/areas` branch and its imports.
- `apps/web/components/areas-reference/areas.module.css`
- `apps/web/components/areas-reference/sections.tsx`
- `apps/web/components/areas-reference/chrome.tsx`
- `apps/web/components/areas-reference/area-selection.tsx`
- `apps/web/components/areas-reference/data.ts`
- `apps/web/components/areas-reference/reference-icon.tsx`
- `apps/web/public/images/areas/` — ten local WebP images and `ASSETS.md`.
- `apps/web/scripts/areas-reference-qa.mjs`

Components: AreasHeader, AreasHero, AreaGrid, AreaCard, NearbyAreas, TrustBar, BookingSection, BookingForm, AreasFooter, AreaSelectionProvider, AreaButton and AreasReferenceIcon. Header search accepts accented/unaccented area names. All eight cards and six chips open service links and an in-page booking action; they do not point to nonexistent area routes. The booking form keeps its existing API, validation, pending/duplicate guard, success, error and retry behavior.

## Desktop comparison

Desktop screenshot compared with provided mockup: **YES**, at **880 × 1788**, device scale 1.

- [Final desktop](areas-880.png)
- [Mockup beside implementation](compare-desktop.png)
- [320px](areas-320.png), [390px](areas-390.png), [768px](areas-768.png), [1440px](areas-1440.png)

| Section | Top | Height | Bottom |
| --- | ---: | ---: | ---: |
| Hero | 0 | 471 | 471 |
| Area directory | 471 | 524 | 995 |
| Nearby areas | 995 | 149 | 1144 |
| Trust bar | 1144 | 86 | 1230 |
| Booking | 1230 | 303 | 1533 |
| Footer | 1533 | 255 | 1788 |

Booking form: x559, y1246, width288, height272. Cards: four desktop columns, two tablet columns, one or two mobile columns depending on width.

## Verification

`node apps/web/scripts/areas-reference-qa.mjs`: **17 passed, 0 failed**. See [full result](qa-results.json) and [check list](qa-results.md).

- All five widths render without horizontal document overflow or broken images.
- Eight distinct area images, six nearby chips and four required form fields.
- Search, details, menu, Escape/focus return, service navigation and booking anchors checked.
- Required/invalid input, pending duplicate prevention, successful booking, server failure and retry checked with intercepted requests. No real booking was sent.
- No unexpected console errors or uncaught runtime errors.
- 150 original files verified against pre-edit hashes.
- Services screenshot is pixel-identical to the pre-edit screenshot in the final run.
- Home: zero changed pixels outside photographs; all computed styles, element boxes and image URLs unchanged across 480 elements when the Areas stylesheet is removed. Services also passes the same isolation check across 565 elements.
- Raw Home screenshot difference remains 27,861 pixels (maximum channel difference30), restricted to photographs. Chrome photo resampling varied across repeated fresh/scroll/repaint captures without source changes. Raw counts remain in the JSON report instead of being reported as a pixel-identical Home comparison.

Targeted ESLint, TypeScript and production build pass.

## Remaining visual differences

The overall section geometry is aligned, but this is **not a 100% pixel-identical reproduction**:

- The hero and eight district photographs are generated interpretations. The skyline, statue shape/plinth, clouds, vehicles, trees, streets, bridge and river details differ from the reference. The hero sky/foreground lighting and facade are also different.
- The booking technician matches the bare-arm pose, blue uniform, wrench and van composition more closely after regeneration; facial features, arm placement, embroidered lettering, van/background and crop still differ.
- Minor glyph metrics, icon strokes/shapes, and small text/pill spacing differences remain. In particular the secondary call CTA text, grid descriptions, nearby chip widths and social icons are not exact raster matches.

Generated assets and full prompt sets: [asset provenance](../../apps/web/public/images/areas/ASSETS.md), [hero](prompt-hero.json), [first four cards](prompts-first-four.json), [last four cards](prompts-last-four.json), [booking](prompt-booking.json). All were made with the built-in image generation tool. The rejected second hero attempt is retained as prompt provenance only.
