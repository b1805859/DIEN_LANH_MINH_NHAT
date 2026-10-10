import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { integrationSettings } from '@/lib/integrations/settings';
export function AreaMap({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={`mn-area-map ${compact ? 'mn-area-map-compact' : ''}`}
      viewBox="0 0 430 340"
      role="img"
      aria-label="Sơ đồ minh họa khu vực phục vụ Cần Thơ"
    >
      <defs>
        <radialGradient id={compact ? 'map-compact' : 'map-fill'}>
          <stop stopColor="#09669e" stopOpacity=".9" />
          <stop offset="1" stopColor="#022343" stopOpacity=".9" />
        </radialGradient>
        <filter id={compact ? 'pin-compact' : 'pin-glow'}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path
        d="m56 63 23-23 26 6 20-21 24 9 23-14 23 20 22-3 25 19 26-8 20 26 25 3 18 32 29 10-13 32 23 30-20 25 10 29-29 19-16 34-36-1-23 33-26-14-28 12-19-21-35 2-14-31-27-6 5-34-19-21 8-35-10-24 21-21Z"
        fill={`url(#${compact ? 'map-compact' : 'map-fill'})`}
        stroke="#0fbce9"
        strokeWidth="1.5"
      />
      <g stroke="#1385b0" fill="none" strokeWidth=".8" opacity=".8">
        <path d="m65 82 53 30 25-33 53 17 28-44M91 47l27 65-30 43 29 35-31 42M143 79l23 51 56-11 24 33 60-16 29 17M117 190l41-27 31 30-9 38 46 13 6 51M166 130l-8 33 31 30 45-10 12-31M306 136l-30 59 38 45M180 231l-58 23M226 244l50-49-42-12M276 195l-2 64" />
        <path d="M60 275 155 190 222 172 322 73" stroke="#54d6ff" strokeWidth="4" opacity=".3" />
        <path d="m50 132 92 83 78 55 111-88" strokeDasharray="4 6" />
      </g>
      {[
        ['Thốt Nốt', 93, 77],
        ['Vĩnh Thạnh', 133, 124],
        ['Cờ Đỏ', 244, 88],
        ['Bình Thủy', 276, 143],
        ['Ô Môn', 126, 201],
        ['Phong Điền', 104, 263],
        ['Cái Răng', 247, 291],
      ].map(([name, x, y]) => (
        <g key={name} transform={`translate(${x},${y})`}>
          <path d="M0 0c-10-11-9-19 0-19S10-11 0 0" fill="#48e7ff" />
          <circle cy="-12" r="3" fill="#03547b" />
          <text x="10" y="-6" fill="#d6f5ff" fontSize="12">
            {name}
          </text>
        </g>
      ))}
      <g transform="translate(235 214)">
        <circle cy="-19" r="30" fill="#0ad4ff" opacity=".2" />
        <path
          d="M0 0C-31-33-28-57 0-57S31-33 0 0"
          fill="#16b9f5"
          stroke="#c1faff"
          strokeWidth="3"
        />
        <circle cy="-35" r="10" fill="white" />
        <text x="27" y="-8" fill="white" fontSize="24" fontWeight="700">
          Cần Thơ
        </text>
      </g>
    </svg>
  );
}
export function ServiceArea() {
  return (
    <section className="mn-service-area" id="khu-vuc">
      <Image
        src={siteContent.images.panorama}
        fill
        sizes="100vw"
        alt="Phối cảnh cầu Cần Thơ lung linh về đêm – ảnh minh họa"
      />
      <div className="mn-area-shade" />
      <div className="mn-area-copy">
        <h2>
          Có mặt nhanh chóng
          <br />
          tại mọi khu vực
        </h2>
        <p>Hỗ trợ tận nơi tại Cần Thơ và lân cận</p>
        <div className="mn-area-chips">
          {siteContent.areas.map((area) => (
            <Link key={area.name} href={area.slug ? `/areas/${area.slug}` : '/contact'}>
              <MapPin size={17} />
              {area.name}
            </Link>
          ))}
          <Link href="/contact">
            <MapPin size={17} />
            Và các khu vực lân cận
          </Link>
        </div>
      </div>
      <AreaMap />
    </section>
  );
}
export function ContactMap() {
  return (
    <section className="mn-contact-map">
      <h2>
        <MapPin size={20} />
        Địa chỉ · Khu vực phục vụ
      </h2>
      <div className="mn-contact-map-art">
        <svg
          viewBox="0 0 540 330"
          className="mn-street-map"
          role="img"
          aria-label="Sơ đồ minh họa các tuyến đường và khu vực Cần Thơ"
        >
          <defs>
            <pattern
              id="street-blocks"
              width="46"
              height="36"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(32)"
            >
              <rect
                x="3"
                y="3"
                width="38"
                height="28"
                rx="2"
                fill="#174a66"
                stroke="#247699"
                strokeWidth=".6"
              />
              <path d="M22 4v26M4 17h36" stroke="#205d7c" strokeWidth=".65" />
            </pattern>
            <linearGradient id="river-blue">
              <stop stopColor="#0467a3" />
              <stop offset="1" stopColor="#0a3e65" />
            </linearGradient>
          </defs>
          <rect width="540" height="330" fill="url(#street-blocks)" opacity=".52" />
          <path
            d="M340-20C260 70 390 86 296 185S253 305 205 360"
            fill="none"
            stroke="url(#river-blue)"
            strokeWidth="55"
          />
          <g stroke="#428db2" strokeWidth="2" fill="none" opacity=".65">
            <path d="M0 120 160 45 470 310M-20 240 240 50 510 220M30 0 310 330M110 0 440 330M470 0 100 330M560 100 180 330M0 280 250 90M0 70 380 320" />
            <path
              d="m50 50 130 165 198-127M180 0l-56 90 85 98 180-129M19 186l93 99 160-84 120 105M250 0l-49 99 41 70M540 280l-119-91 82-108"
              strokeWidth=".8"
            />
          </g>
          <path
            d="M-10 186 130 122 275 179 392 278 520 207"
            fill="none"
            stroke="#70bddd"
            strokeWidth="4"
          />
          <path d="M54 338 190 202 306 118 470 5" fill="none" stroke="#1199df" strokeWidth="5" />
          <g fill="#c2e4f5" fontSize="13">
            <text x="45" y="61">
              Ninh Kiều
            </text>
            <text x="395" y="59">
              Thốt Nốt
            </text>
            <text x="53" y="164">
              Ô Môn
            </text>
            <text x="99" y="274">
              Phong Điền
            </text>
            <text x="379" y="293">
              Cái Răng
            </text>
          </g>
          <g fill="#37beef" stroke="#caf3ff" strokeWidth="1.5">
            {[
              [35, 48],
              [44, 149],
              [85, 260],
              [365, 280],
              [390, 42],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="5" />
            ))}
          </g>
          <g transform="translate(322 176)">
            <circle cy="-14" r="29" fill="#0abaff" opacity=".22" />
            <path
              d="M0 6C-29-25-26-48 0-48S29-25 0 6"
              fill="#168fee"
              stroke="#b6f2ff"
              strokeWidth="3"
            />
            <circle cy="-28" r="9" fill="white" />
            <rect x="25" y="-43" width="155" height="42" rx="6" fill="#022b4beb" stroke="#0b8ac0" />
            <text x="36" y="-25" fill="white" fontSize="12">
              Khu vực phục vụ
            </text>
            <text x="36" y="-10" fill="#50dbff" fontSize="13" fontWeight="700">
              Cần Thơ
            </text>
          </g>
        </svg>
        <span className="mn-map-caption">Sơ đồ khu vực phục vụ · Minh họa</span>
      </div>
      <div className="mn-map-address">
        <Navigation size={18} />
        <span>{siteContent.address}</span>
        {integrationSettings.googleMapsUrl && (
          <a target="_blank" rel="noreferrer" href={integrationSettings.googleMapsUrl}>
            Chỉ đường ↗
          </a>
        )}
      </div>
    </section>
  );
}
