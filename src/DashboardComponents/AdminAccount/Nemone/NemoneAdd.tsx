// src\app\components\NemoneAdd.tsx
"use client";

import { Add } from '@mui/icons-material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NemoneFormData {
  src: string;
}

const NemoneAdd: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<NemoneFormData>({ src: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/nemone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: formData.src }),
      });

      if (!response.ok) throw new Error('خطا در ثبت نمونه‌کار');

      alert('نمونه‌کار با موفقیت ثبت شد!');
      setFormData({ src: '' });
      router.push('/admin/nemonelist');
    } catch (error) {
      alert('خطا در ثبت نمونه‌کار: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <Add className="w-8 h-8" />
          افزودن نمونه‌کار جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">اطلاعات نمونه‌کار</h3>
            <div>
              <label className="block text-sm text-gray-300 mb-2">آدرس تصویر</label>
              <input
                type="url"
                name="src"
                value={formData.src}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                placeholder="مثال: https://picsum.photos/300/200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: !isSubmitting ? 1.05 : 1 }}
              whileTap={{ scale: !isSubmitting ? 0.95 : 1 }}
              disabled={isSubmitting}
              className={`px-6 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full transition-all duration-300 shadow-lg ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#0aaf5a] hover:to-[#088f4a] hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                    ></path>
                  </svg>
                  <span>در حال ثبت...</span>
                </div>
              ) : (
                'ثبت نمونه‌کار'
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push('/admin/nemonelist')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              انصراف
            </motion.button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </main>
  );
};

export default NemoneAdd;