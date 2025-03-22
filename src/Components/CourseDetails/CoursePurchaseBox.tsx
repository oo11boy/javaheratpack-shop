"use client";
import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Course } from "@/lib/Types/Types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link"; // برای لینک به StudyRoom

const CoursePurchaseBox: React.FC<{ course: Course }> = ({ course }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // حالت لودینگ
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number>(0);
  const { addtocart } = useCart();
  const { userData, isLoggedIn } = useAuth();

  // بررسی وضعیت لود شدن userData
  useEffect(() => {
    if (userData !== null || isLoggedIn === false) {
      setIsLoading(false); // وقتی userData لود شد یا کاربر لاگین نکرده، لودینگ خاموش می‌شه
    }
  }, [userData, isLoggedIn]);

  // محاسبه وضعیت خرید
  const isPurchased = userData?.purchasedCourses?.some((item) => item.id === course.id);

  useEffect(() => {
    const updateInitialTop = () => {
      if (purchaseBoxRef.current) {
        initialTopRef.current =
          purchaseBoxRef.current.getBoundingClientRect().top + window.scrollY;
      }
    };
    updateInitialTop();

    const handleScroll = () => {
      if (purchaseBoxRef.current) {
        const scrollPosition = window.scrollY;
        const elementTop = initialTopRef.current;
        setIsSticky(scrollPosition > elementTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={purchaseBoxRef}
      className={`bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 right-0 z-10 mx-4 md:mx-8" : "relative"
      }`}
    >
      <div className="text-lg font-bold text-[color:var(--primary-color)] mb-4">
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
        <div className="w-full py-3 bg-gray-600 text-white rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full w-5 h-5 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
        </div>
      ) : isPurchased ? (
        <Link
          href={`/StudyRoom/${course.id}`}
          className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          مشاهده دوره
        </Link>
      ) : (
        <button
          onClick={() => addtocart(course)}
          className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          ثبت و خرید دوره
        </button>
      )}
    </div>
  );
};

export default CoursePurchaseBox;