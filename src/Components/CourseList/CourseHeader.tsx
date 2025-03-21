import React from 'react';
import { BookOpen } from 'lucide-react';

const CourseHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] flex items-center gap-3 animate-pulse-once">
        <BookOpen className="w-10 h-10" />
        لیست دوره‌ها
      </h1>
      <p className="text-gray-300 text-center max-w-xl">
        مجموعه‌ای از بهترین دوره‌های آموزشی برای ارتقای مهارت‌های شما
      </p>
    </div>
  );
};

export default CourseHeader;