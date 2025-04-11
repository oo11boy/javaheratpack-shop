"use client";

import { Add } from '@mui/icons-material';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  accessType: string;
  price: string;
  discountPrice: string;
  introVideo: string;
  level: string;
  bannerImage: string;
  features: string;
  prerequisites: string;
  targetAudience: string;
  category: string;
  thumbnail: string;
  instructorID: number;
}

interface ContentItem {
  title: string;
  description: string;
  url: string;
  duration: string;
}

const CourseAdd: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    accessType: '',
    price: '',
    discountPrice: '',
    introVideo: '',
    level: '',
    bannerImage: '',
    features: '',
    prerequisites: '',
    targetAudience: '',
    category: '',
    thumbnail: '',
    instructorID: 2,
  });

  const [contentItems, setContentItems] = useState<ContentItem[]>([{
    title: '',
    description: '',
    url: '',
    duration: '',
  }]);

  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newContent = [...contentItems];
    newContent[index][name as keyof ContentItem] = value;
    setContentItems(newContent);
  };

  const addContentItem = () => {
    setContentItems([...contentItems, { title: '', description: '', url: '', duration: '' }]);
    setOpenVideoIndex(contentItems.length);
  };

  const removeContentItem = (index: number) => {
    const newContent = contentItems.filter((_, i) => i !== index);
    setContentItems(newContent);
    if (openVideoIndex === index) setOpenVideoIndex(newContent.length > 0 ? 0 : null);
  };

  const toggleVideo = (index: number) => {
    setOpenVideoIndex(openVideoIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const courseResponse = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split(',').map(item => item.trim()),
          prerequisites: formData.prerequisites.split(',').map(item => item.trim()),
          targetAudience: formData.targetAudience.split(',').map(item => item.trim()),
        }),
      });

      if (!courseResponse.ok) throw new Error('خطا در ثبت دوره');
      const courseData = await courseResponse.json();
      const courseId = courseData.id;

      const contentPromises = contentItems.map(async (item, index) => {
        const place = index + 1;
        await fetch('/api/syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseID: courseId, title: item.title, description: item.description || null }),
        });
        await fetch('/api/coursesvideo', { // تغییر به /api/coursesvideo
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            place,
            title: item.title,
            url: item.url,
            duration: item.duration || null,
            description: item.description || null,
            courseId,
          }),
        });
      });

      await Promise.all(contentPromises);

      alert('دوره و محتواها با موفقیت ثبت شدند!');
      setFormData({ title: '', description: '', duration: '', accessType: '', price: '', discountPrice: '', introVideo: '', level: '', bannerImage: '', features: '', prerequisites: '', targetAudience: '', category: '', thumbnail: '', instructorID: 2 });
      setContentItems([{ title: '', description: '', url: '', duration: '' }]);
      setOpenVideoIndex(0);
    } catch (error) {
      alert('خطا در ثبت اطلاعات: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <Add className="w-8 h-8" />
          افزودن دوره جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">اطلاعات دوره</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-300 mb-2">عنوان دوره</label><input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: دوره جامع طراحی جواهرات مدرن" /></div>
              <div><label className="block text-sm text-gray-300 mb-2">مدت زمان</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: ۸ هفته (۴۸ ساعت)" /></div>
            </div>
            <div><label className="block text-sm text-gray-300 mb-2">توضیحات</label><textarea name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" rows={4} placeholder="مثال: این دوره شما را با تکنیک‌های پیشرفته..." /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-300 mb-2">قیمت (تومان)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: 2500000" /></div>
              <div><label className="block text-sm text-gray-300 mb-2">قیمت با تخفیف</label><input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: 2000000" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-300 mb-2">نوع دسترسی</label><input type="text" name="accessType" value={formData.accessType} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: آنلاین و آفلاین" /></div>
              <div><label className="block text-sm text-gray-300 mb-2">سطح دوره</label><select name="level" value={formData.level} onChange={handleChange} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"><option value="">انتخاب کنید</option><option value="مبتدی">مبتدی</option><option value="متوسط">متوسط</option><option value="پیشرفته">پیشرفته</option></select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm text-gray-300 mb-2">لینک ویدیو معرفی</label><input type="url" name="introVideo" value={formData.introVideo} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: https://media.istockphoto.com/..." /></div>
              <div><label className="block text-sm text-gray-300 mb-2">تصویر بنر</label><input type="url" name="bannerImage" value={formData.bannerImage} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: https://picsum.photos/..." /></div>
            </div>
            <div><label className="block text-sm text-gray-300 mb-2">تصویر کوچک</label><input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: https://picsum.photos/300/200?random=6" /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-sm text-gray-300 mb-2">ویژگی‌ها</label><textarea name="features" value={formData.features} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" rows={3} placeholder="مثال: پشتیبانی اختصاصی, پروژه‌های عملی, ..." /></div>
              <div><label className="block text-sm text-gray-300 mb-2">پیش‌نیازها</label><textarea name="prerequisites" value={formData.prerequisites} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" rows={3} placeholder="مثال: علاقه به طراحی, آشنایی با کامپیوتر, ..." /></div>
              <div><label className="block text-sm text-gray-300 mb-2">مخاطبان هدف</label><textarea name="targetAudience" value={formData.targetAudience} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" rows={3} placeholder="مثال: علاقه‌مندان به جواهرات, طراحان مبتدی, ..." /></div>
            </div>
            <div><label className="block text-sm text-gray-300 mb-2">دسته‌بندی</label><input type="text" name="category" value={formData.category} onChange={handleChange} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: طراحی" /></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">محتوای دوره</h3>
            <AnimatePresence>
              {contentItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border border-[color:var(--primary-color)]/20 rounded-xl shadow-lg bg-[#2a3347]/70 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleVideo(index)}
                    disabled={isSubmitting}
                    className="w-full text-left p-4 bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] hover:bg-[color:var(--primary-color)]/20 transition-all duration-300 flex justify-between items-center"
                  >
                    <span className="text-lg font-semibold text-white">
                      ویدیو {index + 1} - {item.title || 'بدون عنوان'}
                    </span>
                    <motion.span
                      animate={{ rotate: openVideoIndex === index ? 180 : 0 }}
                      className="text-[color:var(--primary-color)]"
                    >
                      ▼
                    </motion.span>
                  </button>
                  {openVideoIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 space-y-4"
                    >
                      <div><label className="block text-sm text-gray-300 mb-2">عنوان</label><input type="text" name="title" value={item.title} onChange={(e) => handleContentChange(index, e)} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: مقدمه دوره" /></div>
                      <div><label className="block text-sm text-gray-300 mb-2">توضیحات</label><textarea name="description" value={item.description} onChange={(e) => handleContentChange(index, e)} disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" rows={2} placeholder="مثال: آشنایی با مفاهیم اولیه دوره" /></div>
                      <div><label className="block text-sm text-gray-300 mb-2">لینک ویدیو</label><input type="url" name="url" value={item.url} onChange={(e) => handleContentChange(index, e)} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: https://media.istockphoto.com/..." /></div>
                      <div><label className="block text-sm text-gray-300 mb-2">مدت زمان</label><input type="text" name="duration" value={item.duration} onChange={(e) => handleContentChange(index, e)} required disabled={isSubmitting} className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all" placeholder="مثال: 12:33" /></div>
                      {contentItems.length > 1 && (
                        <button type="button" onClick={() => removeContentItem(index)} disabled={isSubmitting} className="text-red-400 hover:text-red-300 transition-colors duration-200">
                          حذف ویدیو
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={addContentItem}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Add className="w-5 h-5" /> افزودن ویدیوی جدید
            </motion.button>
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ثبت دوره و محتوا
            </motion.button>
          </div>
        </form>

        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[#121824] bg-opacity-80 z-50"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full h-20 w-20 border-2 border-[color:var(--primary-color)]/50"
              />
              <p className="mt-6 text-lg text-[color:var(--primary-color)] font-semibold">در حال ثبت دوره...</p>
            </div>
          </motion.div>
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

export default CourseAdd;