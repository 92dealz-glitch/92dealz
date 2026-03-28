import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5001", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5001", pathname: "/uploads/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "234deals-backend.vercel.app", pathname: "/uploads/**" },
    ],
  },
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

export default nextConfig;
