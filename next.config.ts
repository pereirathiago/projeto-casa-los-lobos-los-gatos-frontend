import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-a7b15f51b50a4d659d25a15b10d78339.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
