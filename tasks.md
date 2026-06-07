# Implementation Task Plan

Source of truth: `plan.md`

Status legend:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed
- `[!]` Blocked or needs approval

Current status: Phases 1 through 9 complete. Final review, coverage matrix, and reports generated.

## Phase 0: Planning and Approval

- [x] Read `plan.md` completely.
- [x] Analyze business, SEO, CMS, booking, security, performance, and infrastructure requirements.
- [x] Create `architecture.md`.
- [x] Create `tasks.md`.
- [x] Wait for approval before creating application code.

## Phase 1: Project Setup, Docker, PostgreSQL, Prisma, NestJS, Next.js

- [x] Create monorepo folder structure.
- [x] Initialize Next.js 15 app with App Router, React 19, TypeScript, and TailwindCSS.
- [x] Install and configure Shadcn/UI.
- [x] Install frontend dependencies: TanStack Query, React Hook Form, Zod, Axios.
- [x] Initialize NestJS API with TypeScript.
- [x] Configure PostgreSQL connection.
- [x] Install and configure Prisma ORM.
- [x] Create initial Prisma schema.
- [x] Add Docker setup for web, API, PostgreSQL, and Nginx.
- [x] Add `.env.example` for frontend, backend, database, auth, SEO, and integrations.
- [x] Add base linting and formatting configuration.
- [x] Verify local services start through Docker.

## Phase 2: Authentication and Authorization

- [x] Create user and role database models.
- [x] Create refresh token model or equivalent secure refresh-token persistence.
- [x] Implement password hashing.
- [x] Implement login endpoint.
- [x] Implement access token generation.
- [x] Implement refresh token flow.
- [x] Implement logout flow.
- [x] Implement JWT guards.
- [x] Implement role-based access control.
- [x] Protect admin API routes.
- [x] Create frontend admin login page.
- [x] Create authenticated admin layout.
- [x] Add frontend auth state handling.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`
- [x] Runtime login smoke test with seeded admin user.

## Phase 3: CMS Foundation

- [x] Implement service management API.
- [x] Implement location management API.
- [x] Implement category and tag management API.
- [x] Implement FAQ management API.
- [x] Implement testimonial management API.
- [x] Implement media file management API.
- [x] Implement SEO settings management API.
- [x] Implement user management API.
- [x] Build admin dashboard.
- [x] Build admin CRUD pages for services.
- [x] Build admin CRUD pages for locations.
- [x] Build admin CRUD pages for categories and tags.
- [x] Build admin CRUD pages for FAQs.
- [x] Build admin CRUD pages for testimonials.
- [x] Build admin CRUD pages for media files.
- [x] Build admin CRUD pages for SEO settings.
- [x] Build admin CRUD pages for users and roles.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`
- [x] Protected admin dashboard smoke test.

## Phase 4: Booking System

- [x] Create booking database model.
- [x] Create booking status enum: Pending, Confirmed, In Progress, Completed, Cancelled.
- [x] Implement public booking creation API.
- [x] Validate service, district, date, time, address, customer information, and notes.
- [x] Add rate limiting to public booking endpoint.
- [x] Implement admin booking list endpoint.
- [x] Implement booking detail endpoint.
- [x] Implement booking status update endpoint.
- [x] Build public booking page.
- [x] Build quick booking form component.
- [x] Build admin booking management pages.
- [x] Add status filters and date filters.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`

## Phase 5: Blog System

- [x] Create blog post model.
- [x] Create category model.
- [x] Create tag model.
- [x] Add featured image support.
- [x] Add SEO metadata fields for blog posts.
- [x] Implement blog public listing API.
- [x] Implement blog detail API.
- [x] Implement blog category and tag filtering.
- [x] Build public blog list page.
- [x] Build public blog detail page.
- [x] Build blog category pages.
- [x] Add table of contents support.
- [x] Add related articles.
- [x] Add social sharing.
- [x] Build admin blog management pages.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`

## Phase 6: SEO System

- [x] Implement Metadata API helpers.
- [x] Implement dynamic page metadata.
- [x] Implement canonical URL generation.
- [x] Implement Open Graph metadata.
- [x] Implement Twitter Card metadata.
- [x] Implement JSON-LD helpers.
- [x] Implement LocalBusiness schema.
- [x] Implement HVACBusiness schema.
- [x] Implement Service schema.
- [x] Implement FAQPage schema.
- [x] Implement BreadcrumbList schema.
- [x] Implement BlogPosting and Article schemas.
- [x] Implement dynamic sitemap.
- [x] Implement robots.txt.
- [x] Implement automatic slug generation.
- [x] Implement internal linking helpers.
- [x] Verify initial HTML contains SEO content before JavaScript execution.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`
- [x] Runtime check confirms canonical metadata and JSON-LD in programmatic page HTML.

## Phase 7: Programmatic SEO

- [x] Seed or create CMS entries for priority services.
- [x] Seed or create CMS entries for priority districts.
- [x] Implement service x location landing page data composition.
- [x] Implement `/areas/[locationSlug]/[serviceSlug]` route.
- [x] Generate SEO titles automatically.
- [x] Generate meta descriptions automatically.
- [x] Generate breadcrumbs automatically.
- [x] Generate structured data automatically.
- [x] Generate canonical URLs automatically.
- [x] Add sitemap entries automatically.
- [x] Add related services.
- [x] Add related blog posts.
- [x] Add localized FAQs.
- [x] Add booking CTA and contact CTA.
- [x] Add support for editorial overrides per service-location pair.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`
- [x] Runtime check for `/areas/ninh-kieu/sua-may-lanh`.

## Phase 8: Integrations

- [x] Add Google Maps embed support.
- [x] Add configurable business address and map settings.
- [x] Add Google Analytics configuration.
- [x] Add Google Search Console verification support.
- [x] Add Facebook Messenger link or chat integration.
- [x] Add Zalo Official Account link or integration.
- [x] Add global floating hotline button.
- [x] Add global floating Zalo button.
- [x] Add global floating Messenger button.
- [x] Add sticky mobile call button.
- [x] Add click-to-call links.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`

## Phase 9: Optimization, Testing, and Production Deployment

- [x] Add image optimization strategy.
- [x] Add lazy loading for non-critical media.
- [x] Add route and code splitting verification.
- [x] Add caching headers through Nginx.
- [x] Add compression through Nginx.
- [x] Add API rate limiting tests.
- [x] Add API validation tests.
- [x] Add authentication and authorization tests.
- [x] Add booking flow tests.
- [x] Add CMS CRUD tests for critical modules.
- [x] Add SEO metadata and structured data tests.
- [x] Run Lighthouse audits.
- [x] Fix performance, accessibility, SEO, and best-practice issues.
- [x] Create production Docker configuration.
- [x] Create Nginx production configuration.
- [x] Create deployment guide.

Validation:

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test`
- [x] `npm audit --omit=dev`
- [x] Docker Compose stack rebuild and smoke test.
- [x] Lighthouse: Performance 98, SEO 100, Accessibility 92, Best Practices 96.

## Required Initial Content

Priority services:

- [x] Tháo Lắp Máy Lạnh.
- [x] Vệ Sinh Máy Lạnh.
- [x] Sửa Máy Lạnh.
- [x] Nạp Gas Máy Lạnh.
- [x] Sửa Tủ Lạnh.
- [x] Sửa Máy Giặt.
- [x] Vệ Sinh Máy Giặt.
- [x] Sửa Chữa Điện Nước.

Priority districts:

- [x] Ninh Kieu.
- [x] Cai Rang.
- [x] Binh Thuy.
- [x] O Mon.

Blog categories:

- [x] Máy Lạnh.
- [x] Máy Giặt.
- [x] Tủ Lạnh.
- [x] Điện Nước.
- [x] Tiết Kiệm Điện.

Example blog topics:

- [x] Bao lâu nên vệ sinh máy lạnh một lần?
- [x] Dấu hiệu máy lạnh cần nạp gas.
- [x] Máy lạnh không lạnh nguyên nhân do đâu?
- [x] Máy lạnh chảy nước phải làm sao?
- [x] Các lỗi thường gặp ở tủ lạnh.
- [x] Khi nào cần vệ sinh máy giặt?
- [x] Mẹo tiết kiệm điện khi sử dụng máy lạnh.

## Approval Gate

- [x] Do not start Phase 1 until the user approves `architecture.md` and `tasks.md`.
- [x] After each phase, update task progress before continuing to the next phase.
- [x] Do not implement features outside `plan.md` without explicit approval.

