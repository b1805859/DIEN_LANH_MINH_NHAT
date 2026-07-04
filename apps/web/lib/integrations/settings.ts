import { BUSINESS } from '@minhnhat/shared';

const fallbackZaloUrl = BUSINESS.zaloUrl;
const configuredZaloUrl = process.env.NEXT_PUBLIC_ZALO_OA_URL?.trim();
const rootZaloUrls = new Set(['https://zalo.me', 'https://zalo.me/', 'https://zalo.me/vi/']);

export const integrationSettings = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || BUSINESS.name,
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || BUSINESS.phone,
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || BUSINESS.address,
  zaloUrl: configuredZaloUrl && !rootZaloUrls.has(configuredZaloUrl) ? configuredZaloUrl : fallbackZaloUrl,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  messengerUrl: process.env.NEXT_PUBLIC_FACEBOOK_MESSENGER_URL || '',
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || BUSINESS.googleMapsUrl,
  googleMapsEmbedUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || BUSINESS.googleMapsEmbedUrl,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  googleSearchConsoleVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION || '',
};
