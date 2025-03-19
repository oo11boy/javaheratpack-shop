"use client";

import React from "react";
import { CheckCircle, ChevronRight, BookOpen, User } from "lucide-react";
import Image from "next/image"; // اضافه کردن next/image

interface PurchasedCourse {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  courseLink: string;
}

interface PurchaseSuccessProps {
  purchasedCourses: PurchasedCourse[];
  totalAmount?: number;
  purchaseDate: string;
  orderCode: string;
}

const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({
  purchasedCourses,
  totalAmount = 0,
  purchaseDate,
  orderCode,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#121824] via-[#1e2636] to-[#2a3347] px-4 py-8 font-sans">
      <div className="w-full max-w-4xl bg-[#2a3347]/95 rounded-3xl shadow-2xl border border-[#0dcf6c]/20 p-6 sm:p-10 transform transition-all duration-500 hover:shadow-[0_0_30px_rgba(13,207,108,0.2)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 sm:mb-12 gap-4">
          <CheckCircle className="w-8 h-8 sm:w-8 sm:h-8 text-[#0dcf6c] animate-bounce-slow" />
          <h2 className="text-3xl sm:text-3xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] bg-clip-text text-center">
            خرید موفق
          </h2>
        </div>

        {/* Purchase Info */}
        <div className="text-center mb-8 sm:mb-12 bg-[#1e2636]/60 rounded-xl p-5 sm:p-8 border border-[#0dcf6c]/10 shadow-inner">
          <p className="text-gray-100 text-base sm:text-lg md:text-xl font-medium">
            تبریک! خرید شما با موفقیت انجام شد.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-300 text-sm sm:text-base">
            <p>
              تاریخ خرید: <span className="text-[#0dcf6c] font-semibold">{purchaseDate}</span>
            </p>
            <p>
              کد سفارش: <span className="text-[#0dcf6c] font-semibold">{orderCode}</span>
            </p>
          </div>
          <p className="text-[#0dcf6c] text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6">
            مبلغ پرداختی: {totalAmount.toLocaleString()} تومان
          </p>
        </div>

        {/* Purchased Courses */}
        <div className="space-y-6 mb-8 sm:mb-12">
          <h3 className="text-gray-100 text-base sm:text-lg md:text-xl font-semibold flex items-center gap-3 bg-[#2a3347] p-3 rounded-lg shadow-md">
            <BookOpen className="w-6 h-6 text-[#0dcf6c]" />
            دوره‌های خریداری‌شده
          </h3>
          <div className="max-h-72 overflow-y-auto custom-scrollbar pr-2 sm:pr-3">
            {purchasedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#2a3347]/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 border border-[#0dcf6c]/20 hover:bg-[#2a3347] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  width={80} // بر اساس sm:w-20 (20 * 4 = 80px)
                  height={80} // بر اساس sm:h-20
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow-md border border-[#0dcf6c]/30"
                  sizes="(max-width: 640px) 64px, 80px" // 64px در موبایل، 80px در دسکتاپ
                />
                <div className="flex-1 text-center sm:text-right">
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-100 line-clamp-1">
                    {course.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {course.price.toLocaleString()} تومان
                  </p>
                </div>
                <a
                  href={course.courseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#0dcf6c] hover:text-[#0aaf5a] transition-colors text-sm sm:text-base font-medium bg-[#0dcf6c]/10 px-3 py-1 rounded-full hover:bg-[#0dcf6c]/20"
                >
                  نمایش دوره
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => (window.location.href = "/account")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            رفتن به حساب کاربری
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-[#2a3347] text-[#0dcf6c] rounded-full border border-[#0dcf6c]/40 hover:bg-[#2a3347]/70 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
          >
            بازگشت به صفحه اصلی
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a3347;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0dcf6c;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0aaf5a;
        }
        @media (max-width: 640px) {
          .rounded-3xl {
            border-radius: 1.5rem;
          }
          .shadow-2xl {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        }
      `}</style>
    </div>
  );
};

export default PurchaseSuccess;