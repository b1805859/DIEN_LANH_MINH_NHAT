import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Navigation } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { integrationSettings } from '@/lib/integrations/settings';
export function AreaMap({ compact = false }: { compact?: boolean }) {
  const prefix = compact ? 'area-compact' : 'area';
  return (
    <svg
      className={`mn-area-map mn-area-map-native ${compact ? 'mn-area-map-compact' : ''}`}
      viewBox="0 0 210 188"
      role="img"
      aria-label="Sơ đồ minh họa khu vực phục vụ Cần Thơ"
    >
      <defs>
        <radialGradient id={`${prefix}-fill`} cx="55%" cy="57%" r="70%">
          <stop stopColor="#035587" stopOpacity=".94" />
          <stop offset="1" stopColor="#00243c" stopOpacity=".94" />
        </radialGradient>
        <radialGradient id={`${prefix}-light`}>
          <stop stopColor="#09bfff" stopOpacity=".9" />
          <stop offset="1" stopColor="#008aff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${prefix}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <clipPath id={`${prefix}-clip`}>
          <path d="M8 32 13 24Q21 25 27 17L36 20 41 21 48 12 55 8 61 14 65 13 71 21 83 18 88 15 96 19Q104 23 112 20L115 14Q119 7 124 9L132 13 141 16 149 15 155 23 161 20 165 29 177 33Q192 31 198 42L202 52 211 57 212 65 221 74 231 93 229 188H59L62 181 66 176 68 169 64 161 57 157 54 151Q44 154 39 152L32 154 28 153 22 155 14 151Q6 149 6 139L8 128 6 117 9 106 10 97 15 91 17 82 20 78 15 70 13 63 11 58 15 52 11 48Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${prefix}-clip)`}>
        <rect width="210" height="188" fill={`url(#${prefix}-fill)`} />
        <g fill="none" stroke="#126284" strokeWidth=".65" opacity=".8">
          <path d="M26 17 30 34 27 44 37 52 47 58 55 53 55 44 48 32 48 12M61 14 67 32 87 32 89 15M30 34 19 39 11 48M37 52 33 66 18 69M47 58 45 77 27 79 20 78M67 32 60 50 55 53 78 61 87 32 111 35 112 20M111 35 122 48 141 43 149 15M141 43 152 51 160 47 177 33M152 51 147 64 152 75 165 80 180 68 202 52M147 64 125 67 116 84 101 80 96 67 78 61M45 77 58 75 70 84 80 81 96 67M17 82 34 91 52 89 58 75M34 91 28 106 10 97M52 89 62 106 79 103 80 81M28 106 32 121 17 131 8 128M62 106 52 119 39 123 32 121M52 119 63 134 59 147 54 151M79 103 89 118 78 129 63 134M101 80 116 103 135 108 152 75M89 118 105 121 116 103M105 121 118 137 138 139 149 124 135 108M118 137 112 150 93 155 78 148 78 129M78 148 72 163 64 161M93 155 97 177 80 188M112 150 124 160 129 179 119 188M138 139 151 149 147 164 129 179M149 124 170 115 165 99 152 75M170 115 188 126 201 113 205 91 180 68M188 126 188 149 167 151 151 149M188 149 210 159M147 164 167 174 174 188M167 151 167 174M201 113 210 118M59 147 65 151 72 163" />
        </g>
        <circle cx="105" cy="109" r="38" fill={`url(#${prefix}-light)`} />
        <g fill="none" stroke="#00b5ff" strokeWidth="1.3">
          <path d="m79 103 14 14 23-8 19-1 14 16 21 6M116 109l-5 17 12 15 5 21M93 117l-12 6-8 10-10 5M93 117l-9-19-9-10M116 109l7-20 17-8 12-6" />
        </g>
        <g fill="#05c7ff" filter={`url(#${prefix}-glow)`}>
          <circle cx="105" cy="109" r="9" />
          <circle cx="128" cy="162" r="3" />
          <circle cx="170" cy="130" r="3" />
        </g>
      </g>
      <path
        d="M8 32 13 24Q21 25 27 17L36 20 41 21 48 12 55 8 61 14 65 13 71 21 83 18 88 15 96 19Q104 23 112 20L115 14Q119 7 124 9L132 13 141 16 149 15 155 23 161 20 165 29 177 33Q192 31 198 42L202 52 211 57 212 65 221 74 231 93M59 188 62 181 66 176 68 169 64 161 57 157 54 151Q44 154 39 152L32 154 28 153 22 155 14 151Q6 149 6 139L8 128 6 117 9 106 10 97 15 91 17 82 20 78 15 70 13 63 11 58 15 52 11 48 8 32"
        fill="none"
        stroke="#23b7d9"
        strokeWidth="1.1"
      />
      {[
        ['Thốt Nốt', 33, 42],
        ['Vĩnh Thạnh', 66, 65],
        ['Cờ Đỏ', 127, 50],
        ['Bình Thủy', 135, 78],
        ['Ô Môn', 53, 109],
        ['Cái Răng', 108, 157],
      ].map(([name, x, y]) => (
        <g key={name} transform={`translate(${x},${y})`}>
          <path d="M0 0C-11-13-10-19 0-19S11-13 0 0" transform="scale(.58)" fill="#48e7ff" />
          <circle cy="-7.3" r="2.1" fill="#07516c" />
          <text x="12" y="-3" fill="#e0f7ff" fontSize="8.2" fontWeight="500">
            {name}
          </text>
        </g>
      ))}
      <text x="28" y="133" fill="#e0f7ff" fontSize="8.2" fontWeight="500">
        Phong Điền
      </text>
      <g transform="translate(112 107)">
        <path
          d="M0 0C-27-31-23-41 0-41S27-31 0 0"
          transform="scale(.65)"
          fill="#7cddff"
          stroke="white"
          strokeWidth="2.5"
        />
        <circle cy="-18.7" r="5.4" fill="#074b78" stroke="#d0f7ff" strokeWidth="1" />
        <text x="20" y="2" fill="white" fontSize="12" fontWeight="600">
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
      <div className="mn-area-map mn-area-map-reference">
        <Image
          src="/images/redesign/area-map-reference.webp"
          fill
          unoptimized
          sizes="(max-width: 800px) 80vw, 36vw"
          alt="Bản đồ Cần Thơ trong thiết kế gốc: Thốt Nốt, Vĩnh Thạnh, Cờ Đỏ, Bình Thủy, Ô Môn, Phong Điền và Cái Răng"
        />
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
