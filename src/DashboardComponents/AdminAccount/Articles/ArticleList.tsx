// src\app\components\ArticleList.tsx
"use client";

import { Edit, Trash2, FileText } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Visibility } from '@mui/icons-material';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  thumbnail: string;
  date: string;
}

const ArticleList: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // تابع دریافت لیست مقالات
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/articles', {
        cache: 'no-cache', // اجبار به دریافت داده تازه
      });
      if (!response.ok) throw new Error('خطا در دریافت مقالات');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('خطا:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // بارگذاری اولیه مقالات
  useEffect(() => {
    fetchArticles();
  }, []);

  // حذف مقاله
  const handleDelete = async (articleId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) return;

    setIsDeleting(articleId);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در حذف مقاله');

      // بعد از حذف موفق، لیست را دوباره بارگذاری کنیم
      await fetchArticles();
      alert('مقاله با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در حذف مقاله: ' + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  // هدایت به صفحه ویرایش
  const handleEdit = (articleId: string) => {
    router.push(`../admin/articleedit/${articleId}`);
  };

    // هدایت به صفحه ویرایش
    const handleView = (articleId: string) => {
      router.push(`../bloglist/${articleId}`);
    };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          مدیریت مقالات
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : articles.length === 0 ? (
          <p className="text-gray-300 text-center py-6">هیچ مقاله‌ای یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">عنوان</th>
                  <th className="p-4 font-semibold">دسته‌بندی</th>
                  <th className="p-4 font-semibold">زمان مطالعه</th>
                  <th className="p-4 font-semibold">تاریخ</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{article.title}</td>
                    <td className="p-4">{article.category}</td>
                    <td className="p-4">{article.readTime}</td>
                    <td className="p-4">{article.date}</td>
                    <td className="p-4 flex gap-2">

                    <motion.button
                        onClick={() => handleView(article.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[color:var(--primary-color)] text-black rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Visibility className="w-5 h-5" />
                      مشاهده
                      </motion.button>

                      <motion.button
                        onClick={() => handleEdit(article.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[color:var(--primary-color)] text-black rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        ویرایش
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(article.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting === article.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isDeleting === article.id ? (
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

export default ArticleList;