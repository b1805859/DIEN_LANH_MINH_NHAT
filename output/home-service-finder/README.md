# Desktop home service finder — 2026-10-31

The selected mockup is `reference.png`. The implementation changes only desktop widths above the existing 900px navigation breakpoint. Mobile keeps the original hero (copied verbatim to `home-mobile-hero.tsx`, export name changed only), original photo, original eight-item service gallery and existing section ordering.

Desktop displays all 11 services as links in the hero. The separate duplicated desktop gallery is omitted. Introduction, existing five-step animated process, coverage/map and projects remain. The mockup's “Hiểu rõ dịch vụ trước khi đặt” section is not added.

User refinement: the blue panel's extension beyond the content column was reduced from 64px to 20px. The source image and WebGL canvas use a shared, right-aligned projection so the AC and technician remain visible on laptops.

## Asset

- Mode: built-in ImageGen edit, then WebP encoding with Sharp.
- Asset: `apps/web/public/images/redesign/hero-family-service-finder-v2.webp` (1660 × 947).
- Source: `hero-family-natural-arms-uniform-v1.webp`.
- Prompt: preserve the original wide living room, Vietnamese technician with navy/cyan uniform on the right and AC upper right; relocate the seated mother, father and child to the center-right, around 64–83% of image width, with the complete sofa and coffee table also inside that right-hand zone, so the left service panel does not hide them. Keep natural anatomy and lighting. Do not bake airflow or particles into the photo. Output only the photo, no UI.
- The original `HeroAirflow` implementation is unchanged. A sibling foreground mask protects the recomposed family while retaining the existing technician contour.

## Verification

- Isolated production build passed, 106 static pages generated.
- Targeted ESLint and TypeScript checks passed.
- Desktop 1440px and laptop 1024px: 11 service links, no horizontal overflow or clipped links.
- 390px preservation check: legacy hero, original image, original eight-item gallery, no new desktop finder.
- Browser-tested newly surfaced drinking-water-dispenser service link and booking CTA; both navigated to correct existing pages.
- One hero particle canvas mounted at a time; visual airflow and micro-particles present.
- Fresh browser console: no warnings or errors.
- Original particle component, process components, coverage component and map data match pre-task SHA-256 hashes.
- Comparisons: `hero-content-comparison.png`, `services-comparison.png`.

User correction: the first crop still hid part of the family/sofa. The v2 photo repositions the entire seating group inside the visible image region; mobile keeps its original photo.
