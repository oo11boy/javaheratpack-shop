/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
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