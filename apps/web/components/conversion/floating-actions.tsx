'use client';

import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  Headset,
  Minus,
  Paperclip,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDraggableBubble } from './use-draggable-bubble';
import styles from './floating-actions.module.css';
import { LoadingImage } from '@/components/ui/loading-image';
import { integrationSettings } from '@/lib/integrations/settings';
import { trackEvent } from '@/lib/analytics';

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
  image?: string;
};

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const panelTransition = {
  scale: { duration: .45, ease: [.3, 1.15, .4, 1] as const },
  opacity: { duration: .25 },
};

const mascotPath = '/images/chat/minh-nhat-ai-mechanic.png';

function MechanicAvatar({
  className = '',
  launcher = false,
}: {
  className?: string;
  launcher?: boolean;
}) {
  return (
    <Image
      src={launcher ? mascotPath : '/images/chat/minh-nhat-ai-avatar.png'}
      alt=""
      width={96}
      height={96}
      sizes="96px"
      priority
      className={className}
    />
  );
}

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
      'Không phải máy lạnh yếu là cần nạp gas ngay. Kỹ thuật viên cần đo áp suất, kiểm tra rò rỉ và tình trạng dàn nóng/dàn lạnh trước. Nếu phát hiện máy thiếu môi chất, cần tìm nguyên nhân trước khi quyết định cách xử lý.',
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
    {
      id: 'booking',
      terms: ['bao gia', 'chi phi', 'dat lich', 'hen lich', 'gia sua', 'gia ve sinh'],
    },
    { id: 'fridge', terms: ['tu lanh', 'tu mat'] },
    { id: 'washer', terms: ['may giat', 'long giat'] },
    {
      id: 'plumbing',
      terms: ['dien nuoc', 'ong nuoc', 'voi nuoc', 'bon rua', 'may nuoc nong', 'nuoc nong lanh'],
    },
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
  const reduceMotion = useReducedMotion();
  const aiBubble = useDraggableBubble<HTMLButtonElement>();
  const zaloBubble = useDraggableBubble<HTMLAnchorElement>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [attachment, setAttachment] = useState<string>();
  const [attachmentError, setAttachmentError] = useState('');
  const [awaitingAirflow, setAwaitingAirflow] = useState(false);
  const [pendingReply, setPendingReply] = useState<{ content: string; awaitingAirflow: boolean } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const launcherCircle = useRef<HTMLSpanElement>(null);
  const openingOrigin = useRef<{ x: number; y: number } | null>(null);
  const floatingControls = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Chào bạn, mình là trợ lý AI\ncủa Điện Lạnh Minh Nhật.\nMình có thể hỗ trợ gì cho bạn\nvề máy lạnh, máy giặt, tủ lạnh...?',
    },
  ]);

  useEffect(() => {
    const controls = floatingControls.current;
    const preference = window.matchMedia(reducedMotionQuery);
    if (!controls || preference.matches || controls.contains(document.activeElement) ||
        typeof Element.prototype.animate !== 'function') return;

    const animations = Array.from(controls.children, (launcher, index) =>
      launcher.animate([
        { opacity: 0, transform: 'translateY(14px) scale(.94)' },
        { opacity: 1, transform: 'none' },
      ], {
        duration: 380,
        delay: 160 + index * 85,
        easing: 'cubic-bezier(.2, .85, .25, 1.12)',
        fill: 'backwards',
      }),
    );
    const finish = () => animations.forEach((animation) => animation.cancel());
    const respectPreference = (event: MediaQueryListEvent) => {
      if (event.matches) finish();
    };
    // Keep focus and the drag origin at the final position on immediate interaction.
    controls.addEventListener('focusin', finish);
    controls.addEventListener('pointerdown', finish, true);
    preference.addEventListener('change', respectPreference);
    return () => {
      finish();
      controls.removeEventListener('focusin', finish);
      controls.removeEventListener('pointerdown', finish, true);
      preference.removeEventListener('change', respectPreference);
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const origin = openingOrigin.current;
    if (isChatOpen && panel && origin) {
      panel.style.transformOrigin = `${origin.x - panel.offsetLeft}px ${origin.y - panel.offsetTop}px`;
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (!pendingReply) return;

    const preference = window.matchMedia(reducedMotionQuery);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(typingTimer);
      window.clearTimeout(replyTimer);
      setMessages(current => [...current, { role: 'assistant', content: pendingReply.content }]);
      setAwaitingAirflow(pendingReply.awaitingAirflow);
      setIsTyping(false);
      setPendingReply(null);
    };
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) finish();
    };
    const typingTimer = window.setTimeout(() => setIsTyping(true), 300);
    const replyTimer = window.setTimeout(finish, preference.matches ? 0 : 1300);
    preference.addEventListener('change', onPreferenceChange);
    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(replyTimer);
      preference.removeEventListener('change', onPreferenceChange);
    };
  }, [pendingReply]);

  useEffect(() => {
    if (!isChatOpen) return;
    const container = messagesRef.current;
    container?.scrollTo({
      top: container.scrollHeight,
      behavior: window.matchMedia(reducedMotionQuery).matches ? 'auto' : 'smooth',
    });
  }, [messages, isChatOpen, isTyping]);

  useEffect(() => {
    if (!isChatOpen) return;
    const previousFocus = document.activeElement;
    if (window.matchMedia('(min-width: 640px)').matches)
      inputRef.current?.focus({ preventScroll: true });
    // The trigger remounts when the panel closes; resolve its current node at cleanup.
    const restoreFocus = () => {
      const target =
        triggerRef.current ??
        (previousFocus instanceof HTMLElement && previousFocus.isConnected ? previousFocus : null);
      target?.focus({ preventScroll: true });
    };
    return () => {
      requestAnimationFrame(restoreFocus);
    };
  }, [isChatOpen]);

  // Keep the page still behind the mobile sheet, including when rotating a device.
  useEffect(() => {
    if (!isChatOpen) return;
    const media = window.matchMedia('(max-width: 639px)');
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const sync = () => {
      root.style.overflow = media.matches ? 'hidden' : previousOverflow;
    };
    sync();
    media.addEventListener('change', sync);
    return () => {
      root.style.overflow = previousOverflow;
      media.removeEventListener('change', sync);
    };
  }, [isChatOpen]);

  // Keep the composer inside the visible area when a mobile keyboard opens.
  useEffect(() => {
    if (!isChatOpen || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const syncViewport = () => {
      const panel = panelRef.current;
      if (!panel) return;
      panel.style.setProperty('--chat-available-height', `${Math.max(0, viewport.height - 24)}px`);
      panel.style.setProperty(
        '--chat-bottom',
        `${Math.max(12, window.innerHeight - viewport.height - viewport.offsetTop + 12)}px`,
      );
    };
    syncViewport();
    viewport.addEventListener('resize', syncViewport);
    viewport.addEventListener('scroll', syncViewport);
    return () => {
      viewport.removeEventListener('resize', syncViewport);
      viewport.removeEventListener('scroll', syncViewport);
    };
  }, [isChatOpen]);

  function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (pendingReply || (!trimmedMessage && !attachment)) return;
    const normalized = normalizeText(trimmedMessage);
    const coolingQuestion =
      /may lanh/.test(normalized) && /khong lanh|khong mat|yeu lanh/.test(normalized);
    const airflowReply = awaitingAirflow && /co gio|khong co gio/.test(normalized);
    let answer = getConsultationAnswer(trimmedMessage);
    if (coolingQuestion) answer = 'Mình giúp bạn kiểm tra nhé.\nMáy vẫn có gió thổi ra không?';
    if (airflowReply) {
      answer = normalized.includes('khong co gio')
        ? 'Bạn thử kiểm tra chế độ và tốc độ quạt trên remote nhé. Nếu máy vẫn không thổi gió, hãy tắt máy và kết nối kỹ thuật viên để kiểm tra quạt, nguồn điện.'
        : 'Bạn kiểm tra remote ở chế độ Cool, khoảng 24–26°C và lưới lọc có bám bụi không nhé. Nếu máy vẫn không mát, kỹ thuật viên có thể kiểm tra tại nhà và báo giá trước khi làm.';
    }
    if (attachment)
      answer =
        'Mình đã nhận ảnh đính kèm. Bạn mô tả thêm tình trạng thiết bị nhé. Để kỹ thuật viên xem ảnh trực tiếp, bạn có thể gửi qua mục Kết nối kỹ thuật viên bên dưới.';
    setMessages((current) => [
      ...current,
      { role: 'user', content: trimmedMessage || 'Ảnh thiết bị của tôi', image: attachment },
    ]);
    const reply = { content: answer, awaitingAirflow: coolingQuestion && !attachment };
    if (window.matchMedia(reducedMotionQuery).matches) {
      setMessages(current => [...current, { role: 'assistant', content: reply.content }]);
      setAwaitingAirflow(reply.awaitingAirflow);
    } else {
      setPendingReply(reply);
    }
    setAttachment(undefined);
    setInputValue('');
    setIsChatOpen(true);
  }

  function attachImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setAttachmentError('Chọn ảnh JPG, PNG hoặc WebP tối đa 5 MB nhé.');
      return;
    }
    setAttachmentError('');
    const reader = new FileReader();
    reader.onload = () => setAttachment(reader.result as string);
    reader.readAsDataURL(file);
  }

  const quickPrompts = awaitingAirflow
    ? ['Có gió, không mát', 'Không có gió']
    : ['Máy lạnh không lạnh', 'Máy giặt có mùi hôi'];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (document.activeElement === (event.nativeEvent as SubmitEvent).submitter) {
      inputRef.current?.focus({ preventScroll: true });
    }
    sendMessage(inputValue);
  }

  function openChat() {
    const circle = launcherCircle.current?.getBoundingClientRect();
    openingOrigin.current = circle ? { x: circle.left + circle.width / 2, y: circle.top + circle.height / 2 } : null;
    trackEvent('ai_open');
    setIsChatOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.section
            ref={panelRef}
            key="consultation"
            initial={reduceMotion ? false : { opacity: 0, scale: .1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: .1 }}
            transition={reduceMotion ? { duration: 0 } : panelTransition}
            role="dialog"
            aria-labelledby="mn-ai-chat-title"
            className={styles.panel}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                setIsChatOpen(false);
              }
            }}
          >
            <div className={styles.handle} aria-hidden="true" />
            <div className={styles.header}>
              <MechanicAvatar className={styles.headerAvatar} />
              <div className={styles.heading}>
                <h2 id="mn-ai-chat-title">
                  Trợ lý Minh Nhật <span className={styles.status} aria-hidden="true" />
                </h2>
                <p>Tư vấn bằng AI</p>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Thu nhỏ tư vấn AI"
                onClick={() => setIsChatOpen(false)}
              >
                <Minus size={20} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Đóng tư vấn AI"
                onClick={() => setIsChatOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.conversation}>
              <div
                ref={messagesRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                tabIndex={0}
                aria-label="Cuộc trò chuyện tư vấn"
                className={styles.messages}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                  >
                    {message.role === 'assistant' && (
                      <MechanicAvatar className={styles.messageAvatar} />
                    )}
                    <div className={styles.bubble}>
                      {message.image && (
                        <LoadingImage
                          src={message.image}
                          alt="Ảnh thiết bị đã đính kèm"
                          width={220}
                          height={160}
                          reveal="none"
                          showLoader={false}
                          className={styles.attachedImage}
                        />
                      )}
                      <p>{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <span className={styles.userAvatar} aria-hidden="true">
                        <UserRound size={23} />
                      </span>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className={styles.typing} role="status">
                    <span className="sr-only">Trợ lý đang soạn câu trả lời</span>
                    <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className={styles.quickReplies} aria-label="Gợi ý trả lời">
                {quickPrompts.map((prompt, index) => (
                  <button key={index} type="button" aria-disabled={!!pendingReply} onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.footer}>
              {attachment && (
                <div className={styles.attachmentPreview}>
                  <LoadingImage
                    src={attachment}
                    alt="Ảnh chuẩn bị gửi"
                    width={56}
                    height={44}
                    reveal="none"
                    showLoader={false}
                  />
                  <span>Ảnh thiết bị</span>
                  <button
                    type="button"
                    aria-label="Bỏ ảnh đính kèm"
                    onClick={() => setAttachment(undefined)}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {attachmentError && (
                <p role="alert" className={styles.error}>
                  {attachmentError}
                </p>
              )}
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={attachImage}
                  className={styles.fileInput}
                  aria-label="Chọn ảnh thiết bị"
                  tabIndex={-1}
                />
                <div className={styles.inputWrap}>
                  <button
                    type="button"
                    className={styles.attachButton}
                    aria-label="Đính kèm ảnh thiết bị"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Paperclip size={22} />
                  </button>
                  <input
                    ref={inputRef}
                    aria-label="Nội dung cần tư vấn"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Nhập tin nhắn..."
                    maxLength={2000}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.sendButton}
                  aria-label="Gửi tin nhắn"
                  disabled={!!pendingReply || (!inputValue.trim() && !attachment)}
                >
                  <Send size={21} />
                </button>
              </form>
              <div className={styles.supportRow}>
                <a
                  href={integrationSettings.zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.technician}
                >
                  <Headset size={25} />
                  <span>Kết nối kỹ thuật viên</span>
                  <ChevronRight size={18} />
                </a>
                <span className={styles.supportNote}>
                  <ShieldCheck size={19} /> AI hỗ trợ thông tin
                </span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <div ref={floatingControls} className={`${styles.floatingSupport} ${isChatOpen ? styles.chatOpen : ''}`}>
        <a
          {...zaloBubble}
          href={integrationSettings.zaloUrl}
          aria-label="Chat Zalo ngay"
          title="Chat Zalo ngay"
          className={styles.zalo}
          target="_blank"
          rel="noreferrer"
        >
          <span className={styles.pillLabel}>
            <span className={styles.onlineDot} aria-hidden="true" />
            <span>
              Chat <strong className={styles.pillAccent}>Zalo</strong> ngay
            </span>
          </span>
          <span className={styles.zaloCircle} aria-hidden="true">
            <LoadingImage
              src="/icons/zalo.svg"
              alt=""
              width={48}
              height={48}
              priority
              className={styles.zaloImage}
            />
          </span>
        </a>
        {!isChatOpen && (
          <button
            {...aiBubble}
            ref={(node) => {
              triggerRef.current = node;
              aiBubble.ref(node);
            }}
            type="button"
            aria-label="Hỏi Trợ lý AI 24/7"
            aria-expanded={isChatOpen}
            aria-haspopup="dialog"
            title="Hỏi Trợ lý AI 24/7"
            className={styles.launcher}
            onClick={openChat}
          >
            <span className={styles.pillLabel}>
              <span>
                Hỏi <strong className={styles.pillAccent}>Trợ lý AI</strong> 24/7
              </span>
            </span>
            <span ref={launcherCircle} className={styles.aiCircle} aria-hidden="true">
              <span className={styles.aiOrb}>
                <MechanicAvatar className={styles.launcherMascot} launcher />
              </span>
              <span className={styles.aiBadge}>AI</span>
            </span>
          </button>
        )}
      </div>
    </>
  );
}
