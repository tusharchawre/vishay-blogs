import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
   images: {
    domains: ['lh3.googleusercontent.com', 'files.edgestore.dev', 'image.pollinations.ai'],
   },
};

export default nextConfig;
