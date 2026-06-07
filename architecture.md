# Architecture Plan

Source of truth: `plan.md`

Project: ĐIỆN LẠNH MINH NHẬT, a production-ready Local SEO and lead-generation platform for HVAC and home repair services in Can Tho, Vietnam.

This document defines the intended architecture only. No application implementation should begin until this architecture and the task plan are approved.

## 1. Product Scope

The website is a commercial Local SEO and conversion platform, not a static company profile. Its main goals are to:

- Present HVAC and home repair services professionally.
- Generate calls, Zalo conversations, Messenger conversations, bookings, and quotation requests.
- Rank locally in Can Tho, especially Ninh Kieu, Cai Rang, Binh Thuy, and O Mon.
- Support programmatic SEO pages for every service and district combination.
- Provide a full admin CMS for content, booking, media, SEO, and user management.

## 2. System Overview

The system will use a separated frontend and backend architecture:

- Frontend: Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Shadcn/UI.
- Backend: NestJS, TypeScript, REST API, PostgreSQL, Prisma ORM.
- Infrastructure: Docker, Nginx, PostgreSQL container, production-ready environment configuration.
- Data access: Prisma as the single ORM layer for PostgreSQL.
- Authentication: JWT access tokens, refresh token strategy, role-based access control.
- Rendering: SSR, SSG, and ISR based on SEO and content freshness needs.

High-level request flow:

1. Public users browse SEO-rendered pages from Next.js.
2. Forms submit booking, quotation, and contact requests to the NestJS API.
3. Admin users authenticate through the API and manage CMS data.
4. Next.js fetches public content from the API for SSR, SSG, and ISR pages.
5. Sitemaps, metadata, Open Graph, JSON-LD, and canonical URLs are generated from CMS and SEO entities.

## 3. Monorepo Structure

Recommended root structure:

```text
/
  apps/
    web/                 # Next.js public website and admin frontend
    api/                 # NestJS REST API
  packages/
    shared/              # Shared TypeScript types, constants, validation helpers
  docker/
    nginx/               # Nginx config
    postgres/            # Optional database initialization files
  docs/
    deployment.md
  docker-compose.yml
  .env.example
  architecture.md
  tasks.md
```

Rationale:

- Keeps frontend and backend independently deployable.
- Allows shared types without coupling implementation details.
- Leaves room for future worker services, background jobs, or separate admin app if needed.

## 4. Frontend Architecture

The frontend will be built with Next.js App Router and organized around route groups, feature modules, and reusable UI primitives.

Recommended structure:

```text
apps/web/
  app/
    (public)/
      page.tsx
      about/
      services/
      areas/
      blog/
      booking/
      contact/
      faq/
      privacy-policy/
      terms-of-service/
    (admin)/
      admin/
        dashboard/
        services/
        locations/
        blog/
        bookings/
        contacts/
        media/
        seo/
        users/
    api/                 # Next.js route handlers only if required
    sitemap.ts
    robots.ts
  components/
    ui/                  # Shadcn/UI components
    layout/
    forms/
    seo/
    conversion/
    public/
    admin/
  features/
    services/
    locations/
    booking/
    blog/
    faq/
    seo/
    auth/
  lib/
    api/
    metadata/
    schema/
    validators/
    utils/
```

Frontend responsibilities:

- Render all public SEO-critical pages with content, metadata, Open Graph, canonical URLs, breadcrumbs, and structured data in the initial HTML.
- Provide mobile-first conversion UI: hotline, Zalo, Messenger, sticky mobile call button, quick booking, quotation, and contact forms.
- Provide admin CMS screens for managing services, locations, blog, bookings, contacts, media, SEO, users, FAQs, and testimonials.
- Use React Hook Form and Zod for form validation.
- Use TanStack Query and Axios for client-side admin data fetching and mutations.

## 5. Rendering Strategy

SSR:

- Homepage.
- Service pages.
- Service + district landing pages.
- Contact page.
- FAQ pages.
- Booking page where dynamic service/location data is needed.

SSG:

- Blog articles.
- Blog categories.
- Service guides.

ISR:

- Blog content.
- FAQ content.
- SEO landing pages.

Rules:

- SEO pages must be server-rendered or statically generated with complete HTML.
- Metadata, Open Graph, JSON-LD, FAQ schema, breadcrumb schema, and local business schema must exist before JavaScript executes.
- Programmatic SEO pages must be generated from `Services` and `Locations`, not manually created one by one.

## 6. Backend Architecture

The backend will follow Clean Architecture inside a modular NestJS application.

Recommended module structure:

```text
apps/api/
  src/
    main.ts
    app.module.ts
    config/
    common/
      decorators/
      filters/
      guards/
      interceptors/
      pipes/
    modules/
      auth/
      users/
      roles/
      services/
      locations/
      bookings/
      contacts/
      blog/
      categories/
      tags/
      faqs/
      testimonials/
      media/
      seo/
      sitemap/
    prisma/
```

Each business module should separate:

- Controller: HTTP contract and request handling.
- DTOs: request and response validation.
- Application service: use cases and orchestration.
- Repository/data access: Prisma queries.
- Domain model or entity types where useful.

Backend responsibilities:

- Expose REST APIs for public content and admin CMS.
- Enforce authentication, authorization, rate limiting, validation, and secure API design.
- Own database persistence through Prisma.
- Generate or expose data needed for sitemaps, SEO metadata, programmatic landing pages, and structured data.

## 7. Database Design

Primary database: PostgreSQL.

Core tables from the plan:

- `users`
- `roles`
- `services`
- `locations`
- `bookings`
- `contact_requests`
- `blog_posts`
- `categories`
- `tags`
- `faqs`
- `testimonials`
- `media_files`
- `seo_settings`

Recommended supporting relationships:

- Users belong to roles.
- Blog posts have one category and many tags.
- Services have many FAQs, testimonials, and SEO settings where needed.
- Locations have many FAQs, testimonials, and SEO settings where needed.
- Service + location pages can derive from `services` x `locations`, with optional override data stored in a dedicated SEO landing page table if editorial customization is needed.
- Media files can be attached to blog posts, services, testimonials, or SEO content.

Recommended additional tables:

- `refresh_tokens` for secure session refresh handling.
- `service_location_overrides` for optional custom content on specific Service x Location pages.
- `booking_status_history` if booking workflow auditability is required.
- `settings` for global business data such as phone, Zalo OA, Messenger URL, address, maps embed, social links, and analytics IDs.

## 8. REST API Design

Public API groups:

- `GET /services`
- `GET /services/:slug`
- `GET /locations`
- `GET /locations/:slug`
- `GET /areas/:locationSlug/:serviceSlug`
- `GET /blog`
- `GET /blog/:slug`
- `GET /categories`
- `GET /faqs`
- `POST /bookings`
- `POST /contact-requests`
- `POST /quotation-requests` if quotation flow is separated from contact requests

Admin API groups:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /admin/dashboard`
- CRUD for services, locations, blog posts, categories, tags, FAQs, testimonials, media files, bookings, contact requests, SEO settings, users, and roles.

API rules:

- Validate every request DTO.
- Return consistent error envelopes.
- Use pagination, filtering, and search for admin listing endpoints.
- Protect admin routes with JWT and RBAC.
- Rate-limit public write endpoints.

## 9. SEO Architecture

SEO will be treated as a first-class domain, not page-level decoration.

Required SEO features:

- Next.js Metadata API.
- Dynamic metadata per page.
- Canonical URLs.
- Open Graph.
- Twitter Cards.
- JSON-LD.
- Dynamic sitemap.
- Robots.txt.
- Internal linking.
- Automatic slug generation.
- Optimized images and lazy loading.

Required schemas:

- `LocalBusiness`
- `HVACBusiness`
- `Service`
- `FAQPage`
- `BreadcrumbList`
- `BlogPosting`
- `Article`

SEO data sources:

- Business/global settings.
- Services.
- Locations.
- Blog posts.
- FAQs.
- Testimonials.
- SEO settings and optional service-location overrides.

## 10. Programmatic Local SEO

The system must generate SEO landing pages for every service and location pair.

Priority locations:

- Ninh Kieu.
- Cai Rang.
- Binh Thuy.
- O Mon.

Services:

- Tháo Lắp Máy Lạnh.
- Vệ Sinh Máy Lạnh.
- Sửa Máy Lạnh.
- Nạp Gas Máy Lạnh.
- Sửa Tủ Lạnh.
- Sửa Máy Giặt.
- Vệ Sinh Máy Giặt.
- Sửa Chữa Điện Nước.

Canonical route pattern:

```text
/areas/[locationSlug]/[serviceSlug]
```

Each generated page must include:

- Localized H1 and metadata.
- Service benefits.
- Service process.
- Pricing information.
- Local district coverage content.
- FAQs.
- Related services.
- Related blog posts.
- Contact CTA.
- Booking CTA.
- Breadcrumbs.
- Structured data.
- Sitemap entry.

Generation rules:

- Slugs should be deterministic and SEO-friendly.
- URLs, SEO titles, meta descriptions, canonical URLs, Open Graph, breadcrumbs, internal links, sitemap entries, and structured data should be generated automatically.
- Editorial overrides should be supported without requiring a separate code route.

## 11. CMS Architecture

Admin CMS modules:

- Authentication and dashboard.
- Service management.
- Location management.
- Blog post management.
- Category and tag management.
- FAQ management.
- Testimonial management.
- Contact request management.
- Booking management.
- Media management.
- SEO metadata management.
- User and role management.

CMS rules:

- Admin pages require authentication.
- Mutations require role-based permissions.
- Forms use React Hook Form and Zod.
- Lists support search, pagination, sorting, and status filters where relevant.
- Media uploads must validate type and size.
- SEO fields should provide previews for title, description, canonical URL, and Open Graph content.

## 12. Booking Architecture

Customer booking fields:

- Service.
- District.
- Date.
- Time.
- Address.
- Customer name.
- Phone.
- Optional notes.

Booking statuses:

- Pending.
- Confirmed.
- In Progress.
- Completed.
- Cancelled.

Admin booking actions:

- View bookings.
- Confirm bookings.
- Update status.
- Contact customers.

Implementation notes:

- Booking creation must be public but rate-limited.
- Booking status changes must be admin-only.
- Status transitions should be validated.
- Admin views should support filtering by status, service, district, and date.

## 13. Security Architecture

Required controls:

- JWT access tokens.
- Refresh token strategy.
- Role-based access control.
- Input validation.
- Rate limiting.
- XSS protection.
- CSRF protection where browser credential flows require it.
- Secure password hashing.
- Secure HTTP headers through Nginx and/or NestJS middleware.
- CORS restricted by environment.
- Validation and sanitization for CMS content.

Recommended roles:

- `SUPER_ADMIN`
- `ADMIN`
- `EDITOR`
- `STAFF`

## 14. Integrations

Required integrations:

- Google Maps.
- Google Analytics.
- Google Search Console.
- Facebook Messenger.
- Zalo Official Account.

Integration data should be configurable through environment variables and/or global CMS settings.

## 15. Performance Architecture

Targets:

- Lighthouse SEO above 95.
- Lighthouse Performance above 95.
- Lighthouse Accessibility above 90.
- Lighthouse Best Practices above 90.
- LCP below 2.5s.
- CLS below 0.1.
- INP below 200ms.

Required techniques:

- Route splitting.
- Code splitting.
- Image optimization.
- Lazy loading.
- Compression.
- Browser caching.
- Server caching.
- CDN-ready asset strategy.
- ISR for content that changes less frequently.
- Avoid client-side rendering for SEO-critical content.

## 16. UI/UX Architecture

Design principles:

- Mobile-first.
- Professional and trustworthy.
- Conversion-focused.
- Accessible.
- Fast and clear.

Visual direction:

- Blue, white, and light gray palette.
- Clean service cards and structured content sections.
- Persistent conversion controls for phone, Zalo, and Messenger.
- Clear booking and quotation flows.
- Admin UI optimized for repeated operational use.

Public homepage sections:

- Hero banner.
- Company introduction.
- Service categories.
- Why choose us.
- Service coverage areas.
- Online booking form.
- Customer testimonials.
- Service process.
- Emergency hotline.
- FAQ section.
- Latest blog posts.
- Contact information.
- Google Maps.

## 17. Deployment Architecture

Recommended production topology:

- Nginx reverse proxy.
- Next.js web service.
- NestJS API service.
- PostgreSQL database.
- Persistent storage for media files, or external object storage if selected later.

Docker deliverables:

- Root `docker-compose.yml`.
- Frontend Dockerfile.
- Backend Dockerfile.
- Nginx configuration.
- PostgreSQL service.
- `.env.example`.
- Deployment guide.

## 18. Approval Gate

Implementation must not begin until:

- `architecture.md` is approved.
- `tasks.md` is approved.
- Any required scope adjustments are clarified.

