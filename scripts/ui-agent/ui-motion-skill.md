# UI / Motion Self-Healing Skill

## 60FPS GPU Mandate
- Animate only `transform` (`translate`, `scale`, `rotate`) and `opacity`.
- Never use `transition-all` or animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Use `transition-[transform,opacity,background-color,border-color,box-shadow]` for interactive controls. Color/shadow transitions are the explicit micro-interaction exception; keep them short and local.
- Use Framer Motion's `layout` prop when a container genuinely needs size interpolation. Avoid layout reads/writes inside animation frames.

## Timing & Physics Tokens
- Micro-interactions: 150–200ms; `ease-[cubic-bezier(0.22,1,0.36,1)]`; `hover:-translate-y-[1px]`; `active:scale-[0.97]`.
- Modal / dropdown / popover / toast enter and exit: wrap conditional children in `<AnimatePresence>`.
- `initial={{ opacity: 0, scale: 0.96, y: 8 }}`
- `animate={{ opacity: 1, scale: 1, y: 0 }}`
- `exit={{ opacity: 0, scale: 0.98, y: 4 }}`
- `transition={{ type: "spring", stiffness: 400, damping: 28 }}`
- Staggered lists: `staggerChildren: 0.04`; complete the entire entrance within 400ms, capping delays for long lists.
- Preserve native `<dialog>` / `<details>` semantics, focus management and existing business state. Animate their child surfaces rather than replacing their behavior.

## Accessibility & Touch Targets
- All `button`, `a`, `input`, `select`, `textarea`, `summary`, and `[role="button"]` targets: `min-h-[44px] min-w-[44px]` (or equivalent CSS).
- Keyboard focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2` (or equivalent visible outline/ring).
- Respect motion sensitivity with `motion-reduce:transition-none motion-reduce:hover:transform-none` and `<MotionConfig reducedMotion="user">`.
- Under reduced motion, stop decorative loops and disable transform interactions. Keep content visible and functional.
- WCAG AA: normal text contrast at least 4.5:1, large text 3:1. Retain Vietnamese text, labels, state, props, hooks, data and event handlers.

## Verification
- Audit both 1440×900 desktop and 390×844 touch mobile. Count rendered, enabled targets, including those below the fold; exclude hidden/inert slides.
- Report raw Axe violations, affected nodes, incomplete checks and DOM evidence. A zero automated count is not a claim of full WCAG compliance or measured 60FPS.
- React Fiber debug source is best effort. Source-search candidates must be labelled as inferred, never as verified mappings.
- Fix repeatable, deterministic patterns automatically. Route semantic/visual issues to a code review with concrete evidence; never execute model-generated code.
