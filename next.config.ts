import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "1c05c061-00e4-4404-b75f-4ff6a1e1cc03-00-2zoxpc831yhag.janeway.replit.dev",
    "*.replit.dev",
    "*.repl.co",
    "*.janeway.replit.dev",
    "*.pike.replit.dev",
    "*.sisko.replit.dev",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
