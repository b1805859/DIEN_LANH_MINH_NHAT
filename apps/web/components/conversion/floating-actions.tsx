'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Phone, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { surfaceMotion } from '@/components/ui/motion-tokens';
import { AiChatbotIcon } from '@/components/brand/ai-chatbot-icon';
import { LoadingImage } from '@/components/ui/loading-image';
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
    id: 'ac-cooling',
    keywords: ['khong lanh', 'khong mat', 'yeu lanh', 'may lanh khong lanh', 'may lanh khong mat'],
    answer:
      'Máy lạnh không lạnh thường do lưới lọc/dàn lạnh bẩn, thiếu gas, quạt yếu, tụ hoặc board điều khiển lỗi. Anh/chị nên tắt máy 5-10 phút, kiểm tra remote đang ở chế độ Cool và nhiệt độ khoảng 24-26 độ. Nếu máy vẫn chỉ thổi gió hoặc lạnh yếu, Minh Nhật có thể đến đo gas, kiểm tra dàn nóng và báo giá trước khi làm.',
  },
  {
    id: 'ac-drain',
    keywords: ['chay nuoc', 'ro nuoc', 'nuoc chay', 'may lanh chay nuoc'],
    answer:
      'Máy lạnh chảy nước thường do nghẹt ống thoát, dàn lạnh bám bụi, máng nước bẩn hoặc lắp đặt bị nghiêng. Anh/chị nên hạn chế tự tháo vỏ máy nếu không quen kỹ thuật. Dịch vụ phù hợp là vệ sinh máy lạnh và kiểm tra đường thoát nước.',
  },
  {
    id: 'ac-cleaning',
    keywords: ['ve sinh may lanh', 'bao lau ve sinh', 'bao tri may lanh', 'dinh ky'],
    answer:
      'Gia đình nên vệ sinh máy lạnh khoảng 3-6 tháng/lần. Nếu phòng nhiều bụi, có trẻ nhỏ, cửa hàng hoặc máy chạy nhiều giờ mỗi ngày thì nên vệ sinh khoảng 2-3 tháng/lần. Khi vệ sinh, kỹ thuật viên sẽ xịt rửa dàn lạnh, vệ sinh lưới lọc, kiểm tra thoát nước và chạy thử.',
  },
  {
    id: 'ac-refrigerant',
    keywords: ['nap gas', 'het gas', 'thieu gas', 'gas may lanh'],
    answer:
      'Không phải máy lạnh yếu là cần nạp gas ngay. Kỹ thuật viên cần đo áp suất, kiểm tra rò rỉ và tình trạng dàn nóng/dàn lạnh trước. Nếu thiếu gas thật, Minh Nhật sẽ báo loại gas, lượng nạp và chi phí trước khi thực hiện.',
  },
  {
    id: 'washer',
    keywords: ['may giat', 'khong vat', 'khong xa', 'mui hoi', 'long giat'],
    answer:
      'Máy giặt có mùi hôi hoặc giặt không sạch thường do lồng giặt bám cặn, lọc xơ vải bẩn hoặc đường nước xả có vấn đề. Nếu máy không vắt/không xả, có thể liên quan bơm xả, dây curoa, board hoặc cảm biến cửa. Anh/chị mô tả thêm lỗi hiển thị hoặc hiện tượng để kỹ thuật viên tư vấn sát hơn.',
  },
  {
    id: 'fridge',
    keywords: ['tu lanh', 'tu mat', 'dong tuyet', 'kem lanh', 'khong lanh'],
    answer:
      'Tủ lạnh yếu lạnh có thể do gioăng cửa hở, quạt gió yếu, đóng tuyết, cảm biến hoặc block hoạt động bất thường. Anh/chị nên kiểm tra cửa tủ đóng kín, không nhồi quá nhiều đồ và nghe xem block phía sau có chạy không. Nếu tủ vẫn yếu lạnh, nên đặt lịch kiểm tra tại nhà.',
  },
  {
    id: 'plumbing',
    keywords: ['dien nuoc', 'ong nuoc', 'voi nuoc', 'bon rua', 'may nuoc nong', 'nuoc nong lanh'],
    answer:
      'Với điện nước hoặc máy nước nóng/lạnh, kỹ thuật viên sẽ kiểm tra điểm rò, van khóa, nguồn điện, dây cấp và tình trạng thiết bị trước khi thi công. Anh/chị nên ngắt nguồn điện hoặc khóa van nước nếu đang rò nước mạnh để đảm bảo an toàn.',
  },
  {
    id: 'booking',
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
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getConsultationAnswer(message: string) {
  const normalizedMessage = ` ${normalizeText(message)} `;
  const includes = (phrase: string) => normalizedMessage.includes(` ${phrase} `);
  // Explicit intent/device takes precedence over symptoms shared by several appliances.
  const specific = [
    { id: 'booking', terms: ['bao gia', 'chi phi', 'dat lich', 'hen lich', 'gia sua', 'gia ve sinh'] },
    { id: 'fridge', terms: ['tu lanh', 'tu mat'] },
    { id: 'washer', terms: ['may giat', 'long giat'] },
    { id: 'plumbing', terms: ['dien nuoc', 'ong nuoc', 'voi nuoc', 'bon rua', 'may nuoc nong', 'nuoc nong lanh'] },
  ].find((rule) => rule.terms.some(includes));
  const matchedRule = specific
    ? consultationRules.find((rule) => rule.id === specific.id)
    : consultationRules.find((rule) => rule.keywords.some(includes));

  return (
    matchedRule?.answer ??
    'Mình đã nhận thông tin. Để tư vấn chính xác hơn, anh/chị vui lòng cho biết thiết bị đang gặp lỗi gì, hiện tượng xảy ra bao lâu rồi, và khu vực/phường tại Cần Thơ. Nếu cần xử lý gấp, anh/chị có thể gọi hotline hoặc nhắn Zalo để kỹ thuật viên xác nhận lịch nhanh.'
  );
}

export function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    const container = messagesRef.current;
    container?.scrollTo({
      top: container.scrollHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (!isChatOpen) return;
    const previousFocus = document.activeElement;
    inputRef.current?.focus({ preventScroll: true });
    // The trigger remounts when the panel closes; resolve its current node at cleanup.
    const restoreFocus = () => {
      const target = triggerRef.current ?? (
        previousFocus instanceof HTMLElement && previousFocus.isConnected ? previousFocus : null
      );
      target?.focus({ preventScroll: true });
    };
    return () => {
      restoreFocus();
    };
  }, [isChatOpen]);

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
      <div className={`mn-floating-phone ${isChatOpen ? 'hidden sm:block' : ''}`}>
        <a
          aria-label={`Gọi ${integrationSettings.phone}`}
          title={`Gọi ${integrationSettings.phone}`}
          href={phoneHref}
          className="mn-phone-action contact-action-float inline-flex items-center justify-center rounded-full border"
        >
          <Phone className="h-6 w-6" />
          <span className="sr-only">{integrationSettings.phone}</span>
        </a>
      </div>

      <AnimatePresence>
      {isChatOpen ? (
        <motion.section
          key="consultation"
          {...surfaceMotion}
          role="dialog"
          aria-label="AI tư vấn Minh Nhật"
          className="mn-chat-panel fixed bottom-3 right-3 z-50 w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 sm:bottom-4 sm:right-24 sm:w-[calc(100vw-8rem)] sm:max-w-[380px] lg:max-w-[400px]"
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.stopPropagation();
            setIsChatOpen(false);
          }}
        >
          <div className="flex items-start justify-between gap-3 bg-[#0b172a] p-4 text-white">
            <div className="flex min-w-0 items-start gap-3">
              <AiChatbotIcon className="h-10 w-10" idPrefix="ai-chat-modal-icon" />
              <div className="min-w-0">
                <h2 className="text-sm font-black">AI tư vấn Minh Nhật</h2>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Gợi ý nhanh theo tình trạng thiết bị
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Đóng tư vấn AI"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={messagesRef}
            role="log"
            tabIndex={0}
            aria-label="Cuộc trò chuyện tư vấn"
            className="mn-chat-messages space-y-3 overflow-y-auto bg-slate-50 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[88%] rounded-md px-3 py-2 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-primary/40 hover:bg-cyan-50"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                aria-label="Nội dung cần tư vấn"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Nhập tình trạng thiết bị..."
              />
              <button
                type="submit"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white transition hover:bg-primary/90"
                aria-label="Gửi tin nhắn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.section>
      ) : null}
      </AnimatePresence>

      <div className={`mn-floating-support ${isChatOpen ? 'hidden sm:flex' : 'flex'}`}>
        {!isChatOpen ? (
          <button
            ref={triggerRef}
            type="button"
            aria-label="Mở AI tư vấn"
            title="AI tư vấn"
            className="ai-chat-action contact-action-float group inline-flex h-16 max-w-[calc(100vw-2rem)] items-center justify-center gap-2.5 rounded-full bg-[#0b172a] py-2 pl-2 pr-4 text-left text-cyan-100 shadow-lg shadow-slate-950/25 ring-1 ring-cyan-200/25 [animation-delay:80ms] sm:gap-3 sm:pr-5"
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
        ) : null}
        <a
          href={integrationSettings.zaloUrl}
          aria-label="Liên hệ qua Zalo"
          title="Liên hệ qua Zalo"
          className="contact-action contact-action-float inline-flex h-14 w-14 items-center justify-center rounded-full [animation-delay:160ms]"
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
