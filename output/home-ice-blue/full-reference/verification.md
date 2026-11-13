# Full homepage reference alignment

The latest user request supersedes the earlier orange CTA and original home-header logo choices: the home now follows the blue CTA, reference wordmark, header navigation, house, equipment and service illustrations, pastel backgrounds and compact process in the attached Ice Blue mockup. Coverage, footer and Zalo/AI controls remain unchanged.

## Artwork

Source: user attachment codex-clipboard-e85b0504-6b97-4239-a4ea-ac78737d9f18.png, 1122×1402. Original saved as approved-reference.png in this evidence directory. Runtime asset: apps/web/public/images/home-ice-blue/approved-artwork.webp, losslessly encoded, approximately 1.2 MiB. No new image generation was used for this pass; earlier generated replacement artwork is no longer consumed by the home.

ReferenceArt displays illustration-only source regions with CSS positioning/clipping. Titles, descriptions, navigation, category buttons and service CTAs are live HTML. The house silhouette excludes the original UI text; category and process imagery use separate regions. This preserves source image pixels, while CSS backgrounds, typography and responsive geometry are reconstructed. It is not a claim that every rendered page pixel is identical to the raster mockup, especially at other viewport sizes. No layered design source exists in the workspace.

## Checks

- Production build, TypeScript and targeted ESLint passed.
- Eight viewports: 360, 390, 768, 901, 1122, 1440, 1920, 2560. One H1, six working selectors, no document overflow or uncaught page errors. Catalogue navigation exposes all 11 service URLs; the home retains three AC cards to match the reference.
- SEO audit passed 36 sitemap URLs, 11 services and seven unique articles; canonical, area noindex and 404 checks passed.
- Source checksums match for VerifiedServiceArea, HomeFooter and FloatingActions.
- Screenshot evidence: final-{width}.png; live-1122.png is a same-size comparison capture without floating overlays, which remain enabled in the application.
- No production deployment. Preview runs on port 3006.

## Practical limits

Source images are the exact supplied raster artwork. CSS gradients, font rasterization, clipping boundaries and responsive adaptations may differ from that flattened mockup. The lossless source is a single shared download; the extra payload is a deliberate tradeoff to retain its exact artwork instead of regenerating approximations. Physical Safari/iPhone behavior was not tested.
