import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 98],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5001", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "5001", pathname: "/uploads/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "92dealz-backend.vercel.app", pathname: "/uploads/**" },
    ],
    localPatterns: [{ pathname: "/assets/images/**" }, { pathname: "/images/**" }],
  },
  async rewrites() {
    const csrLoginPath = process.env.NEXT_PUBLIC_CSR_LOGIN_PATH || '/843901globallink-92dealz-cr-485n9485n02';
    const normalizedPath = csrLoginPath.startsWith('/') ? csrLoginPath : `/${csrLoginPath}`;
    return [
      {
        source: normalizedPath,
        destination: '/csr-login',
      },
    ];
  },
  // Add turbopack root to avoid workspace warning
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
