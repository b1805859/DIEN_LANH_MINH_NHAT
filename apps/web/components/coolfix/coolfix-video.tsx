'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import styles from './coolfix.module.css';

export function CoolFixVideo() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = () => {
    dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => {});
  };

  const closeVideo = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
  };

  return (
    <section className={styles.showcase} aria-label="Xem video quy trình kỹ thuật viên">
      <div className={styles.showcaseFrame}>
        <Image
          src="/images/home-reference/technician.webp"
          alt="Kỹ thuật viên Điện Lạnh Minh Nhật kiểm tra và bảo dưỡng dàn nóng máy lạnh"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1320px"
          className={styles.showcaseImage}
        />

        {/* Center Frosted Glass Circular Play Button */}
        <button
          type="button"
          className={styles.playBtn}
          onClick={openVideo}
          aria-label="Phát video quy trình làm việc"
        >
          <Play size={26} fill="currentColor" />
          <span>Play Video</span>
        </button>
      </div>

      {/* Video Modal Dialog */}
      <dialog
        ref={dialogRef}
        style={{
          border: 'none',
          padding: 0,
          background: 'transparent',
          maxWidth: '1000px',
          width: '92vw',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        onClose={closeVideo}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeVideo();
        }}
      >
        <div style={{ position: 'relative', background: '#000', borderRadius: '24px', overflow: 'hidden' }}>
          <button
            type="button"
            onClick={closeVideo}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              background: 'rgba(0,0,0,0.6)',
              border: 'none',
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Đóng video"
          >
            <X size={20} />
          </button>

          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            poster="/images/home-reference/technician.webp"
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '80vh' }}
          >
            <source src="/videos/minh-nhat-process.webm" type="video/webm" />
            <track
              kind="captions"
              src="/videos/minh-nhat-process.vi.vtt"
              srcLang="vi"
              label="Tiếng Việt"
              default
            />
            Trình duyệt của bạn không hỗ trợ phát video HTML5.
          </video>
        </div>
      </dialog>
    </section>
  );
}
