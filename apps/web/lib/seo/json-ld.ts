import { APP_NAME, FAQS, TARGET_CITY } from '@minhnhat/shared';
import { absoluteUrl } from './metadata';
import { integrationSettings } from '../integrations/settings';

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HVACBusiness'],
    name: APP_NAME,
    telephone: integrationSettings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: TARGET_CITY,
      addressCountry: 'VN',
      streetAddress: integrationSettings.address,
    },
    areaServed: TARGET_CITY,
    url: absoluteUrl('/'),
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

export function serviceJsonLd(serviceName: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    provider: localBusinessJsonLd(),
    areaServed: TARGET_CITY,
    url: absoluteUrl(path),
  };
}

export function articleJsonLd(title: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    headline: title,
    author: { '@type': 'Organization', name: APP_NAME },
    publisher: { '@type': 'Organization', name: APP_NAME },
    mainEntityOfPage: absoluteUrl(path),
  };
}

