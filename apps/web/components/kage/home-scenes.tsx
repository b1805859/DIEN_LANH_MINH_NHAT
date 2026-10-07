'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { galleryImages, homeServices } from '@/components/home-reference/data';
import k from './kage.module.css';

export function ServiceSelector() {
  const [active, setActive] = useState(0);
  return (
    <div className={k.services}>
      <div>
        <ul className={k.serviceList}>
          {homeServices.map((service, index) => (
            <li
              key={service.href}
              className={`${k.serviceRow} ${k.reveal}`}
              data-k-reveal
              style={{ ['--i' as string]: index }}
              data-active={active === index}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <Link href={service.href}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <h3>{service.title}</h3>
                <ArrowUpRight aria-hidden="true" />
                <p>{service.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className={k.servicesMore}>
          <Link href="/services" className={k.textLink}>
            Xem tất cả dịch vụ <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className={k.serviceStage} aria-hidden="true">
        {homeServices.map((service, index) => (
          <figure key={service.href} data-active={active === index}>
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(max-width: 960px) 100vw, 45vw"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <figcaption>
              <span>{service.title}</span>
              <span>
                {String(index + 1).padStart(2, '0')} / {String(homeServices.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function CinematicGallery() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (index: number) => {
    setSelected(index);
    dialog.current?.showModal();
  };
  const step = (amount: number) =>
    setSelected((index) => (index + amount + galleryImages.length) % galleryImages.length);

  return (
    <section
      className={k.gallery}
      id="hinh-anh"
      aria-labelledby="gallery-title"
      data-k-gallery
      style={{ ['--gallery-count' as string]: galleryImages.length }}
    >
      <div className={k.gallerySticky}>
        <div className={k.galleryHead}>
          <div>
            <p className={k.label}>
              <b>05</b> — Hình ảnh thực tế
            </p>
            <h2 id="gallery-title" className={k.display} data-k-reveal>
              <span className={k.line}>
                <span>Công việc thật,</span>
              </span>
              <span className={k.line} style={{ ['--i' as string]: 1 }}>
                <span>
                  <em>tại Cần Thơ.</em>
                </span>
              </span>
            </h2>
            <p className={k.lede}>
              Ảnh minh hoạ các dịch vụ thi công, sửa chữa và lắp đặt điện lạnh tại Cần Thơ.
            </p>
          </div>
          <button type="button" className={k.textLink} onClick={() => open(0)}>
            Xem thêm <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className={k.galleryTrack} data-k-track>
          {galleryImages.map((item, index) => (
            <button
              type="button"
              key={item.src}
              className={k.galleryItem}
              onClick={() => open(index)}
              aria-label={`Xem ảnh: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 960px) 78vw, 40vw"
                loading="lazy"
              />
              <span>
                <b>{String(index + 1).padStart(2, '0')}</b>
                {item.alt}
              </span>
            </button>
          ))}
        </div>
        <div className={k.galleryCounter} aria-hidden="true">
          <span>01</span>
          <div className={k.progress} data-k-progress>
            <span />
          </div>
          <span>{String(galleryImages.length).padStart(2, '0')}</span>
        </div>
      </div>
      <dialog
        ref={dialog}
        className={k.lightbox}
        aria-label="Thư viện hình ảnh"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') step(-1);
          if (event.key === 'ArrowRight') step(1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={k.lightboxPhoto}>
          <Image
            key={selected}
            src={galleryImages[selected].src}
            alt={galleryImages[selected].alt}
            fill
            sizes="90vw"
          />
        </div>
        <div className={k.lightboxBar}>
          <button type="button" className={k.iconBtn} aria-label="Ảnh trước" onClick={() => step(-1)}>
            <ChevronLeft />
          </button>
          <p>
            {galleryImages[selected].alt}
            <span>
              {selected + 1} / {galleryImages.length}
            </span>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className={k.iconBtn}
              aria-label="Ảnh tiếp theo"
              onClick={() => step(1)}
            >
              <ChevronRight />
            </button>
            <button
              type="button"
              className={k.iconBtn}
              aria-label="Đóng thư viện"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
