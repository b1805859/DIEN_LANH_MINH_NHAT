import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep audit/build artifacts separate from an already-running development server.
  distDir: process.env.UI_AUDIT_DIST_DIR || '.next',
  poweredByHeader: false,
  devIndicators: false,
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      { source: '/services/thao-lap-may-lanh', destination: '/services/thao-di-doi-may-lanh', permanent: true },
      { source: '/areas/:locationSlug/thao-lap-may-lanh', destination: '/areas/:locationSlug/thao-di-doi-may-lanh', permanent: true },
    ];
  },
  async rewrites() {
    // Browsers use the website origin, including when opened from a phone on LAN.
    const apiUrl = (process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000/api').replace(/\/$/, '');
    return [{ source: '/api/:path*', destination: `${apiUrl}/:path*` }];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 92],
    localPatterns: [
      { pathname: '/**', search: '' },
      { pathname: '/images/redesign/**', search: '?v=20261015-realism' },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
        ],
      },
    ];
  },
};

export default nextConfig;
