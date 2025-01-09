import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Add the rewrites function for API proxying
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Frontend API path
        destination: "http://localhost:5008/:path*", // Express backend
      },
    ];
  },
};

export default nextConfig;