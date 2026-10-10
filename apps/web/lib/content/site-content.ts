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
    technician: '/images/redesign/technician.webp',
    panorama: '/images/redesign/can-tho-night.webp',
    services: '/images/redesign/services-banner.webp',
    contact: '/images/redesign/contact-interior.webp',
    editorial: '/images/redesign/editorial-night.webp',
    team: '/images/redesign/team.webp',
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
    { value: 'Rõ ràng', label: 'từ tư vấn đến bàn giao' },
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
    description: 'Làm sạch dàn nóng, dàn lạnh và lưới lọc. Cho không khí trong lành, mát dễ chịu.',
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
    description: 'Kiểm tra điện nước gia đình, xử lý rò rỉ và thay thế thiết bị phù hợp.',
    icon: 'plug',
  },
  'nap-gas-may-lanh': {
    title: 'Nạp gas máy lạnh',
    description: 'Đo áp suất, kiểm tra rò rỉ và tư vấn lượng gas phù hợp với thiết bị.',
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
export const serviceCards = order.map((slug) => ({
  ...SERVICES.find((s) => s.slug === slug)!,
  ...details[slug],
  image: `/images/redesign/${slug}.webp`,
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
      'Minh họa phương án lắp đặt máy lạnh trong không gian nhà phố, đi đường ống gọn và kiểm tra vận hành.',
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
      'Minh họa vệ sinh lồng giặt, kiểm tra lọc cặn và chạy thử chu trình trước khi bàn giao.',
  },
  {
    slug: 'dien-nuoc-nha-pho',
    title: 'Thi công điện nước gia đình',
    area: 'Phong Điền, Cần Thơ',
    category: 'dien-nuoc',
    image: '/images/redesign/sua-dien-nuoc.webp',
    description:
      'Minh họa kiểm tra đường nước, xử lý rò rỉ và sắp xếp thiết bị cho không gian gia đình.',
  },
];
export const processSteps = [
  ['Tiếp nhận thông tin', 'Lắng nghe nhu cầu, ghi nhận tình trạng thiết bị.'],
  ['Kiểm tra tận nơi', 'Xác định nguyên nhân và phương án phù hợp.'],
  ['Báo giá rõ ràng', 'Thống nhất công việc và chi phí trước khi sửa.'],
  ['Thi công nhanh chóng', 'Thực hiện cẩn thận, chạy thử và bàn giao.'],
  ['Hỗ trợ sau dịch vụ', 'Hướng dẫn sử dụng và trao đổi bảo hành cụ thể.'],
];
