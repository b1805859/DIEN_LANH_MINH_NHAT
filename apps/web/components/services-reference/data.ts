import {
  Droplet,
  CircleGauge,
  Refrigerator,
  Settings,
  ShowerHead,
  Snowflake,
  Sparkles,
  createLucideIcon,
} from 'lucide-react';

const CrossedTools = createLucideIcon('CrossedTools', [
  ['path', { d: 'm14 7 3-3 2-1 2 2-1 2-3 3-3-3ZM14 10l-3 3M8.5 15.5l-4 4', key: 'driver' }],
  [
    'path',
    {
      d: 'm12.5 14.5 5.8 5.8a1.4 1.4 0 0 0 2-2L9.8 7.8A4.5 4.5 0 0 0 4.1 2L7 5 5 7 2 4.1a4.5 4.5 0 0 0 5.8 5.7l1.7 1.7',
      key: 'wrench',
    },
  ],
  ['path', { d: 'm7 14 3 3-5 5-3-3 5-5Z', key: 'handle' }],
]);

export const serviceCards = [
  {
    slug: 'thao-lap-may-lanh',
    title: 'Tháo lắp máy lạnh',
    description: 'Lắp đặt, di dời, tháo rời an toàn, đúng kỹ thuật',
    image: 'install',
    icon: Snowflake,
  },
  {
    slug: 've-sinh-may-lanh',
    title: 'Vệ sinh máy lạnh',
    description: 'Làm sạch sâu, tiết kiệm điện',
    image: 'clean-air',
    icon: ShowerHead,
  },
  {
    slug: 'sua-may-lanh',
    title: 'Sửa máy lạnh',
    description: 'Khắc phục mọi lỗi',
    image: 'repair-air',
    icon: CrossedTools,
  },
  {
    slug: 'nap-gas-may-lanh',
    title: 'Nạp gas máy lạnh',
    description: 'Rò rỉ gas, máy lạnh mát kém',
    image: 'gas',
    icon: CircleGauge,
  },
  {
    slug: 'sua-tu-lanh',
    title: 'Sửa tủ lạnh',
    description: 'Không lạnh, kêu to, rò điện',
    image: 'fridge',
    icon: Refrigerator,
  },
  {
    slug: 'sua-may-giat',
    title: 'Sửa máy giặt',
    description: 'Khắc phục mọi sự cố',
    image: 'washer',
    icon: Settings,
  },
  {
    slug: 've-sinh-may-giat',
    title: 'Vệ sinh máy giặt',
    description: 'Sạch sâu, khử mùi hiệu quả',
    image: 'clean-washer',
    icon: Sparkles,
  },
  {
    slug: 'sua-lap-may-nuoc-nong-lanh-tam',
    title: 'Điện nước / Bình nóng lạnh',
    description: 'Sửa chữa, lắp đặt an toàn',
    image: 'water-heater',
    icon: Droplet,
  },
];
