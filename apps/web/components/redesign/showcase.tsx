'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { projects } from '@/lib/content/site-content';
import { sharedProjectCovers } from '@/lib/content/shared-project-covers';
import { halfContentImageSizes } from '@/lib/image-sizes';
export function Showcase({
  initialTab = 'projects',
  initialCategory = 'all',
  compact = false,
  home = false,
  projectCovers = sharedProjectCovers,
}: {
  initialTab?: 'projects' | 'news';
  initialCategory?: string;
  compact?: boolean;
  home?: boolean;
  projectCovers?: Record<string, { src: string; alt: string; position?: string }>;
}) {
  const [tab, setTab] = useState(initialTab);
  const [category, setCategory] = useState(initialCategory);
  const items =
    tab === 'projects'
      ? projects.map((p) => ({
          ...p,
          href: `/projects/${p.slug}`,
          excerpt: p.description,
          meta: p.area,
          demo: true,
        }))
      : BLOG_POSTS.map((p) => ({
          ...p,
          href: `/blog/${p.slug}`,
          meta: 'Kiến thức điện lạnh',
          demo: false,
        }));
  const filtered = items
    .filter((p) => category === 'all' || p.category === category)
    .slice(0, compact ? 4 : undefined);
  const tabs = (
      <div
        className="mn-tabs"
        role="tablist"
        aria-label="Dự án và tin tức"
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const nextTab =
            event.key === 'Home'
              ? 'projects'
              : event.key === 'End'
                ? 'news'
                : tab === 'projects'
                  ? 'news'
                  : 'projects';
          setTab(nextTab);
          setCategory('all');
          event.currentTarget.querySelector<HTMLButtonElement>(`#tab-${nextTab}`)?.focus();
        }}
      >
        <button
          id="tab-projects"
          role="tab"
          aria-controls="showcase-panel"
          aria-selected={tab === 'projects'}
          tabIndex={tab === 'projects' ? 0 : -1}
          onClick={() => {
            setTab('projects');
            setCategory('all');
          }}
        >
          Dự án
        </button>
        <button
          id="tab-news"
          role="tab"
          aria-controls="showcase-panel"
          aria-selected={tab === 'news'}
          tabIndex={tab === 'news' ? 0 : -1}
          onClick={() => {
            setTab('news');
            setCategory('all');
          }}
        >
          Bài viết
        </button>
      </div>
  );
  return (
    <div className="mn-showcase">
      {home ? (
        <div className="mn-home-showcase-heading">
          <h2>Dự án & <em>Bài viết</em></h2>
          {tabs}
          <Link href={tab === 'projects' ? '/projects' : '/blog'} className="mn-text-link">
            Xem tất cả <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : tabs}
      {!compact && tab === 'news' && (
        <div className="mn-filters" aria-label="Lọc danh mục">
          <button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            Tất cả
          </button>
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div role="tabpanel" id="showcase-panel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        <div className="mn-project-grid" key={`${tab}-${category}`}>
          {filtered.map((item) => (
            <Link href={item.href} key={item.slug} className="mn-project-card">
              <div className="mn-card-photo">
                <Image
                  src={item.demo ? projectCovers[item.slug]?.src || item.image : item.image}
                  alt={
                    item.demo
                      ? projectCovers[item.slug]?.alt || `${item.title} – ảnh minh họa`
                      : `${item.title} – ảnh minh họa`
                  }
                  style={
                    item.demo && projectCovers[item.slug]?.position
                      ? { objectPosition: projectCovers[item.slug].position }
                      : undefined
                  }
                  fill
                  sizes={
                    compact
                      ? home
                        ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 46vw, 310px'
                        : '(max-width: 480px) 44vw, (max-width: 800px) 45vw, (max-width: 1380px) 22vw, 310px'
                      : halfContentImageSizes
                  }
                />
                {item.demo && !home && <span className="mn-demo-tag">Dự án minh họa</span>}
              </div>
              <div className="mn-project-copy">
                <h3>{item.title}</h3>
                {!compact && !item.demo && <p>{item.excerpt}</p>}
                <div>
                  <span>
                    {item.demo ? (
                      <MapPin size={14} aria-hidden="true" />
                    ) : (
                      <BookOpen size={14} aria-hidden="true" />
                    )}
                    {item.meta}
                  </span>
                  <ArrowRight size={19} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mn-empty">
            Chưa có nội dung trong danh mục này. Vui lòng chọn danh mục khác.
          </p>
        )}
      </div>
    </div>
  );
}
