/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "small-wolverine-256.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
