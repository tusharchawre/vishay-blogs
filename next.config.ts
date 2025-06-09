import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
   images: {
    domains: ['lh3.googleusercontent.com',"ui-avatars.com", 'files.edgestore.dev', 'image.pollinations.ai'],
   },
};

export default nextConfig;
