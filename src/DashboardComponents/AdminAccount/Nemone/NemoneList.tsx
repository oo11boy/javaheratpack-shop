// src\app\components\NemoneList.tsx
"use client";

import { Edit, Trash2, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface NemoneItem {
  id: number;
  src: string;
}

const NemoneList: React.FC = () => {
  const router = useRouter();
  const [nemoneItems, setNemoneItems] = useState<NemoneItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchNemoneItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/nemone', {
        cache: 'no-cache', // جلوگیری از کش
      });
      if (!response.ok) throw new Error('خطا در دریافت نمونه‌کارها');
      const data = await response.json();
      setNemoneItems(data);
    } catch (error) {
      console.error('خطا:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNemoneItems();
  }, []);

  const handleDelete = async (nemoneId: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این نمونه‌کار را حذف کنید؟')) return;

    setIsDeleting(nemoneId);
    try {
      const response = await fetch(`/api/nemone/${nemoneId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در حذف نمونه‌کار');
      await fetchNemoneItems(); // بارگذاری مجدد لیست
      alert('نمونه‌کار با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در حذف نمونه‌کار: ' + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (nemoneId: number) => {
    router.push(`../admin/nemoneedit/${nemoneId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          مدیریت نمونه‌کارها
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-start h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : nemoneItems.length === 0 ? (
          <p className="text-gray-300 text-center py-6">هیچ نمونه‌کاری یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">شناسه</th>
                  <th className="p-4 font-semibold">آدرس تصویر</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {nemoneItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">{item.src}</td>
                    <td className="p-4 flex gap-2">
                      <motion.button
                        onClick={() => handleEdit(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[color:var(--primary-color)] text-black rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        ویرایش
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting === item.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isDeleting === item.id ? (
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

export default NemoneList;