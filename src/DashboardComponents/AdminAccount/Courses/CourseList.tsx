"use client";

import { Users, Trash2, Edit } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SimpleCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  accessType: string | null;
  price: number;
  discountPrice: number | null;
  introVideo: string | null;
  level: string;
  bannerImage: string | null;
  features: string[];
  prerequisites: string[];
  targetAudience: string[];
  category: string;
  thumbnail: string | null;
}

const CourseList: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<SimpleCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // دریافت لیست دوره‌ها
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/courses", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("خطا در دریافت دوره‌ها");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // حذف دوره و اطلاعات مرتبط
  const handleDelete = async (courseId: number) => {
    if (
      !confirm(
        "آیا مطمئن هستید که می‌خواهید این دوره و تمام اطلاعات مرتبط را حذف کنید؟"
      )
    )
      return;

    setIsDeleting(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}/delete`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("خطا در حذف دوره");
      setCourses(courses.filter((course) => course.id !== courseId));
      alert("دوره و اطلاعات مرتبط با موفقیت حذف شدند");
    } catch (error) {
      console.error("خطا:", error);
      alert("خطا در حذف دوره: " + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  // هدایت به صفحه ویرایش
  const handleEdit = (courseId: number) => {
    router.push(`../admin/courseedit/${courseId}`);
  };

  return (
    <main className="min-h-screen flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <Users className="w-8 h-8" />
          مدیریت دوره‌های آموزشی
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : courses.length === 0 ? (
          <p className="text-gray-300 text-center py-6">
            هیچ دوره‌ای یافت نشد.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">عنوان</th>
                  <th className="p-4 font-semibold">دسته‌بندی</th>
                  <th className="p-4 font-semibold">سطح</th>
                  <th className="p-4 font-semibold">قیمت (تومان)</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{course.title}</td>
                    <td className="p-4">{course.category}</td>
                    <td className="p-4">{course.level}</td>
                    <td className="p-4">
                      {course.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400">
                            {course.price==0 ? 'رایگان' :course.price.toLocaleString()}
                          </span>
                          <span className="mr-2 text-[color:var(--primary-color)]">
                            {course.discountPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        course.price==0 ? 'رایگان': course.price.toLocaleString()
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      <motion.button
                        onClick={() => handleEdit(course.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[color:var(--primary-color)] text-black rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        ویرایش
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(course.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting === course.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isDeleting === course.id ? (
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default CourseList;
