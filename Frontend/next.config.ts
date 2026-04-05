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
  async rewrites() {
    const csrLoginPath = process.env.NEXT_PUBLIC_CSR_LOGIN_PATH || '/843901globallink-234deals-cr-485n9485n02';
    const normalizedPath = csrLoginPath.startsWith('/') ? csrLoginPath : `/${csrLoginPath}`;
    return [
      {
        source: normalizedPath,
        destination: '/csr-login',
      },
    ];
  },
};

export default nextConfig;
