'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { integrationSettings } from '@/lib/integrations/settings';
import { CoolFixPropeller } from './coolfix-logo';
import { useToast } from '@/components/ui/toast';
import styles from './coolfix.module.css';

export function CoolFixFooter() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
    toast({
      title: 'Đã gửi yêu cầu tư vấn',
      description: 'Kỹ thuật viên Minh Nhật sẽ liên hệ lại trong ít phút.',
      variant: 'success',
    });
  };

  return (
    <footer className={styles.footer} aria-label="Thông tin chân trang">
      <div className={styles.footerGrid}>
        {/* Col 1: Quick Links */}
        <div>
          <h3 className={styles.footerColTitle}>LIÊN KẾT NHANH</h3>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/services">Dịch vụ điện lạnh</Link>
            </li>
            <li>
              <Link href="/about">Giới thiệu Minh Nhật</Link>
            </li>
            <li>
              <Link href="/areas">Khu vực phục vụ</Link>
            </li>
            <li>
              <Link href="#faq">Câu hỏi thường gặp</Link>
            </li>
            <li>
              <Link href="/blog">Tin tức & Mẹo sử dụng</Link>
            </li>
            <li>
              <Link href="/booking">Đặt lịch trực tuyến</Link>
            </li>
          </ul>
        </div>

        {/* Col 2: Social Media */}
        <div>
          <h3 className={styles.footerColTitle}>KẾT NỐI VỚI CHÚNG TÔI</h3>
          <ul className={styles.footerLinks}>
            <li>
              <a
                href={
                  integrationSettings.facebookUrl ||
                  'https://www.facebook.com/profile.php?id=100063792110691'
                }
                target="_blank"
                rel="noreferrer"
              >
                Facebook Fanpage
              </a>
            </li>
            <li>
              <a href={integrationSettings.zaloUrl} target="_blank" rel="noreferrer">
                Zalo Official Account
              </a>
            </li>
            {integrationSettings.youtubeUrl && (
              <li>
                <a href={integrationSettings.youtubeUrl} target="_blank" rel="noreferrer">
                  YouTube Channel
                </a>
              </li>
            )}
            <li>
              <a
                href={
                  integrationSettings.googleMapsUrl ||
                  'https://www.google.com/maps/search/?api=1&query=Ninh+Kieu+Can+Tho'
                }
                target="_blank"
                rel="noreferrer"
              >
                Vị trí Google Maps (Ninh Kiều)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Newsletter / Quick Callback Form */}
        <div>
          <h3 className={styles.footerColTitle}>NHẬN TƯ VẤN NHANH</h3>
          <p className={styles.newsletterDesc}>
            Để lại thông tin, kỹ thuật viên Minh Nhật sẽ liên hệ tư vấn và báo giá miễn phí trong 5 phút.
          </p>

          {submitted ? (
            <p style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600 }}>
              ✓ Cảm ơn bạn! Chúng tôi sẽ gọi lại ngay.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.newsletterInput}
                aria-label="Họ và tên khách hàng"
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={styles.newsletterInput}
                aria-label="Số điện thoại khách hàng"
              />
              <button type="submit" className={styles.newsletterBtn}>
                Đăng ký
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom row: Big Brand + Legal Meta */}
      <div className={styles.footerBottom}>
        <Link href="/" className={styles.footerLogoBig}>
          <CoolFixPropeller size={36} />
          <span>Điện Lạnh Minh Nhật</span>
        </Link>

        <div className={styles.footerMeta}>
          <span>© 2026 ĐIỆN LẠNH MINH NHẬT. TẤT CẢ QUYỀN ĐƯỢC BẢO LƯU.</span>
          <div className={styles.footerMetaLinks}>
            <Link href="/privacy-policy">CHÍNH SÁCH BẢO MẬT</Link>
            <Link href="/terms-of-service">ĐIỀU KHOẢN DỊCH VỤ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
