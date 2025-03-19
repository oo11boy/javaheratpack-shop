"use client";
import { SchoolOutlined } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image'; // اضافه کردن next/image
import './Doreha.css';

interface JewelryCourse {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  level: string;
}

const jewelryCourses: JewelryCourse[] = [
  {
    id: 1,
    title: "دوره مقدماتی طراحی جواهرات با Matrix",
    description: "یادگیری اصول اولیه طراحی جواهرات با استفاده از نرم‌افزار Matrix",
    image: "https://picsum.photos/300/200?random=1",
    price: "۱,۵۰۰,۰۰۰ تومان",
    duration: "۱ ماه",
    level: "مبتدی",
  },
  {
    id: 2,
    title: "دوره پیشرفته Matrix برای جواهرات",
    description: "طراحی پیچیده جواهرات با ابزارهای پیشرفته Matrix",
    image: "https://picsum.photos/300/200?random=2",
    price: "۲,۸۰۰,۰۰۰ تومان",
    duration: "۲ ماه",
    level: "پیشرفته",
  },
  {
    id: 3,
    title: "دوره رندرینگ جواهرات در Matrix",
    description: "ایجاد رندرهای واقع‌گرایانه از طرح‌های جواهرات",
    image: "https://picsum.photos/300/200?random=3",
    price: "۲,۲۰۰,۰۰۰ تومان",
    duration: "۶ هفته",
    level: "متوسط",
  },
];

export default function Doreha() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white"
    >
      <div className="ccontainer mx-auto px-4">
        <h2 className="!text-xl border inline-block p-2 border-[#0dcf6c] yekanh rounded-xl items-center gap-3 mb-12">
          <SchoolOutlined fontSize="large" className="text-[#0dcf6c] ml-2" />
          دوره‌های آموزشی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jewelryCourses.map((course: JewelryCourse, index: number) => (
            <div
              key={course.id}
              className={`group relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-gray-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden h-56">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={500} // اندازه حداقلی
                  height={300} // اندازه حداقلی
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-[#0dcf6c] text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <span className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  {course.duration}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#0dcf6c] transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0dcf6c]">
                    {course.price}
                  </span>
                  <Link
                    href={`/courselist/${course.id}`}
                    className="bg-[#0dcf6c] cursor-pointer text-gray-900 px-5 py-2 rounded-lg hover:bg-[#0bb55a] transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}