'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, X } from 'lucide-react';
import { integrationSettings } from '@/lib/integrations/settings';
import { CoolFixPropeller } from './coolfix-logo';
import styles from './coolfix.module.css';

export function CoolFixHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const phone = integrationSettings.phone.replace(/\s/g, '');
  const displayPhone = '0939 370 109';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      // Detect if user has scrolled into dark sections (Testimonials, FAQ, Footer)
      const darkEl = document.getElementById('dark-section');
      if (darkEl) {
        const rect = darkEl.getBoundingClientRect();
        // If dark section is within upper viewport area
        setIsDarkSection(rect.top <= 80 && rect.bottom > 80);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMobileMenu = () => {
    dialogRef.current?.showModal();
  };

  const closeMobileMenu = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled ? 'true' : 'false'}
        data-theme={isDarkSection ? 'dark' : 'light'}
      >
        <div className={styles.headerGlass} />
        <div className={styles.headerInner}>
          {/* Left: Menu icon & Language */}
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={openMobileMenu}
              aria-label="Mở menu điều hướng"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
              </svg>
            </button>
            <div className={styles.langPill}>
              <span>VI</span>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ opacity: 0.6 }}>EN</span>
            </div>
          </div>

          {/* Center: Brand */}
          <Link href="/" className={styles.brand} aria-label="Điện Lạnh Minh Nhật — Trang chủ">
            <CoolFixPropeller className={styles.brandIcon} size={28} />
            <span>Điện Lạnh Minh Nhật</span>
          </Link>

          {/* Right: Phone & CTA */}
          <div className={styles.headerRight}>
            <a href={`tel:${phone}`} className={styles.phonePill}>
              <Phone size={15} strokeWidth={2.4} />
              <span>{displayPhone}</span>
            </a>
            <Link href="/booking" className={styles.ctaPill}>
              Đặt lịch ngay
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Dialog */}
      <dialog
        ref={dialogRef}
        style={{
          border: 'none',
          padding: 0,
          background: 'transparent',
          maxWidth: '100vw',
          maxHeight: '100dvh',
          width: '100%',
          height: '100%',
          margin: 0,
        }}
        onClose={() => setMobileOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMobileMenu();
        }}
      >
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 9, 10, 0.94)',
            backdropFilter: 'blur(20px)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            fontFamily: 'var(--cf-font)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 700 }}>
              <CoolFixPropeller size={26} />
              <span>Điện Lạnh Minh Nhật</span>
            </div>
            <button
              type="button"
              onClick={closeMobileMenu}
              style={{
                background: 'rgba(255,255,255,0.1)',
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
              aria-label="Đóng menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 24, fontSize: 24, fontWeight: 600 }}>
            <Link href="#dich-vu" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Dịch vụ nổi bật
            </Link>
            <Link href="#quy-trinh" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Quy trình 5 bước
            </Link>
            <Link href="#danh-gia" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Đánh giá khách hàng
            </Link>
            <Link href="#faq" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Câu hỏi thường gặp
            </Link>
            <Link href="/about" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Về chúng tôi
            </Link>
            <Link href="/contact" onClick={closeMobileMenu} style={{ color: '#fff', textDecoration: 'none' }}>
              Liên hệ
            </Link>
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 16px' }}>Hotline hỗ trợ nhanh 24/7:</p>
            <a
              href={`tel:${phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#3b82f6',
                fontSize: 20,
                fontWeight: 700,
                textDecoration: 'none',
                marginBottom: 20,
              }}
            >
              <Phone size={18} /> {displayPhone}
            </a>
            <Link
              href="/booking"
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#3b82f6',
                color: '#fff',
                padding: '14px',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Đặt lịch sửa chữa ngay <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
