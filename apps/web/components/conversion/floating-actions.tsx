import Image from 'next/image';
import { Phone } from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';

export function FloatingActions() {
  return (
    <>
      <div className="fixed bottom-6 left-4 z-50">
        <div
          aria-label={`Hotline ${integrationSettings.phone}`}
          className="contact-action-float pointer-events-none relative inline-flex h-16 select-none items-center justify-center gap-3 overflow-hidden rounded-full border border-white/70 bg-[linear-gradient(135deg,#ffd84d_0%,#ffc21f_52%,#ffad1f_100%)] py-2 pl-2 pr-5 text-slate-950 shadow-[0_18px_38px_rgb(245_158_11_/_0.36)] ring-1 ring-amber-500/20"
        >
          <span className="pointer-events-none absolute inset-x-5 top-1 h-5 rounded-full bg-white/35 blur-md" />
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.24),0_10px_22px_rgb(0_91_187_/_0.32)]">
            <span className="phone-ring-halo absolute inset-0 rounded-full border border-cyan-100/70" />
            <Phone className="phone-ring-icon relative h-5 w-5" />
          </span>
          <span className="relative flex flex-col leading-none">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-700/80">
              Hotline
            </span>
            <span className="mt-1 text-base font-black tracking-normal">
              {integrationSettings.phone}
            </span>
          </span>
        </div>
      </div>
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
        <a
          href={integrationSettings.zaloUrl}
          aria-label="Mở Zalo"
          className="contact-action contact-action-float inline-flex h-14 w-14 items-center justify-center rounded-full [animation-delay:160ms]"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/icons/zalo.svg" alt="" width={56} height={56} className="h-14 w-14 shrink-0 drop-shadow-lg" />
        </a>
        <a
          href={integrationSettings.messengerUrl}
          aria-label="Mở Messenger"
          className="contact-action contact-action-float inline-flex h-14 w-14 items-center justify-center rounded-full [animation-delay:320ms]"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/icons/messenger.svg" alt="" width={56} height={56} className="h-14 w-14 shrink-0 drop-shadow-lg" />
        </a>
      </div>
    </>
  );
}
