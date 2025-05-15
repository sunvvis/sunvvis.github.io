import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "cdn.pixabay.com"],
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
