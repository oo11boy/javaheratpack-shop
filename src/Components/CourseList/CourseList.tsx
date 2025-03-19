'use client';

import React, { useState } from 'react';
import { BookOpen, Search, Filter, PlayCircle, ChevronDown, Clock } from 'lucide-react';
import { ChevronLeft } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image'; // اضافه کردن next/image
import { SimpleCourse } from '@/lib/Types/Types';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  price: string;
}



const CourseList= ({mockCourses}:{mockCourses: SimpleCourse[]}) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(mockCourses.map((course) => course.category)));

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0dcf6c] flex items-center gap-3 animate-pulse-once">
            <BookOpen className="w-10 h-10" />
            لیست دوره‌ها
          </h1>
          <p className="text-gray-300 text-center max-w-xl">
            مجموعه‌ای از بهترین دوره‌های آموزشی برای ارتقای مهارت‌های شما
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="جستجوی دوره..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-[#2a3347] text-white rounded-full border border-[#0dcf6c]/20 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all shadow-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-1/4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full p-4 bg-[#0dcf6c] text-white rounded-full flex items-center justify-between hover:bg-[#0aaf5a] transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {selectedCategory || 'همه دسته‌بندی‌ها'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-14 left-0 w-full bg-[#2a3347] rounded-lg shadow-xl z-10 animate-fade-in">
                <ul className="py-2">
                  <li
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsFilterOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-[#0dcf6c]/20 hover:text-[#0dcf6c] cursor-pointer transition-colors"
                  >
                    همه دسته‌بندی‌ها
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-[#0dcf6c]/20 hover:text-[#0dcf6c] cursor-pointer transition-colors"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-lg">
            دوره‌ای با این مشخصات یافت نشد!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#2a3347]/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer border border-[#0dcf6c]/20"
              >
                <div className="relative">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-52 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-[#0dcf6c] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 right-4 bg-[#0dcf6c]/80 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {course.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#0dcf6c] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span>{course.category}</span>
                  </div>
                  <Link
                    href={`/courselist/${course.id}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    مشاهده دوره
                    <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
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
        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-pulse-once {
          animation: pulseOnce 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CourseList;