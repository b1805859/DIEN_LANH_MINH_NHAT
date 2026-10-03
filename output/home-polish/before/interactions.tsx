'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CirclePlay, Play, ScanLine, X } from 'lucide-react';
import { galleryImages } from './data';
import styles from './home.module.css';

export function VideoButton({ variant }: { variant: 'outline' | 'feature' }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const open = () => {
    dialog.current?.showModal();
    void video.current?.play().catch(() => {});
  };
  return (
    <>
      {variant === 'outline' ? (
        <button className={styles.videoOutline} onClick={open}>
          <CirclePlay />
          Xem video
        </button>
      ) : (
        <button
          className={styles.featureVideo}
          onClick={open}
          aria-label="Xem video quy trình của chúng tôi"
        >
          <span className={styles.bigPlay}>
            <Play fill="currentColor" />
          </span>
          <span className={styles.videoCaption}>
            <span>
              <ScanLine />
            </span>
            <span>
              <strong>Xem video</strong>
              <small>Quy trình của chúng tôi</small>
            </span>
          </span>
        </button>
      )}
      <dialog
        ref={dialog}
        className={`${styles.dialog} ${styles.videoDialog}`}
        aria-label="Video giới thiệu quy trình Điện Lạnh Minh Nhật"
        onClose={() => video.current?.pause()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className={styles.closeButton}
          onClick={() => dialog.current?.close()}
          aria-label="Đóng video"
        >
          <X />
        </button>
        <video
          ref={video}
          controls
          playsInline
          preload="none"
          poster="/images/home-reference/hero.webp"
        >
          <source src="/videos/minh-nhat-process.webm" type="video/webm" />
          <track
            kind="captions"
            src="/videos/minh-nhat-process.vi.vtt"
            srcLang="vi"
            label="Tiếng Việt"
            default
          />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </dialog>
    </>
  );
}

export function HomeGallery() {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (index: number) => {
    setSelected(index);
    dialog.current?.showModal();
  };
  const step = (amount: number) =>
    setSelected((index) => (index + amount + galleryImages.length) % galleryImages.length);
  return (
    <section className={styles.gallery} id="hinh-anh" aria-labelledby="gallery-title">
      <div className={styles.sectionHeading}>
        <h2 id="gallery-title">Hình ảnh thực tế</h2>
        <p>Một số hình ảnh thi công, sửa chữa, lắp đặt thực tế tại Cần Thơ.</p>
        <button onClick={() => open(0)}>
          Xem thêm <ArrowRight />
        </button>
      </div>
      <div className={styles.galleryViewport}>
        <button
          className={`${styles.galleryArrow} ${styles.previous}`}
          aria-label="Nhóm ảnh trước"
          onClick={() => setOffset((index) => (index + 4) % 5)}
        >
          <ChevronLeft />
        </button>
        <div className={styles.galleryGrid}>
          {galleryImages.map((_, index) => {
            const actualIndex = (offset + index) % galleryImages.length;
            const item = galleryImages[actualIndex];
            return (
              <button
                key={actualIndex}
                onClick={() => open(actualIndex)}
                aria-label={`Xem ảnh: ${item.alt}`}
              >
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 600px) 45vw, 20vw" />
              </button>
            );
          })}
        </div>
        <button
          className={`${styles.galleryArrow} ${styles.next}`}
          aria-label="Nhóm ảnh tiếp theo"
          onClick={() => setOffset((index) => (index + 1) % 5)}
        >
          <ChevronRight />
        </button>
      </div>
      <dialog
        ref={dialog}
        className={`${styles.dialog} ${styles.galleryDialog}`}
        aria-label="Thư viện hình ảnh"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') step(-1);
          if (event.key === 'ArrowRight') step(1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className={styles.closeButton}
          onClick={() => dialog.current?.close()}
          aria-label="Đóng thư viện"
        >
          <X />
        </button>
        <div className={styles.lightboxPhoto}>
          <Image
            src={galleryImages[selected].src}
            alt={galleryImages[selected].alt}
            fill
            sizes="90vw"
          />
        </div>
        <div className={styles.lightboxControls}>
          <button aria-label="Ảnh trước" onClick={() => step(-1)}>
            <ChevronLeft />
          </button>
          <p>
            {galleryImages[selected].alt}
            <span>
              {selected + 1} / {galleryImages.length}
            </span>
          </p>
          <button aria-label="Ảnh tiếp theo" onClick={() => step(1)}>
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </section>
  );
}
