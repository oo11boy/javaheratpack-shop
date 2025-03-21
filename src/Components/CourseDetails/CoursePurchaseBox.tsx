"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Course } from '@/lib/Types/Types';

const CoursePurchaseBox: React.FC<{ course: Course }> = ({ course }) => {
  const [isSticky, setIsSticky] = useState(false);
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number>(0);

  useEffect(() => {
    if (purchaseBoxRef.current) {
      initialTopRef.current = purchaseBoxRef.current.getBoundingClientRect().top + window.scrollY;
    }

    const handleScroll = () => {
      if (purchaseBoxRef.current) {
        const scrollPosition = window.scrollY;
        const elementTop = initialTopRef.current;

        if (scrollPosition > elementTop) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={purchaseBoxRef}
      className={`bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 right-0 z-10 mx-4 md:mx-8' : 'relative'
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
      <button className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
        <ShoppingCart className="w-5 h-5" /> ثبت‌نام در دوره
      </button>
    </div>
  );
};

export default CoursePurchaseBox;