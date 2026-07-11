'use client';

import Link from 'next/link';
import type { SVGProps } from 'react';
import { BadgeCheck, Clock, Facebook, Mail, MapPin } from 'lucide-react';
import { APP_NAME } from '@minhnhat/shared';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { integrationSettings } from '@/lib/integrations/settings';

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M15.7 2.5c.2 1.5.8 2.8 1.8 3.8 1 .9 2.2 1.5 3.8 1.6v3.4c-2-.1-3.8-.7-5.4-1.8v6.3c0 3.4-2.6 5.7-6.1 5.7-3.3 0-5.8-2.3-5.8-5.4 0-3.4 2.6-5.7 6.1-5.7.5 0 1 .1 1.4.2v3.6c-.4-.2-.8-.3-1.3-.3-1.4 0-2.4.8-2.4 2.1 0 1.2.9 2 2.1 2 1.4 0 2.2-.8 2.2-2.4V2.5h3.6Z" />
    </svg>
  );
}

export function SiteFooter() {
  const socialLinks = [
    { label: 'Facebook', href: integrationSettings.facebookUrl, icon: Facebook },
    { label: 'TikTok', href: integrationSettings.tiktokUrl, icon: TikTokIcon },
  ];

  return (
    <>
      <footer className="bg-[#0b172a] pb-24 pt-10 text-white sm:pt-12 lg:pb-0">
        <div className="container">
          <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
              <div className="md:col-span-2 lg:col-span-1">
                <Link href="/" className="inline-flex max-w-full items-center gap-3">
                  <MinhNhatLogoMark
                    className="h-11 w-11 shadow-lg shadow-cyan-400/10"
                    idPrefix="site-footer-logo"
                  />
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-black uppercase leading-tight text-white">
                      {APP_NAME}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-cyan-100/75">
                      Điện lạnh tận nơi tại Cần Thơ
                    </span>
                  </span>
                </Link>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                  Dịch vụ sửa chữa, vệ sinh và lắp đặt điện lạnh gia đình. Tập trung phản hồi nhanh,
                  tư vấn rõ và báo giá trước khi thi công.
                </p>
                <div id="footer-social-links" className="mt-5 flex flex-wrap items-center gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => {
                    const className =
                      'inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/5 text-white shadow-sm shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200';

                    return (
                      <a
                        key={label}
                        href={href || '#footer-social-links'}
                        aria-label={label}
                        title={label}
                        target={href ? '_blank' : undefined}
                        rel={href ? 'noreferrer' : undefined}
                        className={className}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                  Cam kết dịch vụ
                </h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                  <p className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Báo tình trạng rõ trước khi sửa, thống nhất chi phí rồi mới thi công.
                  </p>
                  <p className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Kỹ thuật viên hỗ trợ tận nơi, ưu tiên lịch cần xử lý trong ngày.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                  Thông tin liên hệ
                </h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
                  <p className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    {integrationSettings.address}
                  </p>
                  <p className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Ưu tiên tiếp nhận các lịch cần xử lý trong ngày.
                  </p>
                  <p className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    Liên hệ qua hotline hoặc Zalo để được tư vấn phương án phù hợp.
                  </p>
                </div>
              </div>
          </div>

          <div className="flex flex-col gap-3 py-4 text-xs font-semibold text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {APP_NAME}. Đã đăng ký bản quyền.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="transition hover:text-white">
                Chính sách bảo mật
              </Link>
              <Link href="/terms-of-service" className="transition hover:text-white">
                Điều khoản dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
