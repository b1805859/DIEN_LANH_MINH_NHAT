# Home service finder — desktop QA, 2026-10-31

final result: passed

## Scope and source

- Source visual: `/Users/macbookprom1/develop/DIEN_LANH_MINH_NHAT/output/home-service-finder/reference.png` (899 × 1748 pixels).
- Implementation: http://localhost:3000/.
- Browser-rendered final screenshot: `/Users/macbookprom1/develop/DIEN_LANH_MINH_NHAT/output/home-service-finder/desktop-family-visible.png` (1425 × 1024 captured content pixels; requested desktop viewport 1440 × 1080, capture excludes browser/scrollbar chrome).
- State: home, top of page, all eleven services visible, entrance finished, existing live cooling effect enabled.
- Full composition: `output/home-service-finder/hero-comparison.png` (initial) and `hero-content-final-comparison.png` (final).
- Normalization: source hero cropped at 0,63 with size 899 × 621; final hero cropped at 113,94 with size 1200 × 792. Each resized to 720px width without changing aspect ratio. Existing site gutters/header are retained; the mock's full-bleed outer frame is not treated as a mismatch.
- Focused service-label comparison: `output/home-service-finder/services-comparison.png`. All eleven labels, final full-width water-heater tile, icon circles and arrows were reviewed at readable scale.

## User-directed deviations

- Existing introduction, five-step animated illustrated process, service coverage/map, projects and footer retained rather than replaced by mockup versions.
- The mockup's “Hiểu rõ dịch vụ trước khi đặt” section is omitted.
- Mobile at and below 900px retains its original hero, photo, eight-item gallery and section layout. Only desktop uses the new eleven-service finder.
- Blue panel extension was reduced from 64px to 20px at user's request.
- The desktop photo was recomposed twice because the initial image still placed part of the family/sofa behind the service panel. In the final v2 asset, the complete seating group and table sit farther right in the room. This changes photographic framing from the mock deliberately to satisfy the user's visibility correction.
- Narrow laptops 901–1199px place the menu and photo in separate rows; their DOM bounds do not overlap. This prevents the full service menu from concealing the family on narrower desktop windows. Mobile remains untouched.

## Findings and correction history

1. [P2, resolved] Initial hero cropped the technician/AC and hid the family behind the blue panel. Reduced excess vertical space, kept the scene and WebGL canvas on one right-aligned image projection, and generated a scene with the family in the visible zone.
2. [P2, resolved] User correctly identified residual family/sofa occlusion in v1. Replaced only the desktop photo with v2, relocated the whole sofa/family/table to the right background, and softened the foreground family protection mask. Final browser screenshot and `family-correction-comparison.png` show the blue panel no longer intersects the seating group.
3. [P2, resolved] New hero initially applied to mobile. Restored the complete original mobile hero implementation verbatim under a renamed export and retained the original gallery at the existing mobile breakpoint. Runtime check at 390px found the legacy hero and original image, no desktop finder, eight original service cards.
4. [P2, resolved] Narrow laptop crop could hide background subjects. The 1024px final layout has an 867px-wide photo on its own row below the panel; measured panel bottom equals photo top (733.84px), so no occlusion occurs.

No remaining actionable P0/P1/P2 findings in the requested desktop scope.

## Required fidelity surfaces

- Fonts/typography: existing Be Vietnam Pro retained. Navy bold two-line heading with blue second line, readable service names, no ellipsis or clipped labels. Small helper copy remains subordinate.
- Spacing/layout: two-column service catalogue on wide desktop; last service spans both tracks. Header alignment and existing content frame retained. Blue overflow reduced. Comparison crops normalized by content width.
- Colors/tokens: pale ice-blue gradient panel, white service tiles, existing blue actions and navy copy. Original cooling effect remains a live canvas, not baked into the photo.
- Image quality: built-in ImageGen edit saved as a 1660 × 947 WebP (`hero-family-service-finder-v2.webp`). New photo retains technician/AC and visibly separates the complete seating group from the panel. Existing mask system extended for the new family position; original WebGL shader/component unchanged.
- Copy/content: all eleven catalogue titles and routes derive from existing site content. No new claims, prices, reviews or guarantees. All five original process labels remain, and coverage choices/map are preserved.

## Verification

- Production build passed (106 static pages) after desktop/mobile split. Final photo/framing iterations subsequently passed targeted ESLint and TypeScript validation; CSS formatting passed.
- Browser service-link test: drinking-water-dispenser item navigated to `/services/sua-lap-may-nuoc-uong-nong-lanh` with matching heading.
- Browser CTA test: hero booking button navigated to `/booking`, showing the existing booking page.
- Wide desktop: eleven links, one cooling canvas, no horizontal overflow or clipped link containers.
- 1024px final: eleven links, no horizontal overflow, panel/photo regions do not overlap.
- 390px preservation check: original hero, original image, original gallery; mobile hero file equals the pre-task implementation except export name.
- Fresh final browser console: no errors or warnings.
- SHA-256 checks confirm original `hero-airflow.tsx`, `home-process-journey.tsx`, `process-timeline.tsx`, `verified-service-area.tsx` and `can-tho-map.json` unchanged from task start.
- Introduction content unchanged; page delta against the pre-task backup only replaces the hero import and switches the duplicate gallery to mobile-only.

## Follow-up polish

- P3: generated family scene differs from the original mock's camera distance; the complete seating group is intentionally smaller to stay visible.
- No backend booking submission was made; existing booking behavior was not modified.
