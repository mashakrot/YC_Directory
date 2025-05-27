import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: remove later
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      }
    ]
  },
  experimental: {
    ppr: 'incremental'
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  }

};

export default nextConfig;
