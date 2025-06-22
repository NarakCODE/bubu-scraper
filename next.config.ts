import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows any https hostname
      },
      {
        protocol: 'http',
        hostname: '**', // This allows any http hostname
      },
    ],
  },
};

export default nextConfig;
