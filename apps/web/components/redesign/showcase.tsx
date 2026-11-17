'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { TactileCard } from '@/components/ui/tactile-card';
import type { WebsiteCategory, WebsitePost } from '@/lib/content/website-content';
import { projects } from '@/lib/content/site-content';
import { sharedProjectCovers } from '@/lib/content/shared-project-covers';
import { halfContentImageSizes } from '@/lib/image-sizes';
export function Showcase({
  initialTab = 'projects',
  initialCategory = 'all',
  compact = false,
  home = false,
  showTabs = true,
  projectCovers = sharedProjectCovers,
  posts = [],
  categories = [],
}: {
  initialTab?: 'projects' | 'news';
  initialCategory?: string;
  compact?: boolean;
  home?: boolean;
  showTabs?: boolean;
  posts?: WebsitePost[];
  categories?: readonly WebsiteCategory[];
  projectCovers?: Record<string, { src: string; alt: string; position?: string }>;
}) {
  const [tab, setTab] = useState(initialTab);
  const [category, setCategory] = useState(initialCategory);
  const prefersReducedMotion = useReducedMotion();
  const items =
    tab === 'projects'
      ? projects.map((p) => ({
          ...p,
          href: `/projects/${p.slug}`,
          excerpt: p.description,
          meta: p.area,
          demo: true,
        }))
      : posts.map((p) => ({
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
          {showTabs && tabs}
          <Link href={tab === 'projects' ? '/projects' : '/blog'} className="mn-text-link">
            Xem tất cả <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : showTabs && tabs}
      {!compact && tab === 'news' && (
        <div className="mn-filters" aria-label="Lọc danh mục">
          <motion.button
            type="button"
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            aria-pressed={category === 'all'}
            className="min-h-[44px]"
            onClick={() => setCategory('all')}
          >
            Tất cả
          </motion.button>
          {categories.map((c) => (
            <motion.button
              type="button"
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              key={c.slug}
              aria-pressed={category === c.slug}
              className="min-h-[44px]"
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </motion.button>
          ))}
        </div>
      )}
      <div
        role={showTabs ? 'tabpanel' : undefined}
        id={showTabs ? 'showcase-panel' : undefined}
        aria-labelledby={showTabs ? `tab-${tab}` : undefined}
        tabIndex={showTabs ? 0 : undefined}
      >
        <div className="mn-project-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.slug}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, delay: (index % 4) * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <TactileCard className="h-full rounded-[14px]">
                  <Link
                    href={item.href}
                    className="mn-project-card h-full"
                  >
                    <div className="mn-card-photo">
                      <Image loading={index < 4 ? 'eager' : 'lazy'}
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
                </TactileCard>
              </motion.div>
            ))}
          </AnimatePresence>
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
