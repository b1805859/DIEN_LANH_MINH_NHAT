import { SERVICES } from '@minhnhat/shared';
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
    carouselMaintenance: '/images/redesign/carousel-maintenance.webp',
    carouselHomeVisitsAlbum: '/images/redesign/carousel-home-visits-album-v2.webp',
    technician: '/images/redesign/technician.webp',
    panorama: '/images/redesign/can-tho-night-realism-v2.webp',
    services: '/images/redesign/services-banner.webp',
    contact: '/images/redesign/contact-interior.webp',
    editorial: '/images/redesign/editorial-night.webp',
    team: '/images/redesign/team.webp?v=20261015-realism',
    support: '/images/redesign/support.webp',
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
  'thao-lap-may-lanh': {
    title: 'Lắp đặt máy lạnh',
    description:
      'Khảo sát vị trí, tháo lắp và di dời thiết bị. Thi công gọn gàng, chạy thử trước bàn giao.',
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
  'nap-gas-may-lanh': {
    title: 'Nạp gas máy lạnh',
    description: 'Đo áp suất và kiểm tra rò rỉ. Báo loại gas và chi phí trước khi nạp.',
    icon: 'gauge',
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
  'thao-lap-may-lanh',
  'nap-gas-may-lanh',
  've-sinh-may-giat',
  'sua-lap-may-nuoc-uong-nong-lanh',
  'sua-lap-may-nuoc-nong-lanh-tam',
];
const revisedServiceImages = new Set([
  'nap-gas-may-lanh',
  'sua-lap-may-nuoc-nong-lanh-tam',
]);
export const serviceCards = order.map((slug) => ({
  ...SERVICES.find((s) => s.slug === slug)!,
  ...details[slug],
  image: slug === 'sua-may-lanh'
    ? '/images/redesign/sua-may-lanh-realism-v2.webp'
    : `/images/redesign/${slug}.webp${revisedServiceImages.has(slug) ? '?v=20261015-realism' : ''}`,
}));
// Demo projects are explicitly labelled in the public UI; no invented clients or completion claims.
export const projects = [
  {
    slug: 'lap-dat-may-lanh-ninh-kieu',
    title: 'Lắp đặt máy lạnh tại nhà phố',
    area: 'Ninh Kiều, Cần Thơ',
    category: 'may-lanh',
    image: '/images/redesign/thao-lap-may-lanh.webp',
    description:
      'Minh họa lắp máy lạnh tại nhà phố: chọn vị trí, đi đường ống và chạy thử máy.',
  },
  {
    slug: 'sua-tu-lanh-binh-thuy',
    title: 'Kiểm tra và sửa chữa tủ lạnh',
    area: 'Bình Thủy, Cần Thơ',
    category: 'tu-lanh',
    image: '/images/redesign/sua-tu-lanh.webp',
    description:
      'Minh họa quy trình kiểm tra khả năng làm lạnh, đường điện và linh kiện của tủ lạnh gia đình.',
  },
  {
    slug: 've-sinh-may-giat-cai-rang',
    title: 'Vệ sinh máy giặt cửa trước',
    area: 'Cái Răng, Cần Thơ',
    category: 'may-giat',
    image: '/images/redesign/ve-sinh-may-giat.webp',
    description:
      'Minh họa vệ sinh lồng giặt, làm sạch lọc cặn và chạy thử máy.',
  },
  {
    slug: 'dien-nuoc-nha-pho',
    title: 'Thi công điện nước gia đình',
    area: 'Phong Điền, Cần Thơ',
    category: 'dien-nuoc',
    image: '/images/redesign/sua-dien-nuoc.webp',
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
