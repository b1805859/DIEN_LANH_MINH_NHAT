import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceGrid } from './ui';

export function HomeServicesSection() {
  return (
    <section className="mn-section mn-home-services">
      <div className="mn-section-heading">
        <div>
          <p className="mn-kicker">DỊCH VỤ ĐIỆN LẠNH MINH NHẬT</p>
          <h2>
            <span className="mn-heading-title">Dịch vụ điện lạnh</span>{' '}
            <em>toàn diện tại Cần Thơ</em>
          </h2>
        </div>
        <Link href="/services" className="mn-text-link">
          Xem tất cả <ArrowRight size={17} />
        </Link>
      </div>
      <ServiceGrid limit={5} home />
    </section>
  );
}
