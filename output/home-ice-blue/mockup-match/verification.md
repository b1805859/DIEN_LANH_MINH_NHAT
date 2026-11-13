# Direct mockup comparison

Reference: approved Ice Blue image `exec-fde7bda2-0b2b-4635-bea8-7d4665f80dd2.png` in this chat's generated_images directory.

Measured card geometry: 347:200 aspect, title inset 6.34% horizontally and 14% vertically, description top 30%, CTA bottom 10%. AC section uses the original two-line intro, expanded card row and 1% gaps. Descriptions are limited to three lines to preserve the button separation.

The three illustrations were recreated directly from the reference with built-in image_gen, replacing the previous generic sprite. Runtime files: apps/web/public/images/home-ice-blue/service-{repair,clean,install}-mockup-v3.webp. Full-bleed art backgrounds; all headings, descriptions and links remain HTML.

Prompts: extract each approved service card as a 347:200 rectangular background, remove UI text and button, preserve pastel gradient, composition, subject scale and scene. Repair: back-facing technician and opened AC. Clean: closed white AC, airflow, green leaves and pot. Install: outdoor condenser, toolbox, drill and plant, without copper coil. Original generated files: exec-18ce7256-4eae-429c-a16e-3da1f18d95a0.png, exec-1b4d6d5a-c13f-4680-bd1f-2ff2ae6fc195.png, exec-73ebf3a2-60b5-44d0-a707-12bc5d694d7d.png. WebP encoding only after generation.

Visual comparison: comparison.png presents reference above implementation at the same row width. These are recreated illustrations, so fine details are not pixel-identical to the original generated mockup. The implementation does not claim a perfect pixel match.

Checks: production build and targeted ESLint passed. Eight viewports (360,390,768,1024,1122,1440,1920,2560), no horizontal overflow or uncaught errors, no description/button overlap; see checks.json. Original coverage, footer and floating controls pass source checksum preservation. Live port 3006 verified serving v3 images. No production deploy.
