# Plan Coverage Matrix

| Requirement Area | Implemented | Evidence |
|---|---:|---|
| Next.js 15 App Router, React 19, TypeScript, TailwindCSS | Yes | `apps/web` |
| Shadcn/UI-compatible setup | Yes | `components.json`, `components/ui/button.tsx` |
| TanStack Query, React Hook Form, Zod, Axios | Yes | Forms, admin pages, package dependencies |
| NestJS REST API | Yes | `apps/api/src` |
| PostgreSQL and Prisma ORM | Yes | `apps/api/prisma/schema.prisma` |
| JWT authentication and refresh tokens | Yes | `modules/auth`, `refresh_tokens` table |
| RBAC | Yes | `RolesGuard`, `Roles` decorator, protected admin routes |
| Admin CMS | Yes | `/admin/*` API and frontend pages |
| Service management | Yes | CMS resource `services` |
| Location management | Yes | CMS resource `locations` |
| Blog management | Yes | CMS resource `blog`, public blog routes |
| Category/tag management | Yes | CMS resources `categories`, `tags` |
| FAQ management | Yes | CMS resource `faqs`, FAQ page/schema |
| Testimonial management | Yes | CMS resource `testimonials` |
| Contact request management | Yes | `contact_requests`, CMS resource `contacts` |
| Booking system | Yes | `modules/bookings`, `/booking`, admin bookings |
| Media management | Yes | `media_files`, CMS resource `media` |
| SEO metadata management | Yes | `seo_settings`, CMS resource `seo` |
| User and role management | Yes | CMS resources `users`, `roles` |
| Public pages | Yes | Home, About, Services, Blog, Booking, Contact, FAQ, Privacy, Terms |
| Service detail pages | Yes | `/services/[slug]` |
| District pages | Yes | `/areas/[locationSlug]` |
| Service x District pages | Yes | `/areas/[locationSlug]/[serviceSlug]` |
| Programmatic SEO URL generation | Yes | Static params from services x priority districts |
| Dynamic metadata | Yes | `lib/seo/metadata.ts` |
| Canonical URLs | Yes | `buildMetadata` |
| Open Graph and Twitter Cards | Yes | `buildMetadata` |
| JSON-LD schemas | Yes | `lib/seo/json-ld.ts` |
| LocalBusiness and HVACBusiness | Yes | `localBusinessJsonLd` |
| Service schema | Yes | `serviceJsonLd` |
| FAQPage schema | Yes | `faqJsonLd` |
| BreadcrumbList schema | Yes | `breadcrumbJsonLd` |
| BlogPosting and Article schema | Yes | `articleJsonLd` |
| Dynamic sitemap | Yes | `app/sitemap.ts`, API `/seo/sitemap` |
| Robots.txt | Yes | `app/robots.ts` |
| Internal linking | Yes | Home, service, district, blog, related links |
| Seed priority services | Yes | `prisma/seed.js`, shared constants |
| Seed priority districts | Yes | `prisma/seed.js`, shared constants |
| Seed blog categories/topics | Yes | `prisma/seed.js`, shared constants |
| Booking statuses | Yes | Prisma `BookingStatus` enum |
| Public lead forms | Yes | Booking and contact/quotation forms |
| Hotline/Zalo/Messenger buttons | Yes | `FloatingActions` |
| Sticky mobile call button | Yes | `FloatingActions` |
| Google Maps placeholder/config | Yes | Contact page and env settings |
| Google Analytics config | Yes | Root layout script guard |
| Search Console verification | Yes | Metadata verification |
| Docker | Yes | `docker-compose.yml`, Dockerfiles |
| Nginx | Yes | `docker/nginx/default.conf` |
| Compression and caching | Yes | Nginx gzip/cache headers |
| Lighthouse targets | Yes | Performance 98, SEO 100, Accessibility 92, Best Practices 96 |
| Deployment guide | Yes | `docs/deployment.md` |

