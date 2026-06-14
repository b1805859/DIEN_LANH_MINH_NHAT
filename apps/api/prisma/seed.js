const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

const services = [
  ['Tháo Lắp Máy Lạnh', 'thao-lap-may-lanh'],
  ['Vệ Sinh Máy Lạnh', 've-sinh-may-lanh'],
  ['Sửa Máy Lạnh', 'sua-may-lanh'],
  ['Nạp Gas Máy Lạnh', 'nap-gas-may-lanh'],
  ['Sửa Tủ Lạnh', 'sua-tu-lanh'],
  ['Sửa Máy Giặt', 'sua-may-giat'],
  ['Vệ Sinh Máy Giặt', 've-sinh-may-giat'],
  ['Sửa Chữa Điện Nước', 'sua-dien-nuoc'],
  ['Sửa Lắp Máy Nước Uống Nóng Lạnh', 'sua-lap-may-nuoc-uong-nong-lanh'],
  ['Sửa Lắp Máy Nước Nóng Lạnh Tắm', 'sua-lap-may-nuoc-nong-lanh-tam'],
];

const locations = [
  ['Ninh Kiều', 'ninh-kieu'],
  ['Cái Răng', 'cai-rang'],
  ['Bình Thủy', 'binh-thuy'],
  ['Ô Môn', 'o-mon'],
];

const categories = [
  ['Máy Lạnh', 'may-lanh'],
  ['Máy Giặt', 'may-giat'],
  ['Tủ Lạnh', 'tu-lanh'],
  ['Điện Nước', 'dien-nuoc'],
  ['Tiết Kiệm Điện', 'tiet-kiem-dien'],
];

const blogPosts = [
  {
    title: 'Bao lâu nên vệ sinh máy lạnh một lần?',
    slug: 'bao-lau-nen-ve-sinh-may-lanh-mot-lan',
    categorySlug: 'may-lanh',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt: 'Mốc thời gian vệ sinh máy lạnh phù hợp cho gia đình, phòng trọ và cửa hàng sử dụng thường xuyên.',
  },
  {
    title: 'Dấu hiệu máy lạnh cần nạp gas',
    slug: 'dau-hieu-may-lanh-can-nap-gas',
    categorySlug: 'may-lanh',
    image: '/images/services/nap-gas-may-lanh.jpg',
    excerpt: 'Các biểu hiện thiếu gas, cách kiểm tra ban đầu và thời điểm nên gọi kỹ thuật viên.',
  },
  {
    title: 'Máy lạnh không lạnh nguyên nhân do đâu?',
    slug: 'may-lanh-khong-lanh-nguyen-nhan-do-dau',
    categorySlug: 'may-lanh',
    image: '/images/services/sua-may-lanh.jpg',
    excerpt: 'Tổng hợp nguyên nhân khiến máy lạnh chạy nhưng không mát và hướng xử lý an toàn.',
  },
  {
    title: 'Máy lạnh chảy nước phải làm sao?',
    slug: 'may-lanh-chay-nuoc-phai-lam-sao',
    categorySlug: 'may-lanh',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt: 'Nhận biết nguyên nhân máy lạnh rò nước, nghẹt ống thoát và các bước xử lý ban đầu.',
  },
  {
    title: 'Các lỗi thường gặp ở tủ lạnh',
    slug: 'cac-loi-thuong-gap-o-tu-lanh',
    categorySlug: 'tu-lanh',
    image: '/images/services/sua-tu-lanh.jpg',
    excerpt: 'Những lỗi tủ lạnh thường gặp như yếu lạnh, đóng tuyết, rò nước và tiếng ồn bất thường.',
  },
  {
    title: 'Khi nào cần vệ sinh máy giặt?',
    slug: 'khi-nao-can-ve-sinh-may-giat',
    categorySlug: 'may-giat',
    image: '/images/services/ve-sinh-may-giat.jpg',
    excerpt: 'Dấu hiệu lồng giặt bám cặn, có mùi và lịch vệ sinh giúp quần áo sạch hơn.',
  },
  {
    title: 'Mẹo tiết kiệm điện khi sử dụng máy lạnh',
    slug: 'meo-tiet-kiem-dien-khi-su-dung-may-lanh',
    categorySlug: 'tiet-kiem-dien',
    image: '/images/services/ve-sinh-may-lanh.jpg',
    excerpt: 'Cách cài đặt nhiệt độ, vệ sinh định kỳ và dùng máy lạnh hợp lý để giảm hao điện.',
  },
];

async function main() {
  const roles = await Promise.all(
    ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF'].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      }),
    ),
  );

  const superAdmin = roles.find((role) => role.name === 'SUPER_ADMIN');
  await prisma.user.upsert({
    where: { email: 'admin@minhnhat.local' },
    update: {},
    create: {
      email: 'admin@minhnhat.local',
      name: 'Minh Nhat Admin',
      passwordHash: await hash('ChangeMe123!', 12),
      roleId: superAdmin.id,
    },
  });

  for (const [name, slug] of services) {
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        summary: `${name} tại Cần Thơ, hỗ trợ nhanh tại Ninh Kiều, Cái Răng, Bình Thủy và Ô Môn.`,
        description: `${name} chuyên nghiệp cho hộ gia đình và cửa hàng tại Cần Thơ.`,
        displayOrder: services.findIndex((service) => service[1] === slug),
      },
    });
  }

  for (const [name, slug] of locations) {
    await prisma.location.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        isPriority: true,
        description: `Dịch vụ điện lạnh và sửa chữa tận nơi tại ${name}, Cần Thơ.`,
      },
    });
  }

  for (const [name, slug] of categories) {
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, description: `Kiến thức và hướng dẫn về ${name}.` },
    });
  }

  for (const post of blogPosts) {
    const category = await prisma.category.findUnique({ where: { slug: post.categorySlug } });
    const fileName = post.image.split('/').pop() || `${post.slug}.jpg`;
    const featuredImage = await prisma.mediaFile.upsert({
      where: { id: `seed-blog-image-${post.slug}` },
      update: {
        fileName,
        originalName: fileName,
        mimeType: post.image.endsWith('.png') ? 'image/png' : 'image/jpeg',
        url: post.image,
        altText: post.title,
        visibility: 'PUBLIC',
      },
      create: {
        id: `seed-blog-image-${post.slug}`,
        fileName,
        originalName: fileName,
        mimeType: post.image.endsWith('.png') ? 'image/png' : 'image/jpeg',
        size: 0,
        url: post.image,
        altText: post.title,
        visibility: 'PUBLIC',
      },
    });

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        excerpt: post.excerpt,
        featuredImageId: featuredImage.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: `# ${post.title}\n\nBài viết cung cấp dấu hiệu nhận biết, nguyên nhân thường gặp và lời khuyên bảo trì an toàn cho khách hàng tại Cần Thơ.\n\n## Khi nào cần gọi kỹ thuật viên?\n\nNếu thiết bị hoạt động bất thường, phát tiếng ồn, rò nước hoặc giảm hiệu suất, hãy liên hệ đội kỹ thuật để kiểm tra.`,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        categoryId: category?.id,
        featuredImageId: featuredImage.id,
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: 'business' },
    update: {},
    create: {
      key: 'business',
      value: {
        name: 'ĐIỆN LẠNH MINH NHẬT',
        phone: '0939370109',
        address: 'Cần Thơ, Việt Nam',
        zaloUrl: 'https://zalo.me/0939370109',
        googleMapsEmbedUrl: '',
      },
    },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: 'Dịch vụ có hỗ trợ ngoài giờ không?',
        answer: 'Có, đội kỹ thuật hỗ trợ tư vấn và đặt lịch nhanh trong ngày.',
      },
      {
        question: 'Có báo giá trước khi sửa không?',
        answer: 'Có, kỹ thuật viên kiểm tra tình trạng thiết bị và báo giá trước khi thực hiện.',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
