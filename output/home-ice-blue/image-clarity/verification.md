# Homepage image clarity

## Cause and change

The previous runtime asset was the 1122×1402 flattened mockup. Each service card contained only about 347×200 source pixels. At 1440 CSS px and DPR 2 the source bitmap was enlarged approximately 2.57×, explaining the visible softness; changing encoding quality alone cannot restore missing detail.

The home now consumes five individually restored assets generated with built-in image_gen in edit mode, encoded as WebP at quality 92:

| Runtime asset under apps/web/public/images/home-ice-blue/hd/ | Resolution |
|---|---|
| house.webp | 1377×1142 |
| equipment.webp | 2179×722 |
| repair.webp | 1652×952 |
| clean.webp | 1652×952 |
| install.webp | 1653×952 |

Source landmarks are mapped into the existing layout and feathered card masks. HTML text/links remain live. The home logo and process icons now use vector rendering instead of small raster regions. Coverage, footer and floating controls remain unchanged (checksum verification passed).

The new assets total approximately 807 KiB versus about 1.2 MiB for the former shared source. At 1440 CSS px / DPR 2 each service card displays about 888 physical pixels from a 1652px source (0.54×), rather than enlarging a 347px region. The house still scales about 1.29× at DPR 2 versus 2.57× before; the improvement does not establish unlimited 4K detail.

## Validation

- TypeScript, targeted ESLint, production build and git diff whitespace checks passed.
- Six viewport widths (360,390,768,1122,1440,2560), all at DPR 2: all visible images decode, no old mockup raster used in home artwork, vector logo rendered, six category buttons work, no title/description/button overlap, no horizontal overflow or uncaught page errors. Raw measurements: before.json and after.json.
- Retina screenshots: before-1440-dpr2.png and after-{width}-dpr2.png. Final production preview runs on port 3006. No production deployment.
- The initial whole-page restoration trial retained 1122×1402 output and was discarded. It is not the deployed HD source.

## Provenance and limits

Exact prompt set: prompts.json. The sources were read-only browser crops of the approved reference. Image restoration used the built-in image_gen tool, followed only by WebP encoding. Detailed textures are AI-restored approximations, not recovered original camera/design data; small details can differ from the flattened reference. The installation brand lettering received a separate correction edit before use.

Generated originals in this chat's generated_images directory:
- house: exec-f56abaa2-259e-42d6-a009-21294d6045f6.png
- equipment: exec-bf49555e-ca5c-4bee-8f81-66b5227387aa.png
- repair: exec-ff68c3e0-ae86-4211-980a-f19b1eb9adae.png
- clean: exec-a06b0577-5654-4a4f-ae34-9dbfc79c44a4.png
- install final: exec-aa82063b-ceb3-4f21-b66a-0fa8990b0bdd.png
