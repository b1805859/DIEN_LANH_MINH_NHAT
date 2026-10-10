import { APP_NAME, FAQS, TARGET_CITY } from '@minhnhat/shared';
import { absoluteUrl } from './metadata';
import { integrationSettings } from '../integrations/settings';

export function localBusinessJsonLd() {
  const sameAs = [
    integrationSettings.facebookUrl,
    integrationSettings.tiktokUrl,
    integrationSettings.youtubeUrl,
    integrationSettings.zaloUrl,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HVACBusiness'],
    '@id': absoluteUrl('/#business'),
    name: APP_NAME,
    image: absoluteUrl('/images/redesign/family-morning.webp'),
    telephone: integrationSettings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: TARGET_CITY,
      addressCountry: 'VN',
      ...(integrationSettings.address ? { streetAddress: integrationSettings.address } : {}),
    },
    areaServed: TARGET_CITY,
    url: absoluteUrl('/'),
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    provider: localBusinessJsonLd(),
    areaServed: TARGET_CITY,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
  };
}

export function articleJsonLd(title: string, description: string, image: string, path: string) {
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
  };
}

