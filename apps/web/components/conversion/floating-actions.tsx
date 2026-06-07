import Image from 'next/image';
import { Phone } from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';

export function FloatingActions() {
  const phoneHref = `tel:${integrationSettings.phone.replace(/\s/g, '')}`;

  return (
    <>
      <div className="fixed bottom-20 left-4 z-50 sm:bottom-6">
        <a
          href={phoneHref}
          aria-label="Gọi hotline"
          className="contact-action contact-action-float inline-flex h-12 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Phone className="h-4 w-4" />
          </span>
          <span>{integrationSettings.phone}</span>
        </a>
      </div>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3 sm:bottom-6">
        <a
          href={integrationSettings.zaloUrl}
          aria-label="Mở Zalo"
          className="contact-action contact-action-float inline-flex h-12 w-12 items-center justify-center rounded-full [animation-delay:160ms]"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/icons/zalo.svg" alt="" width={48} height={48} className="h-12 w-12 shrink-0 drop-shadow-lg" />
        </a>
        <a
          href={integrationSettings.messengerUrl}
          aria-label="Mở Messenger"
          className="contact-action contact-action-float inline-flex h-12 w-12 items-center justify-center rounded-full [animation-delay:320ms]"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/icons/messenger.svg" alt="" width={48} height={48} className="h-12 w-12 shrink-0 drop-shadow-lg" />
        </a>
      </div>
      <a
        href={phoneHref}
        className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-center gap-2 bg-primary text-sm font-semibold text-white sm:hidden"
      >
        <Phone className="h-5 w-5" />
        Gọi ngay {integrationSettings.phone}
      </a>
    </>
  );
}
