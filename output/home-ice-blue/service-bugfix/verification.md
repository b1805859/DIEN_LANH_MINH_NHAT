# AC service card rendering fix

User confirmed the defect is in the three AC cards. Source inspection showed two concrete errors in the previous implementation: rectangular clipping boundaries exposed different background colours, and the installation card clipped at 72% even though the outdoor condenser begins around 56%, removing its fan.

The source artwork remains unchanged. Corrected source boundaries include the entire condenser and toolbox and the cleaning card's leaves. Small feathered SVG masks soften the empty source margins without regenerating the illustrations. Card background colours are sampled from text-free pixels in the reference. Home teaser text now matches the reference's shorter cleaning/installation descriptions; catalogue text remains unchanged.

Evidence: before-1440-0.png / before-390-0.png versus final-1440.png / final-390.png. Enlarged read-only reference inspections are source-{repair,clean,install}.png. No new image generation or raster retouching was used.

Checks: eight viewports (360,390,768,901,1122,1440,1920,2560), no horizontal overflow or uncaught page errors, no title/description/button overlap, equal desktop CTA baselines, all three service destinations return 200. See checks.json. Targeted ESLint, TypeScript and production build passed. Coverage/footer/AI/Zalo source checksums still match. No production deployment.

The full mockup remains a flattened image; this fix addresses the visible card clipping and colour seams rather than asserting pixel-perfect equality of the entire homepage.
