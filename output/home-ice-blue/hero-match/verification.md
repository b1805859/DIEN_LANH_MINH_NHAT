# First-screen reference alignment

Changes are confined to the home header/hero and the home wrapper background. The service section's component, copy and art masks are unchanged in this pass.

- Replaced polygon clipping of the house with a cleaned transparent asset retaining the 1377×1142 canvas and house landmarks. This restores the roof, foliage and left balcony that the old polygon cut away.
- The home wrapper background now continues behind the header instead of leaving a white strip. Header still becomes opaque when scrolling for readable navigation.
- At the 1122px reference width, title first line is approximately 47.3px with the second line at 93% to match the reference's different text measure; desktop remains two lines. Subtitle and trust row spacing are adjusted independently.
- Booking and call button widths are approximately 215px and 170px at the reference width, with a 15px gap. The hotline pill is widened by matching its reference text size. Hero benefit icon now uses a document/list outline.

## Validation

- Production build, TypeScript, targeted ESLint and git diff whitespace checks passed.
- Eight viewport widths (360,390,768,901,1122,1440,1920,2560): no document overflow or uncaught page errors, one H1, two-line title on desktop, hero decoded with no CSS clip/mask, CTA heights at least 44px with no overlap, mobile menu works. Raw checks: checks.json.
- Checksums unchanged for coverage, footer and floating AI/Zalo components.
- Evidence: before-1122.png and after-{width}.png; same-width reference comparison is comparison.png. Floating controls may be hidden in isolated visual comparison screenshots only; application controls are retained.
- No production deployment; local production preview uses port 3006.

## Asset provenance

Runtime asset: apps/web/public/images/home-ice-blue/hd/house-clean-v2.webp. Built-in image_gen edit with transparent_background=true, followed by WebP encoding at quality 92 / alpha quality 100. Original generated output: exec-e70330c8-e972-4d9d-a162-ad343893609d.png in this chat's generated_images directory. Original source was the HD house; only surrounding UI/background cleanup was requested. AI extraction can make small differences to edge/detail pixels and is not proof of exact pixel equality to the flattened mockup.
