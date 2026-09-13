import {
  APP_NAME,
  FAQS,
  PRIORITY_DISTRICTS,
  SERVICES,
  TARGET_CITY,
  findDistrict,
  findServiceContent,
} from '@minhnhat/shared';
import { absoluteUrl } from './metadata';
import { integrationSettings } from '../integrations/settings';

function localAreas() {
  return [
    {
      '@type': 'City',
      name: TARGET_CITY,
    },
    ...PRIORITY_DISTRICTS.map((district) => ({
      '@type': 'AdministrativeArea',
      name: `${district.name}, ${TARGET_CITY}`,
    })),
  ];
}

export function localBusinessJsonLd() {
  const sameAs = [
    ...new Set(
      [
        integrationSettings.facebookUrl,
        integrationSettings.tiktokUrl,
        integrationSettings.youtubeUrl,
        integrationSettings.zaloUrl,
      ].filter(Boolean),
    ),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HVACBusiness'],
    '@id': absoluteUrl('/#business'),
    name: integrationSettings.businessName,
    description:
      'Dịch vụ sửa chữa, vệ sinh và lắp đặt điện lạnh tận nơi cho gia đình, cửa hàng tại Cần Thơ.',
    image: absoluteUrl('/images/home-hero.jpg'),
    logo: absoluteUrl('/favicon.ico'),
    telephone: integrationSettings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: TARGET_CITY,
      addressRegion: TARGET_CITY,
      addressCountry: 'VN',
      ...(integrationSettings.hasConfiguredAddress
        ? { streetAddress: integrationSettings.address }
        : {}),
    },
    areaServed: localAreas(),
    url: absoluteUrl('/'),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: integrationSettings.phone,
      contactType: 'customer service',
      availableLanguage: ['vi'],
      areaServed: 'VN',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dịch vụ điện lạnh tại Cần Thơ',
      itemListElement: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          url: absoluteUrl(`/services/${service.slug}`),
        },
      })),
    },
    ...(integrationSettings.googleMapsUrl ? { hasMap: integrationSettings.googleMapsUrl } : {}),
    ...(integrationSettings.latitude && integrationSettings.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: integrationSettings.latitude,
            longitude: integrationSettings.longitude,
          },
        }
      : {}),
    ...(integrationSettings.openingHours ? { openingHours: integrationSettings.openingHours } : {}),
    ...(integrationSettings.priceRange ? { priceRange: integrationSettings.priceRange } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: APP_NAME,
    inLanguage: 'vi-VN',
    publisher: { '@id': absoluteUrl('/#business') },
  };
}

export function faqJsonLd(faqs = FAQS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(serviceName: string, path: string, image?: string) {
  const pathSegments = path.split('/').filter(Boolean);
  const serviceSlug = pathSegments.at(-1) || '';
  const serviceContent = findServiceContent(serviceSlug);
  const district =
    pathSegments[0] === 'areas' && pathSegments[1] ? findDistrict(pathSegments[1]) : undefined;
  const areaServed = district
    ? [
        {
          '@type': 'AdministrativeArea',
          name: `${district.name}, ${TARGET_CITY}`,
        },
      ]
    : localAreas();

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`${path}#service`),
    name: serviceName,
    serviceType: serviceName,
    ...(serviceContent ? { description: serviceContent.shortDescription } : {}),
    provider: { '@id': absoluteUrl('/#business') },
    areaServed,
    url: absoluteUrl(path),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl('/booking'),
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: integrationSettings.phone,
        contactType: 'customer service',
        availableLanguage: ['vi'],
      },
    },
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function articleJsonLd(
  title: string,
  description: string,
  image: string,
  path: string,
  dates?: { datePublished?: string; dateModified?: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    headline: title,
    description,
    image: [absoluteUrl(image)],
    author: { '@type': 'Organization', name: APP_NAME },
    publisher: { '@id': absoluteUrl('/#business') },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    url: absoluteUrl(path),
    inLanguage: 'vi-VN',
    ...(dates?.datePublished ? { datePublished: dates.datePublished } : {}),
    ...(dates?.dateModified ? { dateModified: dates.dateModified } : {}),
  };
}
