"use client";

import { Edit } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// تعریف نوع داده‌ها
interface CourseFormData {
  id: number;
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
  id?: number;
  title: string;
  description: string;
  url: string;
  duration: string;
  place: number;
}

const CourseEdit: React.FC<{ courseId: number }> = ({ courseId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [deletedVideoIds, setDeletedVideoIds] = useState<number[]>([]); // برای ذخیره IDهای ویدیوهای حذف‌شده
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری اطلاعات دوره و محتواها
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseResponse, syllabusResponse, videoResponse] = await Promise.all([
          fetch(`/api/courses/${courseId}`),
          fetch(`/api/syllabus?courseid=${courseId}`),
          fetch(`/api/coursesvideo?courseid=${courseId}`),
        ]);
  
        if (!courseResponse.ok || !syllabusResponse.ok || !videoResponse.ok) {
          throw new Error('خطا در بارگذاری اطلاعات');
        }
  
        const courseData = await courseResponse.json();
        const syllabusData = await syllabusResponse.json();
        const videoData = await videoResponse.json();
  
        setFormData({
          ...courseData,
          features: courseData.features.join(','),
          prerequisites: courseData.prerequisites.join(','),
          targetAudience: courseData.targetAudience.join(','),
          price: courseData.price.toString(),
          discountPrice: courseData.discountPrice ? courseData.discountPrice.toString() : '',
          instructorID: 2, // مقدار ثابت ۲ برای instructorID
        });
  
        const mergedContent = videoData.map((video: any, index: number) => ({
          id: video.id,
          title: video.title,
          description: video.description || syllabusData[index]?.description || '',
          url: video.url,
          duration: video.duration || '',
          place: video.place,
        }));
        setContentItems(mergedContent);
      } catch (error) {
        console.error('خطا:', error);
        alert('خطا در بارگذاری اطلاعات دوره');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCourseData();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleContentChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newContent = [...contentItems];
    newContent[index][name as keyof ContentItem] = value;
    setContentItems(newContent);
  };

  const addContentItem = () => {
    setContentItems([...contentItems, { title: '', description: '', url: '', duration: '', place: contentItems.length + 1 }]);
    setOpenVideoIndex(contentItems.length);
  };

  const removeContentItem = (index: number) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این ویدیو را حذف کنید؟')) {
      const itemToDelete = contentItems[index];
      const newContent = contentItems.filter((_, i) => i !== index);
      setContentItems(newContent.map((item, idx) => ({ ...item, place: idx + 1 })));
      if (openVideoIndex === index) setOpenVideoIndex(newContent.length > 0 ? 0 : null);

      if (itemToDelete.id) {
        setDeletedVideoIds((prev) => [...prev, itemToDelete.id!]);
      }
    }
  };

  const toggleVideo = (index: number) => {
    setOpenVideoIndex(openVideoIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    try {
      // به‌روزرسانی اطلاعات دوره
      const courseResponse = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split(',').map(item => item.trim()),
          prerequisites: formData.prerequisites.split(',').map(item => item.trim()),
          targetAudience: formData.targetAudience.split(',').map(item => item.trim()),
          price: parseFloat(formData.price) || null,
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          instructorID: 2,
        }),
      });

      if (!courseResponse.ok) throw new Error('خطا در به‌روزرسانی دوره');

      // مدیریت حذف ویدیوها
      for (const videoId of deletedVideoIds) {
        await Promise.all([
          fetch(`/api/syllabus/${videoId}`, { method: 'DELETE' }),
          fetch(`/api/coursesvideo/${videoId}`, { method: 'DELETE' }),
        ]);
      }

      // به‌روزرسانی یا اضافه کردن سرفصل‌ها و ویدیوها
      const contentPromises = contentItems.map(async (item, index) => {
        const place = index + 1;
        if (item.id) {
          // به‌روزرسانی موجود
          await Promise.all([
            fetch(`/api/syllabus/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ courseID: courseId, title: item.title, description: item.description || null }),
            }),
            fetch(`/api/coursesvideo/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                place,
                title: item.title,
                url: item.url,
                duration: item.duration || null,
                description: item.description || null,
                courseId,
              }),
            }),
          ]);
        } else {
          // اضافه کردن جدید
          const [syllabusRes, videoRes] = await Promise.all([
            fetch('/api/syllabus', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ courseID: courseId, title: item.title, description: item.description || null }),
            }),
            fetch('/api/coursesvideo', {
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
            }),
          ]);

          if (!syllabusRes.ok || !videoRes.ok) throw new Error('خطا در اضافه کردن محتوا');
        }
      });

      await Promise.all(contentPromises);

      alert('دوره و محتواها با موفقیت به‌روزرسانی شدند!');
      router.push('/admin/courselist'); // هدایت به لیست دوره‌ها
      setDeletedVideoIds([]); // ریست کردن لیست حذف‌شده‌ها
    } catch (error) {
      alert('خطا در به‌روزرسانی اطلاعات: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  if ( !formData) {
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
          ویرایش دوره
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">اطلاعات دوره</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">عنوان دوره</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">مدت زمان</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">قیمت (تومان)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">قیمت با تخفیف</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">نوع دسترسی</label>
                <input
                  type="text"
                  name="accessType"
                  value={formData.accessType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">سطح دوره</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="مبتدی">مبتدی</option>
                  <option value="متوسط">متوسط</option>
                  <option value="پیشرفته">پیشرفته</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">لینک ویدیو معرفی</label>
                <input
                  type="url"
                  name="introVideo"
                  value={formData.introVideo}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">تصویر بنر</label>
                <input
                  type="url"
                  name="bannerImage"
                  value={formData.bannerImage}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                />
              </div>
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
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">ویژگی‌ها</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">پیش‌نیازها</label>
                <textarea
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">مخاطبان هدف</label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">دسته‌بندی</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[color:var(--primary-color)]">محتوای دوره</h3>
            <AnimatePresence>
              {contentItems.map((item, index) => (
                <motion.div
                  key={item.id || `new-${index}`}
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
                      ویدیو {item.place} - {item.title || 'بدون عنوان'}
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
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">عنوان</label>
                        <input
                          type="text"
                          name="title"
                          value={item.title}
                          onChange={(e) => handleContentChange(index, e)}
                          required
                          disabled={isSubmitting}
                          className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">توضیحات</label>
                        <textarea
                          name="description"
                          value={item.description}
                          onChange={(e) => handleContentChange(index, e)}
                          disabled={isSubmitting}
                          className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">لینک ویدیو</label>
                        <input
                          type="url"
                          name="url"
                          value={item.url}
                          onChange={(e) => handleContentChange(index, e)}
                          required
                          disabled={isSubmitting}
                          className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">مدت زمان</label>
                        <input
                          type="text"
                          name="duration"
                          value={item.duration}
                          onChange={(e) => handleContentChange(index, e)}
                          required
                          disabled={isSubmitting}
                          className="w-full p-3 bg-[#2a3347] rounded-lg border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                        />
                      </div>
                      {contentItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentItem(index)}
                          disabled={isSubmitting}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
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
              <Edit className="w-5 h-5" /> افزودن ویدیوی جدید
            </motion.button>
          </div>

          <div className="flex justify-end gap-4">
  <motion.button
    type="submit"
    whileHover={{ scale: !isSubmitting ? 1.05 : 1 }} // فقط در حالت غیرفعال انیمیشن اعمال شود
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
        <span>در حال ذخیره...</span>
      </div>
    ) : (
      'ذخیره تغییرات'
    )}
  </motion.button>

  <motion.button
    type="button"
    onClick={() => router.push('/admin/courselist')}
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

export default CourseEdit;