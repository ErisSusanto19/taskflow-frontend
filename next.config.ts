import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/quotes',
        destination: 'https://zenquotes.io/api/random',
      },
    ];
  },
};

export default nextConfig;
