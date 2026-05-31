import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
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
