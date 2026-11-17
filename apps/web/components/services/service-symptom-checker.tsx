'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, MessageCircle, Wrench } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';

/**
 * Interactive symptom multi-select checker on /services/[slug].
 * Lets visitors tick the issues they observe and forwards selected context straight to /contact or Zalo.
 */
export function ServiceSymptomChecker({
  serviceSlug,
  serviceTitle,
  symptoms,
}: {
  serviceSlug: string;
  serviceTitle: string;
  symptoms: string[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string[]>([]);

  if (!symptoms || symptoms.length === 0) return null;

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom],
    );
  };

  const noteText =
    selected.length > 0
      ? `${serviceTitle}: ${selected.join(', ')}`
      : `Tư vấn ${serviceTitle}`;

  return (
    <section
      aria-label="Chọn tình trạng thiết bị"
      className="my-6 rounded-2xl border border-[#bde2fb] bg-gradient-to-br from-[#f0f9ff] via-white to-[#e6f4fe] p-5 shadow-[0_12px_28px_-14px_rgba(7,89,199,0.16)]"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-[#061c3d]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0284c7] text-white shadow-[0_4px_12px_-4px_rgba(2,132,199,0.5)]">
            <Wrench size={17} aria-hidden="true" />
          </span>
          <div>
            <h2 className="m-0 text-[16px] font-extrabold leading-tight">
              Thiết bị của bạn đang gặp dấu hiệu nào?
            </h2>
            <p className="m-0 text-[13px] text-[#355678]">
              Chọn nhanh 1 hoặc nhiều tình trạng để thợ chuẩn bị đúng dụng cụ & linh kiện
            </p>
          </div>
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="min-h-[44px] rounded-full border border-[#c3e1f7] bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-[#035388] transition-colors hover:bg-[#eaf6ff]"
          >
            Bỏ chọn ({selected.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Danh sách tình trạng">
        {symptoms.map((symptom) => {
          const isChecked = selected.includes(symptom);
          return (
            <motion.button
              key={symptom}
              type="button"
              aria-pressed={isChecked}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
              onClick={() => toggleSymptom(symptom)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-left text-[13.5px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 ${
                isChecked
                  ? 'border-[#0269b3] bg-[#0269b3] text-white shadow-[0_8px_16px_-6px_rgba(2,105,179,0.45)]'
                  : 'border-[#c8e4f9] bg-white text-[#0b2b4e] hover:border-[#49adeb] hover:bg-[#f2f9ff]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                  isChecked ? 'border-white bg-white/20 text-white' : 'border-[#9ed0f2] bg-[#f4faff]'
                }`}
              >
                {isChecked && <Check size={13} strokeWidth={3} />}
              </span>
              <span>{symptom}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#d8ecfa] pt-4">
        <Link
          href={`/contact?service=${encodeURIComponent(serviceSlug)}&note=${encodeURIComponent(noteText)}#tu-van`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0277bd] px-5 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(2,119,189,0.45)] transition-colors hover:bg-[#015f98]"
        >
          <span>{selected.length > 0 ? `Đặt kiểm tra (${selected.length} lỗi)` : 'Đặt lịch kiểm tra ngay'}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          href={siteContent.zalo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#9fd4f7] bg-white px-4 py-2 text-[13.5px] font-bold text-[#05447c] transition-colors hover:bg-[#ecf7ff]"
        >
          <MessageCircle size={16} aria-hidden="true" />
          <span>Nhắn Zalo gửi tình trạng</span>
        </a>
      </div>
    </section>
  );
}
