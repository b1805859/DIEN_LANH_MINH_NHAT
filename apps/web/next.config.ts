import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep audit/build artifacts separate from an already-running development server.
  distDir: process.env.UI_AUDIT_DIST_DIR || '.next',
  poweredByHeader: false,
  devIndicators: false,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
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
