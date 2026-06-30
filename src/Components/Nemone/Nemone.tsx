"use client";

import { DiamondOutlined } from "@mui/icons-material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";

interface NemoneItem {
  id: number;
  src: string;
}

const FALLBACK_IMAGE = "/Images/placeholder.png";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`خطا: ${res.status}`);
  return res.json();
});

export default function Nemone() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { 
    data: nemoneha = [], 
    error, 
    isLoading 
  } = useSWR<NemoneItem[]>('/api/nemone', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    refreshInterval: 3600000,
    revalidateIfStale: false,
    keepPreviousData: true,
    errorRetryCount: 2,
  });

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(currentSection);
    return () => observer.disconnect();
  }, []);

  const openModal = (src: string): void => {
    setSelectedImage(src);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== FALLBACK_IMAGE) {
      target.src = FALLBACK_IMAGE;
    }
  };

  const renderedItems = useMemo(() => {
    return nemoneha.map((item, index) => (
      <div
        key={item.id}
        className={`group relative overflow-hidden rounded-2xl aspect-square transform transition-all duration-700 hover:scale-105 cursor-pointer ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
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
          onError={handleImageError}
          priority={false}
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <span className="text-white text-sm font-medium p-3">
            نمونه {item.id}
          </span>
        </div>
      </div>
    ));
  }, [nemoneha, isVisible]);

  if (error) {
    return (
      <div className="mt-6 py-16 text-white bg-gradient-to-b to-gray-900 from-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400">خطا در بارگذاری نمونه‌کارها</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-700 animate-pulse"></div>
            ))}
          </div>
        ) : nemoneha.length === 0 ? (
          <p className="text-center text-gray-400">هیچ نمونه کاری یافت نشد</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {renderedItems}
          </div>
        )}
      </div>

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full h-[80vh] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="تصویر بزرگ"
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-lg"
              sizes="100vw"
              quality={90}
              onError={handleImageError}
            />
            <button
              className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
              onClick={closeModal}
              aria-label="بستن"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}