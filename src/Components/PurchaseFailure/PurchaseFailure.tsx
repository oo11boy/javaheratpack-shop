'use client';

import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import { ChevronRight } from '@mui/icons-material';

interface PurchaseFailureProps {
  errorMessage?: string;
  retryAction?: () => void;
}

const PurchaseFailure: React.FC<PurchaseFailureProps> = ({
  errorMessage = 'پرداخت شما با خطا مواجه شد.',
  retryAction,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#121824] via-[#1e2636] to-[#2a3347] px-4 py-8 font-sans">
      <div className="w-full max-w-4xl bg-[#2a3347]/95 rounded-3xl shadow-2xl border border-red-500/20 p-6 sm:p-10 transform transition-all duration-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        {/* Header */}
    

        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 sm:mb-12 gap-4">
          <XCircle className="w-8 h-8 sm:w-8 sm:h-8 text-[color:var(--primary-color)] animate-bounce-slow" />
          <h2 className="text-3xl sm:text-3xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
          خرید ناموفق
          </h2>
        </div>

        {/* Failure Info */}
        <div className="text-center mb-8 sm:mb-12 bg-[#1e2636]/60 rounded-xl p-5 sm:p-8 border border-red-500/10 shadow-inner">
          <p className="text-gray-100 text-base sm:text-lg md:text-xl font-medium flex items-center justify-center gap-3 flex-wrap">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
            {errorMessage}
          </p>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-4 max-w-2xl mx-auto">
            لطفاً دوباره تلاش کنید یا برای رفع مشکل با پشتیبانی تماس بگیرید.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {retryAction && (
            <button
              onClick={retryAction}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold"
            >
              تلاش مجدد
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <button
            onClick={() => window.location.href = '/support'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-[#2a3347] text-[color:var(--primary-color)] rounded-full border border-[color:var(--primary-color)]/40 hover:bg-[#2a3347]/70 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
          >
            تماس با پشتیبانی
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-[#2a3347] text-[color:var(--primary-color)] rounded-full border border-[color:var(--primary-color)]/40 hover:bg-[#2a3347]/70 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
          >
            رفتن به صفحه اصلی
          </button>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s infinite ease-in-out;
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

export default PurchaseFailure;