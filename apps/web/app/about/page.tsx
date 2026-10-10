import Image from 'next/image';
import { PageHero, Reasons, SectionHeading } from '@/components/redesign/ui';
import { ServiceArea } from '@/components/redesign/service-area';
import { siteContent } from '@/lib/content/site-content';
import { buildMetadata } from '@/lib/seo/metadata';
export const metadata = buildMetadata({
  title: 'Giới thiệu Điện Lạnh Minh Nhật',
  description: 'Dịch vụ điện lạnh tận nơi, tận tâm đồng hành cùng người dân Cần Thơ.',
  path: '/about',
});
export default function AboutPage() {
  return (
    <main>
      <PageHero
        className="mn-about-hero"
        title="Tận tâm đồng hành"
        accent="cùng người dân Cần Thơ"
        image={siteContent.images.technician}
        description="Chúng tôi hiểu cuộc sống thoải mái đến từ những dịch vụ điện lạnh chất lượng, cùng một người thợ chu đáo, đáng tin cậy."
      />
      <div className="mn-container">
        <div className="mn-about-facts mn-panel">
          {[
            ['10', 'nhóm dịch vụ'],
            ['Tận nơi', 'tại Cần Thơ'],
            ['Rõ ràng', 'từ tư vấn đến bàn giao'],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <section className="mn-section mn-story">
          <div>
            <p className="mn-kicker">CÂU CHUYỆN MINH NHẬT</p>
            <h2>
              Chăm chút từng thiết bị.
              <br />
              <em>An tâm từng mái nhà.</em>
            </h2>
          </div>
          <p>
            Điện Lạnh Minh Nhật cung cấp dịch vụ sửa chữa, vệ sinh, lắp đặt máy lạnh, máy giặt, tủ
            lạnh và điện nước gia đình. Mỗi yêu cầu đều bắt đầu bằng việc lắng nghe, kiểm tra thực
            tế và trao đổi rõ phương án. Chúng tôi hướng đến cách phục vụ gần gũi, làm việc gọn gàng
            và hỗ trợ khách hàng sau dịch vụ.
          </p>
        </section>
        <section>
          <SectionHeading title="Vì sao chọn" accent="Điện Lạnh Minh Nhật?" />
          <Reasons />
          <div className="mn-team-photo">
            <Image
              src={siteContent.images.team}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              alt="Ảnh minh họa đội bốn kỹ thuật viên Minh Nhật làm việc trong căn hộ"
            />
          </div>
          <p className="mn-image-note">Hình ảnh minh họa dịch vụ.</p>
        </section>
        <ServiceArea />
      </div>
    </main>
  );
}
