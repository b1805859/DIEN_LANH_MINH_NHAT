import { BUSINESS } from '@minhnhat/shared';

const fallbackZaloUrl = BUSINESS.zaloUrl;
const configuredZaloUrl = process.env.NEXT_PUBLIC_ZALO_OA_URL?.trim();
const rootZaloUrls = new Set(['https://zalo.me', 'https://zalo.me/', 'https://zalo.me/vi/']);
const configuredAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim();

export const integrationSettings = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || BUSINESS.name,
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || BUSINESS.phone,
  address: configuredAddress || BUSINESS.address,
  hasConfiguredAddress: Boolean(configuredAddress),
  latitude: process.env.NEXT_PUBLIC_BUSINESS_LATITUDE?.trim() || '9.9650142',
  longitude: process.env.NEXT_PUBLIC_BUSINESS_LONGITUDE?.trim() || '105.7455554',
  openingHours: process.env.NEXT_PUBLIC_BUSINESS_OPENING_HOURS?.trim() || BUSINESS.contactHours,
  email: BUSINESS.email,
  priceRange: process.env.NEXT_PUBLIC_BUSINESS_PRICE_RANGE?.trim() || '',
  zaloUrl:
    configuredZaloUrl && !rootZaloUrls.has(configuredZaloUrl) ? configuredZaloUrl : fallbackZaloUrl,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || BUSINESS.facebookUrl,
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  messengerUrl: process.env.NEXT_PUBLIC_FACEBOOK_MESSENGER_URL || '',
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || BUSINESS.googleMapsUrl,
  googleMapsEmbedUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || BUSINESS.googleMapsEmbedUrl,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  googleSearchConsoleVerification: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION || '',
};
