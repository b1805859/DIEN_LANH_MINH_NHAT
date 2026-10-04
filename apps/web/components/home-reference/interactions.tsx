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
        <button className={styles.videoOutline} onClick={open} data-motion-hover="button">
          <CirclePlay />
          Xem video
        </button>
      ) : (
        <button
          className={styles.featureVideo}
          onClick={open}
          aria-label="Xem video quy trình của chúng tôi"
          data-motion="image"
          data-motion-delay="120"
          data-motion-hover="image"
        >
          <Image
            src="/images/home-reference/technician.webp"
            alt="Kỹ thuật viên Minh Nhật kiểm tra dàn nóng máy lạnh"
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 960px) 45vw, 30vw"
          />
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
          data-motion-hover="icon"
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
  const [hasNavigated, setHasNavigated] = useState(false);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (index: number) => {
    setSelected(index);
    dialog.current?.showModal();
  };
  const step = (amount: number) =>
    setSelected((index) => (index + amount + galleryImages.length) % galleryImages.length);
  const moveGallery = (amount: number) => {
    setHasNavigated(true);
    setOffset((index) => (index + amount + galleryImages.length) % galleryImages.length);
  };
  return (
    <section className={styles.gallery} id="hinh-anh" aria-labelledby="gallery-title">
      <div className={styles.sectionHeading} data-motion-stagger="60">
        <h2 id="gallery-title">Hình ảnh thực tế</h2>
        <p>Ảnh minh hoạ các dịch vụ thi công, sửa chữa và lắp đặt điện lạnh tại Cần Thơ.</p>
        <button onClick={() => open(0)}>
          Xem thêm <ArrowRight />
        </button>
      </div>
      <div className={styles.galleryViewport}>
        <button
          className={`${styles.galleryArrow} ${styles.previous}`}
          aria-label="Nhóm ảnh trước"
          data-motion-hover="icon"
          onClick={() => moveGallery(-1)}
        >
          <ChevronLeft />
        </button>
        <div className={styles.galleryGrid} data-motion-stagger="60">
          {galleryImages.map((_, index) => {
            const actualIndex = (offset + index) % galleryImages.length;
            const item = galleryImages[actualIndex];
            return (
              <button
                key={index}
                onClick={() => open(actualIndex)}
                aria-label={`Xem ảnh: ${item.alt}`}
                data-motion-hover="image"
              >
                <span
                  key={actualIndex}
                  className={`${styles.galleryPhoto} ${hasNavigated ? styles.galleryPhotoChanged : ''}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 760px) 50vw, (max-width: 960px) 33vw, (min-width: 1440px) 248px, 20vw"
                  />
                </span>
              </button>
            );
          })}
        </div>
        <button
          className={`${styles.galleryArrow} ${styles.next}`}
          aria-label="Nhóm ảnh tiếp theo"
          data-motion-hover="icon"
          onClick={() => moveGallery(1)}
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
          data-motion-hover="icon"
        >
          <X />
        </button>
        <div className={styles.lightboxPhoto}>
          <Image
            key={selected}
            src={galleryImages[selected].src}
            alt={galleryImages[selected].alt}
            className={styles.lightboxImage}
            fill
            sizes="90vw"
          />
        </div>
        <div className={styles.lightboxControls}>
          <button aria-label="Ảnh trước" onClick={() => step(-1)} data-motion-hover="icon">
            <ChevronLeft />
          </button>
          <p>
            {galleryImages[selected].alt}
            <span>
              {selected + 1} / {galleryImages.length}
            </span>
          </p>
          <button aria-label="Ảnh tiếp theo" onClick={() => step(1)} data-motion-hover="icon">
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </section>
  );
}
