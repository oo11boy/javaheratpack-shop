"use client";
import { DiamondOutlined } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import "./Nemone.css";

// تعریف رابط برای دیتای نمونه‌ها
interface NemoneItem {
  id: number;
  src: string;
}

export default function Nemone() {
  const nemoneha: NemoneItem[] = [
    { id: 1, src: "./images/nemone/1.jpg" },
    { id: 2, src: "./images/nemone/2.jpg" },
    { id: 3, src: "./images/nemone/3.jpg" },
    { id: 4, src: "./images/nemone/4.jpg" },
    { id: 5, src: "./images/nemone/5.jpg" },
    { id: 6, src: "./images/nemone/6.jpg" },
    { id: 7, src: "./images/nemone/7.jpg" },
    { id: 8, src: "./images/nemone/8.jpg" },
    { id: 9, src: "./images/nemone/9.jpg" },
  ];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // استفاده از Intersection Observer برای تشخیص ورود به دید
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current); // فقط یک بار اجرا شود
          }
        }
      },
      {
        threshold: 0.2, // وقتی 20٪ از کامپوننت قابل مشاهده شد
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

  const openModal = (src: string): void => {
    setSelectedImage(src);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div
      ref={sectionRef}
      className="mt-6 py-16 text-white bg-gradient-to-b to-gray-900 from-[gray-800]"
    >
      <div className="ccontainer mx-auto mt-6 px-4">
        <h2 className="!text-xl border inline-block p-2 border-[#0dcf6c] yekanh rounded-xl items-center gap-3 mb-12">
          <DiamondOutlined fontSize="large" className="text-[#0dcf6c] ml-2" />
          برخی از نمونه کارهای طراحی شده
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {nemoneha.map((item: NemoneItem, index: number) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl aspect-square transform transition-all duration-700 hover:scale-105 cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }} // تاخیر تدریجی برای هر تصویر
              onClick={() => openModal(item.src)}
            >
              <img
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                src={item.src}
                alt={`نمونه کار ${item.id}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white text-sm font-medium p-3">
                  نمونه {item.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مودال تمام صفحه */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full h-[80vh] animate-fadeIn"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <img
              src={selectedImage ?? ""}
              alt="تصویر بزرگ"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white bg-[#0dcf6c] hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}