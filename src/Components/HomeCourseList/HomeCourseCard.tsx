import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SimpleCourse } from '@/lib/Types/Types';

interface CourseCardProps {
  course: SimpleCourse;
  isVisible: boolean;
  index: number;
}

const HomeCourseCard: React.FC<CourseCardProps> = ({ course, isVisible, index }) => {
  return (
    <div
      className={`group relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-gray-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden h-56">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={500}
          height={300}
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
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-[#0dcf6c]">{course.price}</span>
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
  );
};

export default HomeCourseCard;