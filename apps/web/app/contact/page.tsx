import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Facebook, MapPin, Phone } from 'lucide-react';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { integrationSettings } from '@/lib/integrations/settings';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Liên hệ Điện Lạnh Minh Nhật',
  description:
    'Liên hệ Điện Lạnh Minh Nhật qua điện thoại, Zalo hoặc Facebook. Phục vụ Ninh Kiều, Bình Thủy, Cái Răng, Ô Môn và Thốt Nốt tại Cần Thơ.',
  path: '/contact',
});

const facebookUrl = 'https://www.facebook.com/profile.php?id=100063792110691';

export default function ContactPage() {
  return (
    <main className="mock-page mock-inner-page mock-contact">
      <div className="mock-shell">
        <nav className="mock-breadcrumb" aria-label="Đường dẫn">
          <Link href="/">Trang chủ</Link>
          <ChevronRight size={15} />
          <span>Liên hệ</span>
        </nav>
        <div className="mock-contact-layout">
          <section>
            <h1>Liên hệ với Minh Nhật</h1>
            <p>Mọi thắc mắc về dịch vụ, liên hệ qua các kênh dưới đây.</p>
            <div className="mock-contact-list">
              <a href={`tel:${integrationSettings.phone}`}>
                <span className="mock-contact-icon">
                  <Phone />
                </span>
                <span>
                  <strong>Điện thoại</strong>
                  <b>0939 370 109</b>
                  <small>08:00 – 17:00 Thứ 2 – CN</small>
                </span>
              </a>
              <a href={integrationSettings.zaloUrl} target="_blank" rel="noreferrer">
                <span className="mock-contact-icon">
                  <Image src="/icons/zalo.svg" width={32} height={32} alt="" />
                </span>
                <span>
                  <strong>Zalo</strong>
                  <b>0939 370 109</b>
                  <small>Liên hệ qua số Zalo</small>
                </span>
              </a>
              <a href={facebookUrl} target="_blank" rel="noreferrer">
                <span className="mock-contact-icon">
                  <Facebook />
                </span>
                <span>
                  <strong>Facebook</strong>
                  <small>Facebook Điện Lạnh Minh Nhật</small>
                </span>
              </a>
              <div>
                <span className="mock-contact-icon">
                  <MapPin />
                </span>
                <span>
                  <strong>Địa chỉ phục vụ</strong>
                  <small>
                    Ninh Kiều, Bình Thủy, Cái Răng,
                    <br />Ô Môn, Thốt Nốt – Cần Thơ
                  </small>
                </span>
              </div>
            </div>
          </section>
          <section className="mock-map" aria-label="Sơ đồ minh họa khu vực Cần Thơ">
            <svg
              viewBox="0 0 620 430"
              role="img"
              aria-label="Sơ đồ minh họa trung tâm Cần Thơ"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="contact-street-blocks"
                  width="65"
                  height="48"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-24)"
                >
                  <rect width="65" height="48" fill="#eeefea" />
                  <path
                    d="M0 0H65V48 M22 0V48 M0 24H65"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <path d="M45 0V24" stroke="#dde8e1" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="620" height="430" fill="url(#contact-street-blocks)" />
              <path
                d="M245 -30 C272 80 350 126 440 175 S560 265 650 280"
                fill="none"
                stroke="#9ed9f5"
                strokeWidth="72"
              />
              <path
                d="M245 -30 C272 80 350 126 440 175 S560 265 650 280"
                fill="none"
                stroke="#c7eafd"
                strokeWidth="57"
              />
              <path
                d="M15 62 L360 0 M-20 144 L385 75 M-10 240 L405 152 M0 335 L370 235 M115 430 L438 286 M470 20 L630 120 M430 128 L628 220 M395 265 L615 350"
                stroke="#fff"
                strokeWidth="7"
                fill="none"
              />
              <path
                d="M55 -15 L128 430 M166 -10 L218 430 M266 -10 L280 430 M-10 189 L335 430 M337 20 L10 390 M458 0 L600 420"
                stroke="#fff"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M0 108 L368 49 M0 286 L396 194 M58 430 L413 308 M127 0 L204 430 M316 -10 L318 430"
                stroke="#e9d9ac"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M22 15 L84 6 L92 54 L29 72 Z M209 203 L270 186 L301 232 L236 260 Z M493 308 L560 320 L545 372 L470 356 Z"
                fill="#d3ead4"
              />
              <text x="153" y="172" fill="#3f6692" fontSize="15" fontWeight="700">
                Ninh Kiều
              </text>
              <text x="202" y="328" fill="#2868a7" fontSize="30" fontWeight="400">
                Cần Thơ
              </text>
              <text x="493" y="104" fill="#3f6692" fontSize="13">
                Bình Thủy
              </text>
              <text x="488" y="313" fill="#3f6692" fontSize="13">
                Cái Răng
              </text>
              <path
                d="M288 267 C281 254 267 240 267 228 A21 21 0 1 1 309 228 C309 240 295 254 288 267Z"
                fill="#f24d28"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="288" cy="227" r="7" fill="#963119" />
            </svg>
            <div>
              <MapPin size={21} />
              <span>
                <strong>Khu vực Cần Thơ</strong>
                <small>Sơ đồ minh họa</small>
              </span>
            </div>
          </section>
        </div>
      </div>
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Trang chủ', path: '/' },
          { name: 'Liên hệ', path: '/contact' },
        ])}
      />
    </main>
  );
}
