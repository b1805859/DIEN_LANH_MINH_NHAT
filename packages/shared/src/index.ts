import type { FaqItem } from './seo-content';

export * from './seo-content';

export const APP_NAME = 'Điện Lạnh Minh Nhật';

export const ASCII_APP_NAME = 'DIEN LANH MINH NHAT';

export const TARGET_CITY = 'Cần Thơ';

export const BUSINESS = {
  name: APP_NAME,
  phone: '0939370109',
  address: 'Cần Thơ, Việt Nam',
  zaloUrl: 'https://zalo.me/0939370109',
  googleMapsUrl: '',
  googleMapsEmbedUrl: '',
};

export const PRIORITY_DISTRICTS = [
  {
    name: 'Phường Ninh Kiều',
    shortName: 'Ninh Kiều',
    slug: 'ninh-kieu',
    image: '/images/wards/ninh-kieu-dai-lo-hoa-binh.jpg',
    highlight: 'Trung tâm Ninh Kiều',
  },
  {
    name: 'Phường Cái Răng',
    shortName: 'Cái Răng',
    slug: 'cai-rang',
    image: '/images/wards/cai-rang-cong-chao.jpg',
    highlight: 'Cổng chào và khu dân cư Cái Răng',
  },
  {
    name: 'Phường Bình Thủy',
    shortName: 'Bình Thủy',
    slug: 'binh-thuy',
    image: '/images/wards/binh-thuy-stella-mega-city.jpg',
    highlight: 'Khu đô thị Bình Thủy',
  },
  {
    name: 'Phường Ô Môn',
    shortName: 'Ô Môn',
    slug: 'o-mon',
    image: '/images/wards/o-mon-do-thi.jpg',
    highlight: 'Trung tâm Ô Môn',
  },
  {
    name: 'Phường Thốt Nốt',
    shortName: 'Thốt Nốt',
    slug: 'thot-not',
    image: '',
    highlight: 'Thốt Nốt, Cần Thơ',
  },
] as const;

export const SERVICES = [
  { name: 'Tháo Lắp Máy Lạnh', slug: 'thao-lap-may-lanh' },
  { name: 'Vệ Sinh Máy Lạnh', slug: 've-sinh-may-lanh' },
  { name: 'Sửa Máy Lạnh', slug: 'sua-may-lanh' },
  { name: 'Nạp Gas Máy Lạnh', slug: 'nap-gas-may-lanh' },
  { name: 'Sửa Tủ Lạnh', slug: 'sua-tu-lanh' },
  { name: 'Sửa Máy Giặt', slug: 'sua-may-giat' },
  { name: 'Vệ Sinh Máy Giặt', slug: 've-sinh-may-giat' },
  { name: 'Sửa Chữa Điện Nước', slug: 'sua-dien-nuoc' },
  { name: 'Sửa Lắp Máy Nước Uống Nóng Lạnh', slug: 'sua-lap-may-nuoc-uong-nong-lanh' },
  { name: 'Sửa Lắp Máy Nước Nóng Lạnh Tắm', slug: 'sua-lap-may-nuoc-nong-lanh-tam' },
] as const;

export const BLOG_CATEGORIES = [
  { name: 'Máy Lạnh', slug: 'may-lanh' },
  { name: 'Máy Giặt', slug: 'may-giat' },
  { name: 'Tủ Lạnh', slug: 'tu-lanh' },
  { name: 'Điện Nước', slug: 'dien-nuoc' },
  { name: 'Tiết Kiệm Điện', slug: 'tiet-kiem-dien' },
] as const;

export const BLOG_POSTS = [
  {
    title: 'Bao lâu nên vệ sinh máy lạnh một lần?',
    slug: 'bao-lau-nen-ve-sinh-may-lanh-mot-lan',
    category: 'may-lanh',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt:
      'Mốc thời gian vệ sinh máy lạnh phù hợp cho gia đình, phòng trọ và cửa hàng sử dụng thường xuyên.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Dấu hiệu máy lạnh cần nạp gas',
    slug: 'dau-hieu-may-lanh-can-nap-gas',
    category: 'may-lanh',
    image: '/images/services/nap-gas-may-lanh.jpg',
    excerpt:
      'Nhận biết biểu hiện máy lạnh có thể thiếu gas, bước kiểm tra ban đầu và thời điểm nên gọi kỹ thuật viên tại Cần Thơ.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Máy lạnh không lạnh nguyên nhân do đâu?',
    slug: 'may-lanh-khong-lanh-nguyen-nhan-do-dau',
    category: 'may-lanh',
    image: '/images/services/sua-may-lanh.jpg',
    excerpt:
      'Tổng hợp nguyên nhân khiến máy lạnh vẫn chạy nhưng không mát, cách kiểm tra ban đầu và hướng xử lý an toàn tại nhà.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Máy lạnh chảy nước phải làm sao?',
    slug: 'may-lanh-chay-nuoc-phai-lam-sao',
    category: 'may-lanh',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt:
      'Nhận biết nguyên nhân máy lạnh rò nước, nghẹt ống thoát và các bước xử lý ban đầu an toàn trước khi gọi thợ.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Các lỗi thường gặp ở tủ lạnh',
    slug: 'cac-loi-thuong-gap-o-tu-lanh',
    category: 'tu-lanh',
    image: '/images/services/sua-tu-lanh.jpg',
    excerpt:
      'Nhận biết các lỗi tủ lạnh thường gặp như yếu lạnh, đóng tuyết, rò nước, tiếng ồn bất thường và cách xử lý ban đầu.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Khi nào cần vệ sinh máy giặt?',
    slug: 'khi-nao-can-ve-sinh-may-giat',
    category: 'may-giat',
    image: '/images/services/ve-sinh-may-giat.jpg',
    excerpt:
      'Các dấu hiệu lồng giặt bám cặn, có mùi và cách chọn lịch vệ sinh phù hợp để máy hoạt động ổn định, quần áo sạch hơn.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
  {
    title: 'Mẹo tiết kiệm điện khi sử dụng máy lạnh',
    slug: 'meo-tiet-kiem-dien-khi-su-dung-may-lanh',
    category: 'tiet-kiem-dien',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt:
      'Cách cài đặt nhiệt độ, vệ sinh định kỳ và sử dụng máy lạnh hợp lý để giảm hao điện mà vẫn giữ phòng thoải mái.',
    publishedAt: '2026-07-23',
    updatedAt: '2026-07-23',
  },
] as const;

export const FAQS: readonly FaqItem[] = [
  {
    question: 'Bao lâu nên vệ sinh máy lạnh?',
    answer: 'Gia đình nên vệ sinh máy lạnh mỗi 3 đến 6 tháng tùy tần suất sử dụng.',
  },
  {
    question: 'Có báo giá trước khi sửa không?',
    answer: 'Có. Kỹ thuật viên kiểm tra, tư vấn nguyên nhân và báo giá trước khi thực hiện.',
  },
  {
    question: 'Khu vực nào được hỗ trợ nhanh?',
    answer:
      'Ưu tiên các phường Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn và các khu vực lân cận tại Cần Thơ.',
  },
  {
    question: 'Cần gửi thông tin gì khi đặt lịch?',
    answer:
      'Nên gửi loại thiết bị, model nếu có, biểu hiện đang gặp, địa chỉ cụ thể và hình ảnh hoặc mã lỗi. Thông tin càng rõ thì bước xác nhận nhu cầu càng thuận tiện.',
  },
  {
    question: 'Có nên tiếp tục sử dụng thiết bị đang có mùi khét hoặc rò điện?',
    answer:
      'Không. Hãy dừng sử dụng, ngắt nguồn ở vị trí an toàn và tránh chạm vào thiết bị khi tay hoặc nền đang ướt.',
  },
  {
    question: 'Máy lạnh yếu có phải luôn cần nạp gas không?',
    answer:
      'Không. Bụi bẩn, quạt, cảm biến, dàn nóng hoặc cài đặt cũng có thể làm máy yếu lạnh. Cần kiểm tra trước khi kết luận thiếu gas.',
  },
  {
    question: 'Nên sửa hay thay thiết bị mới?',
    answer:
      'Quyết định phụ thuộc vào nguyên nhân, tình trạng tổng thể, khả năng có linh kiện phù hợp và chi phí dự kiến. Nên kiểm tra hiện trạng rồi so sánh phương án trước khi quyết định.',
  },
  {
    question: 'Khách hàng cần chuẩn bị gì trước khi kỹ thuật viên đến?',
    answer:
      'Nên dọn khoảng trống quanh thiết bị, giữ lại mã lỗi hoặc hình ảnh biểu hiện và thông báo trước nếu vị trí ở cao, khó tiếp cận hoặc có quy định ra vào.',
  },
];

export function findService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

export function findDistrict(slug: string) {
  return PRIORITY_DISTRICTS.find((district) => district.slug === slug);
}

export function findBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
