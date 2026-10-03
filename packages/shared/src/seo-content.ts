export type FaqItem = {
  question: string;
  answer: string;
};

export type ServiceContent = {
  shortDescription: string;
  heroDescription: string;
  overview: string[];
  requestSigns: string[];
  workItems: string[];
  beforeVisit: string[];
  faqs: FaqItem[];
};

export type AreaContent = {
  metaDescription: string;
  overview: string[];
  bookingTips: string[];
  serviceNotes: Record<string, string>;
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogArticleContent = {
  lead: string;
  sections: ArticleSection[];
  safetyNote?: string;
  relatedServiceSlugs: string[];
};

const commonFaqs: FaqItem[] = [
  {
    question: 'Có báo giá trước khi thực hiện không?',
    answer:
      'Có. Kỹ thuật viên kiểm tra thực tế, tư vấn phương án và báo chi phí trước khi thực hiện.',
  },
  {
    question: 'Cần chuẩn bị gì trước khi kỹ thuật viên đến?',
    answer:
      'Bạn nên gửi loại thiết bị, biểu hiện lỗi, địa chỉ và khung giờ mong muốn để việc xác nhận lịch thuận tiện hơn.',
  },
];

const serviceSeeds: Record<string, { short: string; signs: string[]; work: string[] }> = {
  'thao-lap-may-lanh': {
    short: 'Tháo lắp và di dời máy lạnh gọn, đúng kỹ thuật tại Cần Thơ.',
    signs: [
      'Cần lắp máy lạnh mới',
      'Chuyển máy sang vị trí khác',
      'Ống đồng hoặc dây điện cần kiểm tra',
    ],
    work: [
      'Khảo sát vị trí và đường ống',
      'Thu hồi gas, tháo lắp an toàn',
      'Chạy thử và kiểm tra thoát nước',
    ],
  },
  've-sinh-may-lanh': {
    short: 'Vệ sinh máy lạnh giúp máy mát đều, giảm mùi và hạn chế chảy nước.',
    signs: ['Máy lạnh có mùi', 'Gió yếu hoặc lạnh kém', 'Dàn lạnh bám bụi, chảy nước'],
    work: ['Xịt rửa dàn lạnh và lưới lọc', 'Vệ sinh dàn nóng', 'Kiểm tra máng và ống thoát nước'],
  },
  'sua-may-lanh': {
    short: 'Kiểm tra và sửa máy lạnh không lạnh, báo lỗi, chảy nước hoặc kêu lớn.',
    signs: [
      'Máy chạy nhưng không mát',
      'Máy báo lỗi hoặc tự ngắt',
      'Máy kêu lớn, rung hoặc chảy nước',
    ],
    work: [
      'Đo điện và thông số vận hành',
      'Kiểm tra dàn nóng, dàn lạnh',
      'Tư vấn phương án và chi phí',
    ],
  },
  'nap-gas-may-lanh': {
    short: 'Đo áp suất, kiểm tra rò rỉ và nạp gas máy lạnh theo đúng tình trạng.',
    signs: [
      'Máy lạnh lạnh yếu',
      'Dàn lạnh bám tuyết bất thường',
      'Máy chạy lâu nhưng phòng không mát',
    ],
    work: ['Đo áp suất và dòng điện', 'Kiểm tra điểm rò rỉ', 'Nạp đúng loại gas và chạy thử'],
  },
  'sua-tu-lanh': {
    short: 'Sửa tủ lạnh yếu lạnh, đóng tuyết, rò nước hoặc phát tiếng ồn bất thường.',
    signs: [
      'Tủ không lạnh hoặc không đông đá',
      'Tủ đóng tuyết nhiều',
      'Tủ chạy liên tục, rò nước hoặc kêu lớn',
    ],
    work: [
      'Kiểm tra block, quạt và cảm biến',
      'Kiểm tra ron cửa và hệ thống xả đá',
      'Chạy thử và hướng dẫn sử dụng',
    ],
  },
  'sua-may-giat': {
    short: 'Sửa máy giặt không vắt, không xả, rung mạnh hoặc hiển thị mã lỗi.',
    signs: [
      'Máy không cấp hoặc xả nước',
      'Máy không vắt, rung mạnh',
      'Máy báo mã lỗi hoặc kêu lớn',
    ],
    work: [
      'Đọc mã lỗi và kiểm tra nguồn',
      'Kiểm tra bơm xả, motor và cảm biến',
      'Chạy thử một chu trình',
    ],
  },
  've-sinh-may-giat': {
    short: 'Vệ sinh lồng giặt giúp giảm cặn bẩn, mùi hôi và bảo vệ quần áo.',
    signs: ['Lồng giặt có mùi', 'Quần áo dính cặn', 'Máy đã lâu chưa được vệ sinh'],
    work: ['Vệ sinh lồng và gioăng cửa', 'Làm sạch khay, lọc cặn', 'Khử mùi và chạy thử'],
  },
  'sua-dien-nuoc': {
    short: 'Hỗ trợ sửa chữa điện nước gia đình, kiểm tra rò rỉ và thiết bị hư hỏng.',
    signs: [
      'Rò nước hoặc tắc đường ống',
      'Ổ điện, công tắc chập chờn',
      'Thiết bị điện nước hoạt động bất thường',
    ],
    work: [
      'Kiểm tra an toàn nguồn điện',
      'Xác định điểm rò hoặc hư hỏng',
      'Thay linh kiện phù hợp và bàn giao',
    ],
  },
  'sua-lap-may-nuoc-uong-nong-lanh': {
    short: 'Sửa lắp máy nước uống nóng lạnh, kiểm tra nguồn nước và khả năng vận hành.',
    signs: ['Máy không nóng hoặc không lạnh', 'Máy rò nước', 'Cần lắp hoặc di dời máy'],
    work: [
      'Kiểm tra nguồn nước và điện',
      'Test nóng lạnh, van và bơm',
      'Lắp đặt chắc chắn, chạy thử',
    ],
  },
  'sua-lap-may-nuoc-nong-lanh-tam': {
    short: 'Sửa lắp máy nước nóng lạnh tắm, ưu tiên kiểm tra chống giật và nguồn nước.',
    signs: [
      'Máy không làm nóng',
      'Nước yếu hoặc nhiệt độ không ổn định',
      'Thiết bị báo lỗi hoặc rò điện',
    ],
    work: [
      'Kiểm tra chống giật và dây nguồn',
      'Kiểm tra áp lực nước',
      'Lắp đặt, chạy thử và hướng dẫn',
    ],
  },
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = Object.fromEntries(
  Object.entries(serviceSeeds).map(([slug, seed]) => [
    slug,
    {
      shortDescription: seed.short,
      heroDescription: `${seed.short} Kỹ thuật viên kiểm tra hiện trạng và tư vấn phương án phù hợp trước khi làm.`,
      overview: [
        seed.short,
        'Minh Nhật tiếp nhận thông tin thiết bị, khu vực và thời gian mong muốn để sắp xếp kỹ thuật viên phù hợp. Chi phí được trao đổi rõ trước khi thực hiện.',
      ],
      requestSigns: seed.signs,
      workItems: seed.work,
      beforeVisit: [
        'Gửi model hoặc hình ảnh thiết bị nếu có.',
        'Dọn khoảng trống quanh khu vực cần kiểm tra.',
      ],
      faqs: commonFaqs,
    } satisfies ServiceContent,
  ]),
);

export const AREA_CONTENT: Record<string, AreaContent> = Object.fromEntries(
  [
    ['ninh-kieu', 'Ninh Kiều'],
    ['cai-rang', 'Cái Răng'],
    ['binh-thuy', 'Bình Thủy'],
    ['o-mon', 'Ô Môn'],
    ['thot-not', 'Thốt Nốt'],
  ].map(([slug, name]) => [
    slug,
    {
      metaDescription: `Dịch vụ điện lạnh tận nơi tại phường ${name}, Cần Thơ. Đặt lịch sửa chữa, vệ sinh và lắp đặt, báo giá rõ trước khi thực hiện.`,
      overview: [
        `Minh Nhật nhận lịch sửa chữa, vệ sinh và lắp đặt thiết bị điện lạnh tại phường ${name}, Cần Thơ.`,
        `Khi đặt lịch tại ${name}, bạn nên gửi địa chỉ, loại thiết bị và hiện tượng đang gặp để kỹ thuật viên chuẩn bị tốt hơn.`,
      ],
      bookingTips: [
        'Gửi số nhà, tên đường và phường để xác nhận khu vực.',
        'Cho biết loại thiết bị và lỗi đang gặp.',
        'Chọn khung giờ có người hỗ trợ kỹ thuật viên vào nhà.',
      ],
      serviceNotes: Object.fromEntries(
        Object.entries(serviceSeeds).map(([serviceSlug, seed]) => [
          serviceSlug,
          `${seed.short} Nhận lịch tại ${name}, Cần Thơ.`,
        ]),
      ),
    } satisfies AreaContent,
  ]),
);

const articleDefaults: BlogArticleContent = {
  lead: 'Nắm đúng dấu hiệu và thời điểm kiểm tra giúp thiết bị hoạt động ổn định, an toàn và tiết kiệm chi phí hơn.',
  sections: [
    {
      id: 'dau-hieu',
      title: 'Dấu hiệu thường gặp',
      paragraphs: [
        'Quan sát biểu hiện của thiết bị và ghi lại thời điểm lỗi xuất hiện. Những thông tin này giúp kỹ thuật viên khoanh vùng nguyên nhân nhanh hơn.',
      ],
      bullets: [
        'Thiết bị hoạt động khác thường',
        'Hiệu suất giảm hoặc phát sinh tiếng ồn',
        'Có mùi, nước rò hoặc mã lỗi',
      ],
    },
    {
      id: 'xu-ly',
      title: 'Cách xử lý ban đầu',
      paragraphs: [
        'Hãy tắt thiết bị khi có mùi khét, rò điện hoặc nước chảy gần ổ điện. Không tự tháo các bộ phận điện nếu không có chuyên môn.',
      ],
    },
    {
      id: 'goi-tho',
      title: 'Khi nào nên gọi kỹ thuật viên?',
      paragraphs: [
        'Nếu lỗi lặp lại, thiết bị không đạt hiệu suất hoặc cần tháo lắp, nên đặt lịch kiểm tra để có phương án và chi phí rõ ràng.',
      ],
    },
  ],
  safetyNote:
    'Ngắt nguồn ở vị trí an toàn khi thiết bị có dấu hiệu rò điện, mùi khét hoặc nước chảy vào khu vực có ổ điện.',
  relatedServiceSlugs: ['sua-may-lanh', 've-sinh-may-lanh'],
};

export const BLOG_ARTICLE_CONTENT: Record<string, BlogArticleContent> = {};

export function findServiceContent(slug: string) {
  return SERVICE_CONTENT[slug];
}

export function findAreaContent(slug: string) {
  return AREA_CONTENT[slug];
}

export function findBlogArticleContent(slug: string) {
  if (!BLOG_ARTICLE_CONTENT[slug]) {
    BLOG_ARTICLE_CONTENT[slug] = {
      ...articleDefaults,
      relatedServiceSlugs: articleDefaults.relatedServiceSlugs,
    };
  }
  return BLOG_ARTICLE_CONTENT[slug];
}
