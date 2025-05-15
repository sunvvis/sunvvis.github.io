import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "cdn.pixabay.com"],
    unoptimized: true,
  },
  output: 'export',
  eslint: {
    // 빌드 시 ESLint 실행 비활성화
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 체크 비활성화
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
