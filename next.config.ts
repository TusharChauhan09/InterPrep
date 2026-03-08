import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // for clerk images
  images: {
    domains: ["img.clerk.com"], // Add Clerk's image host here
  },
  eslint: {
    ignoreDuringBuilds: true, // 🚀 disables ESLint in docker builds
  },
  serverExternalPackages: ["@stream-io/video-react-sdk"],
};

export default nextConfig;
