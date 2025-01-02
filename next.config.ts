import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  swcMinify: true,
   images: {
    domains: ['lh3.googleusercontent.com', 'files.edgestore.dev'],
   },
};

export default nextConfig;
