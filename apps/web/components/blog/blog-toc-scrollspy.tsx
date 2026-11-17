'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy, ListFilter } from 'lucide-react';

export interface TocSection {
  id: string;
  title: string;
}

/**
 * Sticky ScrollSpy Table of Contents + Copy Article Link for /blog/[slug].
 * Maintains >= 44px touch targets for every jump item.
 */
export function BlogTocScrollSpy({
  sections,
  shareUrl,
}: {
  sections: TocSection[];
  shareUrl: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sections.length) return;
    const headings = sections
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!headings.length || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0.05 },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sections]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="mn-editorial-toc text-sm text-slate-700" data-reveal="">
      <div className="rounded-2xl border border-[#cde6f8] bg-[#f8fcff] p-4 shadow-[0_12px_26px_-16px_rgba(7,89,199,0.16)] lg:sticky lg:top-28">
        <div className="mb-2 flex items-center gap-2 font-black text-[#061c3d]">
          <ListFilter size={16} className="text-[#0284c7]" aria-hidden="true" />
          <span>Mục lục bài viết</span>
        </div>

        <nav aria-label="Mục lục bài viết" className="flex flex-col gap-1">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                className={`relative flex min-h-[44px] items-center rounded-xl px-3 py-2 text-[13.5px] leading-snug transition-colors ${
                  isActive
                    ? 'font-extrabold text-[#0269b3]'
                    : 'font-medium text-[#2c4a6b] hover:bg-white hover:text-[#061c3d]'
                }`}
              >
                {isActive && !prefersReducedMotion && (
                  <motion.span
                    layoutId="blog-toc-active"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl border border-[#9fd6f9] bg-white shadow-sm"
                  />
                )}
                {isActive && prefersReducedMotion && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl border border-[#9fd6f9] bg-white"
                  />
                )}
                <span className="relative z-10">{section.title}</span>
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#bde0f8] bg-white px-3.5 py-2 text-[13px] font-bold text-[#05447c] transition-colors hover:border-[#0284c7] hover:bg-[#edf7ff]"
        >
          {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
          <span>{copied ? 'Đã sao chép liên kết' : 'Sao chép liên kết'}</span>
        </button>
      </div>
    </aside>
  );
}
