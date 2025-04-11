// src\app\components\UserEdit.tsx
"use client";

import { Edit } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  phonenumber: string;
  vip: number;
}

const UserEdit: React.FC<{ userId: number }> = ({ userId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, { cache: 'no-cache' });
        if (!response.ok) throw new Error('خطا در بارگذاری اطلاعات کاربر');
        const userData = await response.json();
        setFormData(userData);
      } catch (error) {
        console.error('خطا:', error);
        alert('خطا در بارگذاری اطلاعات کاربر');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: name === 'vip' ? parseInt(value) : value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('خطا در به‌روزرسانی کاربر');
      alert('کاربر با موفقیت به‌روزرسانی شد!');
      router.push('/admin/userlist');
    } catch (error) {
      alert('خطا در به‌روزرسانی کاربر: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <Edit className="w-8 h-8" />
          ویرایش کاربر
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">ایمیل</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">نام</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">نام خانوادگی</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">شماره تلفن</label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">نوع کاربر</label>
              <select
                name="vip"
                value={formData.vip}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              >
                <option value={0}>کاربر عادی</option>
                <option value={1}>ادمین</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: !isSubmitting ? 1.05 : 1 }}
              whileTap={{ scale: !isSubmitting ? 0.95 : 1 }}
              disabled={isSubmitting}
              className={`px-6 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full transition-all duration-300 shadow-lg ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#0aaf5a] hover:to-[#088f4a]'
              }`}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => router.push('/admin/userlist')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-lg"
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

export default UserEdit;