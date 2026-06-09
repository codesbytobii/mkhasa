import path from "path";

const DEFAULT_API_BASE = "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";
const DEFAULT_SITE_URL = "https://www.mkhasa.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_API_BASE,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(process.cwd(), "src"),
    };
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|m4a|aac)$/i,
      type: "asset/resource",
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "mkhasa.com" }],
        destination: "https://www.mkhasa.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
