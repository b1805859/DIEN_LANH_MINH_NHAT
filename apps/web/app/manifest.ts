import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Điện Lạnh Minh Nhật - Quản Trị Hệ Thống',
    short_name: 'Minh Nhật Admin',
    description: 'Hệ thống quản trị và điều phối dịch vụ Điện Lạnh Minh Nhật cho iPhone và thiết bị di động.',
    start_url: '/admin/login',
    display: 'standalone',
    background_color: '#0b1727',
    theme_color: '#0874df',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
