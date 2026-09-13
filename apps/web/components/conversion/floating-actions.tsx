'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Phone, Send, X } from 'lucide-react';
import { AiChatbotIcon } from '@/components/brand/ai-chatbot-icon';
import { LoadingImage } from '@/components/ui/loading-image';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { integrationSettings } from '@/lib/integrations/settings';

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

const quickPrompts = [
  'Máy lạnh không lạnh',
  'Máy lạnh chảy nước',
  'Bao lâu vệ sinh máy lạnh?',
  'Máy giặt có mùi hôi',
  'Tủ lạnh yếu lạnh',
  'Tôi muốn đặt lịch',
];

const consultationRules = [
  {
    keywords: ['khong lanh', 'khong mat', 'yeu lanh', 'may lanh khong lanh', 'may lanh khong mat'],
    answer:
      'Máy lạnh không lạnh thường do lưới lọc/dàn lạnh bẩn, thiếu gas, quạt yếu, tụ hoặc board điều khiển lỗi. Anh/chị nên tắt máy 5-10 phút, kiểm tra remote đang ở chế độ Cool và nhiệt độ khoảng 24-26 độ. Nếu máy vẫn chỉ thổi gió hoặc lạnh yếu, Minh Nhật có thể đến đo gas, kiểm tra dàn nóng và báo giá trước khi làm.',
  },
  {
    keywords: ['chay nuoc', 'ro nuoc', 'nuoc chay', 'may lanh chay nuoc'],
    answer:
      'Máy lạnh chảy nước thường do nghẹt ống thoát, dàn lạnh bám bụi, máng nước bẩn hoặc lắp đặt bị nghiêng. Anh/chị nên hạn chế tự tháo vỏ máy nếu không quen kỹ thuật. Dịch vụ phù hợp là vệ sinh máy lạnh và kiểm tra đường thoát nước.',
  },
  {
    keywords: ['ve sinh may lanh', 'bao lau ve sinh', 'bao tri may lanh', 'dinh ky'],
    answer:
      'Gia đình nên vệ sinh máy lạnh khoảng 3-6 tháng/lần. Nếu phòng nhiều bụi, có trẻ nhỏ, cửa hàng hoặc máy chạy nhiều giờ mỗi ngày thì nên vệ sinh khoảng 2-3 tháng/lần. Khi vệ sinh, kỹ thuật viên sẽ xịt rửa dàn lạnh, vệ sinh lưới lọc, kiểm tra thoát nước và chạy thử.',
  },
  {
    keywords: ['nap gas', 'het gas', 'thieu gas', 'gas may lanh'],
    answer:
      'Không phải máy lạnh yếu là cần nạp gas ngay. Kỹ thuật viên cần đo áp suất, kiểm tra rò rỉ và tình trạng dàn nóng/dàn lạnh trước. Nếu thiếu gas thật, Minh Nhật sẽ báo loại gas, lượng nạp và chi phí trước khi thực hiện.',
  },
  {
    keywords: ['may giat', 'khong vat', 'khong xa', 'hoi', 'mui hoi', 'long giat'],
    answer:
      'Máy giặt có mùi hôi hoặc giặt không sạch thường do lồng giặt bám cặn, lọc xơ vải bẩn hoặc đường nước xả có vấn đề. Nếu máy không vắt/không xả, có thể liên quan bơm xả, dây curoa, board hoặc cảm biến cửa. Anh/chị mô tả thêm lỗi hiển thị hoặc hiện tượng để kỹ thuật viên tư vấn sát hơn.',
  },
  {
    keywords: ['tu lanh', 'tu mat', 'dong tuyet', 'kem lanh', 'khong lanh'],
    answer:
      'Tủ lạnh yếu lạnh có thể do gioăng cửa hở, quạt gió yếu, đóng tuyết, cảm biến hoặc block hoạt động bất thường. Anh/chị nên kiểm tra cửa tủ đóng kín, không nhồi quá nhiều đồ và nghe xem block phía sau có chạy không. Nếu tủ vẫn yếu lạnh, nên đặt lịch kiểm tra tại nhà.',
  },
  {
    keywords: ['dien nuoc', 'ong nuoc', 'voi nuoc', 'bon rua', 'may nuoc nong', 'nuoc nong lanh'],
    answer:
      'Với điện nước hoặc máy nước nóng/lạnh, kỹ thuật viên sẽ kiểm tra điểm rò, van khóa, nguồn điện, dây cấp và tình trạng thiết bị trước khi thi công. Anh/chị nên ngắt nguồn điện hoặc khóa van nước nếu đang rò nước mạnh để đảm bảo an toàn.',
  },
  {
    keywords: ['gia', 'bao gia', 'chi phi', 'dat lich', 'hen lich', 'toi muon dat lich'],
    answer:
      'Minh Nhật sẽ báo giá sau khi nắm tình trạng thiết bị và khu vực phục vụ. Anh/chị có thể cho biết thiết bị gì, lỗi đang gặp, địa chỉ/phường tại Cần Thơ và khung giờ mong muốn. Nếu cần nhanh, hãy gọi hotline hoặc nhắn Zalo để được xác nhận lịch sớm.',
  },
];

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function getConsultationAnswer(message: string) {
  const normalizedMessage = normalizeText(message);
  const matchedRule = consultationRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedMessage.includes(normalizeText(keyword))),
  );

  return (
    matchedRule?.answer ??
    'Mình đã nhận thông tin. Để tư vấn chính xác hơn, anh/chị vui lòng cho biết thiết bị đang gặp lỗi gì, hiện tượng xảy ra bao lâu rồi, và khu vực/phường tại Cần Thơ. Nếu cần xử lý gấp, anh/chị có thể gọi hotline hoặc nhắn Zalo để kỹ thuật viên xác nhận lịch nhanh.'
  );
}

export function FloatingActions({ minimal = false }: { minimal?: boolean }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const reducedMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatTriggerRef = useRef<HTMLButtonElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Xin chào, mình là trợ lý tư vấn của Điện Lạnh Minh Nhật. Anh/chị mô tả tình trạng thiết bị, mình sẽ gợi ý hướng xử lý và dịch vụ phù hợp.',
    },
  ]);

  const phoneHref = useMemo(() => `tel:${integrationSettings.phone.replace(/\s/g, '')}`, []);

  useEffect(() => {
    if (!isChatOpen) return;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const chatTrigger = chatTriggerRef.current;
    const focusInputFrame = requestAnimationFrame(() => chatInputRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsChatOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => {
      cancelAnimationFrame(focusInputFrame);
      document.removeEventListener('keydown', closeOnEscape);
      if (chatTrigger?.isConnected) {
        chatTrigger.focus();
      } else if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, isChatOpen, reducedMotion]);

  function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: getConsultationAnswer(trimmedMessage) },
    ]);
    setInputValue('');
    setIsChatOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(inputValue);
  }

  return (
    <>
      <div
        className={
          minimal ? 'hidden' : 'fixed bottom-3 left-3 z-50 hidden lg:block lg:bottom-16 lg:left-4'
        }
      >
        <a
          aria-label={`Gọi ${integrationSettings.phone}`}
          href={phoneHref}
          className="contact-action-float relative inline-flex h-12 w-12 select-none items-center justify-center gap-0 overflow-visible rounded-full border border-white/70 bg-[linear-gradient(135deg,#ffd84d_0%,#ffc21f_52%,#ffad1f_100%)] p-0 text-slate-950 shadow-[0_18px_38px_rgb(245_158_11_/_0.36)] ring-1 ring-amber-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 sm:h-16 sm:w-auto sm:gap-3 sm:py-2 sm:pl-2 sm:pr-5"
        >
          <span className="pointer-events-none absolute inset-x-5 top-1 h-5 rounded-full bg-white/35 blur-md" />
          <span className="phone-ring-halo pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500/45 sm:left-8 sm:h-16 sm:w-16" />
          <span className="phone-ring-halo pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500/30 [animation-delay:400ms] sm:left-8 sm:h-16 sm:w-16" />
          <span className="relative inline-flex h-full w-full translate-x-0.5 items-center justify-center rounded-full text-red-600 sm:h-12 sm:w-10 sm:translate-x-1">
            <Phone className="phone-ring-icon relative h-7 w-7 sm:h-6 sm:w-6" />
          </span>
          <span className="relative hidden text-sm font-black tracking-normal sm:inline sm:text-base">
            {integrationSettings.phone}
          </span>
        </a>
      </div>

      <div
        data-testid="mobile-sticky-cta"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          href={phoneHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#f6c945] bg-[#fff8d9] px-4 text-sm font-black text-[#7a5700] shadow-[0_12px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          <Phone className="h-4 w-4" />
          Gọi ngay
        </a>
        <Link
          href="/booking"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0877c9] px-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(8,119,201,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          Đặt lịch
        </Link>
      </div>

      {isChatOpen ? (
        <section
          id="ai-consultation-dialog"
          role="dialog"
          aria-labelledby="ai-consultation-title"
          aria-describedby="ai-consultation-description"
          className="fixed bottom-3 right-3 z-50 w-[calc(100vw-1.5rem)] max-w-sm animate-in overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 fade-in slide-in-from-bottom-3 zoom-in-95 duration-200 motion-reduce:animate-none sm:bottom-4 sm:right-24 sm:w-[calc(100vw-8rem)] sm:max-w-[380px] lg:max-w-[400px]"
        >
          <div className="flex items-start justify-between gap-3 bg-[#0b172a] p-4 text-white">
            <div className="flex min-w-0 items-start gap-3">
              <AiChatbotIcon className="h-10 w-10" idPrefix="ai-chat-modal-icon" />
              <div className="min-w-0">
                <h2 id="ai-consultation-title" className="text-sm font-black">
                  AI tư vấn Minh Nhật
                </h2>
                <p
                  id="ai-consultation-description"
                  className="mt-1 text-xs leading-5 text-slate-300"
                >
                  Gợi ý nhanh theo tình trạng thiết bị
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng tư vấn AI"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="additions text"
            aria-label="Nội dung hội thoại"
            tabIndex={0}
            className="min-h-[260px] max-h-[54vh] space-y-3 overflow-y-auto bg-slate-50 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:min-h-[320px] lg:min-h-[360px]"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex animate-in fade-in slide-in-from-bottom-1 duration-200 motion-reduce:animate-none ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[88%] rounded-md px-3 py-2 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  <span className="sr-only">
                    {message.role === 'user' ? 'Bạn' : 'Trợ lý tư vấn'}:{' '}
                  </span>
                  {message.content}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div
              role="group"
              aria-label="Câu hỏi gợi ý"
              className="mb-3 flex gap-2 overflow-x-auto pb-1"
            >
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="min-h-11 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary/40 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="ai-consultation-input" className="sr-only">
                Mô tả tình trạng thiết bị
              </label>
              <input
                ref={chatInputRef}
                id="ai-consultation-input"
                name="consultation-message"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Nhập tình trạng thiết bị..."
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi tin nhắn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <div
        className={
          minimal
            ? 'hidden'
            : 'fixed bottom-3 right-3 z-50 hidden flex-col-reverse items-end gap-2 sm:bottom-16 sm:right-4 sm:gap-3 lg:flex'
        }
      >
        <button
          ref={chatTriggerRef}
          type="button"
          hidden={isChatOpen}
          style={isChatOpen ? { display: 'none' } : undefined}
          aria-label="Mở AI tư vấn"
          aria-expanded={isChatOpen}
          aria-controls="ai-consultation-dialog"
          className="ai-chat-action contact-action-float group hidden h-16 max-w-[calc(100vw-2rem)] items-center justify-center gap-2.5 rounded-full bg-[#0b172a] py-2 pl-2 pr-4 text-left text-cyan-100 shadow-lg shadow-slate-950/25 ring-1 ring-cyan-200/25 [animation-delay:80ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 lg:inline-flex lg:gap-3 lg:pr-5"
          onClick={() => setIsChatOpen(true)}
        >
          <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#061326] p-0.5 shadow-lg shadow-cyan-500/20 transition duration-200 group-hover:shadow-cyan-300/45">
            <AiChatbotIcon className="h-full w-full rounded-full" idPrefix="ai-chat-fab-icon" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-sm font-black transition group-hover:text-white">
              AI tư vấn
            </span>
          </span>
        </button>
        <a
          href={integrationSettings.zaloUrl}
          aria-label="Liên hệ qua Zalo"
          className="contact-action contact-action-float inline-flex h-14 w-14 items-center justify-center rounded-full [animation-delay:160ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
          target="_blank"
          rel="noreferrer"
        >
          <LoadingImage
            src="/icons/zalo.svg"
            alt=""
            width={56}
            height={56}
            priority
            className="h-14 w-14 shrink-0 drop-shadow-lg"
          />
        </a>
      </div>
    </>
  );
}
