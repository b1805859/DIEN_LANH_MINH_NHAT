# Shared menu v2 implementation

Applied the approved mockup CSS to `apps/web/app/home-harmony-approved.css`, imported after the existing home styling. Shared service navigation is retained. No production deployment performed.

Pixel comparison against the previously approved PNG files: zero differing pixels for desktop 1440×1000, mobile 375×1000, tablet 768×1000, and full desktop/mobile captures. Chromium, DPR 1, reduced motion, loaded fonts/images, and the reference's desktop-load-then-resize sequence were used for both sides. A fresh mobile navigation may select a different responsive image or downsampling cache; it previously differed only in image rasterization, not typography or geometry.

Functional checks passed: mobile menu opens/closes; washing-machine equipment selection changes the active state. No browser runtime errors. No horizontal overflow at 320, 375, 768, 1024, 1440, and 1920 pixels. ESLint passed for the modified layout.

Machine-readable results: `verification.json`. Actual screenshots and absolute difference images are in this directory. Reference screenshots remain unchanged in the parent directory.
