import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { BLOG_CATEGORIES, BLOG_POSTS, FAQS, SERVICES } from '@minhnhat/shared';
import { getBlogPostImage } from '@/lib/content/site-content';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 4_500,
});

function getTodayIsoDate() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDaysIso(baseIso: string, offset: number) {
  const d = new Date(`${baseIso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function buildPreviewFallback(config?: InternalAxiosRequestConfig): unknown | null {
  if (!config?.url) return null;
  const url = config.url;
  const method = (config.method || 'get').toLowerCase();
  const today = getTodayIsoDate();
  const tomorrow = addDaysIso(today, 1);
  const in2Days = addDaysIso(today, 2);
  const in4Days = addDaysIso(today, 4);

  if (url.includes('/auth/login') && method === 'post') {
    return {
      accessToken: 'aurora-preview-admin-token',
      refreshToken: 'aurora-preview-refresh-token',
    };
  }

  if (url.includes('/auth/logout') && method === 'post') {
    return { ok: true };
  }

  if (url.includes('/admin/dashboard')) {
    return {
      services: SERVICES.length,
      categories: BLOG_CATEGORIES.length,
      faqs: FAQS.length,
      blog: BLOG_POSTS.length,
      bookings: 14,
      bookingOverview: {
        todayActive: 4,
        upcoming7DaysActive: 9,
        pendingActive: 3,
        nextBookingDate: today,
        nextBookingCount: 4,
      },
    };
  }

  if (url.includes('/bookings/schedule')) {
    const sampleBookings = [
      {
        id: 'bk-101',
        scheduledDate: `${today}T08:30:00.000Z`,
        customerName: 'Nguyễn Minh Hoàng',
        customerPhone: '0919 384 215',
        customerEmail: 'hoang.nguyen@gmail.com',
        address: '128 Nguyễn Văn Cừ, P. An Hòa',
        notes: 'Máy lạnh Daikin Inverter 1.5HP kém lạnh, cần vệ sinh và kiểm tra gas.',
        status: 'CONFIRMED',
        createdAt: `${today}T07:15:00.000Z`,
        service: { name: 'Vệ sinh & Bơm gas máy lạnh' },
        location: { name: 'Ninh Kiều' },
      },
      {
        id: 'bk-102',
        scheduledDate: `${today}T10:00:00.000Z`,
        customerName: 'Trần Thị Thu Thảo',
        customerPhone: '0907 612 890',
        customerEmail: 'thuthao.ct@gmail.com',
        address: 'KDC Hưng Phú 1, Đường B2',
        notes: 'Máy lạnh chảy nước ở dàn lạnh trong phòng ngủ.',
        status: 'IN_PROGRESS',
        createdAt: `${today}T08:05:00.000Z`,
        service: { name: 'Sửa chữa máy lạnh' },
        location: { name: 'Cái Răng' },
      },
      {
        id: 'bk-103',
        scheduledDate: `${today}T14:00:00.000Z`,
        customerName: 'Lê Quốc Tuấn',
        customerPhone: '0939 551 740',
        customerEmail: null,
        address: '45 Lê Hồng Phong, P. Trà An',
        notes: 'Kiểm tra tủ lạnh Samsung Side-by-Side không đông đá.',
        status: 'PENDING',
        createdAt: `${today}T09:20:00.000Z`,
        service: { name: 'Sửa chữa tủ lạnh' },
        location: { name: 'Bình Thủy' },
      },
      {
        id: 'bk-104',
        scheduledDate: `${today}T16:00:00.000Z`,
        customerName: 'Phạm Gia Huy',
        customerPhone: '0988 403 119',
        customerEmail: null,
        address: '82 Đường 3/2, P. Xuân Khánh',
        notes: 'Vệ sinh máy giặt lồng ngang Electrolux.',
        status: 'COMPLETED',
        createdAt: `${today}T07:45:00.000Z`,
        service: { name: 'Vệ sinh máy giặt' },
        location: { name: 'Ninh Kiều' },
      },
      {
        id: 'bk-105',
        scheduledDate: `${tomorrow}T09:00:00.000Z`,
        customerName: 'Võ Thanh Tùng',
        customerPhone: '0918 220 645',
        customerEmail: null,
        address: '214 Cách Mạng Tháng 8, P. Bùi Hữu Nghĩa',
        notes: 'Tháo lắp di dời 2 bộ máy lạnh Panasonic sang nhà mới.',
        status: 'PENDING',
        createdAt: `${today}T10:12:00.000Z`,
        service: { name: 'Tháo lắp máy lạnh' },
        location: { name: 'Bình Thủy' },
      },
      {
        id: 'bk-106',
        scheduledDate: `${in2Days}T14:30:00.000Z`,
        customerName: 'Đặng Ngọc Mai',
        customerPhone: '0945 818 302',
        customerEmail: null,
        address: 'KDC Nam Long, P. Hưng Thạnh',
        notes: 'Bảo dưỡng định kỳ 3 máy lạnh gia đình.',
        status: 'CONFIRMED',
        createdAt: `${today}T11:00:00.000Z`,
        service: { name: 'Vệ sinh máy lạnh' },
        location: { name: 'Cái Răng' },
      },
      {
        id: 'bk-107',
        scheduledDate: `${in4Days}T08:30:00.000Z`,
        customerName: 'Huỳnh Văn Khánh',
        customerPhone: '0972 194 508',
        customerEmail: null,
        address: '36 Mậu Thân, P. An Nghiệp',
        notes: 'Kiểm tra máy nước nóng trực tiếp không nóng.',
        status: 'PENDING',
        createdAt: `${today}T11:30:00.000Z`,
        service: { name: 'Sửa máy nước nóng lạnh' },
        location: { name: 'Ninh Kiều' },
      },
    ];

    const days = [
      {
        date: today,
        activeCount: 4,
        cancelledCount: 0,
        statusCounts: { PENDING: 1, CONFIRMED: 1, IN_PROGRESS: 1, COMPLETED: 1, CANCELLED: 0 },
      },
      {
        date: tomorrow,
        activeCount: 1,
        cancelledCount: 0,
        statusCounts: { PENDING: 1, CONFIRMED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0 },
      },
      {
        date: in2Days,
        activeCount: 1,
        cancelledCount: 0,
        statusCounts: { PENDING: 0, CONFIRMED: 1, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0 },
      },
      {
        date: in4Days,
        activeCount: 1,
        cancelledCount: 0,
        statusCounts: { PENDING: 1, CONFIRMED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0 },
      },
    ];

    return {
      from: addDaysIso(today, -7),
      to: addDaysIso(today, 28),
      days,
      bookings: sampleBookings,
    };
  }

  if (url.includes('/admin/services')) {
    const items = SERVICES.map((svc, index) => ({
      id: `svc-${index + 1}`,
      name: svc.name,
      slug: svc.slug,
      summary: svc.shortDescription,
      description: svc.description,
      imageUrl: svc.image,
      imageAlt: svc.name,
      displayOrder: index + 1,
      isActive: true,
      updatedAt: `${today}T08:00:00.000Z`,
    }));
    return { items, total: items.length };
  }

  if (url.includes('/admin/categories')) {
    const items = BLOG_CATEGORIES.map((cat, index) => ({
      id: `cat-${index + 1}`,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      updatedAt: `${today}T08:00:00.000Z`,
    }));
    return { items, total: items.length };
  }

  if (url.includes('/admin/blog')) {
    const items = BLOG_POSTS.map((post, index) => {
      const cat = BLOG_CATEGORIES.find((c) => c.slug === post.category);
      const cover = getBlogPostImage(post.slug, post.image);
      return {
        id: `post-${index + 1}`,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.sections.map((s) => `${s.heading}\n${s.body}`).join('\n\n'),
        status: 'PUBLISHED',
        category: { name: cat?.name ?? 'Kinh nghiệm điện lạnh' },
        featuredImage: { url: cover, altText: post.title },
        publishedAt: `${post.publishedAt}T08:00:00.000Z`,
        updatedAt: `${today}T08:30:00.000Z`,
      };
    });
    return { items, total: items.length };
  }

  if (url.includes('/admin/faqs')) {
    const items = FAQS.map((faq, index) => ({
      id: `faq-${index + 1}`,
      question: faq.question,
      answer: faq.answer,
      serviceId: faq.category || 'general',
      blogPostId: '',
      isActive: true,
      updatedAt: `${today}T08:00:00.000Z`,
    }));
    return { items, total: items.length };
  }

  if (url.includes('/admin/history')) {
    const items = [
      {
        id: 'hist-1',
        action: 'UPDATE',
        resource: 'bookings',
        recordId: 'bk-102',
        actorEmail: 'admin@dienlanhminhnhat.vn',
        beforeSnapshot: { customerName: 'Trần Thị Thu Thảo', status: 'CONFIRMED' },
        afterSnapshot: { customerName: 'Trần Thị Thu Thảo', status: 'IN_PROGRESS' },
        revertedAt: null,
        createdAt: `${today}T09:15:00.000Z`,
      },
      {
        id: 'hist-2',
        action: 'UPDATE',
        resource: 'services',
        recordId: 'svc-1',
        actorEmail: 'admin@dienlanhminhnhat.vn',
        beforeSnapshot: { name: 'Vệ sinh máy lạnh', summary: 'Vệ sinh dàn nóng và dàn lạnh.' },
        afterSnapshot: {
          name: 'Vệ sinh máy lạnh',
          summary: 'Làm sạch dàn nóng, dàn lạnh và lưới lọc. Kiểm tra đường thoát nước sau khi vệ sinh.',
        },
        revertedAt: null,
        createdAt: `${today}T08:20:00.000Z`,
      },
    ];
    return { items, total: items.length };
  }

  if (url.includes('/admin/')) {
    return { items: [], total: 0 };
  }

  return null;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackData = buildPreviewFallback(error?.config);
    if (fallbackData !== null) {
      return Promise.resolve({
        data: fallbackData,
        status: 200,
        statusText: 'OK (Aurora Preview Fallback)',
        headers: {},
        config: error.config,
      } as AxiosResponse);
    }
    return Promise.reject(error);
  },
);
