'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { siteContent } from '@/lib/content/site-content';
import { integrationSettings } from '@/lib/integrations/settings';

// Every public coverage section uses Home's verified map and interactions.
export { VerifiedServiceArea as ServiceArea } from './verified-service-area';

export function ContactMap() {
  return (
    <section className="mn-contact-map">
      <h2>
        <MapPin size={20} />
        Địa chỉ · Khu vực phục vụ
      </h2>
      <div className="mn-contact-map-art">
        <iframe
          src={integrationSettings.googleMapsEmbedUrl}
          title={`Bản đồ Điện Lạnh Minh Nhật – ${siteContent.address}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {/* Open the business listing, rather than the iframe's generic map view. */}
        <a
          className="mn-map-open-link"
          href={integrationSettings.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mở vị trí Điện Lạnh Minh Nhật trong Google Maps"
        >
          Mở trong Maps <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
