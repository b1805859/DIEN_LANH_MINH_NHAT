'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { integrationSettings } from '@/lib/integrations/settings';
import { CoolFixPropeller } from './coolfix-logo';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '@/lib/api/client';
import styles from './coolfix.module.css';

export function CoolFixFooter() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    if (!/^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/.test(cleanPhone)) {
      setErrorMessage('Số điện thoại chưa hợp lệ.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await apiClient.post('/bookings', {
        customerName: name.trim() || 'Khách hàng liên hệ nhanh',
        customerPhone: cleanPhone,
        serviceId: 'tu-van-nhanh',
        address: 'Cần Thơ',
        notes: 'Khách hàng để lại số điện thoại nhận tư vấn nhanh qua chân trang.',
      });
      setSubmitted(true);
      toast({
        title: 'Đã gửi yêu cầu tư vấn',
        description: 'Kỹ thuật viên Minh Nhật sẽ liên hệ lại với bạn.',
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Không gửi được yêu cầu',
        description: `Vui lòng gọi hotline ${integrationSettings.phone} hoặc nhắn Zalo để được hỗ trợ ngay.`,
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
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
                href={integrationSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
              >
                Facebook Fanpage
              </a>
            </li>
            <li>
              <a href={integrationSettings.zaloUrl} target="_blank" rel="noreferrer">
                Zalo tư vấn
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
                href={integrationSettings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Can+Tho'}
                target="_blank"
                rel="noreferrer"
              >
                Vị trí phục vụ tại Cần Thơ
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Newsletter / Quick Callback Form */}
        <div>
          <h3 className={styles.footerColTitle}>NHẬN TƯ VẤN NHANH</h3>
          <p className={styles.newsletterDesc}>
            Để lại thông tin, kỹ thuật viên Minh Nhật sẽ liên hệ tư vấn phương án kỹ thuật và hỗ trợ khảo sát tận nơi.
          </p>

          {submitted ? (
            <p style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600 }}>
              ✓ Cảm ơn bạn! Chúng tôi đã ghi nhận và sẽ liên hệ lại.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className={styles.newsletterInput}
                aria-label="Họ và tên khách hàng"
              />
              <input
                type="tel"
                placeholder="Số điện thoại *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
                className={styles.newsletterInput}
                aria-label="Số điện thoại khách hàng"
              />
              <button type="submit" disabled={isSubmitting} className={styles.newsletterBtn}>
                {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
              </button>
              {errorMessage && (
                <p style={{ color: '#f87171', fontSize: 12, margin: '6px 0 0', width: '100%' }}>
                  {errorMessage}
                </p>
              )}
              <p style={{ color: 'var(--cf-dark-muted)', fontSize: 11, margin: '8px 0 0', width: '100%' }}>
                Thông tin chỉ dùng để kỹ thuật viên liên hệ tư vấn dịch vụ.
              </p>
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
