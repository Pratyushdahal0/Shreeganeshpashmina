import type { NextConfig } from 'next';
import path from 'path';

const immutableCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  async headers() {
    return [
      { source: '/uploads/:path*', headers: immutableCache },
      { source: '/images/:path*', headers: immutableCache },
      { source: '/logos/:path*', headers: immutableCache },
    ];
  },
};

export default nextConfig;
