import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Clock } from 'lucide-react';
import { ChevronLeft } from '@mui/icons-material';
import { SimpleCourse } from '@/lib/Types/Types';

const CourseCard: React.FC<{ course: SimpleCourse }> = ({ course }) => {
  return (
    <div className="bg-[#2a3347]/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer border border-[#0dcf6c]/20">
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

export default CourseCard;