'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Expand, Minimize2, PhoneCall, Search, Sparkles } from 'lucide-react';
import { AnimatedFaqAccordion, type FaqAccordionItem } from '@/components/ui/animated-faq-accordion';
import { siteContent } from '@/lib/content/site-content';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Tất cả câu hỏi' },
  { id: 'booking', label: 'Đặt lịch & Giá' },
  { id: 'ac', label: 'Máy lạnh' },
  { id: 'appliances', label: 'Tủ lạnh & Máy giặt' },
  { id: 'warranty', label: 'Bảo hành & Khu vực' },
] as const;

type FaqCategoryId = (typeof FAQ_CATEGORIES)[number]['id'];

function classifyFaq(question: string, answer: string): FaqCategoryId {
  const text = `${question} ${answer}`.toLowerCase();
  if (/máy lạnh|điều hòa|ga|vệ sinh/.test(text)) return 'ac';
  if (/tủ lạnh|máy giặt|nóng lạnh|điện nước/.test(text)) return 'appliances';
  if (/bảo hành|khu vực|cần thơ|quận|ninh kiều|cái răng|bình thủy/.test(text)) return 'warranty';
  return 'booking';
}

function normalizeVietnamese(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function InteractiveFaqHub({ faqs }: { faqs: readonly FaqAccordionItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>('all');
  const [expandedAll, setExpandedAll] = useState<boolean | null>(null);

  const enrichedFaqs = useMemo(
    () =>
      faqs.map((faq) => ({
        ...faq,
        categoryId: classifyFaq(faq.question, faq.answer),
      })),
    [faqs],
  );

  const filteredFaqs = useMemo(() => {
    const q = normalizeVietnamese(query.trim());
    return enrichedFaqs.filter((item) => {
      const catMatch = activeCategory === 'all' || item.categoryId === activeCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return normalizeVietnamese(`${item.question} ${item.answer}`).includes(q);
    });
  }, [activeCategory, enrichedFaqs, query]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#cde6f9] bg-gradient-to-br from-[#f2f9ff] via-white to-[#eaf5fe] p-4 shadow-[0_14px_34px_-16px_rgba(7,89,199,0.16)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block flex-1">
            <span className="sr-only">Tìm nhanh câu hỏi</span>
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0277bd]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm câu hỏi (vd: bảo hành, bảng giá, vệ sinh máy lạnh...)"
              className="min-h-[48px] w-full rounded-xl border border-[#b9def8] bg-white pl-11 pr-4 text-[15px] text-[#061c3d] placeholder:text-[#587594] focus:border-[#0284c7] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/30"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setExpandedAll((prev) => (prev === true ? null : true))}
              aria-pressed={expandedAll === true}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#b9def8] bg-white px-3.5 py-2 text-[13px] font-bold text-[#05447c] transition-colors hover:bg-[#eaf6ff]"
            >
              <Expand size={15} aria-hidden="true" />
              <span>Mở tất cả</span>
            </button>
            <button
              type="button"
              onClick={() => setExpandedAll(false)}
              aria-pressed={expandedAll === false}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#b9def8] bg-white px-3.5 py-2 text-[13px] font-bold text-[#05447c] transition-colors hover:bg-[#eaf6ff]"
            >
              <Minimize2 size={15} aria-hidden="true" />
              <span>Thu gọn</span>
            </button>
          </div>
        </div>

        <div
          className="mt-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Lọc câu hỏi theo nhóm"
        >
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                onClick={() => {
                  setActiveCategory(category.id);
                  setExpandedAll(null);
                }}
                className={`relative inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-[13.5px] font-bold transition-colors ${
                  isActive
                    ? 'border-[#0277bd] text-white'
                    : 'border-[#c6e2f7] bg-white text-[#0b2b4e] hover:border-[#5eb5ee] hover:bg-[#f2f9ff]'
                }`}
              >
                {isActive && !prefersReducedMotion && (
                  <motion.span
                    layoutId="faq-tab-indicator"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0275bd] to-[#0269b3] shadow-[0_6px_14px_-4px_rgba(2,105,179,0.45)]"
                  />
                )}
                {isActive && prefersReducedMotion && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#0277bd]"
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-sm font-semibold text-[#315072]">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-[#0062a3]" aria-hidden="true" />
          Hiển thị {filteredFaqs.length} câu hỏi giải đáp chi tiết
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="min-h-[44px] px-2 font-bold text-[#0277bd] underline"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${filteredFaqs.length}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {filteredFaqs.length > 0 ? (
            <AnimatedFaqAccordion
              items={filteredFaqs}
              defaultOpenIndex={0}
              expandedAll={expandedAll}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#a6d4f5] bg-[#f8fcff] p-8 text-center">
              <p className="m-0 text-base font-bold text-[#061c3d]">
                Không tìm thấy câu hỏi khớp với “{query}”
              </p>
              <p className="mt-2 text-sm text-[#3c5b7d]">
                Bạn có thể nhắn trực tiếp hoặc để lại số điện thoại để kỹ thuật viên tư vấn ngay.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <aside className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#b4dcf9] bg-gradient-to-r from-[#06264a] to-[#0a417a] p-6 text-white shadow-[0_18px_36px_-18px_rgba(6,38,74,0.55)] sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#6ee7ff]">
            <Sparkles size={14} aria-hidden="true" />
            Tư vấn kỹ thuật miễn phí
          </span>
          <h2 className="mt-1 text-xl font-black text-white">
            Vẫn còn thắc mắc về thiết bị của bạn?
          </h2>
          <p className="mt-1 text-sm text-[#cae6fb]">
            Trao đổi thẳng với đội ngũ kỹ thuật Minh Nhật trước khi đặt lịch đến nhà.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact#tu-van"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#24ccf5] px-5 py-2.5 text-sm font-extrabold text-[#001f38] transition-colors hover:bg-[#5ce0ff]"
          >
            <span>Gửi câu hỏi</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href={siteContent.phoneHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#6be5ff]/60 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/20"
          >
            <PhoneCall size={16} aria-hidden="true" />
            <span>{siteContent.phoneDisplay}</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
