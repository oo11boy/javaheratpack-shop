/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { useCache: true, optimizeCss: true, webpackBuildWorker: true },
  images: {
    unoptimized: true, // ← این خط را اضافه کنید
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "dl.shivid.co",
      },
      {
        protocol: "http",
        hostname: "dl.shivid.co",
      },
      {
        protocol: "https",
        hostname: "unicodewebdesign.com",
        port: "", // اگر پورت خاصی استفاده نمی‌کنید، خالی بگذارید
        pathname: "/**", // اجازه دسترسی به تمام مسیرهای دامنه
      },
    ],
  },
};

module.exports = nextConfig;
