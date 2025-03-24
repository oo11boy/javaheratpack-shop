"use client";
import React, { useState, useEffect } from "react";
import { Clock, BookOpen, Award, ShoppingCart } from "lucide-react";
import { Course } from "@/lib/Types/Types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const CourseSidebar: React.FC<{ course: Course }> = ({ course }) => {
  const { addtocart } = useCart();
  const { userData, isLoggedIn } = useAuth();
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const purchased =
      userData?.courseid?.some((item) => item.id === course.id) || false;
    setIsPurchased(purchased);
    setIsLoading(false);
  }, [userData, course.id]);


  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg lg:sticky top-8 border border-gray-700">
      <h2 className="text-xl font-semibold text-[color:var(--primary-color)] mb-4">
        جزئیات دوره
      </h2>
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-gray-300">
          <Clock className="w-5 h-5 text-[color:var(--primary-color)]" /> مدت
          زمان: {course.duration}
        </p>
        <p className="flex items-center gap-2 text-gray-300">
          <BookOpen className="w-5 h-5 text-[color:var(--primary-color)]" /> نوع
          دسترسی: {course.accessType}
        </p>
        <p className="flex items-center gap-2 text-gray-300">
          <Award className="w-5 h-5 text-[color:var(--primary-color)]" />{" "}
          پیش‌نیازها: {course.prerequisites.join(", ")}
        </p>
        <div className="text-gray-300">
          <strong className="text-[color:var(--primary-color)]">
            ویژگی‌ها:
          </strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {course.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <p className="text-gray-300">
          <strong className="text-[color:var(--primary-color)]">
            مخاطبان:
          </strong>{" "}
          {course.targetAudience.join(", ")}
        </p>

        <div className="hidden lg:block">
          <div className="text-lg font-bold text-[color:var(--primary-color)]">
            {course.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="line-through text-gray-500">
                  {course.price.toLocaleString()} تومان
                </span>
                <span>{course.discountPrice.toLocaleString()} تومان</span>
              </div>
            ) : (
              <span>{course.price.toLocaleString()} تومان</span>
            )}
          </div>

          {isLoading ? (
            <div className="w-full py-3 mt-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : isPurchased ? (
            <Link
              href={`/StudyRoom/${course.id}`}
              className="w-full py-3 mt-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              مشاهده دوره
            </Link>
          ) : isLoggedIn ? (
            <button
              onClick={() => addtocart(course)}
              className="w-full py-3 mt-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              ثبت نام و خرید دوره
            </button>
          ) : (
            <button
              onClick={() => addtocart(course)}
              className="w-full py-3 mt-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              ثبت نام و خرید دوره
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;