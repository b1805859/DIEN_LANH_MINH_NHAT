export const areas = [
  {
    slug: 'ninh-kieu',
    title: 'Quận Ninh Kiều',
    description: 'Dịch vụ nhanh chóng,\nphục vụ tận nơi',
  },
  { slug: 'binh-thuy', title: 'Quận Bình Thủy', description: 'Hỗ trợ sửa chữa, lắp đặt\ntận nơi' },
  {
    slug: 'cai-rang',
    title: 'Quận Cái Răng',
    description: 'Phục vụ toàn khu vực,\ntận tâm, chu đáo',
  },
  {
    slug: 'o-mon',
    title: 'Quận Ô Môn',
    description: 'Sửa chữa, vệ sinh, bảo trì\nuy tín, chuyên nghiệp',
  },
  { slug: 'thot-not', title: 'Quận Thốt Nốt', description: 'Hỗ trợ kỹ thuật tận nơi\ncác phường' },
  { slug: 'phong-dien', title: 'Huyện Phong Điền', description: 'Dịch vụ tận nơi, phương án rõ ràng' },
  {
    slug: 'thoi-lai',
    title: 'Huyện Thới Lai',
    description: 'Đáp ứng nhanh mọi nhu cầu\nđiện lạnh',
  },
  {
    slug: 'vinh-thanh',
    title: 'Huyện Vĩnh Thạnh',
    description: 'Phục vụ tận nơi, bảo hành\ndài hạn',
  },
] as const;

export const nearbyAreas = [
  'Hậu Giang',
  'Kiên Giang',
  'Sóc Trăng',
  'Vĩnh Long',
  'Đồng Tháp',
  'An Giang',
];

export const normalizeArea = (value: string) =>
  value
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
