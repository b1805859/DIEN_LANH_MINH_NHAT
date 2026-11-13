import type { Metadata } from 'next';
import { APP_NAME, TARGET_CITY } from '@minhnhat/shared';

import { siteUrl, isPreviewDeployment } from './site-url';
const defaultSocialImage = '/images/redesign/family-morning.webp';

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  imageAlt = title,
  type = 'website',
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      locale: 'vi_VN',
      type,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: index && !isPreviewDeployment,
      follow: true,
      googleBot: {
        index: index && !isPreviewDeployment,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export function localTitle(label: string) {
  return `${label} tại ${TARGET_CITY}`;
}
