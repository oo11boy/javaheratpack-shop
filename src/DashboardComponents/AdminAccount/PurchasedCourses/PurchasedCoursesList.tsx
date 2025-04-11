// src\app\components\PurchasedCoursesList.tsx
"use client";

import { Trash2, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PurchasedCourse {
  userName: string;
  userLastname: string;
  userEmail: string;
  userPhonenumber: string;
  courseTitle: string;
  userId: number; // برای عملیات حذف نگه داشته می‌شود
  courseId: number; // برای عملیات حذف نگه داشته می‌شود
}

const PurchasedCoursesList: React.FC = () => {
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<PurchasedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPurchasedCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/purchased-courses', { cache: 'no-cache' });
      if (!response.ok) throw new Error('خطا در دریافت خریدها');
      const data = await response.json();
      setPurchasedCourses(data);
      setFilteredCourses(data); // لیست اولیه فیلتر شده
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در دریافت خریدها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  useEffect(() => {
    const filtered = purchasedCourses.filter(
      (course) =>
        course.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.userLastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.userPhonenumber.includes(searchTerm) ||
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, purchasedCourses]);

  const handleDelete = async (userId: number, courseId: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این دوره را از خریدهای کاربر حذف کنید؟')) return;

    const deleteKey = `${userId}-${courseId}`;
    setIsDeleting(deleteKey);
    try {
      const response = await fetch(`/api/purchased-courses/${userId}/${courseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در حذف دوره');
      await fetchPurchasedCourses();
      alert('دوره با موفقیت از خریدهای کاربر حذف شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در حذف دوره: ' + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <span>🛒</span>
          لیست دوره‌های خریداری‌شده
        </h2>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو بر اساس نام، نام خانوادگی، ایمیل، شماره تماس یا عنوان دوره..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all pl-10 text-right"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <p className="text-gray-300 text-center py-6">
            {searchTerm ? 'هیچ نتیجه‌ای یافت نشد.' : 'هیچ دوره‌ای خریداری نشده است.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">نام</th>
                  <th className="p-4 font-semibold">نام خانوادگی</th>
                  <th className="p-4 font-semibold">ایمیل</th>
                  <th className="p-4 font-semibold">شماره تماس</th>
                  <th className="p-4 font-semibold">عنوان دوره</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((purchase) => (
                  <motion.tr
                    key={`${purchase.userId}-${purchase.courseId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{purchase.userName}</td>
                    <td className="p-4">{purchase.userLastname}</td>
                    <td className="p-4">{purchase.userEmail}</td>
                    <td className="p-4">{purchase.userPhonenumber}</td>
                    <td className="p-4">{purchase.courseTitle}</td>
                    <td className="p-4">
                      <motion.button
                        onClick={() => handleDelete(purchase.userId, purchase.courseId)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting === `${purchase.userId}-${purchase.courseId}`}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isDeleting === `${purchase.userId}-${purchase.courseId}` ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            حذف
                          </>
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default PurchasedCoursesList;