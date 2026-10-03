import { AirVent, Refrigerator, WashingMachine, Waves, Wind } from 'lucide-react';

export const homeServices = [
  {
    title: 'Sửa chữa máy lạnh',
    description: 'Khắc phục nhanh các lỗi, làm lạnh kém, chảy nước...',
    image: '/images/home-reference/air.webp',
    href: '/services/sua-may-lanh',
    icon: Wind,
  },
  {
    title: 'Lắp đặt máy lạnh',
    description: 'Tư vấn vị trí, lắp đặt chuẩn kỹ thuật, an toàn, thẩm mỹ.',
    image: '/images/home-reference/install.webp',
    href: '/services/thao-lap-may-lanh',
    icon: AirVent,
  },
  {
    title: 'Vệ sinh máy lạnh',
    description: 'Làm sạch sâu, tiết kiệm điện, nâng cao tuổi thọ.',
    image: '/images/home-reference/clean.webp',
    href: '/services/ve-sinh-may-lanh',
    icon: Waves,
  },
  {
    title: 'Sửa chữa máy giặt',
    description: 'Xử lý các lỗi, không vắt, không cấp nước, báo lỗi...',
    image: '/images/home-reference/washer.webp',
    href: '/services/sua-may-giat',
    icon: WashingMachine,
  },
  {
    title: 'Sửa chữa tủ lạnh',
    description: 'Khắc phục các lỗi, không lạnh, chảy nước, kêu to...',
    image: '/images/home-reference/fridge.webp',
    href: '/services/sua-tu-lanh',
    icon: Refrigerator,
  },
];
export const workflow = [
  { number: '01', title: 'Tiếp nhận yêu cầu', description: 'Qua điện thoại, Zalo hoặc website' },
  {
    number: '02',
    title: 'Kiểm tra & tư vấn',
    description: 'Kỹ thuật viên khảo sát, báo tình trạng',
  },
  {
    number: '03',
    title: 'Thực hiện dịch vụ',
    description: 'Sửa chữa, lắp đặt, vệ sinh theo yêu cầu',
  },
  {
    number: '04',
    title: 'Nghiệm thu & bàn giao',
    description: 'Kiểm tra hoạt động, hướng dẫn sử dụng',
  },
];
export const galleryImages = [
  {
    src: '/images/home-reference/gallery-repair.webp',
    alt: 'Kỹ thuật viên lắp đặt máy lạnh tại Cần Thơ',
  },
  { src: '/images/home-reference/clean.webp', alt: 'Vệ sinh và bảo dưỡng máy lạnh' },
  { src: '/images/home-reference/washer.webp', alt: 'Máy giặt sau khi được kiểm tra và bảo dưỡng' },
  {
    src: '/images/home-reference/technician.webp',
    alt: 'Kỹ thuật viên kiểm tra dàn nóng máy lạnh',
  },
  { src: '/images/home-reference/fridge.webp', alt: 'Tủ lạnh trong không gian bếp gia đình' },
];
