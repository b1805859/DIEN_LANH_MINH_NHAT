'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
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
const slides = [
  { image: siteContent.images.services, title: 'Sửa chữa máy lạnh' },
  { image: '/images/redesign/ve-sinh-may-lanh.webp', title: 'Vệ sinh máy lạnh' },
  { image: '/images/redesign/sua-may-giat.webp', title: 'Sửa chữa máy giặt' },
  { image: '/images/redesign/sua-tu-lanh.webp', title: 'Sửa chữa tủ lạnh' },
  { image: '/images/redesign/sua-dien-nuoc.webp', title: 'Điện nước dân dụng' },
  { image: '/images/redesign/thao-lap-may-lanh.webp', title: 'Lắp đặt máy lạnh' },
];
export function HomeHero() {
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respectPreference = () => {
      if (preference.matches) setAutoPlay(false);
    };
    respectPreference();
    preference.addEventListener('change', respectPreference);
    return () => preference.removeEventListener('change', respectPreference);
  }, []);
  useEffect(() => {
    if (!autoPlay || hovering || open) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSlide((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [autoPlay, hovering, open]);
  const selectSlide = (index: number) => {
    setSlide((index + slides.length) % slides.length);
    setAutoPlay(false);
  };
  useEffect(() => {
    const element = modal.current;
    if (open) {
      element?.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
        element?.close();
      };
    }
    modal.current?.close();
  }, [open]);
  return (
    <section
      className="mn-home-hero mn-hero-carousel"
      aria-label="Dịch vụ Điện Lạnh Minh Nhật"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest('[data-carousel-rotation]')) setAutoPlay(false);
      }}
    >
      {slides.map((item, index) => (
        <Image
          key={item.image}
          className="mn-family-image mn-carousel-image"
          src={item.image}
          alt={`${item.title} tại Cần Thơ – ảnh minh họa`}
          hidden={slide !== index}
          fill
          priority={index === 0}
          loading={index === 0 ? undefined : 'eager'}
          sizes="(max-width: 800px) 1200px, 100vw"
        />
      ))}
      <div className="mn-hero-shade" />
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
      <div
        className="mn-carousel-controls"
        role="group"
        aria-label="Điều khiển ảnh dịch vụ"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            selectSlide(slide + (event.key === 'ArrowLeft' ? -1 : 1));
          }
        }}
      >
        <button aria-label="Ảnh dịch vụ trước" onClick={() => selectSlide(slide - 1)}>
          <ChevronLeft />
        </button>
        <div className="mn-carousel-dots" role="group" aria-label="Chọn ảnh dịch vụ">
          {slides.map((item, index) => (
            <button
              key={item.image}
              aria-label={`Xem ảnh ${item.title.toLowerCase()}`}
              aria-current={slide === index ? 'true' : undefined}
              onClick={() => selectSlide(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <button aria-label="Ảnh dịch vụ tiếp theo" onClick={() => selectSlide(slide + 1)}>
          <ChevronRight />
        </button>
        <button
          data-carousel-rotation
          aria-label={autoPlay ? 'Tạm dừng chuyển ảnh' : 'Tự động chuyển ảnh'}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? <Pause /> : <Play />}
        </button>
        <p
          className="mn-carousel-caption"
          aria-live={autoPlay ? 'off' : 'polite'}
          aria-atomic="true"
        >
          <span>
            {String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          {slides[slide].title}
        </p>
      </div>
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
