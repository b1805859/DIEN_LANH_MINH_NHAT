'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface FaqAccordionItem {
  question: string;
  answer: string;
  category?: string;
}

/**
 * Animated accessible FAQ accordion powered by Framer Motion.
 * Replaces static <details> / flat blocks across /faq and /services/[slug].
 */
export function AnimatedFaqAccordion({
  items,
  defaultOpenIndex = 0,
  expandedAll,
}: {
  items: readonly FaqAccordionItem[];
  defaultOpenIndex?: number | null;
  expandedAll?: boolean | null;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [openIndices, setOpenIndices] = useState<Set<number>>(() =>
    defaultOpenIndex !== null && defaultOpenIndex >= 0 ? new Set([defaultOpenIndex]) : new Set(),
  );

  const isItemOpen = (idx: number) => {
    if (expandedAll === true) return true;
    if (expandedAll === false) return false;
    return openIndices.has(idx);
  };

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((faq, idx) => {
        const open = isItemOpen(idx);
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-[border-color,box-shadow,background-color] duration-200 ${
              open
                ? 'border-[#58b4ef] bg-white shadow-[0_14px_28px_-14px_rgba(3,105,161,0.22)]'
                : 'border-[#d3e8f8] bg-[#f8fcff] hover:border-[#8bc7f0] hover:bg-white'
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggleItem(idx)}
              className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-3.5 text-left font-bold text-[#061c3d] transition-colors"
            >
              <span className="text-[15.5px] leading-snug">{faq.question}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: open ? 180 : 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  open ? 'bg-[#0284c7] text-white' : 'bg-[#e3f3fe] text-[#0369a1]'
                }`}
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#e6f2fb] px-5 pb-4 pt-3 text-[15px] leading-relaxed text-[#244162]">
                    <p className="m-0">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
