# Visible heater-to-shower connections

The user approved the conventional top-freezer refrigerator in exec-ddcea09a-30c9-4bbc-8991-ab5a7176e6cb.png and requested that the shower visibly obtain water from the heater instead of appearing disconnected.

The accepted whole-house image is saved losslessly as apps/web/public/images/home-ice-blue/hd/house-fridge-approved-v4.webp. A raw RGBA comparison of its refrigerator region (x400,y650,w370,h410) with the accepted PNG passed pixel equality. Only the bathroom crop was passed to image_gen for the next edit, so the refrigerator was not regenerated.

The corrected crop shows a continuous hot-water pipe from the tank's red outlet to the mixer's left inlet, a cold supply tee branching toward the tank inlet and mixer's right inlet, and the shower hose from mixed outlet to the shower head. The tank ports are not bridged together. This is a visual architectural illustration, not an installation specification.

Runtime edited asset: apps/web/public/images/home-ice-blue/hd/bath-connected-v1.webp, 1132×1389, WebP quality 92. Source crop: x970,y615,w375,h460 in the 1377×1142 accepted house image. CSS positions the replacement only within that right-side region, with a narrow edge blend; the rest uses the accepted base. Generated original: exec-e44b57bc-8003-467a-ba93-cf476ebb1729.png in this chat's generated_images directory. Tool: built-in image_gen, transparent_background=false. Exact prompt: prompt.txt.

Validation: production build, targeted ESLint, TypeScript and whitespace checks passed. Base and bathroom images decode at 390,1122,1440px, overlay remains in the rightmost 30% of the house, no document overflow or uncaught page errors. checks.json and preview-*.png record the results. Coverage/footer/AI/Zalo source checksums are unchanged. Local preview uses port 3006; no production deployment.
