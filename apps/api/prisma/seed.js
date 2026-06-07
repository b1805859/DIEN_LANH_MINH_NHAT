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
  ['Bao lâu nên vệ sinh máy lạnh một lần?', 'bao-lau-nen-ve-sinh-may-lanh-mot-lan', 'may-lanh'],
  ['Dấu hiệu máy lạnh cần nạp gas', 'dau-hieu-may-lanh-can-nap-gas', 'may-lanh'],
  ['Máy lạnh không lạnh nguyên nhân do đâu?', 'may-lanh-khong-lanh-nguyen-nhan-do-dau', 'may-lanh'],
  ['Máy lạnh chảy nước phải làm sao?', 'may-lanh-chay-nuoc-phai-lam-sao', 'may-lanh'],
  ['Các lỗi thường gặp ở tủ lạnh', 'cac-loi-thuong-gap-o-tu-lanh', 'tu-lanh'],
  ['Khi nào cần vệ sinh máy giặt?', 'khi-nao-can-ve-sinh-may-giat', 'may-giat'],
  ['Mẹo tiết kiệm điện khi sử dụng máy lạnh', 'meo-tiet-kiem-dien-khi-su-dung-may-lanh', 'tiet-kiem-dien'],
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

  for (const [title, slug, categorySlug] of blogPosts) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    await prisma.blogPost.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        excerpt: `Hướng dẫn thực tế: ${title}`,
        content: `# ${title}\n\nBài viết cung cấp dấu hiệu nhận biết, nguyên nhân thường gặp và lời khuyên bảo trì an toàn cho khách hàng tại Cần Thơ.\n\n## Khi nào cần gọi kỹ thuật viên?\n\nNếu thiết bị hoạt động bất thường, phát tiếng ồn, rò nước hoặc giảm hiệu suất, hãy liên hệ đội kỹ thuật để kiểm tra.`,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        categoryId: category?.id,
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
        messengerUrl: 'https://m.me/',
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
