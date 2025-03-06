/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["www.pexels.com"], // Allow images from Pexels
  },
}

export default nextConfig
