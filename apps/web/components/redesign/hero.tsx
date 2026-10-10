'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { Actions, Eyebrow, Icon } from './ui';
const quick = [
  ['snowflake', 'Sửa chữa', 'máy lạnh', '/services/sua-may-lanh'],
  ['washer', 'Sửa chữa', 'máy giặt', '/services/sua-may-giat'],
  ['fridge', 'Sửa chữa', 'tủ lạnh', '/services/sua-tu-lanh'],
  ['plug', 'Điện nước', 'dân dụng', '/services/sua-dien-nuoc'],
  ['clock', 'Hẹn lịch nhanh', 'tại Cần Thơ', '/booking'],
  ['list', 'Báo giá rõ ràng', 'trước khi sửa', '/services'],
  ['shield', 'Hỗ trợ bảo hành', 'theo hạng mục', '/about'],
  ['pin', 'Phục vụ khắp', 'Cần Thơ và lân cận', '/#khu-vuc'],
];
export function HomeHero() {
  const [open, setOpen] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) {
      modal.current?.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
        modal.current?.close();
      };
    }
    modal.current?.close();
  }, [open]);
  return (
    <section className="mn-home-hero">
      <Image
        className="mn-family-image"
        src={siteContent.images.hero}
        alt="Gia đình thư giãn trong phòng khách sáng mát, máy lạnh phía trên bên phải – ảnh minh họa"
        fill
        priority
        sizes="(max-width: 800px) 1200px, 100vw"
      />
      <div className="mn-hero-shade" />
      <svg className="mn-airflow" viewBox="0 0 1100 568" aria-hidden="true">
        <defs>
          <linearGradient id="air-gradient">
            <stop stopColor="#34ceff" stopOpacity="0" />
            <stop offset=".65" stopColor="#8ff4ff" stopOpacity=".8" />
            <stop offset="1" stopColor="#d3ffff" stopOpacity=".25" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${870 + i * 8} ${183 - i * 3} Q ${835 + i * 3} ${290 + i * 8} ${560 + i * 23} ${292 + i * 4}`}
            stroke="url(#air-gradient)"
            strokeWidth="1.6"
            fill="none"
            style={{ animationDelay: `${i * -0.7}s` }}
          />
        ))}
      </svg>
      <div className="mn-hero-copy">
        <Eyebrow>ĐIỆN LẠNH TẬN NƠI TẠI CẦN THƠ</Eyebrow>
        <h1>
          Cho cuộc sống
          <br />
          <em>thoải mái hơn</em>
        </h1>
        <p>
          Điện Lạnh Minh Nhật – chuyên sửa chữa, vệ sinh, lắp đặt điều hòa, tủ lạnh, máy giặt và
          thiết bị điện lạnh tận nơi tại Cần Thơ. Nhanh chóng – Uy tín – Giá hợp lý.
        </p>
        <Actions />
        <div className="mn-hero-trust">
          {[
            ['shield', 'Tận tâm', 'trong từng dịch vụ'],
            ['users', 'Tư vấn rõ', 'hỗ trợ tận nơi'],
            ['zap', 'Có mặt nhanh', 'tại Cần Thơ'],
          ].map(([icon, title, desc]) => (
            <div key={title}>
              <span>
                <Icon name={icon} />
              </span>
              <p>
                <strong>{title}</strong>
                <small>{desc}</small>
              </p>
            </div>
          ))}
        </div>
      </div>
      <button
        className="mn-play"
        onClick={() => setOpen(true)}
        aria-label={siteContent.video ? 'Xem video giới thiệu' : 'Xem giới thiệu Minh Nhật'}
      >
        <span>
          <Play fill="currentColor" />
        </span>
        <small>{siteContent.video ? 'Xem video giới thiệu' : 'Khám phá Minh Nhật'}</small>
      </button>
      <nav className="mn-quick-services" aria-label="Dịch vụ nhanh">
        {quick.map(([icon, line1, line2, href]) => (
          <Link href={href} key={icon}>
            <Icon name={icon} />
            <span>
              {line1}
              <br />
              {line2}
            </span>
          </Link>
        ))}
      </nav>
      <dialog
        ref={modal}
        className="mn-intro-dialog"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <button
          aria-label="Đóng giới thiệu"
          className="mn-menu-close"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
        {open &&
          (siteContent.video ? (
            <video src={siteContent.video} controls autoPlay playsInline />
          ) : (
            <div>
              <Image
                src={siteContent.images.hero}
                width={900}
                height={464}
                alt="Gia đình thư giãn trong không gian mát lành – ảnh minh họa"
              />
              <h2>Điện Lạnh Minh Nhật</h2>
              <p>
                Sửa chữa, vệ sinh và lắp đặt điện lạnh tận nơi tại Cần Thơ. Trao đổi rõ tình trạng
                thiết bị, thống nhất phương án rồi mới thực hiện.
              </p>
              <Link className="mn-button" href="/about" onClick={() => setOpen(false)}>
                Tìm hiểu về Minh Nhật →
              </Link>
            </div>
          ))}
      </dialog>
    </section>
  );
}
