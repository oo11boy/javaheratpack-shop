// src\app\components\CommentList.tsx
"use client";

import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
interface Comment {
  id: number;
  article_id: number;
  article_title?: string; // عنوان مقاله که از API جداگانه دریافت می‌شود
  author: string;
  text: string;
  date: string;
  status: 'active' | 'inactive';
}

const CommentList: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // دریافت همه کامنت‌ها (بدون فیلتر وضعیت)
      const response = await fetch('/api/comments', { cache: 'no-cache' });
      if (!response.ok) throw new Error('خطا در دریافت کامنت‌ها');

      const commentData = await response.json();

      // دریافت عناوین مقالات برای هر کامنت
      const commentsWithTitles = await Promise.all(
        commentData.map(async (comment: Comment) => {
          const articleResponse = await fetch(`/api/articles/${comment.article_id}`, { cache: 'no-cache' });
          const articleData = await articleResponse.json();
          return { ...comment, article_title: articleData.title || 'مقاله بدون عنوان' };
        })
      );

      setComments(commentsWithTitles);
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در دریافت کامنت‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (commentId: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟')) return;

    setIsProcessing(commentId);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در حذف کامنت');

      await fetchComments(); // بارگذاری مجدد لیست
      alert('کامنت با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در حذف کامنت: ' + (error as Error).message);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleToggleStatus = async (commentId: number, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setIsProcessing(commentId);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('خطا در تغییر وضعیت کامنت');

      await fetchComments(); // بارگذاری مجدد لیست
      alert(`کامنت با موفقیت ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} شد`);
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در تغییر وضعیت کامنت: ' + (error as Error).message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <span>📝</span>
          مدیریت کامنت‌ها
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-300 text-center py-6">هیچ کامنتی یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">شناسه</th>
                  <th className="p-4 font-semibold">مقاله</th>
                  <th className="p-4 font-semibold">نویسنده</th>
                  <th className="p-4 font-semibold">متن</th>
                  <th className="p-4 font-semibold">تاریخ</th>
                  <th className="p-4 font-semibold">وضعیت</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <motion.tr
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{comment.id}</td>
                    <td className="p-4">{comment.article_title}</td>
                    <td className="p-4">{comment.author}</td>
                    <td className="p-4">{comment.text.slice(0, 50)}...</td>
                    <td className="p-4">{comment.date}</td>
                    <td className="p-4">{comment.status === 'active' ? 'فعال' : 'غیرفعال'}</td>
                    <td className="p-4 flex gap-2">
                      <motion.button
                        onClick={() => handleToggleStatus(comment.id, comment.status)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isProcessing === comment.id}
                        className={`px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 ${
                          comment.status === 'active'
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {isProcessing === comment.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                        ) : comment.status === 'active' ? (
                          <>
                            <XCircle className="w-5 h-5" />
                            غیرفعال
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            فعال
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(comment.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isProcessing === comment.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isProcessing === comment.id ? (
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

export default CommentList;