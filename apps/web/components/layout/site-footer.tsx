'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, Clock, Facebook, Mail, MapPin, Youtube } from 'lucide-react';
import { APP_NAME, PRIORITY_DISTRICTS } from '@minhnhat/shared';
import { MinhNhatLogoMark } from '@/components/brand/minh-nhat-logo';
import { integrationSettings } from '@/lib/integrations/settings';

function ZaloIcon({ className }: { className?: string }) {
  return <Image src="/icons/zalo.svg" alt="" aria-hidden="true" width={20} height={20} className={className} />;
}

const allowedSocialHosts = {
  Facebook: ['facebook.com', 'fb.com', 'fb.me'],
  YouTube: ['youtube.com', 'youtu.be'],
  Zalo: ['zalo.me'],
} as const;

function isValidSocialUrl(label: keyof typeof allowedSocialHosts, href: string) {
  try {
    const hostname = new URL(href).hostname.toLowerCase();
    return allowedSocialHosts[label].some(
      (allowedHost) => hostname === allowedHost || hostname.endsWith(`.${allowedHost}`),
    );
  } catch {
    return false;
  }
}

export function SiteFooter() {
  const seenSocialUrls = new Set<string>();
  const socialLinks = [
    { label: 'Facebook' as const, href: integrationSettings.facebookUrl.trim(), icon: Facebook },
    { label: 'YouTube' as const, href: integrationSettings.youtubeUrl.trim(), icon: Youtube },
    { label: 'Zalo' as const, href: integrationSettings.zaloUrl.trim(), icon: ZaloIcon },
  ].filter(({ label, href }) => {
    const normalizedHref = href.replace(/\/+$/, '');

    if (
      !normalizedHref ||
      seenSocialUrls.has(normalizedHref) ||
      !isValidSocialUrl(label, normalizedHref)
    ) {
      return false;
    }

    seenSocialUrls.add(normalizedHref);
    return true;
  });

  const quickLinks = [
    { label: 'Dịch vụ', href: '/services' },
    { label: 'Khu vực phục vụ', href: '/areas' },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Hỏi đáp', href: '/faq' },
    { label: 'Bài viết', href: '/blog' },
    { label: 'Đặt lịch', href: '/booking' },
  ];

  return (
    <>
      <footer className="bg-[#0b172a] pb-24 pt-10 text-white sm:pt-12 lg:pb-0">
        <div className="container">
          <div className="grid gap-8 border-b border-white/10 pb-8 md:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-8">
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
              <p className="mt-4 hidden max-w-md text-[15px] leading-7 text-slate-300 lg:block">
                Dịch vụ sửa chữa, vệ sinh và lắp đặt điện lạnh gia đình. Tập trung phản hồi nhanh,
                tư vấn rõ và báo giá trước khi thi công.
              </p>
              {socialLinks.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={`${label} (mở trong tab mới)`}
                      title={label}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-white/5 text-white shadow-sm shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="hidden lg:block">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                Cam kết dịch vụ
              </h2>
                <div className="mt-4 grid gap-3 text-[15px] leading-6 text-slate-300">
                <p className="hidden gap-3 lg:flex">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  Báo tình trạng rõ trước khi sửa, thống nhất chi phí rồi mới thi công.
                </p>
                <p className="hidden gap-3 lg:flex">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  Kỹ thuật viên hỗ trợ tận nơi, ưu tiên lịch cần xử lý trong ngày.
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                Khám phá
              </h2>
              <nav className="mt-2 grid grid-cols-2 gap-x-3" aria-label="Liên kết cuối trang">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-slate-300 transition hover:text-cyan-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <h3 className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">
                Phường ưu tiên
              </h3>
              <nav className="mt-1 flex flex-wrap gap-x-3" aria-label="Khu vực phục vụ ưu tiên">
                {PRIORITY_DISTRICTS.map((district) => (
                  <Link
                    key={district.slug}
                    href={`/areas/${district.slug}`}
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-slate-300 transition hover:text-cyan-200 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                  >
                    {district.shortName}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                Thông tin liên hệ
              </h2>
              <div className="mt-4 grid gap-3 text-[15px] leading-6 text-slate-300">
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
              © {new Date().getFullYear()} {APP_NAME}. Bảo lưu mọi quyền.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy-policy"
                className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/terms-of-service"
                className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Điều khoản dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
