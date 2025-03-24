"use client";

import { DiamondOutlined } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./Nemone.css";

interface NemoneItem {
  id: number;
  src: string;
}

export default function Nemone() {
  const [nemoneha, setNemoneha] = useState<NemoneItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // دریافت داده‌ها از API
  useEffect(() => {
    const fetchNemone = async () => {
      try {
        const res = await fetch("/api/nemone");
        if (!res.ok) throw new Error("خطا در دریافت نمونه‌کارها");
        const data: NemoneItem[] = await res.json();
        setNemoneha(data);
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNemone();
  }, []);

  // Intersection Observer برای انیمیشن ورود
  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentSection) {
            observer.unobserve(currentSection);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
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
      className="mt-6 py-16 text-white bg-gradient-to-b to-gray-900 from-gray-800"
    >
      <div className="ccontainer mx-auto mt-6 px-4">
        <h2 className="!text-xl border inline-block p-2 border-[color:var(--primary-color)] yekanh rounded-xl items-center gap-3 mb-12">
          <DiamondOutlined fontSize="large" className="text-[color:var(--primary-color)] ml-2" />
          برخی از نمونه کارهای طراحی شده
        </h2>
        {isLoading ? (
          <p className="text-center">در حال بارگذاری نمونه‌کارها...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {nemoneha.map((item: NemoneItem, index: number) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl aspect-square transform transition-all duration-700 hover:scale-105 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => openModal(item.src)}
              >
                <Image
                  src={item.src}
                  alt={`نمونه کار ${item.id}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
        )}
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
            <Image
              src={selectedImage ?? ""}
              alt="تصویر بزرگ"
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-lg"
              sizes="100vw"
            />
            <button
              className="absolute top-4 right-4 text-white bg-[color:var(--primary-color)] hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
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