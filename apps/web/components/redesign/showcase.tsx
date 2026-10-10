'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@minhnhat/shared';
import { projects } from '@/lib/content/site-content';
export function Showcase({
  initialTab = 'projects',
  initialCategory = 'all',
  compact = false,
}: {
  initialTab?: 'projects' | 'news';
  initialCategory?: string;
  compact?: boolean;
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
  return (
    <div className="mn-showcase">
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
          Dự án thực tế
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
          Tin tức hữu ích
        </button>
      </div>
      {!compact && (
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
      <div role="tabpanel" id="showcase-panel" aria-labelledby={`tab-${tab}`}>
        <div className="mn-project-grid">
          {filtered.map((item) => (
            <Link href={item.href} key={item.slug} className="mn-project-card">
              <div className="mn-card-photo">
                <Image
                  src={item.image}
                  alt={`${item.title} – ảnh minh họa`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {item.demo && <span className="mn-demo-tag">Dự án minh họa</span>}
              </div>
              <div className="mn-project-copy">
                <h3>{item.title}</h3>
                {!compact && <p>{item.excerpt}</p>}
                <div>
                  <span>
                    <MapPin size={14} />
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
