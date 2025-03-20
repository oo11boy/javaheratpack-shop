import React from 'react';

import { SimpleCourse } from '@/lib/Types/Types';
import "./CourseList.css";
import CourseHeader from './CourseHeader';
import CourseFilters from './CourseFilters';
const CourseList: React.FC<{ mockCourses: SimpleCourse[] }> = ({ mockCourses }) => {
  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-8 animate-fade-in">
        <CourseHeader />
        <CourseFilters courses={mockCourses} />
      </div>
    </div>
  );
};

export default CourseList;