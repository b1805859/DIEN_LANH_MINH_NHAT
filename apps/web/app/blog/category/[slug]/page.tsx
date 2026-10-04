import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { ArticleCard, CategoryFilter } from '@/components/blog/article-listing';
import { buildMetadata } from '@/lib/seo/metadata';
import styles from '@/components/blog/blog.module.css';

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);
  if (!category) return {};
  const hasPosts = BLOG_POSTS.some((post) => post.category === slug);
  if (!hasPosts) {
    return {
      ...buildMetadata({
        title: `Bài viết ${category.name}`,
        description: `Chuyên mục hướng dẫn ${category.name.toLowerCase()} của Điện Lạnh Minh Nhật. Các bài viết mới sẽ được cập nhật tại đây.`,
        path: `/blog/category/${slug}`,
      }),
      robots: { index: false, follow: true },
    };
  }
  return buildMetadata({
    title: `Bài viết ${category.name}`,
    description: `Hướng dẫn sử dụng, vệ sinh, bảo trì và nhận biết lỗi ${category.name.toLowerCase()} an toàn, dễ hiểu dành cho gia đình tại Cần Thơ.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = BLOG_POSTS.filter((post) => post.category === slug);

  return (
    <main className={styles.page}>
      <section className={styles.categoryHero} aria-labelledby="blog-category-title">
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink} data-motion="hero">
            <ArrowLeft aria-hidden="true" />
            Tất cả bài viết
          </Link>
          <h1 id="blog-category-title" data-motion="hero" data-motion-delay="60">
            Bài viết {category.name}
          </h1>
          <p className={styles.categoryDescription} data-motion="hero" data-motion-delay="120">
            Các hướng dẫn và dấu hiệu cần chú ý liên quan đến {category.name.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className={`${styles.content} ${styles.container}`} aria-labelledby="category-list-title">
        <h2 className="sr-only" id="category-list-title">Bài viết trong chuyên mục {category.name}</h2>
        <div className={styles.toolbar}>
          <CategoryFilter activeSlug={category.slug} />
          <p className={styles.articleCount}>{posts.length} bài viết</p>
        </div>
        {posts.length ? (
          <div className={`${styles.grid} ${styles.categoryResults}`} key={category.slug}>
            {posts.map((post, index) => (
              <ArticleCard post={post} priority={index < 3} key={post.slug} />
            ))}
          </div>
        ) : (
          <div className={`${styles.emptyState} ${styles.categoryResults}`} key={category.slug}>
            <span className={styles.emptyIcon}><BookOpen aria-hidden="true" /></span>
            <h2>Không tìm thấy bài viết phù hợp.</h2>
            <p>Chuyên mục này chưa có bài viết. Bạn có thể khám phá các nội dung điện lạnh khác.</p>
            <Link className={styles.emptyLink} href="/blog">
              Xem tất cả bài viết <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
