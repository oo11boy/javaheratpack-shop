"use client";
import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Course } from "@/lib/Types/Types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const CoursePurchaseBox: React.FC<{ course: Course }> = ({ course }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number>(0);
  const { addtocart } = useCart();
  const { userData, isLoggedIn } = useAuth();

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

    setIsLoading(true);
    const purchased =
      userData?.courseid?.some((item) => item.id === course.id) || false;
    setIsPurchased(purchased);
    setIsLoading(false);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [userData, course.id]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await addtocart(course);
    setIsPurchased(true);
    setIsLoading(false);
  };

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
          <span>{course.price===0 ? 'این دوره رایگان است.':course.price.toLocaleString()+"تومان "} </span>
        )}
      </div>

      {isLoading ? (
        <div className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg flex items-center justify-center gap-2 shadow-md">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : isPurchased ? (
        <Link
          href={`/StudyRoom/${course.id}`}
          className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          مشاهده دوره
        </Link>
      ) : isLoggedIn ? (
        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          ثبت و خرید دوره
        </button>
      ) : (
        <button
        onClick={handleAddToCart}
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