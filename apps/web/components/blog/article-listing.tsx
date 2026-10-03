import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { LoadingImage } from '@/components/ui/loading-image';
import styles from './blog.module.css';

type BlogPost = (typeof BLOG_POSTS)[number];

function ArticleMeta({ post }: { post: BlogPost }) {
  const category = BLOG_CATEGORIES.find((item) => item.slug === post.category);
  const [year, month, day] = post.publishedAt.split('-');

  return (
    <div className={styles.meta}>
      {category ? (
        <>
          <span className={styles.metaCategory}>{category.name}</span>
          <span aria-hidden="true">·</span>
        </>
      ) : null}
      <time dateTime={post.publishedAt}>{day}/{month}/{year}</time>
    </div>
  );
}

export function CategoryFilter({ activeSlug }: { activeSlug?: string } = {}) {
  return (
    <nav className={styles.filters} aria-label="Chuyên mục bài viết">
      <Link className={styles.filterChip} href="/blog" aria-current={!activeSlug ? 'page' : undefined}>
        Tất cả
      </Link>
      {BLOG_CATEGORIES.map((category) => (
        <Link
          className={styles.filterChip}
          href={'/blog/category/' + category.slug}
          aria-current={activeSlug === category.slug ? 'page' : undefined}
          key={category.slug}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export function FeaturedArticle({ post }: { post: BlogPost }) {
  const titleId = 'featured-' + post.slug;

  return (
    <article className={styles.featured}>
      <Link className={styles.featuredLink} href={'/blog/' + post.slug} aria-labelledby={titleId}>
        <div className={styles.featuredPhoto}>
          <LoadingImage
            src={post.image}
            alt={post.title}
            fill
            priority
            className={styles.articleImage}
            sizes="(max-width: 960px) 100vw, (max-width: 1384px) 55vw, 726px"
          />
        </div>
        <div className={styles.featuredContent}>
          <span className={styles.featuredBadge}>
            <BookOpen aria-hidden="true" /> BÀI NỔI BẬT
          </span>
          <ArticleMeta post={post} />
          <h2 className={styles.featuredTitle} id={titleId}>{post.title}</h2>
          <p className={styles.featuredExcerpt}>{post.excerpt}</p>
          <span className={styles.articleCta}>
            Đọc bài viết <ArrowRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ArticleCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  const titleId = 'article-' + post.slug;

  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} href={'/blog/' + post.slug} aria-labelledby={titleId}>
        <div className={styles.cardPhoto}>
          <LoadingImage
            src={post.image}
            alt={post.title}
            fill
            priority={priority}
            className={styles.articleImage}
            sizes="(max-width: 600px) 100vw, (max-width: 1199px) 50vw, (max-width: 1384px) 33vw, 424px"
          />
        </div>
        <div className={styles.cardContent}>
          <ArticleMeta post={post} />
          <h3 className={styles.cardTitle} id={titleId}>{post.title}</h3>
          <p className={styles.cardExcerpt}>{post.excerpt}</p>
          <span className={styles.articleCta}>
            Đọc bài viết <ArrowRight aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
