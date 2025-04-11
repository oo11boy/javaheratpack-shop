/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'dl.shivid.co',
      },
      {
        protocol: 'http',
        hostname: 'dl.shivid.co',
      },
      {
        protocol: 'https',
        hostname: 'unicodewebdesign.com',
        port: '', // اگر پورت خاصی استفاده نمی‌کنید، خالی بگذارید
        pathname: '/**', // اجازه دسترسی به تمام مسیرهای دامنه
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // غیرفعال کردن ESLint در زمان بیلد
  },
};

module.exports = nextConfig;