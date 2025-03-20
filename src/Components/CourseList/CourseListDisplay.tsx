import React from 'react';
import { SimpleCourse } from '@/lib/Types/Types';
import CourseCard from './CourseCard';

interface CourseListDisplayProps {
  filteredCourses: SimpleCourse[];
}

const CourseListDisplay: React.FC<CourseListDisplayProps> = ({ filteredCourses }) => {
  return filteredCourses.length === 0 ? (
    <p className="text-gray-400 text-center py-8 text-lg">دوره‌ای با این مشخصات یافت نشد!</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseListDisplay;