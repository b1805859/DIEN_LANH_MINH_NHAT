import { BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@minhnhat/shared';
import { ArticleCard, CategoryFilter, FeaturedArticle } from '@/components/blog/article-listing';
import { LoadingImage } from '@/components/ui/loading-image';
import { buildMetadata } from '@/lib/seo/metadata';
import styles from '@/components/blog/blog.module.css';

export const metadata = buildMetadata({
  title: 'Bài viết điện lạnh Cần Thơ',
  description:
    'Kiến thức sử dụng, vệ sinh và nhận biết lỗi máy lạnh, máy giặt, tủ lạnh, điện nước dành cho gia đình tại Cần Thơ.',
  path: '/blog',
});

export default function BlogPage() {
  const featuredPost = BLOG_POSTS[0];
  const posts = BLOG_POSTS.slice(1);

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="blog-title">
        <LoadingImage
          src="/images/service-tools.png"
          alt="Dụng cụ điện lạnh Minh Nhật"
          fill
          priority
          className={styles.heroImage}
          data-motion="hero-image"
          sizes="100vw"
          reveal="filter"
        />
        <div className={styles.heroShade} />
        <div className={`${styles.container} ${styles.heroCopy}`}>
          <p className={styles.heroBadge} data-motion="hero">
            <BookOpen aria-hidden="true" /> Kinh nghiệm điện lạnh
          </p>
          <h1 id="blog-title" data-motion="hero" data-motion-delay="70">
            Bài viết điện lạnh cho
            <br className={styles.heroBreak} /> gia đình tại Cần Thơ
          </h1>
          <p className={styles.heroDescription} data-motion="hero" data-motion-delay="130">
            Tổng hợp dấu hiệu hư hỏng, lịch bảo trì và cách sử dụng thiết bị điện lạnh an toàn hơn
            trước khi cần gọi kỹ thuật viên.
          </p>
        </div>
      </section>

      <section className={`${styles.content} ${styles.container}`} aria-label="Bài viết điện lạnh">
        <div className={styles.toolbar}>
          <CategoryFilter />
          <p className={styles.articleCount}>{BLOG_POSTS.length} bài viết</p>
        </div>
        {featuredPost ? <FeaturedArticle post={featuredPost} /> : null}
        <section className={styles.articleSection} aria-labelledby="blog-list-title">
          <h2 className={styles.listHeading} id="blog-list-title" data-motion="up">Khám phá bài viết</h2>
          <div className={styles.grid} data-motion-stagger="55">
            {posts.map((post) => <ArticleCard post={post} key={post.slug} />)}
          </div>
        </section>
      </section>
    </main>
  );
}
