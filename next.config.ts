import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  swcMinify: true,
   images: {
    domains: ['lh3.googleusercontent.com'],
   },
};

export default nextConfig;
