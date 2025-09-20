import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL!.replace("https://", ""),
      "example.com",
    ],
  },
};

export default nextConfig;
