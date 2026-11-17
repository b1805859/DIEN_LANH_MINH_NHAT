import { SERVICES } from '@minhnhat/shared';
import serviceImages from '@minhnhat/shared/service-images.json';
import { integrationSettings } from '@/lib/integrations/settings';

// Central replacement point. Generated photographs are illustrative, not actual staff/work.
// Never publish the mockup's 5+, 1000+, 98% claims until the business verifies them.
export const siteContent = {
  phone: integrationSettings.phone,
  phoneDisplay: integrationSettings.phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3'),
  phoneHref: `tel:${integrationSettings.phone.replace(/\s/g, '')}`,
  zalo: integrationSettings.zaloUrl,
  address: integrationSettings.address,
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || '',
  video: process.env.NEXT_PUBLIC_INTRO_VIDEO_URL || '',
  images: {
    hero: '/images/redesign/family-morning.webp',
    carouselMaintenance: '/images/redesign/carousel-maintenance-uniform-v1.webp',
    carouselHomeVisitsAlbum: '/images/redesign/carousel-home-visits-album-v2.webp',
    technician: '/images/redesign/technician-uniform-v1.webp',
    panorama: '/images/redesign/can-tho-night-realism-v2.webp',
    services: '/images/redesign/services-banner-uniform-v1.webp',
    contact: '/images/redesign/contact-home-visit-uniform-v1.webp',
    booking: '/images/diverse/tools-flatlay.webp',
    editorial: '/images/redesign/editorial-night.webp',
    team: '/images/redesign/team-uniform-v1.webp',
    support: '/images/redesign/support-uniform-v1.webp',
  },
  assetStatus:
    'AI-generated illustrative photography; replace with approved originals when available',
  verifiedMetrics: null,
  // Mockup metrics are placeholders, never rendered as verified business claims.
  pendingMetrics: { years: '5+', customers: '1000+', satisfaction: '98%', verified: false },
  aboutFacts: [
    { value: String(SERVICES.length), label: 'nhóm dịch vụ' },
    { value: 'Tận nơi', label: 'tại Cần Thơ' },
    { value: 'Báo giá', label: 'trước khi sửa' },
  ],
  areas: [
    { name: 'Ninh Kiều', slug: 'ninh-kieu' },
    { name: 'Bình Thủy', slug: 'binh-thuy' },
    { name: 'Cái Răng', slug: 'cai-rang' },
    { name: 'Ô Môn', slug: 'o-mon' },
    { name: 'Thốt Nốt', slug: null },
    { name: 'Phong Điền', slug: null },
    { name: 'Vĩnh Thạnh', slug: null },
    { name: 'Cờ Đỏ', slug: null },
  ],
};

const details: Record<string, { title: string; description: string; icon: string }> = {
  'sua-may-lanh': {
    title: 'Sửa chữa máy lạnh',
    description:
      'Kiểm tra máy không lạnh, chảy nước, báo lỗi. Tư vấn rõ nguyên nhân trước khi sửa.',
    icon: 'snowflake',
  },
  've-sinh-may-lanh': {
    title: 'Vệ sinh máy lạnh',
    description: 'Làm sạch dàn nóng, dàn lạnh và lưới lọc. Kiểm tra đường thoát nước sau khi vệ sinh.',
    icon: 'wind',
  },
  'thao-di-doi-may-lanh': {
    title: 'Tháo dỡ, di dời máy lạnh',
    description:
      'Tháo máy khi chuyển nhà, chuyển phòng hoặc trả mặt bằng. Khảo sát đường ống, bảo vệ thiết bị và thống nhất phương án di dời.',
    icon: 'airvent',
  },
  'lap-dat-may-lanh': {
    title: 'Lắp đặt máy lạnh',
    description:
      'Lắp máy mới hoặc lắp lại máy đã sử dụng. Khảo sát vị trí, đường ống, nguồn điện và chạy thử trước bàn giao.',
    icon: 'airvent',
  },
  'sua-may-giat': {
    title: 'Sửa chữa máy giặt',
    description: 'Kiểm tra lỗi không vắt, không xả, rung và tiếng ồn. Hỗ trợ ngay tại nhà.',
    icon: 'washer',
  },
  'sua-tu-lanh': {
    title: 'Sửa chữa tủ lạnh',
    description: 'Xử lý yếu lạnh, không đông đá, rò nước và tiếng ồn bất thường.',
    icon: 'fridge',
  },
  'sua-dien-nuoc': {
    title: 'Điện nước dân dụng',
    description: 'Kiểm tra điện nước trong nhà, sửa chỗ rò rỉ, thay vòi, van, ổ cắm và công tắc.',
    icon: 'plug',
  },
  've-sinh-may-giat': {
    title: 'Vệ sinh máy giặt',
    description: 'Làm sạch lồng giặt, lọc cặn và đường nước, hạn chế mùi và cặn bám.',
    icon: 'washer',
  },
  'sua-lap-may-nuoc-uong-nong-lanh': {
    title: 'Máy nước uống nóng lạnh',
    description: 'Sửa chữa, lắp đặt và kiểm tra chức năng làm nóng, làm lạnh, đường nước.',
    icon: 'droplet',
  },
  'sua-lap-may-nuoc-nong-lanh-tam': {
    title: 'Máy nước nóng lạnh tắm',
    description: 'Kiểm tra nguồn điện, áp lực nước và thiết bị chống giật trước khi bàn giao.',
    icon: 'shield',
  },
};
const order = [
  'sua-may-lanh',
  've-sinh-may-lanh',
  'sua-may-giat',
  'sua-tu-lanh',
  'sua-dien-nuoc',
  'thao-di-doi-may-lanh',
  'lap-dat-may-lanh',
  've-sinh-may-giat',
  'sua-lap-may-nuoc-uong-nong-lanh',
  'sua-lap-may-nuoc-nong-lanh-tam',
] as const;
export type ServiceImage = {
  src: string;
  alt: string;
  heroPosition: string;
  heroInset?: boolean;
  cardPosition: string;
  detail?: { src: string; caption: string };
};

const images: Record<(typeof SERVICES)[number]['slug'], ServiceImage> = serviceImages;

export const serviceCards = order.map((slug) => ({
  ...SERVICES.find((s) => s.slug === slug)!,
  ...details[slug],
  imagery: images[slug],
}));
// Demo projects are explicitly labelled in the public UI; no invented clients or completion claims.
export const projects = [
  {
    slug: 'lap-dat-may-lanh-ninh-kieu',
    title: 'Lắp đặt máy lạnh tại nhà phố',
    area: 'Ninh Kiều, Cần Thơ',
    category: 'may-lanh',
    image: '/images/diverse/proj-ninh-kieu-living-ac.webp',
    description:
      'Minh họa lắp máy lạnh tại nhà phố: chọn vị trí, đi đường ống và chạy thử máy.',
  },
  {
    slug: 'sua-tu-lanh-binh-thuy',
    title: 'Kiểm tra và sửa chữa tủ lạnh',
    area: 'Bình Thủy, Cần Thơ',
    category: 'tu-lanh',
    image: '/images/diverse/proj-fridge-compressor-screwdriver.webp',
    description:
      'Minh họa quy trình kiểm tra khả năng làm lạnh, đường điện và linh kiện của tủ lạnh gia đình.',
  },
  {
    slug: 've-sinh-may-giat-cai-rang',
    title: 'Vệ sinh máy giặt cửa trước',
    area: 'Cái Răng, Cần Thơ',
    category: 'may-giat',
    image: '/images/diverse/apartment-laundry-visit.webp',
    description:
      'Minh họa vệ sinh lồng giặt, làm sạch lọc cặn và chạy thử máy.',
  },
  {
    slug: 'dien-nuoc-nha-pho',
    title: 'Thi công điện nước gia đình',
    area: 'Phong Điền, Cần Thơ',
    category: 'dien-nuoc',
    image: '/images/diverse/tools-flatlay.webp',
    description:
      'Minh họa kiểm tra đường nước và sửa chỗ rò rỉ trong nhà.',
  },
];
export const processSteps = [
  ['Nhận yêu cầu', 'Bạn cho biết máy bị lỗi gì và địa chỉ cần đến.'],
  ['Đến kiểm tra', 'Thợ kiểm tra máy, tìm nguyên nhân gây lỗi.'],
  ['Báo giá', 'Trao đổi cách sửa và chi phí để bạn quyết định.'],
  ['Sửa và chạy thử', 'Làm phần việc đã thống nhất rồi chạy thử máy.'],
  ['Hướng dẫn sau sửa', 'Trao đổi cách sử dụng và bảo hành theo phần việc.'],
];

export const blogPostCovers: Record<string, string> = {
  'bao-lau-nen-ve-sinh-may-lanh-mot-lan': '/images/diverse/blog-ac-pressure-wash-bag.webp',
  'dau-hieu-may-lanh-can-nap-gas': '/images/diverse/ac-condenser-gauges-macro.webp',
  'may-lanh-khong-lanh-nguyen-nhan-do-dau': '/images/redesign/chay-thu-may-lanh-uniform-v1.webp',
  'may-lanh-chay-nuoc-phai-lam-sao': '/images/diverse/ac-drain-pan-macro.webp',
  'cac-loi-thuong-gap-o-tu-lanh': '/images/diverse/blog-fridge-freezer-frost.webp',
  'khi-nao-can-ve-sinh-may-giat': '/images/diverse/blog-washer-detergent-tray.webp',
  'meo-tiet-kiem-dien-khi-su-dung-may-lanh': '/images/diverse/blog-ac-energy-curtain.webp',
};

export function getBlogPostImage(slug: string, fallback: string) {
  return blogPostCovers[slug] || fallback;
}
