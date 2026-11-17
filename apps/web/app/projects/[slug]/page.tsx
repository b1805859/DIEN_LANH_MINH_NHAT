import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects } from '@/lib/content/site-content';
import { Actions, PageHero, Process } from '@/components/redesign/ui';
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title, robots: { index: false, follow: true } };
}
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <main>
      <PageHero
        title={project.title}
        accent={project.area}
        image={project.image}
        label="Dự án minh họa"
        imagePreview
      />
      <div className="mn-container">
        <div className="mn-tone-section mn-tone-light">
        <article className="mn-article mn-panel" data-reveal="">
          <Link className="mn-text-link inline-flex min-h-[44px] items-center" href="/projects">
            ← Tất cả dự án
          </Link>
          <p className="mn-notice">
            Nội dung và hình ảnh minh họa, chưa phải hồ sơ công trình thực tế. Thông tin sẽ được cập
            nhật khi có ảnh và hồ sơ được xác nhận.
          </p>
          <h2>Hạng mục thực hiện</h2>
          <p>{project.description}</p>
          <div className="my-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#cce4f7] bg-[#f4faff] p-4">
              <strong className="block text-xs uppercase tracking-wider text-[#0277bd]">Khu vực</strong>
              <span className="mt-1 block font-bold text-[#061c3d]">{project.area}</span>
            </div>
            <div className="rounded-xl border border-[#cce4f7] bg-[#f4faff] p-4">
              <strong className="block text-xs uppercase tracking-wider text-[#0277bd]">Quy chuẩn</strong>
              <span className="mt-1 block font-bold text-[#061c3d]">Khảo sát &amp; báo giá trước</span>
            </div>
            <div className="rounded-xl border border-[#cce4f7] bg-[#f4faff] p-4">
              <strong className="block text-xs uppercase tracking-wider text-[#0277bd]">Bàn giao</strong>
              <span className="mt-1 block font-bold text-[#061c3d]">Chạy thử &amp; bảo hành 3–6 tháng</span>
            </div>
          </div>
          <p>
            Kỹ thuật viên kiểm tra tình trạng thiết bị, trao đổi phương án và thống nhất chi phí
            trước khi thực hiện. Sau thi công, thiết bị được chạy thử và khách hàng được hướng dẫn
            cách sử dụng.
          </p>
          <Actions booking />
        </article>
        </div>
        <Process />
      </div>
    </main>
  );
}
