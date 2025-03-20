import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Clock } from 'lucide-react';
import { ChevronLeft } from '@mui/icons-material';
import { SimpleCourse } from '@/lib/Types/Types';

const CourseCard: React.FC<{ course: SimpleCourse }> = ({ course }) => {
  return (
    <div className="bg-[#2a3347]/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer border border-[#0dcf6c]/20">
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
  );
};

export default CourseCard;