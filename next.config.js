/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
