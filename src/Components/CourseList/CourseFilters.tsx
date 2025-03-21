"use client";
import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { SimpleCourse } from '@/lib/Types/Types';
import CourseListDisplay from './CourseListDisplay';

interface CourseFiltersProps {
  courses: SimpleCourse[];
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(courses.map((course) => course.category)));

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="جستجوی دوره..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 bg-[#2a3347] text-white rounded-full border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all shadow-md"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="relative w-full md:w-1/4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full p-4 bg-[color:var(--primary-color)] text-black rounded-full flex items-center justify-between hover:bg-[#0aaf5a] transition-all duration-300 shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {selectedCategory || 'همه دسته‌بندی‌ها'}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isFilterOpen && (
            <div className="absolute top-14 left-0 w-full bg-[#2a3347] rounded-lg shadow-xl z-10 animate-fade-in">
              <ul className="py-2">
                <li
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsFilterOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[color:var(--primary-color)]/20 hover:text-[color:var(--primary-color)] cursor-pointer transition-colors"
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
                    className="px-4 py-2 hover:bg-[color:var(--primary-color)]/20 hover:text-[color:var(--primary-color)] cursor-pointer transition-colors"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <CourseListDisplay filteredCourses={filteredCourses} />
    </>
  );
};

export default CourseFilters;