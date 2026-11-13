import { cache } from 'react';
import { z } from 'zod';
import { BLOG_CATEGORIES, BLOG_POSTS, FAQS } from '@minhnhat/shared';
import { blogContent } from './blog-content';
import { serviceDetails } from './service-details';
import { getBlogPostImage, serviceCards, siteContent } from './site-content';

const faqSchema = z.object({ question: z.string(), answer: z.string() });
const snapshotSchema = z.object({
  services: z.array(z.object({
    slug: z.string(), name: z.string(), summary: z.string().nullable(),
    description: z.string().nullable(), imageUrl: z.string().nullable(),
    imageAlt: z.string().nullable(), faqs: z.array(faqSchema),
  })),
  posts: z.array(z.object({
    slug: z.string(), title: z.string(), excerpt: z.string().nullable(),
    content: z.string(), image: z.string().nullable(), imageAlt: z.string().nullable(),
    category: z.object({ slug: z.string() }).nullable(),
  })),
  categories: z.array(z.object({
    slug: z.string(), name: z.string(), description: z.string().nullable(),
  })),
  faqs: z.array(faqSchema),
});

export type WebsiteService = {
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  imagery: (typeof serviceCards)[number]['imagery'];
  introduction?: string;
  faqs: ReadonlyArray<z.infer<typeof faqSchema>>;
};

export type WebsitePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  content?: string;
};

export type WebsiteCategory = { slug: string; name: string; description?: string | null };

const bundled = {
  services: serviceCards.map((service): WebsiteService => ({
    ...service,
    introduction: serviceDetails[service.slug].introduction,
    faqs: serviceDetails[service.slug].faqs,
  })),
  posts: BLOG_POSTS.map((post): WebsitePost => ({
    ...post, image: getBlogPostImage(post.slug, post.image), imageAlt: post.title,
  })),
  categories: BLOG_CATEGORIES as readonly WebsiteCategory[],
  faqs: FAQS as ReadonlyArray<z.infer<typeof faqSchema>>,
};

function publicImage(value: string | null, fallback: string) {
  if (value && (/^\/(?!\/)/.test(value) || /^https:\/\//i.test(value) || /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(value))) return value;
  return fallback;
}

export const getWebsiteContent = cache(async (): Promise<typeof bundled> => {
  const apiUrl = process.env.API_INTERNAL_URL ||
    (process.env.VERCEL_ENV === 'production'
      ? 'https://dien-lanh-minh-nhat-api.vercel.app/api'
      : 'http://127.0.0.1:4000/api');

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/website-content`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) return bundled;

    const snapshot = snapshotSchema.parse(await response.json());
    return {
      services: snapshot.services.map((row) => {
        const base = serviceCards.find((service) => service.slug === row.slug);
        const src = publicImage(row.imageUrl, base?.imagery.src ?? siteContent.images.services);
        return {
          slug: row.slug,
          name: row.name,
          title: row.name,
          description: row.summary || row.description || '',
          introduction: row.description ?? undefined,
          icon: base?.icon ?? 'airvent',
          imagery: {
            heroPosition: 'center',
            cardPosition: 'center',
            ...base?.imagery,
            src,
            alt: row.imageAlt || row.name,
          },
          faqs: row.faqs,
        };
      }),
      posts: snapshot.posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? '',
        image: publicImage(post.image, siteContent.images.editorial),
        imageAlt: post.imageAlt || post.title,
        category: post.category?.slug ?? '',
        content: post.content,
      })),
      categories: snapshot.categories,
      faqs: snapshot.faqs,
    };
  } catch {
    // The bundled copy also supports running the frontend without the API.
    return bundled;
  }
});

export function getArticleSections(post: WebsitePost) {
  const original = (blogContent as Partial<Record<string, (typeof blogContent)[keyof typeof blogContent]>>)[post.slug];
  if (post.content === undefined) return original?.sections ?? [];

  // The editor stores text. Keep the existing section layout for Markdown headings and paragraphs.
  const sections: Array<{ id: string; title: string; paragraphs: string[] }> = [];
  let section: (typeof sections)[number] | undefined;
  for (const block of post.content.trim().split(/\r?\n\s*\r?\n/)) {
    if (!block.trim()) continue;
    const heading = /^#{1,6}\s+([^\n]+)\s*$/.exec(block);
    if (heading) {
      const title = heading[1].trim();
      const previousId = original?.sections.find((item) => item.title === title)?.id;
      const id = previousId && !sections.some((item) => item.id === previousId) ? previousId : `phan-${sections.length + 1}`;
      section = { id, title, paragraphs: [] };
      sections.push(section);
    } else {
      if (!section) {
        section = { id: 'noi-dung', title: 'Nội dung', paragraphs: [] };
        sections.push(section);
      }
      section.paragraphs.push(block);
    }
  }
  return sections;
}
