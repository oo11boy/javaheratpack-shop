// src\app\components\ArticleAdd.tsx
"use client";

import { Add } from '@mui/icons-material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ArticleFormData {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  thumbnail: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  heroImage: string;
}

const ArticleAdd: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    category: '',
    readTime: '',
    thumbnail: '',
    date: new Date().toLocaleDateString('fa-IR'),
    author: '',
    summary: '',
    content: '',
    heroImage: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          category: formData.category || null,
          readTime: formData.readTime || null,
          thumbnail: formData.thumbnail || 'https://picsum.photos/300/200',
          date: formData.date || new Date().toLocaleDateString('fa-IR'),
          author: formData.author || 'نویسنده ناشناس',
          summary: formData.summary,
          content: formData.content,
          heroImage: formData.heroImage || 'https://picsum.photos/1200/600',
        }),
      });

      if (!response.ok) throw new Error('خطا در ثبت مقاله');

      alert('مقاله با موفقیت ثبت شد!');
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        readTime: '',
        thumbnail: '',
        date: new Date().toLocaleDateString('fa-IR'),
        author: '',
        summary: '',
        content: '',
        heroImage: '',
      });
      router.push('../admin/articlelist');
    } catch (error) {
      alert('خطا در ثبت مقاله: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <Add className="w-8 h-8" />
          افزودن مقاله جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">اطلاعات مقاله</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">عنوان مقاله</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: راهنمای جامع طراحی وب"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">نویسنده</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: علی محمدی"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">دسته‌بندی</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: فناوری"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">زمان مطالعه</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: ۵ دقیقه"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">تاریخ</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: 1403/01/20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">تصویر کوچک</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  placeholder="مثال: https://picsum.photos/300/200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">خلاصه کوتاه (Excerpt)</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                rows={3}
                placeholder="مثال: خلاصه‌ای کوتاه از مقاله..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">خلاصه</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                rows={4}
                placeholder="مثال: این مقاله به بررسی اصول اولیه طراحی وب می‌پردازد..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">محتوا</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                rows={8}
                placeholder="مثال: طراحی وب یکی از مهارت‌های کلیدی در دنیای امروز است..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">تصویر اصلی</label>
              <input
                type="url"
                name="heroImage"
                value={formData.heroImage}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                placeholder="مثال: https://picsum.photos/1200/600"
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
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:from-[#0aaf5a] hover:to-[#088f4a] hover:shadow-xl'
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
                'ثبت مقاله'
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push('../admin/articlelist')}
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

export default ArticleAdd;