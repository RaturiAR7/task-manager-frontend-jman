import type { NextConfig } from "next";


const nextConfig = {
  experimental: {
    turbo: false, // ← disables Turbopack completely
  },
};

module.exports = nextConfig;
