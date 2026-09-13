import type { Metadata } from 'next';
import { APP_NAME, TARGET_CITY } from '@minhnhat/shared';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
export const siteUrl = new URL(configuredSiteUrl).origin;
const defaultSocialImage = '/images/home-hero.jpg';

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
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
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    authors: [{ name: APP_NAME, url: absoluteUrl('/about') }],
    creator: APP_NAME,
    publisher: APP_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
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
