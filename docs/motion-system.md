# Public website motion

The public site uses CSS transitions and the browser Web Animations API. No animation dependency or scroll replacement is required. Pages remain Server Components; `SiteMotion` in `SiteChrome` provides the client enhancement.

## Shared language

`apps/web/lib/motion/config.ts` defines durations (200/320/720/900 ms), easing, distances, stagger limits, and viewport settings. Scroll content uses 1050 ms; large images use 1200 ms with a gentler, separate easing. Viewport reveals start at 15% visibility, 40 px inside the bottom edge rather than before entry. `motionVariables` emits the same values as CSS custom properties during SSR. Micro-interactions live in `apps/web/app/motion.css`; page modules only own composition-specific details such as workflow connectors and gallery changes.

- `data-motion="up|left|right|fade|scale"`: reveal once near the viewport.
- `data-motion="image"`: scale reveal that preserves the image's authored opacity/mask.
- `data-motion="hero|hero-image|header"`: immediate, transform-only entrance; never hides the headline or LCP image.
- `data-motion-delay="120"`: optional delay, paced at 1.15× and capped at 420 ms.
- `data-motion-stagger="70"`: observe direct children with successive delays. Each child is observed separately so long mobile grids do not animate before they are visible.
- `data-motion-group-variant="fade"`: quieter group entrance, used by footer groups.
- `data-motion="workflow"`: triggers `data-motion-state="visible"` without fading the whole group on top of its children.
- `data-motion-hover="button|card|image|icon"`: consistent hover/touch feedback. Card/button lift can be reduced through `--motion-card-lift` and `--motion-button-lift`.
- `Reveal` is a compatible, server-safe wrapper/Slot that emits the same markers. It does not create an observer per component.

Keep markers on meaningful headings, cards, or groups. Do not add them to every paragraph or nest multiple fades on the same content. Native `translate` and `scale` animation properties preserve existing `transform` composition; hover uses separate properties where needed.

## Lifecycle and accessibility

There is one active motion IntersectionObserver per public route and a MutationObserver for streamed/inserted content. Both disconnect on route changes; native animations, frame callbacks, and event listeners are cleaned up. Shared header/footer DOM is remembered with a WeakSet so it does not repeatedly enter on navigation. CSS workflow animations are one-shot.

Content is visible in the server HTML and never depends on a hidden CSS class. Unsupported animation APIs leave it usable. Keyboard focus cancels motion on its ancestors. Reduced motion disables native entrances and CSS motion, including hover displacement and enhanced scrolling; changing the preference mid-animation cancels active animations. Touch/small screens use half the entrance distance and shorter stagger, with no hover-dependent actions. Scrolling remains native everywhere.

Page entry is a 320 ms opacity adjustment that starts after navigation; it never waits for an exit animation, replaces forms, or intercepts router behavior. News category links retain their real routes and have a short result-entry animation. Gallery image changes retain the navigation button and its keyboard focus.

Service image assets, sizes, object positions, content, routes, booking validation/submission, and brand design are preserved. No counters or ambient loops were added.

## Verification

Run `npm run build:web`, `npm run lint --workspace @minhnhat/web`, and `npx tsc --noEmit -p apps/web/tsconfig.json`.

With the production site running locally, run `node apps/web/scripts/motion-qa.mjs`. The script defaults to installed Chrome (`PLAYWRIGHT_CHANNEL` can override it), takes `MOTION_QA_URL`, blocks external writes with local mocked responses, and covers desktop/mobile public routes, SSR without JavaScript, reduced motion, one-shot reveal, hover composition, route cleanup, gallery keyboard behavior, menu navigation, and form validation/success. It writes screenshots and a JSON report to `output/motion-qa/`.
